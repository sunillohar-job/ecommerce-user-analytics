# User Journey Analytics (Mock)

Local demo of a React + TypeScript front-end with a mock Express backend that returns user events and KPIs.

Run locally:

```powershell
npm install
npm run start
```

This starts an Express mock API on port `4000` and the Vite dev server on `5173`.

Data model and storage recommendation
- Events: store as append-only event stream with schema: { eventId, userId, type, ts, metadata }.
- Session entity: derived from events; store session start, end, pagesVisited, purchases for fast read queries.
- Users: profile store with userId, email, name, traits.

Storage approach for scale (1M events/day, 500k users):
- Ingest events into a streaming system (Kafka/Kinesis).
- Raw events persisted in a cost-efficient object store (S3) partitioned by date for audit/history.
- Use a time-series optimized DB for querying recent events and aggregations (ClickHouse, TimescaleDB, or Druid).
- User profile and lookup stored in a low-latency key-value store (Redis or DynamoDB) for search.
- Precompute daily aggregates (sessions, page_views, purchases) into an OLAP store for dashboard KPIs.

This repo contains a minimal UI demonstrating: user search, session timeline, KPIs and charts.
