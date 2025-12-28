# Backend / API Service (L3)

This repository contains the **Backend / API (L3 level)** service built using **Node.js, Express, and TypeScript**.
The service exposes REST APIs for **health checks, user data, and analytics KPIs**, following clean architecture, middleware-based validation, and production-ready tooling.

---

## Tech Stack

- **Node.js**
- **Express.js**
- **TypeScript**
- **ts-node-dev** – development with hot reload
- **ESLint** – linting
- **Prettier** – code formatting
- **pino & pino-pretty** – structured logging

---

## Project Structure

```
.
├── src/
│   ├── index.ts                # Application entry point
│   ├── routes/
│   │   ├── health.routes.ts
│   │   ├── users.routes.ts
│   │   └── analytics.routes.ts
│   ├── controllers/            # Route handlers
│   ├── middlewares/            # Request validators & middleware
│   └── utils.ts
│
├── dist/                       # Compiled JavaScript (production)
├── package.json
├── tsconfig.json
├── .eslintrc
├── .prettierrc
└── README.md
```

---

## Available Scripts

| Script              | Description                                      |
| ------------------- | ------------------------------------------------ |
| `npm run dev`       | Start server in development mode with hot reload |
| `npm run build`     | Compile TypeScript into JavaScript               |
| `npm start`         | Run production build from `dist/`                |
| `npm run lint`      | Run ESLint and auto-fix issues                   |
| `npm run format`    | Format code using Prettier                       |
| `npm run typecheck` | Type-check without emitting files                |

---

## Getting Started

### 1. Install Dependencies

```
npm install
```

### 2. Run in Development

```
npm run dev
```

### 3. Build for Production

```
npm run build
npm start
```

The API will be available at:

```
http://localhost:<PORT>/api
```

---

## Middleware & Validation

The API uses middleware to enforce request consistency and data correctness.

### Global / Route-Level Middleware

- **`x-request-id-validator`**

  - Ensures every request contains a valid `x-request-id` header
  - Used across user and analytics routes

- **`period-query-validator`**

  - Validates period query parameters for date range
  - Ensures the provided period value matches one of the predefined supported time ranges
  - Applied to analytics endpoints only
  - The period query parameter must be one of the following values:
    today | yesterday | last_7_days | this_week | last_week | this_month | last_month | this_year | last_year

---

## Health Check API

Base Path:

```
/health
```

| Method | Endpoint  | Description                   |
| ------ | --------- | ----------------------------- |
| GET    | `/health` | Returns service health status |

---

## Users APIs

Base Path:

```
/users
```

Middleware:

- `x-request-id-validator`

| Method | Endpoint                  | Description                               |
| ------ | ------------------------- | ----------------------------------------- |
| GET    | `/users/search`           | Search users using query parameters       |
| GET    | `/users/:userId/journeys` | Retrieve journey data for a specific user |

---

## Analytics APIs

Base Path:

```
/analytics
```

Middleware:

- `x-request-id-validator`
- `period-query-validator`

These endpoints provide KPI, funnel, and behavioral analytics.

| Method | Endpoint                              | Description                     |
| ------ | ------------------------------------- | ------------------------------- |
| GET    | `/analytics/traffic`                  | Traffic-related KPIs            |
| GET    | `/analytics/search`                   | Search performance KPIs         |
| GET    | `/analytics/product-and-cart`         | Product & cart analytics        |
| GET    | `/analytics/revenue-and-conversion`   | Revenue & conversion metrics    |
| GET    | `/analytics/user-behavior-and-funnel` | User behavior & funnel analysis |

---

## Required Headers

Most APIs require the following header:

```
X-Request-Id: <unique-request-id>
```

Analytics APIs also require valid **period-based query parameters**, enforced via middleware.

---

## Error Handling

- Centralized error handling middleware
- Consistent API error responses
- Validation errors returned with appropriate HTTP status codes

---

## Logging

- Uses **pino** for structured logs
- Pretty-printed logs in local development
- Production-ready JSON logs for observability tools

---

## Best Practices Followed

- Type-safe APIs using TypeScript
- Clean separation of routes, controllers, and middleware
- Request validation at API boundaries
- Environment-agnostic build process
- Linting and formatting enforced

## Design Patterns & Architecture

- This backend follows a layered architecture with a strong focus on separation of concerns and scalability.
- Routes define API endpoints and compose middleware.
- Controllers handle request processing and response construction.
- Middleware manages cross-cutting concerns such as header and query validation.
- The solution leverages Express’s middleware pattern to keep validation and request handling decoupled and reusable.

Key principles applied:

- Single Responsibility Principle (SRP) – each module has one clear purpose
- Fail-Fast Validation – invalid requests are rejected early
- Configuration-Driven Design – analytics periods are validated against a centralized TIME_PERIODS config
- Type Safety using TypeScript to reduce runtime errors
- Observability-Ready Logging with structured logs via pino
- Overall, the design is clean, maintainable, testable, and production-ready.
