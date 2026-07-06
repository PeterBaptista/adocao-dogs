# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Landing site (pt-BR) for responsible puppy adoption. Visitors browse a grid of puppies, open an adoption dialog, and are sent to a pre-filled WhatsApp message to contact the owner (Sofia). "Adoption" itself is still a WhatsApp deep link — there is no checkout.

A small **admin panel** (`/admin`) lets the owner change each puppy's status (`disponivel` / `reservado` / `adotado`); the public grid reflects it (badge + adopted cards grayed out with the CTA disabled). This is backed by **Postgres + Drizzle**, gated by **Better Auth** (email/password, no public sign-up), with the admin UI using **TanStack Query**.

## Commands

Package manager is **pnpm** (see `pnpm-lock.yaml`).

```bash
pnpm install      # install deps
pnpm dev          # dev server (Next.js) at localhost:3000
pnpm build        # production build
pnpm start        # serve production build
pnpm lint         # eslint

# Database (needs Postgres running + .env with DATABASE_URL)
docker compose up -d   # start Postgres (see docker-compose.yml)
pnpm db:generate       # generate SQL migration from lib/db/schema.ts -> drizzle/
pnpm db:migrate        # apply migrations
pnpm db:push           # push schema directly (dev shortcut, skips migration files)
pnpm db:seed           # seed 7 puppies + create admin user (idempotent)
pnpm db:studio         # Drizzle Studio
```

There are no tests in this project. `pnpm exec tsc --noEmit` is the fastest full correctness check (the Next build ignores TS errors — see below).

**First-time setup:** `docker compose up -d` → copy `.env.example` to `.env` and set `BETTER_AUTH_SECRET` (`openssl rand -hex 32`) + `ADMIN_EMAIL`/`ADMIN_PASSWORD` → `pnpm db:migrate` → `pnpm db:seed` → `pnpm dev`. Log in at `/admin/login`.

## Stack

- **Next.js 16** (App Router, RSC) + **React 19**
- **Tailwind CSS v4** (config-less; configured entirely in `app/globals.css` via `@theme`, no `tailwind.config.js`)
- **shadcn/ui** with the `base-nova` style and `@base-ui/react` primitives (note: this is Base UI, not Radix). Components land in `components/ui/`. `lucide-react` for icons.
- **Drizzle ORM** + **node-postgres** (`pg`) against Postgres; **Better Auth** for auth; **TanStack Query** for client data fetching.
- TypeScript path alias `@/*` → repo root.

## Architecture

The public page renders from `app/page.tsx` (an async server component), composing four sections in order: `PawBackground` → `Hero` → `PuppyGrid` → `ContactFooter`.

- **Source of truth is the DB.** `app/page.tsx` queries the `puppies` table (ordered by `sortOrder`) and passes the rows into `PuppyGrid`. It wraps the query in a `try/catch` that **falls back to the static array in `lib/puppies.ts`** (all statuses defaulted to `disponivel`) so the marketing site still renders if Postgres is down. `export const dynamic = "force-dynamic"` keeps it from being statically cached.
- **`lib/db/schema.ts`** defines the `puppies` table (with the `puppy_status` pgEnum), the `leads` table (adoption-interest form submissions), plus Better Auth's `user`/`session`/`account`/`verification` tables. `lib/db/index.ts` exports the Drizzle `db`.
- **`lib/puppies.ts`** now holds: the `PuppyStatus` union, `STATUS_LABELS` / `PUPPY_STATUSES`, the `Puppy` type, and the static `puppies` array (typed `PuppySeed`, i.e. no status). That array is used only as **seed data** (`lib/db/seed.ts`) and the **offline fallback** — edit it to change the default roster, then re-run `pnpm db:seed`. The `contact` object (WhatsApp/Instagram) still lives here.
- **`components/puppy-grid.tsx`** takes `puppies` as a prop; it holds the `selected` puppy state and renders `PuppyCard`s plus a single `AdoptionDialog`.
- **`components/puppy-card.tsx`** shows a status badge; `adotado` grays the image and replaces the "Quero adotar" button with an inert "Já encontrou um lar" state. `reservado` shows a badge but stays actionable.
- **`components/adoption-dialog.tsx`** is a hand-rolled modal — own Escape handler, body scroll lock, backdrop-click close. Builds the WhatsApp URL by URL-encoding a pt-BR message interpolating the puppy + optional name/city inputs. When the user clicks "Falar com a Sofia" it also fires a fire-and-forget `POST /api/leads` (`keepalive`) to record the interest before the WhatsApp tab opens. WhatsApp/Instagram icons are inline SVGs at the bottom.
- **`components/ui/particles.tsx`** is the Magic UI Particles canvas (self-contained, no extra deps), rendered as an absolute background layer in `app/page.tsx` behind `PawBackground` and the content.

### Auth + admin

- **`lib/auth.ts`** configures Better Auth with the Drizzle adapter (`provider: "pg"`). Email/password is enabled at the API level so the seed can create the admin; there is no public sign-up UI. **`lib/auth-client.ts`** is the React client (`signIn`/`signOut`/`useSession`). **`app/api/auth/[...all]/route.ts`** mounts the Better Auth handler.
- **`app/admin/page.tsx`** is a server component that calls `auth.api.getSession` and `redirect("/admin/login")` if there's no session; otherwise it renders **`components/admin-dashboard.tsx`** (TanStack Query: `useQuery` on `/api/puppies`, `useMutation` PATCHing status, plus a sign-out button). **`app/admin/login/page.tsx`** is the login form.
- **API:** `app/api/puppies/route.ts` (`GET` list) and `app/api/puppies/[id]/route.ts` (`PATCH` status — **guarded by `auth.api.getSession`, returns 401 unauthenticated**, and validates the status against `PUPPY_STATUSES`). `app/api/leads/route.ts` has a **public `POST`** (landing-page form capture) and an **auth-guarded `GET`** (admin list). The admin dashboard shows captured leads in an "Interessados" table.
- **`app/providers.tsx`** wraps the app in TanStack Query's `QueryClientProvider`; it's mounted in `app/layout.tsx`.

## Conventions & gotchas

- **User-facing copy is Brazilian Portuguese.** Keep new strings in pt-BR to match.
- Styling uses **semantic Tailwind color tokens** (`bg-background`, `text-foreground`, `bg-primary`, `text-muted-foreground`, etc.) defined as CSS variables in `app/globals.css` — use these tokens rather than hard-coded colors. Two font variables are exposed: `font-sans` (Nunito) and `font-display` (Baloo 2).
- The app is **light-mode only** by design: `app/layout.tsx` hard-codes the `light` class and `colorScheme: 'light'` on `<html>`. A `dark` variant exists in CSS but is not activated.
- `next.config.mjs` sets `typescript.ignoreBuildErrors: true` and `images.unoptimized: true` — TS errors won't fail the build, so run `pnpm lint` / check types deliberately.
- Client components that use state/effects need the `"use client"` directive (see `puppy-grid.tsx`, `adoption-dialog.tsx`).
- Vercel Analytics is injected in `layout.tsx` only in production.
- This directory is **not a git repository**.
