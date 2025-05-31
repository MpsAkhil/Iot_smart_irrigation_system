import React, { useState } from "react";
import "./Homepage.css";

const App = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [currentSensorInfo, setCurrentSensorInfo] = useState(null);

  const sensors = [
    { id: "temperature", name: "Temperature Sensor", logo: "#temperature-logo", info: "Info about Temperature Sensor" },
    { id: "humidity", name: "Humidity Sensor", logo: "#humidity-logo", info: "Info about Humidity Sensor" },
    { id: "moisture", name: "Moisture Sensor", logo: "#moisture-logo", info: "Info about Moisture Sensor" },
    { id: "water-level", name: "Water Level Sensor", logo: "#water-level-logo", info: "Info about Water Level Sensor" },
    { id: "Esp-32", name: "Esp-32 microcontroller", logo: "#Esp32-logo", info: "Info about Esp32" },
    { id: "4G-GSM Module", name: "SIM-COM Module", logo: "#Simcom-logo", info: "Info about 4G-GSM Module" }
  ];

  const handleSensorClick = (sensor) => {
    setCurrentSensorInfo(sensor);
    setShowInfo(true);
  };

  return (
    <main>
      <LandingPage sensors={sensors} onSensorClick={handleSensorClick} />
      {showInfo && <SensorInfo sensor={currentSensorInfo} onClose={() => setShowInfo(false)} />}
    </main>
  );
};

const LandingPage = ({ sensors, onSensorClick }) => {
  return (
    <section id="landing-page">
      <ul className="signs-list">
        {sensors.map((sensor, index) => (
          <li key={sensor.id} className="signs-item" style={{ "--_degrees": `${(index * 360) / sensors.length}deg` }}>
            <svg className="icon" width="64" height="64" viewBox="0 0 64 64" onClick={() => onSensorClick(sensor)}>
              <use href={sensor.logo} />
            </svg>
          </li>
        ))}
      </ul>
    </section>
  );
};

const SensorInfo = ({ sensor, onClose }) => {
  return (
    <div className="sensor-info-container">
      <h2>{sensor.name}</h2>
      <p>{sensor.info}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default App;