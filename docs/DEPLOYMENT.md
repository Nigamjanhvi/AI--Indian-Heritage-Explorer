# Deployment Guide

## 1. MongoDB Atlas

1. Create a MongoDB Atlas cluster.
2. Create a database user.
3. Allow your server IP address in Network Access.
4. Copy the connection string and set it as `MONGO_URI`.

## 2. Backend Environment

Copy `backend/.env.example` to `backend/.env` and fill:

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=use_a_long_random_secret
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_key
CLIENT_URL=http://localhost
```

## 3. Local Development

Terminal 1:

```bash
cd backend
npm install
npm run dev
```

Terminal 2:

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000/api/health`

## 4. Docker Compose Deployment

```bash
docker compose up --build -d
```

Application: `http://localhost`

Health check: `http://localhost/api/health`

## 5. Jenkins Pipeline

The included `Jenkinsfile` runs:

1. Git Clone
2. Install Dependencies
3. Run Tests
4. Build Frontend
5. Build Backend
6. Docker Build
7. Docker Compose Deployment
8. Health Check

Install Docker and Docker Compose on the Jenkins agent, then create a pipeline job from the repository.

## 6. AWS EC2 Deployment

1. Launch an Ubuntu EC2 instance.
2. Install Docker, Docker Compose and Git.
3. Clone the repository.
4. Create `backend/.env` with MongoDB Atlas, JWT and Gemini values.
5. Run:

```bash
docker compose up --build -d
```

6. Point your domain to the EC2 public IP.
7. Add HTTPS with Certbot or terminate TLS at an AWS load balancer.

## 7. GitHub Actions

The workflow at `.github/workflows/ci.yml` installs dependencies, runs tests, builds the frontend, and verifies Docker builds on pushes and pull requests to `main`.
