# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project overview

PickOnePlay — a "would you rather" game platform. Users create games made of image/name pairs; players pick one side per pair and see aggregate results. This repo is the Next.js frontend only: all persistent data (users, games, pairs, scores) lives in a separate backend service reached via `NEXT_PUBLIC_BACKEND_URL` (`.env` points it at `http://localhost:5001`). There is no database or ORM in this repo — the backend must be running separately for `npm run dev` to be useful.

## Commands

- `npm run dev` — start Next dev server on localhost:3000 (requires the backend running separately)
- `npm run build` — production build
- `npm run start` — start production build
- `npm run lint` — ESLint (flat config in `eslint.config.mjs`, extends `eslint-config-next` core-web-vitals + typescript)
- No test suite is configured in this repo.

## Architecture

### Two ways data reaches the backend

- **Server Components fetch the backend directly** for public reads (e.g. `app/game/[id]/page.tsx`, `app/games/page.tsx`), no auth involved.
- **Client-side mutations split by whether an httpOnly cookie must be set/read**:
  - Auth (`services/auth.ts`) always goes through this app's own `/api/auth/*` route handlers (`app/api/auth/login|register|logout|me/route.ts`), because only a Next.js route handler can set the httpOnly `jwt` cookie returned by the backend.
  - Once authenticated, most client mutations call the backend directly with `credentials: "include"` (e.g. `services/games.ts`: `createGame`, `updatePairScore`, `updatePlayScore`), relying on the browser to attach the `jwt` cookie itself.
  - `app/api/games/create/route.ts` is an alternate cookie-forwarding proxy for game creation (streams `req.body` through with `duplex: "half"`) that isn't currently wired to any UI — `services/games.ts`'s `createGame` is what `app/create/page.tsx` actually calls. Check which pattern an existing feature uses before copying one for a new mutation.

### Auth

- JWT lives in an httpOnly cookie (`jwt`), set only by `app/api/auth/login|register/route.ts` after forwarding credentials to the backend.
- `lib/auth/getCurrentUserOnServer.ts` and `app/layout.tsx` each independently forward the incoming request's cookies to the backend's `/auth/me` to resolve the current user during SSR.
- Client-side auth state is a zustand store, `store/useAuth.ts` (`user`, `loading`, `fetchUser`, `logout`), hydrated by `components/authInitializer.tsx` from the server-resolved user passed down in `app/layout.tsx`.

### Game flow

`GameController` (`components/game/gameController.tsx`) is a client-side state machine with three steps — `info` → `session` → `results` — rendering `GameInfo`, `GameSession`, `GameResults` respectively. It's handed a `GameWithPairs` fetched server-side by `app/game/[id]/page.tsx`.

### Game creation

`app/create/page.tsx` is a two-step `react-hook-form` wizard using `FormProvider`: step 1 (`CreateGameForm`) collects title/description/image/category/tags, step 2 (`CreatePairsForm`) collects the would-you-rather pairs. On submit, everything (including images) is packed into one `FormData`, with pair images keyed like `pairs[0][leftImage]`, and posted via `services/games.ts`'s `createGame`. Keep that FormData shape in sync with the backend's multipart parser if the form fields change — see `types/CreateGameFormData.ts` for the underlying shape before that packing happens.

### Styling

Tailwind v4, CSS-first config via `@theme` in `app/globals.css` (no `tailwind.config.*` file). Dark UI with two accent colors used as a running convention for "left/A" vs "right/B" choices: cyan `main1` and coral `main2` (see `VsDivider`, the `shadow-glow-*` variables). The comment block at the top of `globals.css` documents the canonical radius/shadow scale for `components/ui/*` primitives (e.g. `rounded-lg` for controls, `rounded-xl` for image tiles, `rounded-2xl` for panels) — follow it instead of picking values ad hoc.

### Path alias

`@/*` maps to the repo root (`tsconfig.json`), e.g. `@/components/...`, `@/services/...`, `@/types/...`.
