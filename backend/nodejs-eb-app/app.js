const mqtt = require("mqtt");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const axios = require("axios"); // Add axios for HTTP requests

const app = express();
const port = process.env.PORT || 8081;

// ML Service URL (from your EB deployment)
const ML_SERVICE_URL = "http://ml-env-2.eba-pk2s4nrh.us-east-1.elasticbeanstalk.com";

// Enhanced CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://iot2-744e6.web.app',
    'https://iot2-744e6.firebaseapp.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Initialize Firebase
try {
  const serviceAccount = require("./firebase-key.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://iot2-744e6-default-rtdb.firebaseio.com"
  });
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization failed:", error);
  process.exit(1);
}

const db = admin.database();

// MQTT Configuration
const mqttOptions = {
  host: "5b0d1f92d9934c03a7c3cd5bab179064.s1.eu.hivemq.cloud",
  port: 8883,
  username: "project",
  password: "Project1",
  protocol: "mqtts",
  reconnectPeriod: 5000,
  connectTimeout: 30000,
  rejectUnauthorized: true
};

console.log("Attempting MQTT connection...");
const client = mqtt.connect(mqttOptions);

// MQTT Topics
const topics = [
  "sensor/data/temperature",
  "sensor/data/humidity",
  "sensor/data/water_level",
  "sensor/data/moisture_level"
];

// Firebase paths mapping
const firebasePaths = {
  "sensor/data/temperature": "sensorData/temperature",
  "sensor/data/humidity": "sensorData/humidity",
  "sensor/data/water_level": "sensorData/water_level",
  "sensor/data/moisture_level": "sensorData/moisture_level"
};

// MQTT Event Handlers
client.on("connect", () => {
  console.log("✅ Connected to MQTT broker");
  client.subscribe(topics, (err) => {
    if (err) console.error("❌ Subscription error:", err);
    else console.log("🔔 Subscribed to topics:", topics);
  });
});

client.on("error", (err) => console.error("❌ MQTT Error:", err));
client.on("offline", () => console.warn("⚠️ MQTT Offline"));
client.on("close", () => console.warn("⚠️ MQTT Connection Closed"));

client.on("message", (topic, message) => {
  const value = message.toString();
  const roundedTimestamp = new Date().toISOString().substring(0, 16);
  
  console.log(`📩 Received MQTT [${topic}]: ${value}`);

  if (firebasePaths[topic]) {
    const path = firebasePaths[topic];
    db.ref(path).push({ value, timestamp: roundedTimestamp })
      .then(() => console.log(`🔥 Data written to Firebase: ${path}`))
      .catch((err) => console.error("❌ Firebase write error:", err));
  }
});

// ==================== ML SERVICE PROXY ENDPOINTS ==================== //
app.post('/predict-motor', async (req, res) => {
  try {
    console.log('Received /predict-motor request:', req.body);
    const response = await axios.post(`${ML_SERVICE_URL}/predict-motor`, req.body);
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
    const response = await axios.post(`${ML_SERVICE_URL}/predict-motor-2`, req.body);
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
// =================================================================== //

// Existing API Endpoints
app.get('/', (req, res) => {
  res.json({
    status: 'active',
    services: {
      mqtt: client.connected ? 'connected' : 'disconnected',
      firebase: 'initialized',
      endpoints: ['/health', '/status', '/sensors', '/predict-motor', '/predict-motor-2']
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/status', (req, res) => {
  res.json({
    mqtt: {
      connected: client.connected,
      host: mqttOptions.host,
      subscribed: client.connected ? topics : []
    },
    firebase: {
      connected: true,
      databaseURL: admin.app().options.databaseURL
    },
    ml_service: {
      url: ML_SERVICE_URL,
      status: 'configured'
    }
  });
});

app.get('/sensors', async (req, res) => {
  try {
    const snapshot = await db.ref("sensorData").once("value");
    res.json(snapshot.val());
  } catch (error) {
    console.error("Firebase read error:", error);
    res.status(500).json({ error: "Failed to read sensor data" });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('⚠️ Server Error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
client.once('connect', () => {
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`🔗 http://localhost:${port}`);
    console.log(`🤖 ML Service: ${ML_SERVICE_URL}`);
  });
});

client.once('error', (err) => {
  console.error('❌ FATAL: MQTT Connection Failed', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('⚠️ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('⚠️ Unhandled Rejection:', err);
});