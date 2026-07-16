---
name: nextjs-content-fetching
description: Conventions for structuring pages and components in this Next.js + Tailwind landing page project, specifically how to combine two data sources — Sanity (copywriting) and the Glio public API (project showcase) — inside App Router pages. Use whenever scaffolding a new page, section component, or layout in the landing page repo, or whenever unsure where a piece of content/data should come from.
---

# Next.js Content Fetching Conventions (Landing Page)

This project has **two distinct data sources** and mixing up which one a piece of content should come from is the most common mistake — check this table first.

| Content | Source | Fetched via |
|---|---|---|
| Hero text, section copy, about/services text, testimonials, SEO meta, site settings | **Sanity** | `lib/sanity/queries.ts` |
| Project showcase list/detail (title, images, tech stack, category) | **Glio public API** | `lib/api/glio-projects.ts` |

If a task mentions editing "the text" on a page → Sanity. If it mentions "projects", "portfolio", "case studies", "showcase" → Glio API. Never add a `project` schema type to Sanity — see the `sanity-schema` skill for why.

## Folder structure

```
app/
├── (marketing)/
│   ├── page.tsx                # Home — combines Sanity page content + Glio featured projects
│   ├── projects/
│   │   ├── page.tsx             # Projects listing — Glio API only
│   │   └── [slug]/page.tsx      # Project detail — Glio API only
│   └── about/page.tsx           # Sanity only
components/
├── sections/                    # one component per Sanity `sectionBlock` _type
├── projects/                    # project card, project gallery, etc.
└── ui/                          # generic Tailwind primitives (button, badge, container)
lib/
├── sanity/ (client.ts, queries.ts)
└── api/glio-projects.ts
```

## Page-level data fetching pattern

Fetch both sources in parallel with `Promise.all` at the top of the Server Component — never sequentially unless one depends on the other's output:

```tsx
export default async function HomePage() {
  const [page, featuredProjects] = await Promise.all([
    getPage("home"),
    getProjects(),
  ]);

  return (
    <>
      {page.sections.map((section) => (
        <SectionRenderer key={section._key} section={section} />
      ))}
      <FeaturedProjects projects={featuredProjects.slice(0, 3)} />
    </>
  );
}
```

## Section renderer pattern (for Sanity `sectionBlock` array)

Use a switch/map keyed on `_type` so editors adding a new section type in Sanity only requires one new component + one new case — never a chain of `if` statements:

```tsx
const sectionComponents: Record<string, React.ComponentType<any>> = {
  hero: HeroSection,
  about: AboutSection,
  testimonialGrid: TestimonialGrid,
};

function SectionRenderer({ section }: { section: { _type: string } }) {
  const Component = sectionComponents[section._type];
  if (!Component) return null;
  return <Component {...section} />;
}
```

## Tailwind conventions

- Use the design tokens already established in `tailwind.config.ts` (colors, font sizes) — don't hardcode arbitrary hex values or `text-[17px]` in components.
- Prefer composing small primitives in `components/ui/` (e.g. `<Container>`, `<Section>`) over repeating `max-w-7xl mx-auto px-4` in every section component.
- Image components must use `next/image` — for Sanity images, use `@sanity/image-url` to build a responsive `src`; for Glio images (served via UploadThing), pass the full URL directly and set `remotePatterns` in `next.config.js` for the UploadThing domain.

## Error / empty states

- Every page fetching from the Glio API should handle an empty array (no published projects yet) gracefully — don't let the projects section crash the whole page.
- Every page fetching from Sanity should handle a missing document (e.g. page not yet created in Studio) with a clear fallback, not a raw runtime error.

## Loading skeleton and error handling

Add `app/**/loading.tsx` for any route doing the parallel fetch above (project listing especially, since it depends on an external API round-trip that can be slower than the Sanity fetch). Add `app/**/error.tsx` at the route segment fetching Glio data specifically, since it's the source most likely to have a transient failure (external API vs. local CMS).
