---
name: glio-api-integration
description: Conventions for building the public read-only API endpoints inside the Glio repo (Next.js + Prisma + MongoDB) and for consuming them from the landing page repo. Use whenever writing or editing anything under app/api/public/ in Glio, whenever writing project-showcase fetch code in the landing page, or whenever the user mentions "Glio", "Prisma project query", "public API", "project showcase data", or "isPublic". This is a security-sensitive integration — always follow the field allowlist and userId scoping rules below, never skip them even for a "quick test".
---

# Glio Public API Integration

Glio is a multi-tenant agency-management app (Next.js + Prisma + MongoDB). The landing page project pulls **project showcase data** from Glio via a small set of public, read-only, API-key-protected endpoints — it never connects to Prisma/MongoDB directly.

## Non-negotiable rules

1. **Never** install Prisma or share `DATABASE_URL` in the landing page repo. All Prisma access happens inside Glio.
2. **Every** public endpoint must filter `isPublic: true` AND `userId: OWNER_USER_ID` (from `process.env.GLIO_OWNER_USER_ID`). Skipping the `userId` filter leaks other tenants' public projects — this is the single most important rule in this skill.
3. **Every** public endpoint must check an `x-api-key` header against `process.env.PUBLIC_API_KEY` before touching the database.
4. **Only** select an explicit allowlist of fields (see below). Never `select: undefined` / return the raw Prisma object — the `Project` model contains sensitive fields (`budget`, `clientId`, credentials, invoices, payments, members) that must never leave the Glio server.

## Field allowlist for `Project`

Safe to expose:
```
slug, name, summary, summaryId, summaryEn, description, descriptionId,
descriptionEn, bannerImage, thumbnail, technologies, categories,
status, startDate, endDate, order, links (title/url/icon only)
```

Never expose: `budget`, `clientId`, `deadline`, `currency`, `notes`, `credentials`, `invoices`, `payments`, `members`, `comments`, `milestones`, `documents`, `proposals`.

When adding a *new* field to a public endpoint, always check the Prisma schema comment/field name for anything that looks financial, credential-like, or client-identifying — when in doubt, leave it out and ask.

## Endpoint locations (inside Glio repo)

```
app/api/public/projects/route.ts          # GET list
app/api/public/projects/[slug]/route.ts   # GET detail
```

## Standard endpoint skeleton

```ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const OWNER_USER_ID = process.env.GLIO_OWNER_USER_ID!;

export async function GET(request: Request) {
  const apiKey = request.headers.get("x-api-key");
  if (apiKey !== process.env.PUBLIC_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await prisma.project.findMany({
    where: { isPublic: true, userId: OWNER_USER_ID },
    select: { /* allowlist only, see above */ },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(data, {
    headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
  });
}
```

Always set the `Cache-Control` header — it lets Vercel's edge cache absorb repeat requests instead of hitting MongoDB every time.

## Consuming from the landing page

All fetch helpers live in `lib/api/glio-projects.ts` in the landing page repo. Rules:

- Always call `fetch()` from a **Server Component, Route Handler, or generateStaticParams** — never from a Client Component (`"use client"`) — because the `x-api-key` must stay server-side.
- Always pass `next: { revalidate: 60 }` (or a project-agreed interval) so updates in Glio propagate without a manual redeploy.
- Type the response with the `Project` type matching the allowlist exactly — if Glio adds a field, add it to both the Prisma `select` and this type together, in the same change.
- Handle `404` from the detail endpoint as "not found" (return `null`), not as a thrown error, so pages can call `notFound()` cleanly.

## Adding a new public field — checklist

When asked to expose a new piece of project data to the landing page:
1. Confirm the field is not in the "never expose" list above.
2. Add it to the `select` allowlist in **both** `route.ts` files that need it.
3. Add it to the `Project` type in `lib/api/glio-projects.ts` on the landing page.
4. If it's a relation (like `links`), only select the sub-fields actually needed — never the full related model.
5. Mention explicitly in your summary to the user that a new field was exposed publicly, so they can sanity-check it.
