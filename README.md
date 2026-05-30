# Indian Heritage Explorer

![GitHub Actions CI](https://github.com/Nigamjanhvi/Indian-Heritage-Explorer/actions/workflows/ci.yml/badge.svg)

A premium production-ready AI-powered tourism platform for exploring Indian heritage, culture, monuments, temples, UNESCO sites, state routes, saved collections and AI-generated itineraries.

## Tech Stack

- Frontend: React, Tailwind CSS, Framer Motion, React Router, Axios, React Query, Leaflet, Recharts
- Backend: Node.js, Express.js
- Database: MongoDB Atlas with Mongoose
- Authentication: JWT
- AI: Gemini API
- DevOps: Docker, Docker Compose, Jenkins, GitHub Actions, Nginx
- Deployment Target: AWS EC2

## Folder Structure

```text
backend/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    utils/
frontend/
  src/
    api/
    components/
    context/
    pages/
    data/
docker/
jenkins/
nginx/
docs/
.github/workflows/
```

## Core Features

- Register, login, logout and JWT protected routes
- Cinematic landing page with video background, hero search, voice search, recent and trending searches
- Mega navigation for Explore, UNESCO, States, Culture, Map, AI Planner and Dashboard
- Heritage site CRUD with image upload
- Search by name, state, category and UNESCO status
- Favorites and travel collections
- Reviews with ratings
- Trip planner with saved itineraries
- Gemini recommendations, 3-day/5-day/7-day itineraries and floating-style chatbot page
- Leaflet-based map explorer
- State guide pages, UNESCO grid/timeline/gallery, culture timeline
- Admin dashboard with totals and charts
- Responsive luxury tourism UI with dark mode, glassmorphism, animated cards and search suggestions

## API Routes

```text
POST /api/auth/register
POST /api/auth/login

GET  /api/users/profile
PUT  /api/users/profile
GET  /api/users/admin/stats

GET    /api/sites/getall
GET    /api/sites/getbyid/:id
POST   /api/sites/create
PUT    /api/sites/update/:id
DELETE /api/sites/delete/:id

POST   /api/reviews
PUT    /api/reviews/:id
DELETE /api/reviews/:id

GET    /api/favorites
POST   /api/favorites
DELETE /api/favorites/:siteId

GET    /api/trips
POST   /api/trips
PUT    /api/trips/:id
DELETE /api/trips/:id

POST /api/ai/recommend
POST /api/ai/chat
```

## Environment Setup

Backend:

```bash
cp backend/.env.example backend/.env
```

Frontend:

```bash
cp frontend/.env.example frontend/.env
```

Fill MongoDB Atlas, JWT and Gemini values in `backend/.env`.

## Run Locally

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## CI/CD Demo

- GitHub Actions workflow configured in `.github/workflows/ci.yml`
- Jenkins pipeline configured in `Jenkinsfile`
- Workflow runs on `push` and `pull_request` to `main`
- Includes frontend build, backend install, smoke test, Docker Compose build, service startup, and health check
- Adds cleanup logic so services are removed after the run

## Run With Docker

```bash
docker compose up --build
```

Open `http://localhost`.

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).
