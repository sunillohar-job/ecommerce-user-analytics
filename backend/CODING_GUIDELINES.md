# Coding Guidelines — Backend

Purpose: keep code consistent, testable and easy to maintain.

Key rules

- TypeScript: enable `strict` in `tsconfig.json` and prefer explicit types for public functions.
- Error handling: centralize error responses via middleware (`src/middlewares/errorHandler.ts`).
- Layering: controllers handle HTTP; services contain business logic; routes wire controllers.
- No direct DB calls in controllers — use services or repositories.
- Keep functions small and single-purpose.

Formatting & linting

- Use `prettier` for formatting and `eslint` (with `@typescript-eslint`) for linting.
- `npm run lint` and `npm run format` should be run before commits.

Folder structure

- `src/config` — config and env loading
- `src/routes` — express routers
- `src/controllers` — request handlers
- `src/services` — business logic
- `src/models` — types or DB models
- `src/middlewares` — express middlewares

API design

- Use RESTful routes under `/api`.
- Responses: wrap payload in `{ data: ... }`, errors in `{ message: ... }`.

Testing

- Add unit tests for services and controllers. Mock external dependencies.

Commits & PRs

- Write descriptive commit messages.
- Include tests and update docs when adding features.
