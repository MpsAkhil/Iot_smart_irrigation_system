import React, { useState } from 'react';
import axios from 'axios';

const Predictions = () => {
    const [city, setCity] = useState('');
    const [predictions, setPredictions] = useState([]);
    const [error, setError] = useState('');

    const handlePredict = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/predict', {
                city_name: city, // Send city_name instead of latitude and longitude
            });
            setPredictions(response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch predictions');
            setPredictions([]);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Weather Forecast</h1>
            <input
                type="text"
                placeholder="Enter city name"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={{ padding: '10px', fontSize: '16px', marginRight: '10px' }}
            />
            <button
                onClick={handlePredict}
                style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
            >
                Predict
            </button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {predictions.length > 0 && (
                <table style={{ marginTop: '20px', borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Temperature</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Humidity</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Pressure</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Cloud Cover</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Weather Code</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Wind Speed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {predictions.map((pred, index) => (
                            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{pred.temperature}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{pred.humidity}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{pred.pressure}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{pred.cloud_cover}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{pred.weather_code}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{pred.wind_speed}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Predictions;