# AGENTS.md

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build       # Production build
npm run start       # Run production build
npm run lint       # ESLint
npm run send-emails # Run bulk email script (scripts/send-bulk-email.mjs)
npm run mcp-serve  # Run MCP server (stdio transport)
```

## Architecture

- **Framework**: Next.js 14 (App Router) + React 18 + TypeScript + Tailwind CSS
- **Database**: SQLite (`database/users.sqlite`) via `better-sqlite3`, supports MySQL via `mysql2`
- **Entry point**: `src/app/page.tsx`
- **Routing**: File-based in `src/app/`
- **Auth**: JWT-based in `src/lib/auth.ts`

## Key Directories

- `src/app/` - Next.js pages and API routes
- `src/lib/` - Utilities (db, auth, blogUtils, projectUtils, etc.)
- `src/components/` - Reusable UI components
- `src/sections/` - Page sections (Home page)
- `mcp/` - MCP server implementation

## MCP Server

The MCP server (`mcp/server.ts`) provides CRUD tools for blogs, projects, and contributions via stdio. Requires `MCP_API_KEY` env var. Run with `npm run mcp-serve`.

## Environment Variables

Create `.env.local` with required vars (database URL, API keys, etc.). See existing configs.

## Non-Obvious Notes

1. Database connection lives in `src/lib/sqlite.ts` and `src/lib/db.js` (dual support)
2. Blog/project/contribution utils in `src/lib/*Utils.ts` - use these for data access, not raw queries
3. The MCP server authenticates via `MCP_API_KEY` env var and validates against users table or admin_settings

---
No test suite found. No pre-commit hooks.