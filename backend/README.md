# Backend — TypeScript + Express

This folder contains a minimal scaffold for the assignment backend using Node.js, Express and TypeScript. It provides a small example API (health, users, events) and coding guidelines.

Quick start

1. Install dependencies

```bash
cd backend
npm install
```

2. Run in development

```bash
npm run dev
```

3. Build and run production

```bash
npm run build
npm start
```

API endpoints (examples)

- `GET /api/health` — basic health check
- `GET /api/users` — list example users
- `GET /api/users/:id` — get user by id
- `GET /api/events` — list events (in-memory)
- `POST /api/events` — create event (in-memory)

Files to inspect

- `src/app.ts` — express app
- `src/index.ts` — server entry
- `src/routes/*` — route definitions
- `src/controllers/*` — request handlers
- `src/services/*` — business logic (in-memory examples)
