# ecommerce-user-analytics

## Overview
This project implements a **User Journey Tracking Platform** for an e-commerce–like system (similar to Amazon).  
The platform ingests user events, stores them efficiently, and provides APIs and dashboards to visualize **user behavior, sessions, and analytics** over time.

The solution is designed with **scalability, observability, and cloud-native principles** in mind, targeting high-volume event ingestion (1M+ events/day).

---

## 🧠 Key Objectives
- Track user journeys across sessions and events
- Support efficient search and analytics per user
- Handle large-scale event ingestion
- Provide system health monitoring
- Demonstrate backend, cloud, and architectural expertise

---

## 🏗️ Architecture Overview
Frontend (React)
↓
API Gateway
↓
Node.js (Express + TypeScript)
↓
MongoDB Atlas
↓
Daily Analytics Job (10:00 UTC)
↓
External System / Export


### Core Design Principles
- Event-driven architecture
- Write-optimized event storage
- Separation of transactional and analytical workloads
- Cloud observability and monitoring

---

## 🧱 Tech Stack

### Frontend
- React
- TypeScript
- Chart.js / Recharts

### Backend
- Node.js
- Express.js
- TypeScript
- Swagger (API documentation)
- Jest (unit testing)

### Database
- MongoDB Atlas (Free Tier)

### Cloud & DevOps
- AWS (Free Tier)
  - EC2 / Elastic Beanstalk
  - CloudWatch
- GitHub Actions (CI/CD)
- AWS CDK (Infrastructure as Code)

### Monitoring
- Grafana (Free Tier)
- CloudWatch Logs & Metrics



---

## 🗄️ Database Design (MongoDB)

### Collections
- **users**
- **sessions**
- **events**
- **articles** (external integration)

### Event Model (Sample)
```json
{
  "userId": "string",
  "sessionId": "string",
  "eventType": "PAGE_VIEW | SEARCH | ADD_TO_CART | PURCHASE",
  "page": "/product/123",
  "timestamp": "ISODate",
  "metadata": {}
}

