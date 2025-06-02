# IoT Smart Irrigation System

A smart irrigation system that uses IoT sensors to monitor and control water usage in agricultural fields. The system is fully deployed on AWS and uses ESP32 with 4G GSM module for real-time monitoring and alerts.

## Key Features

- Real-time sensor data monitoring (Temperature, Humidity, Soil Moisture, Water Level)
- Motor control based on sensor readings
- Predictive analytics for motor operation
- Firebase integration for data storage
- MQTT communication for sensor data
- Machine Learning models for predictions
- AWS CloudWatch for HTTPS to HTTP conversion
- Docker containerization for ML service
- Automated phone calls and SMS alerts using 4G GSM module
- Real-time data visualization and analytics dashboard
- Public MQTT broker integration for global accessibility

## Hardware Components

### ESP32 Development Board
- Dual-core 32-bit processor
- Built-in WiFi and Bluetooth
- Multiple GPIO pins for sensor connections
- Low power consumption

### Sensors
1. DHT22 Temperature & Humidity Sensor
   - Temperature Range: -40°C to 80°C
   - Humidity Range: 0-100% RH
   - Accuracy: ±0.5°C, ±2% RH

2. Soil Moisture Sensor (Capacitive)
   - Operating Voltage: 3.3V-5V
   - Output: Analog
   - Moisture Range: 0-100%

3. Water Level Sensor
   - Type: Ultrasonic
   - Range: 2cm-400cm
   - Accuracy: ±1cm
   - Operating Voltage: 5V

### 4G GSM Module (SIM7600E-H)
- 4G LTE connectivity
- Voice call capability
- SMS functionality
- Automatic alert system
- Operating Voltage: 3.4V-4.4V
- Supports multiple frequency bands

### Motor Control
- 12V DC Water Pump
- Relay Module for control
- Power Rating: 5A
- Operating Voltage: 12V

## Project Architecture

```
├── frontend/               # React frontend application (Firebase Hosting)
│   ├── src/               # Source code
│   ├── public/           # Static files
│   └── package.json      # Frontend dependencies
│
├── backend/               # Backend services (AWS Elastic Beanstalk)
│   ├── ml-flask-app/     # Python ML service (Docker)
│   │   ├── app.py        # Flask server for ML predictions
│   │   ├── Dockerfile    # Docker configuration
│   │   └── requirements.txt
│   │
│   └── nodejs-eb-app/    # Node.js backend
│       ├── app.js        # Main server file
│       └── package.json  # Backend dependencies
│
├── iot_arduino/          # ESP32 firmware
│   ├── main.ino         # Main Arduino sketch
│   ├── config.h         # Configuration settings
│   └── libraries/       # Required libraries
│
└── aws/                  # AWS configuration
    └── cloudwatch/       # CloudWatch configuration
```

## Deployment Architecture

### Frontend (Firebase Hosting)
- Hosted on Firebase Hosting
- Serves HTTPS requests
- Communicates with backend through AWS CloudWatch
- Real-time data visualization
- Responsive Material-UI design

### Backend (AWS Elastic Beanstalk)
1. ML Service (Ml-env-2)
   - Platform: Docker
   - Hosts Python Flask application
   - Provides prediction endpoints
   - Containerized using Docker
   - Handles ML model inference

2. Node.js Environment (node-env)
   - Platform: Node.js 22 on Linux
   - Handles HTTP requests
   - Routes prediction requests to ML service
   - Communicates with Firebase
   - Manages MQTT connections

### AWS CloudWatch
- Converts HTTPS requests from Firebase to HTTP
- Routes requests to appropriate Elastic Beanstalk environment
- Handles request/response transformation
- Monitors application health

## IoT Hardware Communication

### ESP32 to Cloud
1. Sensor Data Collection
   - ESP32 reads sensor data every 5 minutes
   - Data sent via MQTT to AWS
   - Firebase Realtime Database stores data

2. Alert System
   - Water level monitoring
   - Automatic phone calls when level drops below threshold
   - SMS alerts for critical conditions
   - 4G GSM module handles communication

3. Motor Control
   - Automated control based on ML predictions
   - Manual override through web interface
   - Real-time status monitoring

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
   node app.js
   ```

### ML Service Setup
1. Navigate to ML service directory:
   ```bash
   cd backend/ml-flask-app
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

### ESP32 Setup
1. Install required libraries:
   - PubSubClient (MQTT)
   - DHT sensor library
   - SIM7600 library
2. Configure WiFi and MQTT settings in config.h
3. Upload sketch to ESP32

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

## MQTT Communication

### HiveMQ Public Broker
- Broker URL: broker.hivemq.com
- Port: 1883 (MQTT) / 8883 (MQTT over TLS)
- WebSocket Port: 8000
- No authentication required for public access
- Supports QoS levels 0, 1, and 2
- Maximum message size: 268,435,456 bytes
- Connection limit: 1000 concurrent connections

### Topic Structure
```
iot-irrigation/
├── sensors/
│   ├── temperature      # Temperature readings
│   ├── humidity         # Humidity readings
│   ├── soil-moisture    # Soil moisture readings
│   └── water-level      # Water level readings
```

### MQTT Features Used
1. **QoS Levels**
   - QoS 0: At most once delivery (for non-critical data)
   - QoS 1: At least once delivery (for sensor readings)
   - QoS 2: Exactly once delivery (for critical commands)

2. **Retained Messages**
   - Last known sensor values
   - Current motor status
   - System state

3. **Last Will and Testament (LWT)**
   - Topic: `iot-irrigation/status/device`
   - Message: "offline"
   - QoS: 1
   - Retained: true

4. **Message Format**
```json
{
  "deviceId": "esp32_001",
  "timestamp": "2024-03-20T10:30:00Z",
  "type": "sensor_reading",
  "data": {
    "temperature": 25.5,
    "humidity": 60,
    "soilMoisture": 45,
    "waterLevel": 75
  }
}
```

### Security Considerations
- TLS/SSL encryption for secure communication
- Unique device IDs for each ESP32
- Message validation on both ends
- Rate limiting to prevent abuse
- Regular connection monitoring
