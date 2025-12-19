## Quick orientation

This is an Expo + React Native app using Expo Router, a mix of Redux (redux-persist) and Zustand for state, and axios for API calls. Key runtime files:

- `App.tsx` — app root: wraps app in `Provider` (redux), `PersistGate`, `PaperProvider`, `PortalProvider`, and `AuthProvider`.
- `index.ts` — registers root component via `expo`.
- `app/` — Expo Router route directory; layouts live under `app/(auth)`, `app/(protected)`, etc.
- `AuthProvider.tsx` — decides whether to render Auth, SignUp steps or Home based on tokens + user state; reads tokens from `expo-secure-store`.
- `helpers/axios.ts` and `helpers/auth/axios.ts` — two axios instances: general `api` and `protectedApi`/`secureApi` with interceptors that handle token injection and refresh.
- `zustand/*.ts` — lightweight client state (user, tokens, feature stores). Tokens are persisted to `expo-secure-store`.

## Big-picture architecture & why

- Routing: app uses `expo-router` with folders under `app/` representing routes. Layout files (e.g. `app/_layout.tsx`, `app/(auth)/_layout.tsx`) configure global providers and header options.
- State: a hybrid approach:
  - Redux + redux-persist is used for some global slices (see references to `app/store` and `app/slices` in `AuthProvider.tsx`).
  - Zustand stores (e.g. `zustand/stores.ts`, `zustand/auth/stores.tsx`) hold auth tokens and user data used directly by hooks and axios interceptors. Token refresh logic often reads/writes Zustand and SecureStore directly.
  Reason: Zustand is used for small, synchronous access from non-react contexts (axios interceptors) while Redux holds larger persisted app state.

## Token & API patterns (critical)

- Two base axios instances exist:
  - `api` — public API (`helpers/axios.ts` and `helpers/auth/axios.ts` both export an `api` instance pointing to different base paths).
  - `protectedApi` / `secureApi` — attaches Authorization header from Zustand (`useTokensStore` or `useStore`) and implements a 401 interceptor that attempts a token refresh via `/token_generator/`.

- Important: token refresh is implemented inside the axios response interceptor and retries the original request after updating tokens in Zustand. The stores also persist tokens to `expo-secure-store` so AuthProvider and layouts read tokens at startup.

- When adding new API calls or endpoints, prefer `protectedApi` for endpoints that require auth and `api` for public endpoints. See `app/(auth)/login.tsx` where `api.post('/login/')` is used for login and `protectedApi.get('/jobs/resume/update_resume/')` is used immediately after.

## State access conventions

- Prefer hooks from `zustand/*` for quick read/write of small state (e.g. `useUserStore`, `useTokensStore`). Example: `useTokensStore.getState()` inside `helpers/axios.ts`.
- Redux slices are used for larger domain data (jobs, user profile details) and are wired via `app/store` and `PersistGate`. Use Redux Toolkit patterns where present.

## Key developer workflows (what actually runs)

- Start dev server (Expo):

```bash
npm run start
# or for platform targets
npm run android
## Quick orientation

This is an Expo + React Native app using Expo Router and Zustand for runtime state. Axios is used for API calls. Key runtime files:

- `App.tsx` — app root: wraps the app in global providers and `AuthProvider`.
- `index.ts` — registers root component via `expo`.
- `app/` — Expo Router route directory; layouts live under `app/(auth)`, `app/(protected)`, and `(freeRoutes)`.
- `app/(protected)/_layout.tsx` / `AuthProvider.tsx` — guard and boot logic that read tokens from `expo-secure-store` and populate Zustand stores.
- `helpers/axios.ts` and `helpers/auth/axios.ts` — public and auth-aware axios instances with refresh interceptors.
- `zustand/*.ts` — authoritative runtime stores: `zustand/stores.ts`, `zustand/auth/stores.tsx`, `zustand/jobsStore.ts`.

## Big-picture architecture (how pieces talk)

- Routing uses `expo-router`; folder names control route groups and visibility. Layout files (e.g. `app/(protected)/_layout.tsx`) implement guard logic and boot flows.
- Zustand is the source of truth for tokens and small app state used synchronously by non-react code (axios interceptors, layout guards). Tokens are mirrored in `expo-secure-store` so boot can restore state.
- Axios helpers provide two flavors: a public `api` and an auth `protectedApi` / `secureApi`. Interceptors read tokens from Zustand synchronously, refresh on 401, update Zustand + SecureStore, then retry the original request.

## Critical patterns to follow (concrete)

- Token injection: use `useTokensStore.getState().access` (or `useStore.getState().access`) in request interceptors to synchronously set `Authorization: Bearer <token>`.
- Refresh-on-401: when a response is 401 and `_retry` is not set, call the token endpoint (`/accounts/token_generator/` or `/api/accounts/token_generator/` depending on helper), update the Zustand token store, and retry the original request.
- Boot/guard flow: `app/(protected)/_layout.tsx` reads SecureStore (`accessToken`, `refreshToken`), sets Zustand tokens, validates/authenticates via `protectedApi.get('/accounts/auth_token_validator/')`, then decides Redirect to `/login`, sign-up steps, or render the app tabs.

## Developer workflows (what to run)

Start the Expo dev server:

```bash
npm run start
npm run android
npm run ios
```

Routes under `app/` hot-reload via expo-router. Use `/(protected)` for guarded routes and `/(auth)` for sign-in/sign-up flows.

## Project-specific gotchas

- Do not assume Redux — treat Redux code in the repo as legacy. Use Zustand stores when adding or fixing features.
- There are two axios helpers with slightly different base paths (`/api/` vs `/api/accounts`). Pick the helper matching the endpoint namespace.
- SecureStore keys are important: `accessToken` and `refreshToken` are read at boot and written by `zustand` token setters. Changing these keys requires coordinated changes across layouts and helpers.

## Files to inspect (quick map)

- Boot & routing: `App.tsx`, `index.ts`, `app/_layout.tsx`, `app/(protected)/_layout.tsx`, `AuthProvider.tsx`.
- Auth flows: `app/(auth)/login.tsx`, `app/(auth)/sign_up.tsx`, `helpers/auth/axios.ts`.
- API helpers: `helpers/axios.ts`, `helpers/auth/axios.ts`.
- Stores: `zustand/stores.ts`, `zustand/auth/stores.tsx`, `zustand/jobsStore.ts`.

## Helpful searches

- `useTokensStore` — token reads/writes and persistence.
- `token_generator` — token refresh endpoints.
- `expo-secure-store` — where boot reads tokens.

---

If anything is missing or you'd like short checklists (e.g., "add protected API call" or "add protected route"), tell me which checklist you want and I'll add it.
