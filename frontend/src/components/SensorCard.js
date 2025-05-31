// src/components/SensorCard.js
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Thermometer, Droplets, CloudDrizzle, Waves } from 'lucide-react';

const icons = {
  temperature: <Thermometer size={24} />,
  humidity: <Droplets size={24} />,
  moisture_level: <CloudDrizzle size={24} />,
  water_level: <Waves size={24} />
};

const units = {
  temperature: '°C',
  humidity: '%',
  moisture_level: '%',
  water_level: 'cm'
};

const SensorCard = ({ type, value, onClick }) => {
  const getStatusColor = (val) => {
    if (val === null || val === undefined) return '#9e9e9e'; // Gray for no data
    
    if (type === 'temperature') {
      if (val > 30) return '#ff5722'; // Hot (orange)
      if (val < 15) return '#2196f3';  // Cold (blue)
      return '#4caf50';                // Normal (green)
    }
    if (type === 'humidity') {
      if (val > 70) return '#2196f3';  // High (blue)
      if (val < 30) return '#ff9800';  // Low (orange)
      return '#4caf50';                // Normal (green)
    }
    if (type === 'moisture_level') {
      if (val > 60) return '#2196f3';  // Wet (blue)
      if (val < 30) return '#ff9800';  // Dry (orange)
      return '#4caf50';                // Normal (green)
    }
    if (type === 'water_level') {
      if (val < 10) return '#f44336';  // Critical (red)
      if (val < 20) return '#ff9800';  // Low (orange)
      return '#4caf50';                // Normal (green)
    }
    return '#4caf50';
  };

  return (
    <Card 
      sx={{ 
        minWidth: 200, 
        cursor: 'pointer',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'scale(1.03)' }
      }} 
      onClick={onClick}
    >
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Box sx={{ color: getStatusColor(value), mr: 2 }}>
            {icons[type]}
          </Box>
          <Typography variant="h6" textTransform="capitalize">
            {type.replace('_', ' ')}
          </Typography>
        </Box>
        <Box textAlign="center">
          <Typography variant="h4" sx={{ color: getStatusColor(value) }}>
            {value !== null && value !== undefined ? `${value} ${units[type]}` : 'No data'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SensorCard;