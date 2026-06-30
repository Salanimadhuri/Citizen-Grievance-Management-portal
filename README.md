<div align="center">

<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5L43Bm7seuRYi53lm-CSbm0uP81vizDj05Q&s" height="100" alt="Grievance Portal Logo" />

# 🏛️ Citizen Grievance Management Portal

### A modern, full-stack web application for managing citizen complaints and grievances

[![Java](https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=java)](https://www.java.com)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.5-green?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-darkgreen?style=for-the-badge&logo=mongodb)](https://www.mongodb.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

[🌐 Live Demo](https://grievance-portal-steel.vercel.app) · [📖 API Docs](https://grievance-portal-backend.onrender.com/swagger-ui.html) · [🐛 Report Bug](https://github.com/Salanimadhuri/Citizen-Grievance-Management-portal/issues)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [User Roles](#-user-roles)
- [Screenshots](#-screenshots)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🎯 About

The **Citizen Grievance Management Portal** is a production-ready full-stack application that enables citizens to submit, track, and resolve complaints with their local government. The system provides role-based dashboards for Citizens, Officers, and Administrators with real-time notifications, analytics, and secure JWT authentication.

Originally built with **Node.js + Express**, the backend has been fully migrated to **Java Spring Boot** for enterprise-grade scalability, security, and maintainability.

---

## ✨ Features

### 👤 Citizen
| Feature | Description |
|---|---|
| 📝 Submit Complaints | File complaints with title, description, category, location & images |
| 📍 Location Tracking | Pin complaint location on an interactive map |
| 📊 Track Progress | Real-time status timeline (Submitted → Resolved) |
| 💬 Chat with Officer | In-app messaging with assigned officer |
| ⭐ Feedback System | Rate and review resolved complaints |
| 🔔 Notifications | Real-time in-app notifications on status changes |
| 📄 PDF Export | Download complaint history as a PDF report |
| 🔁 Reopen Complaint | Appeal/reopen if unsatisfied with resolution |

### 👮 Officer
| Feature | Description |
|---|---|
| 📋 Assigned Complaints | View all complaints assigned to them |
| ✏️ Update Status | Move complaints through resolution workflow |
| 💬 Chat with Citizen | Direct messaging about complaints |
| ⭐ View Feedback | See citizen ratings and comments |
| 📊 Dashboard | Personal workload statistics |

### 🔧 Admin
| Feature | Description |
|---|---|
| 🗂️ Complaint Management | View, filter, assign all complaints |
| 👥 Officer Management | Create, approve, reject officer accounts |
| 🏢 Department Management | Create and manage departments with SLA |
| 📈 Analytics Dashboard | Charts for categories, statuses, trends |
| 🗺️ Heatmap | Geographic complaint density visualization |
| ⚡ Escalation System | Auto-escalate overdue complaints |
| 🔔 Notifications | Send notifications to users |

### 🛡️ Security & Infrastructure
- JWT-based stateless authentication
- Role-based access control (Citizen / Officer / Admin)
- BCrypt password hashing
- CORS protection
- Input validation with Jakarta Validation
- Global exception handling
- Swagger / OpenAPI 3 documentation
- PWA support (installable on mobile)
- Dark mode support

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Java | 21 | Language |
| Spring Boot | 3.2.5 | Framework |
| Spring Security | 6.x | Authentication & Authorization |
| Spring Data MongoDB | 4.x | Database ORM |
| MongoDB | 8.x | NoSQL Database |
| JWT (JJWT) | 0.12.5 | Token Authentication |
| iText PDF | 5.5.13 | PDF Generation |
| Spring Mail | 3.2.5 | Email Notifications |
| SpringDoc OpenAPI | 2.3.0 | API Documentation |
| Lombok | latest | Boilerplate Reduction |
| Maven | 3.9.x | Build Tool |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI Framework |
| Vite | 5.x | Build Tool |
| Tailwind CSS | 3.4 | Styling |
| React Router | 7.x | Navigation |
| Axios | 1.x | HTTP Client |
| Recharts | 3.x | Analytics Charts |
| Leaflet | 1.9 | Interactive Maps |
| Lucide React | latest | Icons |

---

## 📁 Project Structure

```
Citizen-Grievance-Management-portal/
│
├── Grievance Management Portal/
│   │
│   ├── backend/                          # Spring Boot Backend
│   │   ├── src/main/java/com/grievance/portal/
│   │   │   ├── config/                   # SecurityConfig, SwaggerConfig, DataSeeder
│   │   │   ├── controller/               # REST Controllers (9 controllers)
│   │   │   ├── dto/
│   │   │   │   ├── request/              # 12 Request DTOs
│   │   │   │   └── response/             # 6 Response DTOs
│   │   │   ├── exception/                # GlobalExceptionHandler + custom exceptions
│   │   │   ├── model/                    # MongoDB Documents (6 models)
│   │   │   ├── repository/               # MongoRepositories (6 repositories)
│   │   │   ├── scheduler/                # EscalationScheduler
│   │   │   ├── security/                 # JWT Filter, JwtUtil, UserDetailsService
│   │   │   ├── service/                  # Business Logic (11 services)
│   │   │   └── GrievancePortalApplication.java
│   │   ├── src/main/resources/
│   │   │   └── application.properties
│   │   ├── Dockerfile
│   │   └── pom.xml
│   │
│   └── frontend/                         # React Frontend
│       ├── public/
│       │   ├── manifest.json             # PWA manifest
│       │   └── sw.js                     # Service Worker
│       ├── src/
│       │   ├── components/               # 18 reusable components
│       │   ├── context/                  # AuthContext, ThemeContext
│       │   ├── layouts/                  # Citizen, Officer, Admin layouts
│       │   ├── pages/
│       │   │   ├── admin/                # 12 Admin pages
│       │   │   ├── auth/                 # Login, Register, OfficerRegister
│       │   │   ├── citizen/              # 6 Citizen pages
│       │   │   ├── common/               # Home, About, NotFound
│       │   │   └── officer/              # 7 Officer pages
│       │   ├── services/
│       │   │   └── api.js                # Axios client + all API endpoints
│       │   ├── App.jsx
│       │   └── main.jsx
│       ├── vercel.json
│       ├── vite.config.js
│       └── package.json
│
├── docker-compose.yml                    # Full stack Docker setup
├── render.yaml                           # Render deployment config
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Java 17+
- Maven 3.9+
- Node.js 18+
- MongoDB 6+ (local) or MongoDB Atlas (cloud)

### 1. Clone the Repository

```bash
git clone https://github.com/Salanimadhuri/Citizen-Grievance-Management-portal.git
cd Citizen-Grievance-Management-portal/Grievance\ Management\ Portal
```

### 2. Start MongoDB

```bash
# Local MongoDB
mongod --dbpath /data/db

# OR use MongoDB Atlas (recommended for production)
# Set MONGODB_URI environment variable
```

### 3. Run the Backend

```bash
cd backend
mvn clean package -DskipTests
mvn spring-boot:run
```

Backend starts at: **http://localhost:5000**

### 4. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend starts at: **http://localhost:5173**

---

## 🔐 Default Test Credentials

> These are seeded automatically on first startup via `DataSeeder.java`

| Role | Email | Password |
|---|---|---|
| 👑 Admin | `admin@example.com` | `admin123` |
| 👮 Officer | `officer@example.com` | `officer123` |
| 👤 Citizen | `citizen@example.com` | `citizen123` |

---

## 🔧 Environment Variables

### Backend (`application.properties` / Environment)

| Variable | Default | Description |
|---|---|---|
| `MONGODB_URI` | `mongodb://localhost:27017/grievance-portal` | MongoDB connection string |
| `JWT_SECRET` | *(set this in production!)* | JWT signing secret (min 32 chars) |
| `JWT_EXPIRATION_MS` | `86400000` | Token expiry (24 hours) |
| `FRONTEND_URL` | `http://localhost:5173` | Allowed CORS origin |
| `PORT` | `5000` | Server port |
| `MAIL_ENABLED` | `false` | Enable email notifications |
| `MAIL_HOST` | `smtp.sendgrid.net` | SMTP host |
| `MAIL_USERNAME` | — | SMTP username / `apikey` |
| `MAIL_PASSWORD` | — | SMTP password / SendGrid API key |

### Frontend (`.env`)

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:5000/api` | Backend API base URL |

---

## 📖 API Documentation

Interactive Swagger UI available at:
```
http://localhost:5000/swagger-ui.html
```

### Key Endpoints

```
AUTH
  POST   /api/auth/register          Register citizen
  POST   /api/auth/login             Login (all roles)
  GET    /api/auth/me                Get current user profile

COMPLAINTS
  POST   /api/complaints             Submit complaint (citizen)
  GET    /api/complaints             Get all complaints (admin)
  GET    /api/complaints/my          Get my complaints (citizen)
  GET    /api/complaints/officer     Get assigned complaints (officer)
  PATCH  /api/complaints/:id/status  Update status (officer/admin)
  PATCH  /api/complaints/:id/assign  Assign to officer (admin)
  PATCH  /api/complaints/:id/reopen  Reopen complaint (citizen)
  DELETE /api/complaints/:id         Delete complaint (admin)

DEPARTMENTS
  GET    /api/departments            List all departments (public)
  POST   /api/departments            Create department (admin)
  PATCH  /api/departments/:id        Update department (admin)
  DELETE /api/departments/:id        Delete department (admin)

ADMIN
  POST   /api/admin/create-officer   Create officer (admin)
  GET    /api/admin/officers         List all officers (admin)
  GET    /api/admin/officer-requests Pending officer requests (admin)
  PATCH  /api/admin/approve-officer/:id  Approve officer (admin)
  PATCH  /api/admin/reject-officer/:id   Reject officer (admin)
  GET    /api/admin/analytics        Analytics data (admin)

FEEDBACK
  POST   /api/feedback               Submit feedback (citizen)
  GET    /api/feedback/officer       Officer feedback (officer)
  GET    /api/feedback/recent        Recent feedback (admin)

COMMUNICATIONS
  POST   /api/communications         Send message
  GET    /api/communications/:id     Get messages for complaint

NOTIFICATIONS
  GET    /api/notifications          Get notifications
  GET    /api/notifications/unread-count  Unread count
  PATCH  /api/notifications/read-all     Mark all as read

PDF
  GET    /api/pdf/complaint/:id      Download complaint PDF
  GET    /api/pdf/my-complaints      Download all my complaints PDF
```

---

## 👥 User Roles & Workflow

```
COMPLAINT LIFECYCLE
─────────────────────────────────────────────────────────────
  Citizen submits complaint
       ↓
  Admin reviews → assigns to Officer + Department
       ↓
  Officer: Under Review → In Progress → Work Scheduled → Resolved
       ↓
  Citizen receives notification → submits feedback
       ↓
  (if unsatisfied) Citizen reopens → cycle repeats
─────────────────────────────────────────────────────────────

AUTO ESCALATION
  EscalationScheduler runs every hour
  If complaint exceeds department SLA hours → marked escalated
  Admin notified → complaint prioritized in dashboard
```

---

## 🗺️ Deployment

### Render + Vercel (Recommended — Free)

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | `https://your-app.vercel.app` |
| Backend | Render | `https://your-app.onrender.com` |
| Database | MongoDB Atlas | Cloud hosted |

### Docker (Self-hosted)

```bash
# Clone repo and run everything with one command
docker compose up -d --build
```

Services:
- Frontend → `http://localhost:3000`
- Backend → `http://localhost:5000`
- MongoDB → `localhost:27017`

See [Deployment Guide](#) for full instructions.

---

## 🔄 Key Architecture Decisions

| Decision | Reason |
|---|---|
| Spring Boot over Node.js | Enterprise security, type safety, better scalability |
| MongoDB over SQL | Flexible schema for complaint documents with embedded objects |
| JWT stateless auth | No server-side sessions — scales horizontally |
| Spring Data `@Query` | Explicit queries avoid derived method name parsing issues |
| `@Async` email sending | Never blocks HTTP response thread |
| `@Scheduled` escalation | Replaces Node.js `setInterval` with Spring's task scheduler |
| Vite code splitting | Reduces initial bundle size for faster page loads |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👩‍💻 Author

**Madhuri Salani**

[![GitHub](https://img.shields.io/badge/GitHub-Salanimadhuri-black?style=flat&logo=github)](https://github.com/Salanimadhuri)

---

<div align="center">

Made with ❤️ for better governance

⭐ **Star this repo if you found it helpful!** ⭐

</div>
