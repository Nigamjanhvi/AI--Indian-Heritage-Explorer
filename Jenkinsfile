pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = 'indian-heritage-explorer'
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Check Tools') {
            steps {
                bat 'node --version'
                bat 'npm --version'
                bat 'docker --version'
                bat 'docker compose version'
            }
        }

        stage('Prepare Environment') {
            steps {
                script {
                    if (!fileExists('backend/.env')) {
                        bat 'copy backend\\.env.example backend\\.env'
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    bat 'npm install'
                }
            }
        }

        stage('Run Backend Smoke Test') {
            steps {
                dir('backend') {
                    bat 'npm test'
                }
            }
        }

        stage('Docker Build') {
            steps {
                bat 'docker compose build'
            }
        }

        stage('Deploy Containers') {
            steps {
                bat 'docker compose up -d'
            }
        }

        stage('Health Check') {
            steps {
                bat 'curl --fail http://localhost:5000/api/health'
            }
        }
    }

    post {
        success {
            echo 'Deployment Successful'
        }

        failure {
            echo 'Deployment Failed'
        }

        always {
            bat 'docker compose down'
        }
    }
}