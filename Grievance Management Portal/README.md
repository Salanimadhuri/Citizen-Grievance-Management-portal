# AI-Powered Smart Citizen Grievance Management System

A production-ready, full-stack AI-powered platform for managing citizen grievances with automated classification, priority prediction, sentiment analysis, and real-time notifications.

---

## Architecture

```
┌─────────────────┐     REST/WS      ┌──────────────────────┐
│  React Frontend │ ◄──────────────► │  Spring Boot Backend │
│  Vite + Tailwind│                  │  JWT + MongoDB        │
└─────────────────┘                  └──────────┬───────────┘
                                                │ REST
                                     ┌──────────▼───────────┐
                                     │  FastAPI ML Service  │
                                     │  scikit-learn + NLP  │
                                     └──────────────────────┘
```

## Tech Stack

| Layer       | Technology                                              |
|-------------|---------------------------------------------------------|
| Frontend    | React 19, Vite, Tailwind CSS, Recharts, STOMP/SockJS   |
| Backend     | Spring Boot 3.2, Spring Security, JWT, MongoDB          |
| ML Service  | FastAPI, scikit-learn, TF-IDF, Logistic Regression      |
| Real-time   | WebSocket (STOMP over SockJS)                           |
| DevOps      | Docker, Docker Compose, GitHub Actions CI/CD            |

---

## AI/ML Features

| Feature                    | Algorithm                        |
|----------------------------|----------------------------------|
| Complaint Classification   | TF-IDF + Logistic Regression     |
| Priority Prediction        | TF-IDF + Logistic Regression     |
| Sentiment Analysis         | Keyword scoring                  |
| Complaint Summarization    | Extractive TF-IDF scoring        |
| Duplicate Detection        | TF-IDF + Cosine Similarity       |
| Department Recommendation  | TF-IDF + Logistic Regression     |

---

## Quick Start

### Prerequisites
- Java 17, Maven
- Node 20, npm
- Python 3.11, pip
- MongoDB (local or Atlas)

### 1. ML Service
```bash
cd ml-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# Health check: http://localhost:8000/health
```

### 2. Backend
```bash
cd backend
# Copy and configure env
cp .env.example .env
mvn spring-boot:run
# Runs on http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
# Runs on http://localhost:5173
```

### Docker (all services)
```bash
cp frontend/.env.example frontend/.env
docker-compose up --build
```

---

## API Endpoints

### ML Service (port 8000)
| Method | Endpoint              | Description                        |
|--------|-----------------------|------------------------------------|
| POST   | /api/ml/analyze       | Full AI analysis (all features)    |
| POST   | /api/ml/classify      | Category classification            |
| POST   | /api/ml/priority      | Priority prediction                |
| POST   | /api/ml/sentiment     | Sentiment analysis                 |
| POST   | /api/ml/summarize     | Complaint summarization            |
| POST   | /api/ml/department    | Department recommendation          |
| POST   | /api/ml/duplicates    | Duplicate detection (batch)        |

### Backend (port 5000)
- Full Swagger UI: http://localhost:5000/swagger-ui.html

---

## Environment Variables

### Backend (`backend/.env`)
```
MONGODB_URI=mongodb://localhost:27017/grievance-portal
JWT_SECRET=your-256-bit-secret
ML_SERVICE_URL=http://localhost:8000
MAIL_ENABLED=false
```

### Frontend (`frontend/.env`)
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_ML_SERVICE_URL=http://localhost:8000
VITE_GOOGLE_MAPS_API_KEY=your_key_here
```

---

## Resume Description

**AI-Powered Citizen Grievance Management System** | Java · Python · React · MongoDB · FastAPI

- Built a full-stack microservices platform with Spring Boot (Java 17), React 19, and a Python FastAPI ML service
- Engineered 6 ML features: automatic complaint classification, priority prediction, sentiment analysis, extractive summarization, duplicate detection (cosine similarity), and department recommendation using TF-IDF + Logistic Regression
- Implemented real-time WebSocket notifications (STOMP/SockJS) replacing polling, reducing server load
- Designed role-based access control (Citizen / Officer / Admin) with JWT authentication across 20+ REST endpoints
- Delivered live AI preview panel in the complaint submission form with debounced inference calls to ML microservice
- Containerized all 4 services (React, Spring Boot, FastAPI, MongoDB) with Docker Compose
- Set up GitHub Actions CI/CD pipeline automating build, test, and Docker Hub publish on every push to main

---

## CI/CD

GitHub Actions pipeline (`.github/workflows/ci-cd.yml`):
1. Backend: Maven build + test
2. ML Service: pip install + health check
3. Frontend: npm build
4. Docker: build & push all images to Docker Hub (on main branch)

Required secrets: `DOCKER_USERNAME`, `DOCKER_PASSWORD`
