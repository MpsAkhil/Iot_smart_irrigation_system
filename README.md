# IoT Smart Irrigation System

A smart irrigation system that uses IoT sensors to monitor and control water usage in agricultural fields.

## Features

- Real-time sensor data monitoring (Temperature, Humidity, Soil Moisture, Water Level)
- Motor control based on sensor readings
- Predictive analytics for motor operation
- Firebase integration for data storage
- MQTT communication for sensor data
- Machine Learning models for predictions
- AWS CloudWatch for HTTPS to HTTP conversion
- Docker containerization for ML service

## Project Architecture

```
├── frontend/               # React frontend application (Firebase Hosting)
├── backend/               # Node.js backend server (AWS Elastic Beanstalk)
│   ├── index.js          # Main backend server
│   └── ml-service/       # Python ML service (Docker on AWS Elastic Beanstalk)
│       ├── app.py        # Flask server for ML predictions
│       ├── Dockerfile    # Docker configuration for ML service
│       └── requirements.txt
└── aws/                  # AWS configuration files
    └── cloudwatch/       # CloudWatch configuration for HTTPS to HTTP conversion
```

## Deployment Architecture

### Frontend (Firebase Hosting)
- Hosted on Firebase Hosting
- Serves HTTPS requests
- Communicates with backend through AWS CloudWatch

### Backend (AWS Elastic Beanstalk)
1. Node.js Environment (node-env)
   - Platform: Node.js 22 on Linux
   - Handles HTTP requests
   - Routes prediction requests to ML service
   - Communicates with Firebase

2. ML Service Environment (Ml-env-2)
   - Platform: Docker
   - Hosts Python Flask application
   - Provides prediction endpoints
   - Containerized using Docker

### AWS CloudWatch
- Converts HTTPS requests from Firebase to HTTP
- Routes requests to appropriate Elastic Beanstalk environment
- Handles request/response transformation

## Request Flow
1. Frontend (HTTPS) → AWS CloudWatch
2. CloudWatch → Node.js Environment (HTTP)
3. Node.js → ML Service (for predictions)
4. Response flows back through the same path

## Setup Instructions

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create .env file with:
   ```
   REACT_APP_API_URL=https://dlhofls0c3ep8.cloudfront.net
   ```
4. Start development server:
   ```bash
   npm start
   ```

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start server:
   ```bash
   node index.js
   ```

### ML Service Setup
1. Navigate to ML service directory:
   ```bash
   cd backend/ml-service
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Build Docker image:
   ```bash
   docker build -t ml-service .
   ```
4. Run Docker container:
   ```bash
   docker run -p 5001:5001 ml-service
   ```

## AWS Deployment

### Node.js Environment (node-env)
1. Create Elastic Beanstalk environment
2. Select Node.js 22 platform
3. Deploy backend code
4. Configure environment variables

### ML Service Environment (Ml-env-2)
1. Create Elastic Beanstalk environment
2. Select Docker platform
3. Deploy Docker image
4. Configure environment variables

### CloudWatch Configuration
1. Set up HTTPS to HTTP conversion
2. Configure routing rules
3. Set up request/response transformation

## Environment Variables

### Backend
- MQTT_HOST: MQTT broker host
- MQTT_USERNAME: MQTT username
- MQTT_PASSWORD: MQTT password
- FIREBASE_DATABASE_URL: Firebase database URL
- ML_SERVICE_URL: URL of the ML service

### ML Service
- PORT: Port number for the Flask server

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 