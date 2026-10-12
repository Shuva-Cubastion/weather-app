pipeline {
  agent any

  environment {
    IMAGE = "weather-app"
    TAG   = "${env.BUILD_NUMBER}"
  }

  stages {
    stage('Fetch') {
      steps {
        checkout scm
        sh 'ls -la'
      }
    }

    stage('Build') {
      steps {
        sh 'docker build -t $IMAGE:$TAG -t $IMAGE:latest .'
      }
    }

    stage('Test') {
      steps {
        sh 'docker run --rm $IMAGE:$TAG npm test'
      }
    }

    stage('Run') {
      steps {
        sh '''
          docker rm -f weather-run 2>/dev/null || true
          docker run -d --name weather-run -p 3000:3000 $IMAGE:$TAG
          sleep 5
          curl -f http://localhost:3000/health
          curl -f "http://localhost:3000/api/calculate?temp=30&humidity=70&wind=5"
        '''
      }
    }
  }

  post {
    success { echo 'Pipeline OK - app is running on port 3000' }
    failure { sh 'docker logs weather-run || true' }
  }
}
