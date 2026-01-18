# Ecommerce User Analytics

This repository contains a full-stack Ecommerce User Analytics platform, organized into clearly separated modules for backend, frontend, database, and DevOps.

Each major folder has its own dedicated README.md with detailed setup and usage instructions.
Start here, then jump into the module you’re interested in 

Live link: [Ecommerce User Analytics](https://d37ep0oojarjm1.cloudfront.net)

## Repository Structure
```
├── backend
├── frontend
├── database
├── dev-ops
├── system-dashboard
├── .github/workflows
└── README.md
```
## Module Documentation and selected Level
- Backend (L4) [README.md](backend/README.md)
    - Handles APIs, business logic, and analytics processing.

- Frontend (L5) [README.md](frontend/README.md)
    - Responsive User interface for KPI dashboards, reports, and analytics visualization.

- Database (L2) [README.md](database/README.md)
    - Collections, Schema definitions, and database-related setup.

- DevOps (L3) [README.md](dev-ops/README.md)
    - System Diagram, CI/CD pipelines and deployment automation.

- System Performance Dashboard (L3) [README.md](system-dashboard/README.md)
    - The dashboard provides real-time and historical visibility into **frontend traffic, performance, and system resource utilization**.

- Bonus Dashboard (L4) - Dashboard for data analytics showing some KPIs     

- GitHub Workflows
    - Automated pipelines for frontend and backend deployments.
    - Location:
        ```
        .github/workflows/
        ├── backend-deploy.yml
        └── frontend-deploy.yml
        ```