# AGENTS.md

## Instructions for OpenCode agents

### Key Commands
- **Backend**: `cd backend && npm run build && npm start` (requires `npm run build` first)
- **Backend dev**: `cd backend && npm run dev` (uses ts-node directly)
- **Frontend**: `cd backend/frontend && npm start`
- **Database**: `docker exec -i edis_db psql -U edis_user -d edis_dashboard_db < database/init.sql`
- **Full stack**: Start backend, then frontend (runs on ports 3000 and 3001 respectively)

### Architecture Notes
- Monorepo with separate `backend/` (Node/Express/TypeScript) and `backend/frontend/` (React/CRA/TypeScript) directories
- Backend entrypoint: `backend/src/app.ts`
- Frontend entrypoint: `backend/frontend/src/App.tsx`
- API base path: `/api` (e.g. `GET /api/tasks`)
- PostgreSQL via Docker container `edis_db` on port 5432
- DB credentials: `edis_user` / `edis_password` / `edis_dashboard_db`
- Package.json-style naming in backend scripts (`build`, `start`, `dev`)

### Workflow Conventions
- Always run `npm run build` before `npm start` in backend (compiled JS is at `backend/dist/`)
- CORS configured on backend to allow `localhost:3000` and `localhost:3001`
- Frontend runs on port 3001 by default (set with `PORT=3001`)
- Both frontend and backend run on `localhost` only (no production deploy config)

### Setup Requirements
- PostgreSQL must be running (Docker: `docker run -d --name edis_pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=edis_dashboard -p 5432:5432 postgres:16`)
- Run `database/init.sql` against the database to create the `tasks` table
- `.env` file at `database/.env` with `DATABASE_URL=postgres://user:pass@localhost:5432/edis_dashboard_db`
- `@mui/icons-material` required in frontend (installed separately)
