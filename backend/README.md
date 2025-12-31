# E-commerce User Analytics Backend (L4)

A production-ready **Backend / API (L4 level)** service built with **Node.js, Express, and TypeScript**. This service exposes REST APIs for health checks, user data management, and comprehensive analytics KPIs. It follows clean architecture principles, implements middleware-based validation, and includes production-ready tooling for logging, error handling, and API documentation.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [API Endpoints](#api-endpoints)
- [Middleware & Validation](#middleware--validation)
- [Error Handling](#error-handling)
- [Logging](#logging)
- [Architecture & Design Patterns](#architecture--design-patterns)
- [Coding Guidelines](#coding-guidelines)

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB
- **Development Tools**:
  - `ts-node-dev` – development with hot reload
  - `ESLint` – linting
  - `Prettier` – code formatting
- **Logging**: `pino` & `pino-pretty` – structured logging
- **Security**: `helmet` – HTTP security headers
- **API Documentation**: `swagger-jsdoc` & `swagger-ui-express`
- **HTTP Logging**: `pino-http` – request/response logging

---

## Features

- RESTful API design with TypeScript type safety
- Comprehensive analytics KPIs (traffic, search, revenue, conversion, user behavior)
- User search and journey tracking
- Request validation via middleware
- Centralized error handling
- Structured logging with request ID tracking
- Swagger/OpenAPI documentation
- MongoDB integration with optimized queries
- Environment-based configuration
- Production-ready security headers (Helmet)
- CORS support

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v22 or higher recommended)
- **npm** (v9 or higher) or **yarn**
- **MongoDB** (v7 or higher) - running locally or accessible via connection string

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory (see [Environment Variables](#environment-variables) section for details):

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017
MONGO_DB=ecommerce_analytics
```

### 3. Run Database Seeding (Optional)

To populate the database with sample data:

```bash
node seed.js
```

This will create:
- 40 sample users
- Multiple sessions per user
- Various event types (PAGE_VIEW, SEARCH, ADD_TO_CART, ORDER_PLACED, etc.)

### 4. Start Development Server

```bash
npm run dev
```

The API will be available at:

```
http://localhost:4000/api
```

### 5. Build for Production

```bash
npm run build
npm start
```

---

## Environment Variables

Create a `.env` file in the root directory with the following variables:

| Variable     | Description                          | Default     | Required |
| ------------ | ------------------------------------ | ----------- | -------- |
| `PORT`       | Server port number                   | `4000`      | No       |
| `MONGO_URI`  | MongoDB connection string            | -           | Yes      |
| `MONGO_DB`   | MongoDB database name                | -           | Yes      |

**Example `.env` file:**

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017
MONGO_DB=ecommerce_analytics
```

---

## Database Setup

### MongoDB Collections

The application uses three main collections:

- **`users`** - User profile data
- **`sessions`** - User session information
- **`events`** - User interaction events

### Database Indexes

The seed script automatically creates the following indexes for optimal query performance:

**Users Collection:**
- `userId` (unique)
- `country`
- `lastActiveAt` (descending)

**Sessions Collection:**
- `sessionId` (unique)
- `userId`
- `startedAt` (descending)

**Events Collection:**
- `userId`
- `sessionId`
- `eventType`
- `timestamp` (descending)
- `sessionId + timestamp` (compound)
- `sessionId + timestamp + eventType + userId` (compound)

### Seeding the Database

Run the seed script to populate your database with sample data:

```bash
node seed.js
```

**Note:** The seed script will:
- Clean existing collections
- Create collections if they don't exist
- Insert sample users, sessions, and events
- Create all necessary indexes

---

## Project Structure

```
.
├── src/
│   ├── index.ts                    # Application entry point
│   ├── app.ts                      # Express app configuration
│   ├── logger.ts                   # Pino logger setup
│   ├── utils.ts                    # Utility functions
│   ├── config/
│   │   └── index.ts                # Configuration management
│   ├── db/
│   │   └── mongoClient.ts          # MongoDB client singleton
│   ├── routes/
│   │   ├── index.ts                # Route aggregator
│   │   ├── health.routes.ts        # Health check endpoints
│   │   ├── users.routes.ts         # User management endpoints
│   │   └── analytics.routes.ts     # Analytics KPI endpoints
│   ├── controllers/
│   │   ├── users.controller.ts     # User request handlers
│   │   └── analytics.controller.ts # Analytics request handlers
│   ├── services/
│   │   ├── users.service.ts        # User business logic
│   │   └── analytics.service.ts     # Analytics business logic
│   ├── middlewares/
│   │   ├── error-handler.middleware.ts        # Global error handler
│   │   ├── x-request-id-validator.middleware.ts # Request ID validation
│   │   └── period-query-validator.middleware.ts # Period query validation
│   ├── models/
│   │   ├── user.interface.ts       # User type definitions
│   │   ├── user-event.interface.ts # Event type definitions
│   │   ├── user-journey.interface.ts # Journey type definitions
│   │   ├── analytics.interface.ts  # Analytics type definitions
│   │   └── event-type.constant.ts  # Event type constants
│   └── swagger/
│       └── components.ts           # Swagger/OpenAPI components
├── dist/                           # Compiled JavaScript (production)
├── node_modules/                   # Dependencies
├── seed.js                         # Database seeding script
├── package.json                    # Project dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
├── CODING_GUIDELINES.md            # Development guidelines
└── README.md                       # This file
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

## API Documentation

Interactive API documentation is available via Swagger UI when the server is running:

Local
```
http://localhost:4000/api/docs
```

Production:
[Swagger Docs](https://d37ep0oojarjm1.cloudfront.net/api/docs)

The documentation includes:
- All available endpoints
- Request/response schemas
- Required headers and query parameters
- Example requests and responses

---

## Deployment

This project uses **GitHub Actions** to deploy the backend to an EC2 instance.

- **Workflow:** Deploy Backend to EC2  
- **Triggers:**
  - Automatic on push to the `main` branch (only when `backend/**` changes)
  - Manual trigger using `workflow_dispatch`
- **What it does:**
  - Connects to EC2 via SSH
  - Pulls the latest code
  - Installs dependencies and runs tests
  - Builds the backend
  - Restarts the service using **PM2**

🔗 **Workflow file:** [Deploy Backend to EC2](https://github.com/sunillohar-job/ecommerce-user-analytics/actions/workflows/backend-deploy.yml)  

---

## API Endpoints

### Base Path

All API endpoints are prefixed with `/api`.

### Health Check API

**Base Path:** [/api/health](https://d37ep0oojarjm1.cloudfront.net/api/health)

| Method | Endpoint  | Description                   | Headers Required |
| ------ | --------- | ----------------------------- | ---------------- |
| GET    | `/health` | Returns service health status | None            |

**Example Request:**

```bash
curl https://d37ep0oojarjm1.cloudfront.net/api/health
```

**Example Response:**

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### Users APIs

**Base Path:** `/api/users`

**Middleware:** `x-request-id-validator`

| Method | Endpoint                  | Description                               | Headers Required        |
| ------ | ------------------------- | ----------------------------------------- | ----------------------- |
| GET    | `/users/search`           | Search users using query parameters       | `X-Request-Id`          |
| GET    | `/users/:userId/sessions` | Query session for a specific user         | `X-Request-Id`          |
| GET    | `/users/:userId/journeys` | Retrieve journey data for a specific user | `X-Request-Id`          |


#### Search Users

**Endpoint:** `GET /api/users/search`

**Query Parameters:**
- `query` (required): Search term to match userId, first name, or last name
- `limit` (optional): Maximum number of users to return (default: 10, max: 50)

**Example Request:**

```bash
curl -H "X-Request-Id: req-123" \
  "https://d37ep0oojarjm1.cloudfront.net/api/users/search?query=john&limit=10"
```

#### Search Users session

**Endpoint:** `GET /api/users/:userId/sessions`

**Query Parameters:**
- `query` (required): Search term to match sessionId
- `limit` (optional): Maximum number of users to return (default: 10, max: 50)

**Example Request:**

```bash
curl -H "X-Request-Id: req-123" \
  "https://d37ep0oojarjm1.cloudfront.net/api/users/u1001/sessions?query=u1001_s&limit=10"
```


#### Get User Journeys

**Endpoint:** `GET /api/users/:userId/journeys`

**Path Parameters:**
- `userId` (required): User ID

**Query Parameters:**
- `from` (required): Journey start date (ISO 8601 format)
- `to` (required): Journey end date (ISO 8601 format)

**Example Request:**

```bash
curl -H "X-Request-Id: req-123" \
  "https://d37ep0oojarjm1.cloudfront.net/api/users/u1001/journeys?from=2024-12-31T18:30:00.000Z&to=2025-12-30T18:29:59.999Z"
```

---

### Analytics APIs

**Base Path:** `/api/analytics`

**Middleware:**
- `x-request-id-validator`
- `period-query-validator`

These endpoints provide comprehensive KPI, funnel, and behavioral analytics.

| Method | Endpoint                              | Description                     | Headers Required        |
| ------ | ------------------------------------- | ------------------------------- | ----------------------- |
| GET    | `/analytics/traffic`                  | Traffic-related KPIs            | `X-Request-Id`          |
| GET    | `/analytics/search`                   | Search performance KPIs         | `X-Request-Id`          |
| GET    | `/analytics/product-and-cart`         | Product & cart analytics        | `X-Request-Id`          |
| GET    | `/analytics/revenue-and-conversion`   | Revenue & conversion metrics    | `X-Request-Id`          |
| GET    | `/analytics/user-behavior-and-funnel` | User behavior & funnel analysis | `X-Request-Id`          |

#### Query Parameters

All analytics endpoints require a `period` query parameter with one of the following values:

- `today`
- `yesterday`
- `last_7_days`
- `this_week`
- `last_week`
- `this_month`
- `last_month`
- `this_year`
- `last_year`

**Example Request:**

```bash
curl -H "X-Request-Id: req-123" \
  "https://d37ep0oojarjm1.cloudfront.net/api/analytics/traffic?period=this_year"
```

---

## Middleware & Validation

The API uses middleware to enforce request consistency and data correctness.

### Global / Route-Level Middleware

#### `x-request-id-validator`

- **Purpose**: Ensures every request contains a valid `x-request-id` header
- **Applied to**: User and analytics routes
- **Error Response**: Returns `400 Bad Request` if header is missing or invalid

#### `period-query-validator`

- **Purpose**: Validates period query parameters for date range
- **Applied to**: Analytics endpoints only
- **Valid Values**: `today`, `yesterday`, `last_7_days`, `this_week`, `last_week`, `this_month`, `last_month`, `this_year`, `last_year`
- **Error Response**: Returns `400 Bad Request` if period is invalid or missing

---

## Error Handling

The application implements centralized error handling:

- **Error Middleware**: All errors are caught and processed by `error-handler.middleware.ts`
- **Consistent Responses**: Error responses follow a standard format:

```json
{
  "message": "Error description",
  "statusCode": 400
}
```

- **HTTP Status Codes**:
  - `400` - Bad Request (validation errors)
  - `404` - Not Found (resource not found)
  - `500` - Internal Server Error (server errors)

---

## Logging

The application uses **pino** for structured, production-ready logging:

- **Structured Logs**: JSON format in production, pretty-printed in development
- **Request Logging**: Automatic HTTP request/response logging via `pino-http`
- **Request ID Tracking**: All logs include the `x-request-id` header for request tracing
- **Log Levels**: Supports standard log levels (info, warn, error, debug)

**Example Log Output:**

```json
{
  "level": 30,
  "time": "2025-12-31T10:14:29.609Z",
  "service": "ecommerce-user-analytics-service",
  "env": "production",
  "req": { "method": "GET", "url": "/api/health" },
  "res": { "statusCode": 200 },
  "responseTime": 1,
  "msg": "request completed"
}
```

---

## Architecture & Design Patterns

This backend follows a **layered architecture** with a strong focus on separation of concerns and scalability.

### Key Principles

- **Single Responsibility Principle (SRP)** – each module has one clear purpose
- **Fail-Fast Validation** – invalid requests are rejected early
- **Configuration-Driven Design** – analytics periods are validated against a centralized config
- **Type Safety** – TypeScript reduces runtime errors
- **Observability-Ready** – structured logs via pino for monitoring tools

### Architecture Layers

1. **Routes** – Define API endpoints and compose middleware
2. **Controllers** – Handle request processing and response construction
3. **Services** – Contain business logic and data processing
4. **Models** – Type definitions and interfaces
5. **Middleware** – Cross-cutting concerns (validation, error handling)
6. **Database** – MongoDB client abstraction

### Design Patterns Applied

- **Middleware Pattern** – Express middleware for validation and request handling
- **Module Pattern** – MongoDB client class are designed with module pattern.
- **Singleton Pattern** – MongoDB client connection management
- **Repository Pattern** – Service layer abstracts database operations
- **Factory Pattern** – Configuration and logger initialization

---

## Coding Guidelines

See [CODING_GUIDELINES.md](./CODING_GUIDELINES.md) for detailed development guidelines.

### Key Rules

- **TypeScript**: Enable `strict` mode and prefer explicit types for public functions
- **Error Handling**: Centralize error responses via middleware
- **Layering**: Controllers handle HTTP; services contain business logic; routes wire controllers
- **No Direct DB Calls**: Use services or repositories, not direct DB calls in controllers
- **Small Functions**: Keep functions small and single-purpose
- **Formatting**: Use `prettier` for formatting and `eslint` for linting

---

## Security

- **Helmet**: HTTP security headers enabled
- **CORS**: Cross-Origin Resource Sharing configured
- **Request Validation**: All requests validated via middleware
- **Type Safety**: TypeScript prevents common runtime errors

---