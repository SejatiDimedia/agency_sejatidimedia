---
name: sanity-schema
description: Conventions for defining and editing Sanity CMS schemas, GROQ queries, and content types for this project's landing page (copywriting content only — NOT project/portfolio data, which comes from the Glio API). Use this whenever creating a new content type, editing an existing Sanity schema, writing a GROQ query, or wiring a page component to fetch content from Sanity. Trigger on any mention of "Sanity", "schema", "content type", "GROQ", "CMS content", "copywriting field", or "Studio".
---

# Sanity Schema Conventions

This project uses **Sanity.io** exclusively for editable *copywriting/marketing content* (hero text, section headings, about/services copy, testimonials, SEO metadata, site settings). It does **not** store project/portfolio data — that lives in Glio's MongoDB and is consumed via the Glio public API (see the `glio-api-integration` skill).

## Where schema files live

```
sanity/
├── schemaTypes/
│   ├── index.ts          # exports all schema types
│   ├── siteSettings.ts
│   ├── page.ts
│   ├── testimonial.ts
│   └── seo.ts             # reusable object type, embedded in page/siteSettings
└── lib/
    ├── client.ts          # sanity client instance
    └── queries.ts          # all GROQ queries, one export per query
```

Always add new schema types to `schemaTypes/index.ts`'s `types` array — a type not registered there won't show up in Studio.

## Core content types for this project

| Type | Kind | Purpose |
|---|---|---|
| `siteSettings` | singleton document | logo, nav links, footer, social links, default SEO |
| `page` | document | one per landing page section-set (Home, About, Services) — array of `sectionBlock` objects |
| `testimonial` | document | client quote, name, role, photo |
| `seo` | object (embedded, not a standalone document) | metaTitle, metaDescription, ogImage — embed this inside `page` and `siteSettings` |

## Writing a new schema type

- Use `defineType` / `defineField` from `sanity` (not raw object literals) — gives type safety and better Studio validation.
- Every document type needs a `title` field used as `preview.select.title` so it's identifiable in the Studio document list.
- For rich text / copywriting bodies use Sanity's **Portable Text** (`type: 'array', of: [{type: 'block'}]`), not plain `string`, so editors get a real rich-text editor. Use plain `string` only for short one-line fields (headline, button label).
- Always add `validation: (Rule) => Rule.required()` on fields that would break the page layout if empty (hero title, slug).
- For any image field, always include a `hotspot: true` option so editors can crop responsively.

Example field block pattern:

```ts
defineField({
  name: 'heroTitle',
  title: 'Hero Title',
  type: 'string',
  validation: (Rule) => Rule.required().max(80),
})
```

## Singleton documents (siteSettings)

Sanity has no native "singleton" concept — enforce it in the Studio structure (`structure.ts`), not by deleting the create action from schema logic alone. When adding a new singleton, also update the desk structure so editors can't accidentally create a second one.

## GROQ query conventions

- One exported query per data need in `lib/queries.ts`, named `<thing>Query` (e.g. `homePageQuery`, `siteSettingsQuery`).
- Always project (`{ }`) only the fields the component actually needs — never `*[_type == "page"]` without a projection, it over-fetches and leaks draft/internal fields.
- Resolve image fields to a usable URL/asset ref explicitly: `"heroImage": heroImage.asset->url` (or use `@sanity/image-url` builder on the client side instead, which is preferred for responsive sizing).

Example:

```groq
*[_type == "page" && slug.current == $slug][0]{
  title,
  sections[]{
    _type,
    heading,
    body,
    "image": image.asset->url
  },
  seo
}
```

## Fetching in Next.js (App Router)

- Use `next-sanity`'s `client.fetch()` inside Server Components only — never expose the Sanity write token to the client.
- Pair every fetch with Next's tag-based revalidation so Studio edits show up without a full redeploy:

```ts
export const revalidate = 60; // fallback ISR interval
// or use fetch(..., { next: { tags: ['page:home'] } }) + a Sanity webhook that calls revalidateTag('page:home')
```

- If the project sets up a Sanity webhook → `/api/revalidate` route, document the webhook URL and secret in the project README, not in code comments.

## When NOT to use Sanity

Never model `project`/`portfolio` content types in Sanity for this project — that data belongs to Glio's `Project` Prisma model and must be fetched through the Glio public API (`isPublic: true`, scoped by `GLIO_OWNER_USER_ID`). Mixing the two sources inside Sanity schema would duplicate data and break the single-source-of-truth setup already agreed for this project.
