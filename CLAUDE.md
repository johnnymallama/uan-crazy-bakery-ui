# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development (runs on port 9002 with Turbopack)
npm run dev

# Build for production
npm run build

# Lint
npm run lint

# Type check (TypeScript without emitting)
npm run typecheck

# Run tests interactively
npm run test

# Run tests in CI mode (non-interactive)
npm run test:ci

# Run a single test file
npx jest src/components/auth/login-form.test.tsx

# Genkit AI development server
npm run genkit:dev
npm run genkit:watch
```

## Architecture

This is a **Next.js 15 app** using the App Router with a `[lang]` dynamic segment for i18n. All pages live under `src/app/[lang]/`, which gives every route automatic locale support (`/es/...` or `/en/...`).

### Internationalization

- Supported locales: `es` (default) and `en`, defined in `i18n-config.ts`
- Dictionaries are JSON files in `src/lib/dictionaries/`
- `src/lib/get-dictionary.ts` loads dictionaries server-side and passes them down as props to components
- The middleware (`src/middleware.ts`) redirects requests without a locale prefix to the detected locale

### Authentication & Session

Authentication is **dual-layer**:

1. **Firebase Auth** — handles identity (email/password + Google sign-in). The client-side `SessionProvider` (`src/context/session-provider.tsx`) listens to `onAuthStateChanged` and enriches the Firebase user with backend data (fetching the user's `tipo`/role from the Spring API).
2. **HTTP-only session cookie** (`session`) — set by `src/app/api/auth/login/route.ts` after login. Contains `{ uid, role }`. The middleware reads this cookie to protect dashboard routes.

Roles are `administrador` and `consumidor`. Route protection:
- `/dashboard/admin/*` requires `role === 'administrador'`
- `/dashboard/consumer/*` requires `role === 'consumidor'`
- Unauthenticated requests are redirected to `/{lang}/unauthorized`

> **Local development note:** The middleware has a commented-out block for hardcoding a session value for Firebase workspace environments. Toggle the appropriate comment in `src/middleware.ts` when switching between local and production auth.

### Backend API

All API calls hit a Spring Boot backend hosted at:
```
https://crazy-bakery-bk-835393530868.us-central1.run.app
```

The main API layer is `src/lib/api.ts`. Domain-specific APIs are split into `src/lib/apis/`:
- `orden-api.ts` — orders
- `torta-api.ts` — cake configs
- `receta-api.ts` — recipes
- `tamano-api.ts` — sizes
- `ingrediente-api.ts` — ingredients
- `imagen-api.ts` — image generation
- `costo-api.ts` — cost calculation

Types are in `src/lib/types/`.

### Order Wizard

The core user flow is a multi-step order wizard (`src/components/order/order-wizard-modal.tsx`). It orchestrates:

1. Recipe type (TORTA / CUPCAKE)
2. Size selection
3. Sponge ingredient
4. Filling ingredient
5. Coverage ingredient
6. Customization + AI image generation (via `/api/generate-suggestion`)
7. Auth gate (login/register if not authenticated)
8. Shipping info
9. Summary + submission

On submit, the wizard calls the backend to create a `torta` → `receta` → `orden` in sequence. Multiple products can be added to the same order.

### AI Features

Genkit (`src/ai/genkit.ts`) uses `googleai/gemini-2.5-flash`. The AI endpoint (`src/app/api/generate-suggestion/route.ts`) streams a text response for customization suggestions. Requires `GOOGLE_GENAI_API_KEY` environment variable.

### UI Components

All base UI components (`src/components/ui/`) are **shadcn/ui** components built on Radix UI primitives + Tailwind CSS. Do not manually edit these unless necessary — regenerate with `npx shadcn-ui add <component>`.

Feature components are organized by domain:
- `src/components/admin/` — admin dashboards (products, sizes, users, order management)
- `src/components/consumer/` — consumer order views
- `src/components/order/` — order wizard and its steps
- `src/components/auth/` — login, register, account forms
- `src/components/layout/` — header, footer, nav

### Style Guidelines

- Primary color: Coral `#FF7F50`
- Background: Light beige `#F5F5DC`
- Accent: Teal `#008080`
- Fonts: `PT Sans` (body), `Playfair` (headlines)
- Pastel tones throughout

### Testing

Tests use Jest + React Testing Library with jsdom. Test files are colocated with their components (e.g., `login-form.test.tsx` next to `login-form.tsx`). The `@/` alias maps to `src/`.

CI runs lint → typecheck → tests → build on every PR (`.github/workflows/pr.yml`).
