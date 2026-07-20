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

- **Server Components fetch the backend directly** for public reads (e.g. `app/game/[id]/page.tsx`, `app/games/page.tsx`), forwarding the incoming request's cookies by hand when the read needs auth (SSR has no browser to attach cookies for it).
- **Client-side mutations all call the backend directly** with `credentials: "include"` and let the browser attach the `jwt` cookie — there is no Next.js API-route proxy layer anymore (`services/auth.ts`, `services/games.ts`, `services/profile.ts` all do this). This only works because the backend's CORS config (`backend/src/server.js`) explicitly allowlists the frontend origins with `credentials: true`, and the `jwt` cookie is `sameSite: "lax"` (see `backend/src/utils/generateToken.js`) rather than scoped to a proxy path.
- `app/api/games/create/route.ts` is leftover dead code from the old proxy pattern (streams `req.body` through to `/game/create` with `duplex: "half"`) — nothing links to it; `services/games.ts`'s `createGame` (called from `app/create/page.tsx`) hits the backend directly instead. Don't use it as a reference for new mutations.
- `app/settings/*` (as opposed to `app/profile/settings/*`) is a stale, unlinked duplicate of the profile pages — superseded by the `app/profile/*` routes below. Safe to ignore or delete; don't build on it.

### Auth

- JWT lives in an httpOnly cookie (`jwt`) set directly by the backend (`generateToken` in `backend/src/utils/generateToken.js`) on login, cleared on logout — the frontend never sets or reads this cookie's value itself, only forwards it.
- `services/auth.ts` (`LoginAccount`, `RegisterAccount`) and `store/useAuth.ts` (`fetchUser`, `logout`) call the backend's `/auth/*` endpoints directly from the browser with `credentials: "include"`.
- For SSR, `lib/auth/getCurrentUserOnServer.ts` and `app/layout.tsx` each independently read `cookies()` and forward them as a `cookie` header to the backend's `/auth/me` to resolve the current user — keep both in sync if the resolution logic changes.
- Client-side auth state is a zustand store, `store/useAuth.ts` (`user`, `loading`, `fetchUser`, `logout`), hydrated by `components/authInitializer.tsx` from the server-resolved user passed down in `app/layout.tsx`.

### Game flow

`GameController` (`components/game/gameController.tsx`) is a client-side state machine with three steps — `info` → `session` → `results` — rendering `GameInfo`, `GameSession`, `GameResults` respectively. It's handed a `GameWithPairs` fetched server-side by `app/game/[id]/page.tsx`.

### Game creation

`app/create/page.tsx` is a two-step `react-hook-form` wizard using `FormProvider`: step 1 (`CreateGameForm`) collects title/description/image/category/tags, step 2 (`CreatePairsForm`) collects the would-you-rather pairs. On submit, everything (including images) is packed into one `FormData`, with pair images keyed like `pairs[0][leftImage]`, and posted via `services/games.ts`'s `createGame`. Keep that FormData shape in sync with the backend's multipart parser if the form fields change — see `types/CreateGameFormData.ts` for the underlying shape before that packing happens.

### Profile area

`app/profile/layout.tsx` gates everything under `/profile` on `getCurrentUserOnServer()`, redirecting guests to `/`, and renders `ProfileNav` (tabs for Settings / My Games). Two sub-areas:

- **Settings** (`app/profile/settings/page.tsx`) — a plain form posting to `services/profile.ts`'s `updateSettings`, which only sends the fields that changed (username/password).
- **My Games** (`app/profile/games/page.tsx` + `components/profile/myGamesList.tsx`) — server-fetches the user's games from `/profile/games`, then client-side renders a grid with per-card Edit/Delete. Delete goes through `components/ui/ConfirmModal.tsx` before calling `services/profile.ts`'s `deleteMyGame`. Edit links to `app/profile/games/[id]/edit/page.tsx`, which mirrors the create-game wizard (`components/edit/editGameForm.tsx` + `editPairsForm.tsx`, driven by `types/EditGameFormData.ts`) but pre-fills from the existing `GameWithPairs` and submits via `updateMyGame`. Because edited pairs mix untouched images (already-uploaded URLs, sent as strings) with newly-picked files, the submit handler only appends a field to `FormData` when the value is an actual `File` — keep that string-vs-File branching if you touch this form.

### Styling

Tailwind v4, CSS-first config via `@theme` in `app/globals.css` (no `tailwind.config.*` file). Dark UI with two accent colors used as a running convention for "left/A" vs "right/B" choices: cyan `main1` and coral `main2` (see `VsDivider`, the `shadow-glow-*` variables). The comment block at the top of `globals.css` documents the canonical radius/shadow scale for `components/ui/*` primitives (e.g. `rounded-lg` for controls, `rounded-xl` for image tiles, `rounded-2xl` for panels) — follow it instead of picking values ad hoc.

### Path alias

`@/*` maps to the repo root (`tsconfig.json`), e.g. `@/components/...`, `@/services/...`, `@/types/...`.
