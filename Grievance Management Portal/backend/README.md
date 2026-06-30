# Citizen Grievance Portal — Spring Boot Backend

Migrated from Node.js / Express.js to Spring Boot 3.2.5 + Java 17.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Spring Boot 3.2.5 |
| Language | Java 17 |
| Database | MongoDB (Spring Data MongoDB) |
| Auth | Spring Security + JWT (jjwt 0.12.5) |
| Validation | Jakarta Bean Validation |
| Build | Maven 3.9+ |
| Container | Docker (multi-stage) |

---

## Project Structure

```
src/main/java/com/grievance/portal/
├── GrievancePortalApplication.java   ← Entry point
├── config/
│   ├── SecurityConfig.java           ← CORS + JWT filter chain
│   └── FileUploadConfig.java         ← Static file serving (/uploads/**)
├── controller/
│   ├── AuthController.java           ← POST /api/auth/**
│   ├── ComplaintController.java      ← /api/complaints/**
│   ├── FeedbackController.java       ← /api/feedback/**
│   ├── CommunicationController.java  ← /api/communications/**
│   ├── UserController.java           ← /api/users/**
│   └── NotificationController.java   ← /api/notifications/**
├── service/                          ← Business logic layer
├── repository/                       ← MongoDB queries
├── model/                            ← MongoDB documents (@Document)
├── dto/
│   ├── request/                      ← Validated request bodies
│   └── response/                     ← Safe response shapes
├── security/
│   ├── JwtUtil.java                  ← Token generation/validation
│   ├── JwtAuthFilter.java            ← Per-request JWT filter
│   └── UserDetailsServiceImpl.java   ← Loads user for Spring Security
└── exception/
    ├── GlobalExceptionHandler.java   ← Centralised error responses
    ├── ResourceNotFoundException.java
    ├── UnauthorizedException.java
    └── BadRequestException.java
```

---

## Prerequisites

- Java 17+ (`java -version`)
- Maven 3.8+ (`mvn -version`)
- MongoDB 6+ running locally or Atlas URI

---

## Local Development

### 1. Clone and configure

```bash
git clone <your-repo-url>
cd grievance-portal-backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

### 2. Set environment variables

```bash
export MONGODB_URI="mongodb://localhost:27017/grievance-portal"
export JWT_SECRET="your-strong-secret-minimum-32-characters"
export FRONTEND_URL="http://localhost:5173"
```

### 3. Build and run

```bash
mvn clean install -DskipTests
mvn spring-boot:run
```

API is live at: **http://localhost:5000**

---

## Docker Deployment

### Build and run with Docker Compose (recommended)

```bash
# Set your secret
export JWT_SECRET="your-strong-secret-minimum-32-characters"

# Start backend + MongoDB
docker-compose up -d --build

# View logs
docker-compose logs -f backend

# Stop
docker-compose down
```

### Manual Docker build

```bash
# Build image
docker build -t grievance-portal-backend:1.0 .

# Run (with external MongoDB Atlas)
docker run -d \
  --name grievance-backend \
  -p 5000:5000 \
  -e MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/grievance-portal" \
  -e JWT_SECRET="your-strong-secret" \
  -e FRONTEND_URL="https://your-frontend.com" \
  -v $(pwd)/uploads:/app/uploads \
  grievance-portal-backend:1.0
```

---

## API Routes (100% backward compatible with Express)

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | Public | Register new user |
| POST | /api/auth/login | Public | Login, returns JWT |
| GET | /api/auth/me | Any | Get own profile |
| PATCH | /api/auth/profile | Any | Update own profile |
| GET | /api/complaints | Admin | All complaints |
| GET | /api/complaints/my | Citizen | Own complaints |
| GET | /api/complaints/officer | Officer | Assigned complaints |
| GET | /api/complaints/:id | Any | Single complaint |
| POST | /api/complaints | Citizen | Submit complaint (multipart) |
| PATCH | /api/complaints/:id/status | Officer/Admin | Update status |
| PATCH | /api/complaints/:id/assign | Admin | Assign officer |
| POST | /api/feedback | Citizen | Submit feedback |
| GET | /api/feedback/recent | Admin | Recent feedback |
| GET | /api/feedback/officer | Officer | Own feedback |
| GET | /api/feedback/:complaintId | Any | Complaint feedback |
| POST | /api/communications | Any | Send message |
| GET | /api/communications/:complaintId | Any | Get conversation |
| GET | /api/communications/unread/count | Any | Unread count |
| GET | /api/users/officers | Admin | List officers |
| GET | /api/users | Admin | All users |
| GET | /api/users/:id | Any | Single user |
| GET | /api/notifications | Any | Own notifications |
| PATCH | /api/notifications/read-all | Any | Mark all read |
| PATCH | /api/notifications/:id/read | Any | Mark one read |

---

## Frontend Changes Required

**None.** All routes, request/response shapes, and HTTP status codes are preserved.

Only confirm your React `.env`:
```env
VITE_API_URL=http://localhost:5000
```

---

## Production Deployment (Render / Railway / EC2)

1. Push to GitHub
2. Set environment variables in your hosting dashboard:
   - `MONGODB_URI` — your Atlas connection string
   - `JWT_SECRET` — strong random secret (min 32 chars)
   - `FRONTEND_URL` — your deployed React app URL
3. Build command: `mvn clean package -DskipTests`
4. Start command: `java -jar target/grievance-portal-backend-1.0.0.jar`
5. Port: `5000`
