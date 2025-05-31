const mqtt = require("mqtt");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const axios = require('axios');

const app = express();

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://iot2-744e6.web.app',
    'https://iot2-744e6.firebaseapp.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Initialize Firebase
const serviceAccount = require("./firebase-Key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://iot2-744e6-default-rtdb.firebaseio.com"
});

const db = admin.database();

// MQTT Connection Details
const mqttOptions = {
  host: "5b0d1f92d9934c03a7c3cd5bab179064.s1.eu.hivemq.cloud",
  port: 8883,
  username: "project",
  password: "Project1",
  protocol: "mqtts"
};

const client = mqtt.connect(mqttOptions);

// MQTT Topics to Subscribe
const topics = [
  "sensor/data/temperature",
  "sensor/data/humidity",
  "sensor/data/water_level",
  "sensor/data/moisture_level"
];

// Mapping topics to Firebase paths
const firebasePaths = {
  "sensor/data/temperature": "sensorData/temperature",
  "sensor/data/humidity": "sensorData/humidity",
  "sensor/data/water_level": "sensorData/water_level",
  "sensor/data/moisture_level": "sensorData/moisture_level"
};

client.on("connect", () => {
  console.log("Connected to MQTT broker");

  client.subscribe(topics, (err) => {
    if (!err) {
      console.log("Subscribed to topics:", topics);
    } else {
      console.error("Subscription error:", err);
    }
  });
});

client.on("message", (topic, message) => {
  console.log(`Received message on topic ${topic}: ${message.toString()}`);

  const value = message.toString();
  const currentTimestamp = new Date();
  const roundedTimestamp = currentTimestamp.toISOString().substring(0, 16); // Round to minute precision

  // Store in Firebase
  if (firebasePaths[topic]) {
    db.ref(firebasePaths[topic]).push({ value, timestamp: roundedTimestamp })
      .then(() => console.log(`Data written to Firebase: ${firebasePaths[topic]}`))
      .catch((err) => console.error("Error writing to Firebase:", err));
  }
});

// ML Service proxy endpoints
app.post('/predict-motor', async (req, res) => {
  try {
    console.log('Received /predict-motor request:', req.body);
    const response = await axios.post('http://localhost:5001/predict-motor', req.body);
    console.log('ML Service response:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error calling ML service:', error.response ? error.response.data : error.message);
    res.status(500).json({ 
      error: 'Failed to get prediction from ML service',
      details: error.response ? error.response.data : error.message
    });
  }
});

app.post('/predict-motor-2', async (req, res) => {
  try {
    console.log('Received /predict-motor-2 request:', req.body);
    const response = await axios.post('http://localhost:5001/predict-motor-2', req.body);
    console.log('ML Service response:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error calling ML service:', error.response ? error.response.data : error.message);
    res.status(500).json({ 
      error: 'Failed to get prediction from ML service',
      details: error.response ? error.response.data : error.message
    });
  }
});

// Add a health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});