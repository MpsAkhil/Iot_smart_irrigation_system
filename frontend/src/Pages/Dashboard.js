// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, CircularProgress, Paper } from '@mui/material';
import { database, ref } from '../firebase/config';
import { onValue } from 'firebase/database';
import SensorCard from '../components/SensorCard';
import SensorChart from '../components/SensorChart';

const Dashboard = () => {
  const [sensorData, setSensorData] = useState({
    temperature: [],
    humidity: [],
    moisture_level: [],
    water_level: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedSensor, setSelectedSensor] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      const sensorsRef = ref(database, 'sensorData');
      
      const unsubscribe = onValue(sensorsRef, (snapshot) => {
        const data = snapshot.val();
        
        // Transform Firebase data into arrays of { value, timestamp }
        const transformData = (rawData) => {
          if (!rawData) return [];
          return Object.keys(rawData).map(key => ({
            value: parseFloat(rawData[key].value),
            time: rawData[key].timestamp
          }));
        };

        setSensorData({
          temperature: transformData(data?.temperature),
          humidity: transformData(data?.humidity),
          moisture_level: transformData(data?.moisture_level),
          water_level: transformData(data?.water_level)
        });
        setLoading(false);
      }, (error) => {
        console.error("Error reading sensor data:", error);
        setLoading(false);
      });

      return () => unsubscribe();
    };

    fetchData();
  }, []);

  const getLatestValue = (dataArray) => {
    if (!Array.isArray(dataArray)) return null;
    const lastReading = dataArray[dataArray.length - 1];
    return lastReading?.value || null;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Smart Irrigation System Dashboard
      </Typography>
      
      {/* Sensor Cards Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <SensorCard
            type="temperature"
            value={getLatestValue(sensorData.temperature)}
            onClick={() => setSelectedSensor('temperature')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SensorCard
            type="humidity"
            value={getLatestValue(sensorData.humidity)}
            onClick={() => setSelectedSensor('humidity')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SensorCard
            type="moisture_level"
            value={getLatestValue(sensorData.moisture_level)}
            onClick={() => setSelectedSensor('moisture_level')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SensorCard
            type="water_level"
            value={getLatestValue(sensorData.water_level)}
            onClick={() => setSelectedSensor('water_level')}
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Temperature History</Typography>
            <SensorChart 
              type="temperature" 
              data={sensorData.temperature} 
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Humidity History</Typography>
            <SensorChart 
              type="humidity" 
              data={sensorData.humidity} 
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Moisture Level History</Typography>
            <SensorChart 
              type="moisture_level" 
              data={sensorData.moisture_level} 
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Water Level History</Typography>
            <SensorChart 
              type="water_level" 
              data={sensorData.water_level} 
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;