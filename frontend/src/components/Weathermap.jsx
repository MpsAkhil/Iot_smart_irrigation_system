import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from "react-leaflet";
import { useState } from "react";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./weathermap.css"; // Import custom CSS

// Custom Location Icon
import locationIcon from "../assets/location-icon.png"; // Add your custom location icon

const customIcon = L.icon({
  iconUrl: locationIcon,
  iconSize: [40, 40], // Size of the icon
  iconAnchor: [20, 40], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -40], // Point from which the popup should open relative to the iconAnchor
});

const WeatherMap = () => {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const API_KEY = "7eeba6a8fe29e05163a9d8011bffcba3"; // Replace with your API key--openweatherapi

  const fetchLocationDetails = async (lat, lon) => {
    try {
      // Reverse Geocoding to get location name
      const locationRes = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const place = locationRes.data.display_name;

      // Fetch Weather Data
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      setLocation({ lat, lon, place });
      setWeather(weatherRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        fetchLocationDetails(lat, lng);
      },
    });
    return null;
  };

  return (
    <div className="weather-map-container">
      <h1 className="title">Weather Map</h1>
      <MapContainer center={[20, 77]} zoom={4} className="map">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler />
        {location && (
          <Marker position={[location.lat, location.lon]} icon={customIcon}>
            <Popup className="custom-popup">
              <div className="popup-content">
                <h2>{location.place}</h2>
                <p><strong>Temperature:</strong> {weather?.main?.temp}°C</p>
                <p><strong>Feels Like:</strong> {weather?.main?.feels_like}°C</p>
                <p><strong>Weather:</strong> {weather?.weather[0]?.description}</p>
                <p><strong>Humidity:</strong> {weather?.main?.humidity}%</p>
                <p><strong>Wind Speed:</strong> {weather?.wind?.speed} m/s</p>
                <p><strong>Pressure:</strong> {weather?.main?.pressure} hPa</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default WeatherMap;