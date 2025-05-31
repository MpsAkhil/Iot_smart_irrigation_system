import React, { useState } from "react";
import "./Home.css";

const App = () => {
  // Code2 State and Logic
  const [showInfo, setShowInfo] = useState(false);
  const [currentSensorInfo, setCurrentSensorInfo] = useState(null);

  const sensors = [
    { id: "temperature", name: "(DHT11)", logo: "#temperature-logo", info: "Measures ambient temperature to help optimize irrigation." },
    { id: "humidity", name: "(DHT11)", logo: "#humidity-logo", info: "Info about Detects humidity levels in the air for climate monitoring." },
    { id: "moisture", name: "Moisture Sensor", logo: "#moisture-logo", info: "Monitors soil moisture levels to determine when irrigation is needed." },
    { id: "water-level", name: "Water Level Sensor", logo: "#water-level-logo", info: "Tracks the water level in the storage tank to prevent overflow or shortages." },
    { id: "Esp-32", name: "Esp-32 microcontroller", logo: "#Esp32-logo", info: " Acts as the central unit, processing sensor data and controlling the system." },
    { id: "4G-GSM Module", name: "SIM-COM Module", logo: "#Simcom-logo", info: "Enables remote communication and control via mobile networks." }
  ];

  const handleSensorClick = (sensor) => {
    setCurrentSensorInfo(sensor);
    setShowInfo(true);
  };

  // Code1 Data
  const cards = [
    {
      id: 'cardUno',
      title: 'Automated Irrigation',
      subtitle: 'Smart Watering Mechanism',
      subsubtitle: 'The system monitors soil moisture levels in real-time and controls the water pump accordingly.',
      backgroundImage: 'https://images.unsplash.com/photo-1729271387795-835e9089e332?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: 'cardDos',
      title: 'Remote Monitoring & Control',
      subtitle: 'Web and Mobile Access',
      subsubtitle: 'Users can monitor sensor data and control the irrigation system via a React web app and a mobile application.',
      backgroundImage: 'https://images.unsplash.com/photo-1727014588962-0bba80d5959e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: 'cardTres',
      title: 'Smart Predictions',
      subtitle: 'Weather Forecasting',
      subsubtitle: 'Implements an LSTM machine learning model to predict future weather conditions.',
      backgroundImage: 'https://images.unsplash.com/photo-1728140161956-3cf6462f2f12?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: 'cardCuatro',
      title: ' Real-Time Data Visualization',
      subtitle: 'Live Data Tracking',
      subsubtitle: 'Displays real-time sensor data (temperature, humidity, soil moisture, and water levels) on a React dashboard.',
      backgroundImage: 'https://images.unsplash.com/photo-1726672458981-b4882850d020?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
  ];
  return (
    <div className="app-container">
      {/* Code2 - Left Side */}
      <div className="left-side">
        <LandingPage sensors={sensors} onSensorClick={handleSensorClick} />
        {showInfo && <SensorInfo sensor={currentSensorInfo} onClose={() => setShowInfo(false)} />}
      </div>

      {/* Code1 - Right Side */}
      <div className="right-side">
        <div className="general-container">
          {cards.map((card) => (
            <React.Fragment key={card.id}>
              <input className="radio" type="radio" name="card" id={card.id} defaultChecked={card.id === 'cardUno'} />
              <label className="content" htmlFor={card.id} style={{ backgroundImage: `url(${card.backgroundImage})` }}>
                <h1 className="title-card">
                  <span className="marg-bott">{card.title}</span>
                  <span className="subtitle">{card.subtitle}</span>
                </h1>
                <h3 className="card-title subsubtitle">
                  <span>{card.subsubtitle}</span>
                </h3>
              </label>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

// Code2 Components
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