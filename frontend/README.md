# Frontend – User Analytics Dashboard (L5)

## Overview

This repository contains the **Responsive Frontend implementation with multi language support (Level L5)** of the **User Tracking & Analytics Platform**.

The application visualizes user behavior, engagement metrics, and conversion funnels for an e-commerce platform processing large-scale user events.

**Tech Stack:** React + TypeScript + Vite  
**Hosting:** Free-tier cloud service  
**Backend:** Connected via REST APIs

🔗 **Live Website URL: https://d37ep0oojarjm1.cloudfront.net**

---

## Table of Contents

- [Selected Level](#selected-level)
- [Application Pages](#application-pages)
  - [Dashboard](#1-dashboard)
  - [User Journey](#2-user-journey)
  - [Add Event](#3-add-event)
- [User Stories](#user-stories)
  - [Dashboard](#1-dashboard-1)
    - [Traffic & Engagement](#traffic--engagement)
    - [Top Products Searched](#top-products-searched)
    - [Product & Cart Metrics](#product--cart-metrics)
    - [Revenue & Conversion](#revenue--conversion)
    - [User Behavior & Funnel](#user-behavior--funnel)
  - [User Journey](#2-user-journey-1)
  - [Add Event](#3-add-event-1)
- [Tech Stack](#tech-stack)
- [Local Setup](#local-setup)
  - [Prerequisites](#1-prerequisites)
  - [Install Dependencies](#2-install-dependencies)
  - [Run With Local Server](#3-run-locally-pointing-api-to-local-server)
  - [Run With Prod Server](#4-run-locally-pointing-api-to-prod-server)
  - [Build for Production](#6-build-for-production)
  - [Preview Production Build](#7-preview-production-build)
- [Deployment](#deployment)
- [Design Patterns](#design-patterns-used)


## Selected Level

| Area     | Level                                                           |
| -------- | --------------------------------------------------------------- |
| Frontend | **L5 – Full Web App (Hosted, API Connected, Data Entry Forms)** |

> L5 includes all requirements from **L1 → L4**, plus cloud hosting.

---

## Application Pages

The frontend application consists of **3 main pages**:

---

### 1 Dashboard

Displays high-level KPIs and analytics summaries.

**KPIs & Sections**

- **Traffic & Engagement**
  - Total sessions (Overall traffic)
  - Active Users (Unique users)
  - Page Views by Page (Page popularity)
  - Session over time (Traffic trend over the time)
- **Top Products Searched**
  - Total Searches (Search usage)
  - Top Search Queries (User intent)
  - Zero Result Searches (Highlights missing content)
- **Product & Cart Metrics**
  - Add to cart count (Indicates product interest)
  - Remove from cart count (Identifies friction)
  - Order Placed (Successful purchase completion)
  - Cart -> Order conversion rate (Shows checkout effectiveness)
  - Top Products Added to cart (Highlights high-demand products)
- **Revenue & Conversion**
  - Total Orders (Tracks overall sales volume)
  - Total Revenue (Business health)
  - Avg Order Value (Helps optimize pricing, and upsell strategies)
  - Order Over Time (Reveals sales trends)
- **User Behavior & Funnel**
  - User Device Distribution (Most-used devices)
  - User Journey (Funnel)(Search → View → Cart → Purchase) (Identifies drop-off points)

**Purpose:**  
Provides a consolidated view of platform performance and user engagement.

---

### 2 User Journey

Focuses on **individual user behavior across sessions**.

**Displayed Information**

- Total Events
- Total Quantity
- Total Purchased
- Conversion Rate
- Event timeline per session

**Purpose:**  
Helps analyze user navigation patterns, engagement depth, and drop-off points.

---

### 3 Add Event

Allows manual insertion of events into the system.

**Inputs Supported**

- User ID
- Session ID
- Event type
- Page / Product
- Timestamp
- Metadata (device, browser, etc.)

**Purpose:**  
Used for testing, validation, and manual event injection.

---

## User Stories

### 1 Dashboard
####  As a User focused on 
####  A. Traffic & Engagement
- I want to track **total sessions** to understand overall engagement.
- I want to see the **total number of users** so I can measure platform reach.
- I want to view **page views by page** to identify the most visited areas.
- I want to monitor **sessions over time** to detect trends and spikes in usage.

#### B. Top Products Searched
- I want to see **total searches** to understand search usage.
- I want to know the **top search queries** to identify user intent and demand.
- I want to track **zero result searches** so that I can identify missing products.

#### C. Product & Cart Metrics
- I want to track **add-to-cart events** to measure purchase intent.
- I want to see **remove-from-cart counts** to identify friction points.
- I want to track **orders placed** to measure successful conversions.
- I want to view the **cart-to-order conversion rate** to evaluate checkout effectiveness.
- I want to know the **top products added to cart** to optimize inventory and promotions.

#### D. Revenue & Conversion
- I want to see **total orders** to track sales performance.
- I want to view **total revenue** to measure business growth.
- I want to track **average order value (AOV)** to understand customer spending behavior.
- I want to view **orders over time** to identify sales trends and seasonality.

#### E. User Behavior & Funnel
- I want to see **user device distribution** to optimize the experience across devices.
- I want to analyze the **user journey funnel (Search → View → Cart → Purchase)** to identify drop-offs and optimization opportunities.
---

### 2 User Journey

- I want to see a user’s session timeline to understand navigation behavior.
- I want to analyze time spent on pages to troubleshoot issues.
---
### 3 Add Event

- As a **developer**, I want to manually add events for testing analytics flows.
- As a **QA engineer**, I want to validate event ingestion via the UI.

---

## Tech Stack

- **Framework:** React + TypeScript
- **Bundler:** Vite
- **Charts:** Material ui charts
- **API Communication:** Fetch
- **Styling:** Material ui
- **Hosting:** Free-tier Cloud Hosting

---

## Local Setup

### 1 Prerequisites

- Node.js ≥ 22
- Backend API running locally

---

### 2 Install Dependencies

```bash
npm install
```

### 3 Run Locally Pointing api to local server

```bash
npm start
```

### 4 Run Locally Pointing api to prod server

```bash
npm run staging
```

### 5 Application will be available at:

```bash
http://localhost:5173/
```

### 6 Build for Production

```bash
npm run build
```

### 7 Preview Production Build

```bash
npm run preview
```

---

## Deployment

This project uses a **GitHub Actions** CI/CD pipeline to automatically build and deploy the frontend to AWS S3 and serve it via CloudFront.

- **Workflow:** Deploy Frontend to CloudFront
- **Triggers:**
  - Automatic on push to the `main` branch (only when `frontend/**` changes)
  - Manual trigger using `workflow_dispatch`
- **What it does:**
  - Triggers on push to main (only when frontend/\*\* changes) or manual dispatch
  - Installs dependencies using Node.js 22.x
  - Builds the frontend using Vite
  - Uploads the production build to Amazon S3
  - Invalidates the CloudFront cache to reflect the latest changes
  - Prints the deployed CloudFront URL in the workflow logs

🔗 **Workflow file:** [Deploy Frontend to CloudFront](https://github.com/sunillohar-job/ecommerce-user-analytics/actions/workflows/frontend-deploy.yml)

---
## Design Patterns Used

### React 19

### 1. Component Pattern
- UI is broken into reusable, isolated components.
- Improves maintainability and reusability.

### 2. Custom Hooks Pattern
- Shared logic extracted into reusable hooks.
- Example: data fetching.

### 3. Controlled Components
- Form state controlled by React state.
- Ensures predictable UI behavior.

### 4. Observer Pattern
- State changes automatically re-render subscribed components.
- Built-in via React state and hooks.