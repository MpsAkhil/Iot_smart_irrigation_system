import React, { useState, useEffect } from 'react';
import { processSensorData } from '../utils';
import TimeSeriesChart from '../components/TimeSeriesChart';
import CorrelationHeatmap from '../components/CorrelationHeatmap';
import AnomalyTable from '../components/AnomalyTable';
import SensorPrediction from '../components/TemperaturePrediction';
import DailyAverages from '../components/DailyAverages';
import StatsTable from '../components/StatsTable';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import { database } from '../firebase/config';
import { ref, onValue, get } from 'firebase/database';

const DashboardPage = () => {
  const [processedData, setProcessedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Function to transform Firebase data
  const transformFirebaseData = (data) => {
    if (!data) return [];
    
    // Get all timestamps
    const timestamps = new Set();
    Object.values(data).forEach(sensorData => {
      Object.values(sensorData).forEach(reading => {
        timestamps.add(reading.timestamp);
      });
    });

    // Create rows for each timestamp
    return Array.from(timestamps).map(timestamp => {
      const row = {
        Timestamp: new Date(timestamp),
        Temperature: 0,
        Humidity: 0,
        'Water Level': 0,
        'Moisture Level': 0
      };

      // Fill in values from each sensor
      Object.entries(data).forEach(([sensor, readings]) => {
        const reading = Object.values(readings).find(r => r.timestamp === timestamp);
        if (reading) {
          switch (sensor) {
            case 'temperature':
              row.Temperature = parseFloat(reading.value);
              break;
            case 'humidity':
              row.Humidity = parseFloat(reading.value);
              break;
            case 'water_level':
              row['Water Level'] = parseFloat(reading.value);
              break;
            case 'moisture_level':
              row['Moisture Level'] = parseFloat(reading.value);
              break;
          }
        }
      });

      return row;
    }).sort((a, b) => a.Timestamp - b.Timestamp);
  };

  // Function to load and process data from Firebase
  const loadData = async () => {
    try {
      console.log('Starting to load data from Firebase...');
      const sensorsRef = ref(database, 'sensorData');
      
      // First, try to get initial data
      const snapshot = await get(sensorsRef);
      if (!snapshot.exists()) {
        console.log('No data exists in Firebase');
        setError('No sensor data available in the database');
        setLoading(false);
        return;
      }

      const data = snapshot.val();
      console.log('Raw data from Firebase:', data);

      const transformedData = transformFirebaseData(data);
      console.log('Transformed data:', transformedData);

      if (transformedData.length === 0) {
        console.log('No valid data after transformation');
        setError('No valid sensor data found in the database');
        setLoading(false);
        return;
      }

      // Process the data
      console.log('Processing data...');
      const processed = processSensorData(transformedData);
      console.log('Processed data:', processed);
      
      setProcessedData(processed);
      setLastUpdate(new Date().toLocaleTimeString());
      setError(null);
      setLoading(false);

      // Set up real-time listener
      onValue(sensorsRef, (snapshot) => {
        const newData = snapshot.val();
        if (newData) {
          const newTransformedData = transformFirebaseData(newData);
          if (newTransformedData.length > 0) {
            const newProcessed = processSensorData(newTransformedData);
            setProcessedData(newProcessed);
            setLastUpdate(new Date().toLocaleTimeString());
            setError(null);
          }
        }
      }, (error) => {
        console.error('Error in real-time listener:', error);
        setError('Error reading sensor data: ' + error.message);
      });
    } catch (err) {
      console.error('Error in loadData:', err);
      setError('Error loading sensor data: ' + err.message);
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadData();
  }, []);

  return (
    <Box sx={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom sx={{ marginBottom: '1rem', textAlign: 'center' }}>
        Sensor Data Analytics Dashboard
      </Typography>

      {lastUpdate && (
        <Typography variant="subtitle2" sx={{ textAlign: 'center', mb: 2, color: 'text.secondary' }}>
          Last updated: {lastUpdate}
        </Typography>
      )}

      {loading && !processedData ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Paper sx={{ p: 2, mb: 2, bgcolor: '#ffebee' }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      ) : processedData ? (
        <>
          <TimeSeriesChart data={processedData.rawData} />
          <CorrelationHeatmap matrix={processedData.correlationMatrix} />
          <StatsTable stats={processedData.stats} />
          <AnomalyTable anomalies={processedData.anomalies} />
          <SensorPrediction 
            data={processedData.rawData} 
            models={processedData.predictionModels} 
          />
          <DailyAverages data={processedData.dailyAverages} />

          {/* Recent Data Table */}
          <div className="card">
            <h2>Recent Sensor Data</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Temperature</th>
                    <th>Humidity</th>
                    <th>Moisture</th>
                    <th>Water Level</th>
                  </tr>
                </thead>
                <tbody>
                  {processedData.rawData.slice(-50).map((row, index) => (
                    <tr key={index}>
                      <td>{new Date(row.Timestamp).toLocaleString()}</td>
                      <td>{row.Temperature.toFixed(2)}°C</td>
                      <td>{row.Humidity.toFixed(2)}%</td>
                      <td>{row['Moisture Level'].toFixed(2)}%</td>
                      <td>{row['Water Level'].toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <Typography>
          No data available. Please ensure the sensors are connected and sending data.
        </Typography>
      )}
    </Box>
  );
};

// Add these styles to your CSS
const styles = `
.table-container {
    max-height: 400px;
    overflow-y: auto;
}

.card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 1rem;
    margin-bottom: 1rem;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #eee;
}

th {
    background-color: #f5f5f5;
    font-weight: 600;
}

tr:hover {
    background-color: #f9f9f9;
}
`;

export default DashboardPage; 