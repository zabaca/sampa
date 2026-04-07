---
name: dev-start
description: Sets up a new developer's local environment for the Sampa BJJ schedule app. Use when someone needs to get the project running locally from scratch.
---

# Dev Start — Sampa BJJ Schedule App

Gets a new developer from zero to a running local dev environment. Follow every step in order, stopping on any failure.

## Workflow

### 1. Prerequisites Check

Verify required tools are installed:

```bash
bun --version    # Requires bun (any recent version)
node --version   # Requires Node.js 20+
```

If either is missing, inform the developer:
- **bun**: Install via `curl -fsSL https://bun.sh/install | bash`
- **node**: Install via `nvm install 20` or from nodejs.org

### 2. Install Dependencies

```bash
bun install
```

If this fails, check for:
- Stale lockfile: try `bun install --force`
- Node version mismatch

### 3. Set Up Local Database

The app uses SQLite locally via libsql. No external database needed for dev.

```bash
bun run db:seed
```

This will:
- Run Drizzle migrations (creates `classes`, `locations`, `program_notes` tables)
- Seed with ~91 classes across Adult BJJ, Youth BJJ, and Striking programs
- Seed 2 locations (Main Mat as default, Room B)
- Seed program notes

Creates a `local.db` file in the project root (gitignored).

### 4. Start Dev Server

```bash
bun dev
```

The app runs on **http://localhost:3020**.

### 5. Verify Everything Works

Open http://localhost:3020 and confirm:
- [ ] Schedule loads with classes in a calendar grid
- [ ] Three program tabs (Adult BJJ, Youth BJJ, Striking) are visible
- [ ] Location dropdown appears next to the gym title
- [ ] Calendar/List view toggle works
- [ ] Edit mode works (click Edit button)

Quick API smoke test:

```bash
curl -s http://localhost:3020/api/classes | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'{len(d)} classes loaded')"
curl -s http://localhost:3020/api/locations | python3 -c "import sys,json; print(json.load(sys.stdin))"
```

Expected: 91 classes, 2 locations.

### 6. (Optional) Connect to Turso for Prod Data

For production database access (not needed for local dev):

```bash
npx vercel env pull .env.local
```

This pulls `TURSO_DATABASE_URL` and `TURSO_DATABASE_TURSO_AUTH_TOKEN`. The app auto-detects these and connects to Turso instead of local SQLite.

To run migrations against prod:

```bash
source .env.local && TURSO_DATABASE_URL=$TURSO_DATABASE_URL TURSO_DATABASE_TURSO_AUTH_TOKEN=$TURSO_DATABASE_TURSO_AUTH_TOKEN bun run db:migrate
```

**Warning**: `db:seed` against prod will wipe and re-seed all data. Only use `db:migrate` for prod.

## Project Overview

| What | Details |
|------|---------|
| Framework | Next.js 16 (App Router) |
| Runtime | Bun |
| Database | SQLite (local) / Turso (prod) via libsql + Drizzle ORM |
| Styling | Tailwind CSS v4 |
| Deployment | Vercel (auto-deploys from `main`) |
| Dev port | 3020 |

## Key Commands

| Command | Purpose |
|---------|---------|
| `bun dev` | Start dev server on port 3020 |
| `bun run build` | Production build |
| `bun run db:generate` | Generate Drizzle migration after schema changes |
| `bun run db:migrate` | Run migrations (no seed) |
| `bun run db:seed` | Run migrations + seed data |
| `bun run db:studio` | Open Drizzle Studio (DB browser) |

## Troubleshooting

- **Port 3020 in use**: Kill the process with `lsof -ti:3020 | xargs kill`
- **DB errors after schema change**: Delete `local.db` and re-run `bun run db:seed`
- **Build fails with Suspense error**: The main page component uses `useSearchParams` which requires a `<Suspense>` wrapper — this is already set up in `src/app/page.tsx`
- **Turso auth errors**: Re-pull env vars with `npx vercel env pull .env.local`
