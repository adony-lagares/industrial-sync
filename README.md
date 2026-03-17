# Industrial Sync v2.0 🏭

![.NET](https://img.shields.io/badge/.NET-10-purple)
![React](https://img.shields.io/badge/React-TypeScript-blue)
![Azure](https://img.shields.io/badge/Cloud-Azure-0078D4)
![Architecture](https://img.shields.io/badge/Architecture-Clean%20Architecture-green)
![Architecture](https://img.shields.io/badge/Architecture-Event_Driven-orange)
![Azure Pipelines](https://img.shields.io/badge/Azure_Pipelines-Enabled-0078D7?logo=azure-pipelines&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

**Industrial Sync** is a high‑performance **IoT telemetry monitoring
system** designed for industrial assets.\
The project demonstrates a **complete cloud‑native architecture**
capable of handling:

-   Real‑time telemetry ingestion
-   Asynchronous message processing
-   Live operational dashboards
-   Multilingual industrial monitoring interfaces

This project simulates a **real enterprise Industry 4.0 monitoring
platform**.

------------------------------------------------------------------------

# 🚀 Purpose & Business Value

In **modern industrial environments**, downtime can cost companies
**thousands of dollars per minute**.

Industrial Sync was designed to address the challenge of:

**Real‑Time Asset Monitoring + Predictive Operational Auditing**

By using **Azure Service Bus** with a **decoupled architecture**, the
system guarantees:

-   No sensor data loss during database spikes
-   Scalable ingestion pipelines
-   Reliable telemetry processing
-   Real‑time operational insights

Operators can monitor **temperature and pressure thresholds** while
maintaining **historical audit logs** for compliance and analysis.

------------------------------------------------------------------------

# 🧠 System Architecture

The solution follows **Clean Architecture** principles to ensure:

-   Separation of concerns
-   Maintainability
-   Testability
-   Scalability

## High-Level Architecture

``` mermaid
flowchart LR

Sensor[Industrial Sensors]
API[.NET Web API]
Queue[Azure Service Bus Queue]
Worker[Worker Service Processor]
DB[(Azure SQL Database)]
Frontend[React Dashboard]

Sensor --> API
API --> Queue
Queue --> Worker
Worker --> DB
Frontend --> API
```

### Architecture Flow

1.  Sensors send telemetry to the **Web API**
2.  The API publishes messages to **Azure Service Bus**
3.  A **Worker Service** consumes messages asynchronously
4.  Data is stored in **Azure SQL**
5.  The **React Dashboard** visualizes telemetry data

------------------------------------------------------------------------

# 🏗 Technologies

## Backend

-   **.NET 10**
-   **ASP.NET Web API**
-   **Worker Services**
-   **Entity Framework Core**
-   **Azure SQL**
-   **Azure Service Bus**
-   **Clean Architecture Pattern**

## Frontend

-   **React**
-   **TypeScript**
-   **Recharts**
-   **Tailwind CSS**
-   **Custom i18n Dictionary Provider**

## Cloud

-   **Microsoft Azure**
-   **Azure Service Bus**
-   **Azure SQL Database**

------------------------------------------------------------------------

# ⚡ Core Features

## Real-Time Telemetry Monitoring

Operators can visualize **live industrial metrics** including:

-   Temperature
-   Pressure
-   Operational timestamps

------------------------------------------------------------------------

## Anomaly Detection

Visual alerts trigger when thresholds are exceeded:

  Metric        Threshold
  ------------- -----------
  Temperature   \> 80°C
  Pressure      \> 45 bar

Alerts appear with **pulsing visual indicators** in the dashboard.

------------------------------------------------------------------------

## Audit Logging

Every telemetry message is stored in **Azure SQL**, allowing:

-   Full historical traceability
-   Industrial audit reports
-   CSV export for compliance reviews

------------------------------------------------------------------------

## Internationalization

The system supports **dynamic language switching**:

-   🇧🇷 Portuguese (Brazil)
-   🇦🇺 English (Australia)

Designed for **global industrial operations**.

------------------------------------------------------------------------

# 🖥 Dashboard Preview

Example dashboard components include:

-   Real‑time telemetry charts
-   Alert indicators
-   Historical logs
-   Language selector
-   Industrial dark theme UI

------------------------------------------------------------------------

# 🛠 Installation & Setup

## Prerequisites

-   **.NET 10 SDK**
-   **Node.js v18+**
-   **Azure Account**

Optional:

-   **Docker**

------------------------------------------------------------------------

# Backend Setup

Navigate to the API folder

``` bash
cd IndustrialSync.Api
```

Update your `appsettings.json` with:

-   Azure SQL connection string
-   Azure Service Bus connection

Run migrations

``` bash
dotnet ef database update
```

Run the API

``` bash
dotnet run
```

------------------------------------------------------------------------

# Frontend Setup

Navigate to the frontend

``` bash
cd web
```

Install dependencies

``` bash
npm install
```

Run the development server

``` bash
npm run dev
```

------------------------------------------------------------------------

# 🐳 Docker (Future)

Planned containerized deployment with:

-   API container
-   Worker container
-   React container
-   Azure emulator support

------------------------------------------------------------------------

# 📊 Roadmap

Planned improvements:

-   [ ] Azure Key Vault integration
-   [ ] Domain Unit Tests with xUnit
-   [ ] SignalR real‑time streaming
-   [ ] Docker Compose deployment
-   [ ] CI/CD pipeline with GitHub Actions
-   [ ] Production monitoring with Azure Application Insights

------------------------------------------------------------------------

# 📚 What This Project Demonstrates

This project highlights experience in:

-   Cloud‑native architecture
-   Event‑driven systems
-   Message broker integration
-   Clean Architecture in enterprise systems
-   Full‑stack development
-   Industrial telemetry processing

------------------------------------------------------------------------

# 👤 Author

**Adony Lagares Guimarães**\
Software Engineer

📍 Ouro Branco --- Minas Gerais --- Brazil

LinkedIn: https://www.linkedin.com/in/adony-lagares/\
Portfolio: https://www.adonylagares.com/
