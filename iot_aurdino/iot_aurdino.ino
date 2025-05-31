#define BLYNK_TEMPLATE_ID "TMPL30uMiS72N"
#define BLYNK_TEMPLATE_NAME "project"
#define BLYNK_AUTH_TOKEN "Yd0-pedXlRj13rsKaX3IkJ7ObX3m13at"

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <HardwareSerial.h>
#include <BlynkSimpleEsp32.h>

// Wi-Fi Credentials
const char* ssid = "Iq";
const char* password = "123456798";

// MQTT Broker Details (HiveMQ Cloud)
const char* mqttServer = "5b0d1f92d9934c03a7c3cd5bab179064.s1.eu.hivemq.cloud";
const int mqttPort = 8883;
const char* mqttUser = "project";
const char* mqttPassword = "Project1";

// Sen7U77UU70HHHH-H66HY6HYsor & Motor Pin Configurations
#define DHTPIN 4
#define DHTTYPE DHT11
const int waterSensorPin = 34;
const int moistureSensorPin = 35;
#define relay 5  // Relay pin for motor

// Initialize Objects
WiFiClientSecure espClient;
PubSubClient client(espClient);
DHT dht(DHTPIN, DHTTYPE);
HardwareSerial simModule(2);
BlynkTimer timer;

void connectToWiFi() {
    Serial.print("Connecting to Wi-Fi...");
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nWi-Fi connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
}

void connectToMQTT() {
    espClient.setInsecure();
    client.setServer(mqttServer, mqttPort);
    while (!client.connected()) {
        Serial.println("Connecting to MQTT broker...");
        if (client.connect("ESP32Client", mqttUser, mqttPassword)) {
            Serial.println("Connected to MQTT broker!");
        } else {
            Serial.print("Failed to connect. State: ");
            Serial.println(client.state());
            delay(5000);
        }
    }
}

void sendSMS(String phoneNumber, String message) {
    simModule.print("AT+CMGS=\"");
    simModule.print(phoneNumber);
    simModule.println("\"");
    delay(500);
    simModule.println(message);
    delay(500);
    simModule.write(26); // End SMS with CTRL+Z
    Serial.println("Message sent!");
}

void makeCall(String phoneNumber) {
    Serial.println("Making an alert call...");
    simModule.print("ATD");
    simModule.print(phoneNumber);
    simModule.println(";");
    delay(20000); // Let it ring for 20 seconds
    simModule.println("ATH"); // Hang up the call
    Serial.println("Call ended.");
}

void sendSensorData() {
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();
    int waterValue = analogRead(waterSensorPin);
    int waterLevel = map(waterValue, 0, 4095, 0, 100);
    
    int moistureSum = 0;
    for (int i = 0; i < 5; i++) {
        moistureSum += analogRead(moistureSensorPin);
        delay(100);
    }
    int moistureValue = moistureSum / 5;
    float moisturePercent = map(moistureValue, 0, 4095, 100, 0);
    
    Serial.print("Temperature: "); Serial.print(temperature);
    Serial.print("°C | Humidity: "); Serial.print(humidity);
    Serial.println("%");
    Serial.print("Water Level: "); Serial.print(waterLevel);
    Serial.println("%");
    Serial.print("Soil Moisture: "); Serial.print(moisturePercent);
    Serial.println("%");
    
    if (waterLevel < 10) {
        sendSMS("+917093276777", "Alert! Water level is below 10%. Switch on the motor.");
        makeCall("+917093276777");
    }

    if (moisturePercent < 10) {
        Serial.println("Moisture level critical! Turning on motor.");
        digitalWrite(relay, LOW);
        Blynk.logEvent("low_moisture", "⚠ Soil moisture is below 10%! Turning ON the motor.");
        client.publish("sensor/data/motor_status", "ON");
        makeCall("+917093276777");  // Call when moisture is too low
    } else {
        Serial.println("Moisture level sufficient. Turning off motor.");
        digitalWrite(relay, HIGH);
        client.publish("sensor/data/motor_status", "OFF");
    }

    client.publish("sensor/data/temperature", String(temperature).c_str());
    client.publish("sensor/data/humidity", String(humidity).c_str());
    client.publish("sensor/data/water_level", String(waterLevel).c_str());
    client.publish("sensor/data/moisture_level", String(moisturePercent).c_str());
    
    Blynk.virtualWrite(V0, temperature);
    Blynk.virtualWrite(V1, humidity);
    Blynk.virtualWrite(V2, waterLevel);
    Blynk.virtualWrite(V3, moisturePercent);
}

void setup() {
    Serial.begin(115200);
    simModule.begin(115200, SERIAL_8N1, 16, 17);
    dht.begin();
    pinMode(relay, OUTPUT);
    digitalWrite(relay, HIGH);
    connectToWiFi();
    connectToMQTT();
    Blynk.begin(BLYNK_AUTH_TOKEN, ssid, password);
    
    simModule.println("AT");
    delay(1000);
    simModule.println("AT+CMGF=1"); // Set SMS mode
    delay(1000);
    
    timer.setInterval(6000L, sendSensorData);
}

void loop() {
    if (!client.connected()) {
        connectToMQTT();
    }
    client.loop();
    Blynk.run();
    timer.run();
}