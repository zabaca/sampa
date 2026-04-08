# Sampa

Class schedule management app for BJJ and martial arts gyms. Built for [Sampa Brazilian Jiu-Jitsu](https://sampabjj.com).

## Stack

- **Next.js** (App Router) with TypeScript
- **Drizzle ORM** + **Turso** (libsql/SQLite)
- **Tailwind CSS v4** with dark/light theme support
- **Bun** as runtime and package manager

## Features

- Weekly calendar and list views for class schedules
- Three programs: Adult BJJ, Youth BJJ, Striking
- Edit mode: add, edit, delete, drag-and-drop classes
- Multi-day class creation for recurring schedules
- Configurable class colors, locations, and program notes
- Dark/light theme with system preference detection

## Development

```bash
bun install
bun run db:migrate --seed   # create tables and seed data
bun dev                     # starts on port 3020
```

## Deployment

Deployed on Vercel with Turso integration for the production database.