pipeline {
  agent any

  environment {
    COMPOSE_PROJECT_NAME = 'indian-heritage-explorer'
  }

  stages {
    stage('Git Clone') {
      steps {
        checkout scm
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'cd backend && npm install'
        sh 'cd frontend && npm install'
      }
    }

    stage('Run Tests') {
      steps {
        sh 'cd backend && npm test'
        sh 'cd frontend && npm test'
      }
    }

    stage('Build Frontend') {
      steps {
        sh 'cd frontend && npm run build'
      }
    }

    stage('Build Backend') {
      steps {
        sh 'cd backend && npm prune --omit=dev'
      }
    }

    stage('Docker Build') {
      steps {
        sh 'docker compose build'
      }
    }

    stage('Docker Compose Deployment') {
      steps {
        sh 'docker compose up -d'
      }
    }

    stage('Health Check') {
      steps {
        sh 'sleep 10 && curl -f http://localhost/api/health'
      }
    }
  }
}
