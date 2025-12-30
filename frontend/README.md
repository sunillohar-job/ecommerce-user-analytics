# Frontend – User Analytics Dashboard (L5)

## Overview

This repository contains the **Frontend implementation (Level L5)** of the **User Tracking & Analytics Platform**.

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
  - [Run Locally](#3-run-locally)
  - [Build for Production](#5-build-for-production)
  - [Preview Production Build](#6-preview-production-build)
- [Deployment](#deployment)


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
  - Total users
  - Total sessions
  - Page Views by Page
  - Session over time
- **Top Products Searched**
  - Total Searches
  - Top Search Queries
- **Product & Cart Metrics**
  - Add to cart count
  - Remove from cart count
  - Order Placed
  - Cart -> Order conversion rate
  - Top Products Added to cart
- **Revenue & Conversion**
  - Total Orders
  - Total Revenue
  - Conversion rate
  - Avg Order Value
  - Order Over Time
- **User Behavior & Funnel**
  - User Device Distribution
  - User Journey (Funnel)(Search → View → Cart → Purchase)

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
####  Traffic & Engagement
- As a **business user**, I want to see the **total number of users** so I can measure platform reach.
- As an **analyst**, I want to track **total sessions** to understand overall engagement.
- As a **product manager**, I want to view **page views by page** to identify the most visited areas.
- As an **analyst**, I want to monitor **sessions over time** to detect trends and spikes in usage.

#### Top Products Searched
- As a **product manager**, I want to see **total searches** to understand search activity volume.
- As a **business stakeholder**, I want to know the **top search queries** to identify user intent and demand.


#### Product & Cart Metrics
- As a **product manager**, I want to track **add-to-cart events** to measure purchase intent.
- As an **analyst**, I want to see **remove-from-cart counts** to identify friction points.
- As a **business user**, I want to track **orders placed** to measure successful conversions.
- As a **stakeholder**, I want to view the **cart-to-order conversion rate** to evaluate checkout effectiveness.
- As a **product manager**, I want to know the **top products added to cart** to optimize inventory and promotions.

#### Revenue & Conversion
- As a **business user**, I want to see **total orders** to track sales performance.
- As a **finance stakeholder**, I want to view **total revenue** to measure business growth.
- As an **analyst**, I want to monitor the **conversion rate** to evaluate funnel efficiency.
- As a **business user**, I want to track **average order value (AOV)** to understand customer spending behavior.
- As an **analyst**, I want to view **orders over time** to identify sales trends and seasonality.

#### User Behavior & Funnel
- As an **analyst**, I want to see **user device distribution** to optimize the experience across devices.
- As a **product manager**, I want to analyze the **user journey funnel (Search → View → Cart → Purchase)** to identify drop-offs and optimization opportunities.
---

### 2 User Journey

- As an **analyst**, I want to see a user’s session timeline to understand navigation behavior.
- As a **support engineer**, I want to analyze time spent on pages to troubleshoot issues.
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

### 3 Run Locally

```bash
npm start
```

### 4 Application will be available at:

```bash
http://localhost:5173/
```

### 5 Build for Production

```bash
npm run build
```

### 6 Preview Production Build

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

🔗 **Workflow file:**  
https://github.com/sunillohar-job/ecommerce-user-analytics/actions/workflows/frontend-deploy.yml
