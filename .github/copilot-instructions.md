# Copilot Instructions for TieBugs

TieBugs is a fly tying recipe sharing platform built with TanStack Start, deployed to Cloudflare Workers.

## Architecture Overview

- **Framework**: TanStack Start (React + SSR) with file-based routing in `src/routes/`
- **Deployment**: Cloudflare Workers via `wrangler` and `@cloudflare/vite-plugin`
- **Database**: Neon PostgreSQL with Drizzle ORM (`src/db/schema.ts`)
- **Auth**: Better Auth with social providers (Google, GitHub, Facebook, Twitter, TikTok) - see `src/lib/auth/`
- **Styling**: Tailwind CSS v4 with shadcn/ui components (`src/components/ui/`)

## Key Patterns

### Routing & API Handlers

Routes live in `src/routes/`. TanStack Router generates `src/routeTree.gen.ts` automatically - never edit this file.

```tsx
// Page route pattern (src/routes/index.tsx)
export const Route = createFileRoute('/')({
  component: HomePage,
  loader: async () => await getRecipeCount(),
});

// API route pattern (src/routes/api/patterns/index.ts)
export const Route = createFileRoute('/api/patterns')({
  server: {
    handlers: ({ createHandlers }) =>
      createHandlers({
        GET: async () => {
          /* ... */
        },
        POST: {
          middleware: [authApiMiddleware],
          handler: async () => {
            /* ... */
          },
        },
      }),
  },
});
```

### Server Functions

Use `createServerFn` for server-side logic callable from client or loaders:

```tsx
// src/lib/recipes.server.ts
export const getRecipeCount = createServerFn({ method: 'GET' }).handler(async () => {
  const result = await db.select({ count: count() }).from(recipes);
  return result[0]?.count ?? 0;
});
```

### Authentication

- **Server**: `auth` from `@/lib/auth/server` - use `auth.api.getSession({ headers })`
- **Client**: `signIn`, `signOut`, `useSession` from `@/lib/auth/client`
- **Middleware**: `authMiddleware` (redirects) / `authApiMiddleware` (401 JSON) from `@/lib/auth/middleware`

### Database

Schema in `src/db/schema.ts`, relations in `src/db/relations.ts`. Use `db` from `@/db`.

```bash
pnpm db:generate   # Generate migrations
pnpm db:push       # Push schema changes
pnpm db:studio     # Open Drizzle Studio
```

## Commands

| Command          | Purpose                        |
| ---------------- | ------------------------------ |
| `pnpm dev`       | Start dev server on port 3000  |
| `pnpm build`     | Production build               |
| `pnpm deploy`    | Deploy to Cloudflare Workers   |
| `pnpm check`     | Run Biome linting + formatting |
| `pnpm storybook` | Launch Storybook on port 6006  |

## Conventions

- **Path aliases**: Use `@/*` imports (maps to `src/*`)
- **Formatting**: Biome with tabs, double quotes - run `pnpm check` before committing
- **UI Components**: Add via `pnpm dlx shadcn@latest add <component>` - uses `new-york` style
- **Component location**: shadcn components go in `src/components/ui/`, custom storybook demos in `src/components/storybook/`
- **Server files**: Name server-only modules with `.server.ts` suffix

## Environment Variables

Required in `.env` (not committed):

- `DATABASE_URL` - Neon PostgreSQL connection string
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - For Google OAuth
- `BETTER_AUTH_URL` - Base URL for auth (e.g., `http://localhost:3000`)
