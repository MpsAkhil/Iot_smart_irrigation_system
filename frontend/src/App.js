import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Weather from "./Pages/Weather";
import Predictions from "./Pages/Predictions";
import Profile from "./Pages/Profile";
import Mappage from "./Pages/map";
import Time from "./Pages/TimePrediction";
import Dashboard from './Pages/Data';
import DashboardPage from './Pages/Analytics';
function App() {
  return (
    <Router>
      <Routes>
      <Route path="/analytics" element={<DashboardPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/dash" element={<Dashboard />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/predictions" element={<Predictions />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/Map" element={<Mappage />} />
        <Route path="/time" element={<Time />} />
      </Routes>
    </Router>
  );
}

export default App;