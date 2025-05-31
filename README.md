# IoT Smart Irrigation System

A smart irrigation system that uses IoT sensors to monitor and control water usage in agricultural fields.

## Features

- Real-time sensor data monitoring (Temperature, Humidity, Soil Moisture, Water Level)
- Motor control based on sensor readings
- Predictive analytics for motor operation
- Firebase integration for data storage
- MQTT communication for sensor data
- Machine Learning models for predictions

## Project Structure

```
├── frontend/               # React frontend application
├── backend/               # Node.js backend server
│   ├── index.js          # Main backend server
│   └── ml-service/       # Python ML service
│       ├── app.py        # Flask server for ML predictions
│       └── requirements.txt
└── render.yaml           # Render.com deployment configuration
```

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
   REACT_APP_API_URL=https://your-backend-url.com
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
3. Start Flask server:
   ```bash
   python app.py
   ```

## Deployment

The project is configured for deployment on Render.com. The `render.yaml` file contains the necessary configuration for both the backend and ML service.

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