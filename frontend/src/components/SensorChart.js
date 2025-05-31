// src/components/SensorChart.js
import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Box } from '@mui/material'; 
const SensorChart = ({ type, data }) => {
  const config = {
    temperature: {
      title: 'Temperature',
      color: '#FF6384',
      unit: '°C',
      minRange: 0,
      maxRange: 50
    },
    humidity: {
      title: 'Humidity',
      color: '#36A2EB',
      unit: '%',
      minRange: 0,
      maxRange: 100
    },
    moisture_level: {
      title: 'Moisture Level',
      color: '#4BC0C0',
      unit: '%',
      minRange: 0,
      maxRange: 100
    },
    water_level: {
      title: 'Water Level',
      color: '#FFCE56',
      unit: 'cm',
      minRange: 0,
      maxRange: 50
    }
  };

  // Safely handle data
  const safeData = Array.isArray(data) ? data : [];
  
  if (safeData.length === 0) {
    return (
      <Box sx={{ 
        height: 350, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'text.secondary'
      }}>
        No data available for {config[type].title.toLowerCase()}
      </Box>
    );
  }

  // Prepare chart data
  const chartData = {
    series: [{
      name: config[type].title,
      data: safeData.map(item => ({
        x: new Date(item.time).getTime(),
        y: item.value
      }))
    }],
    options: {
      chart: {
        type: 'line',
        height: 350,
        zoom: {
          enabled: true
        },
        toolbar: {
          tools: {
            download: true,
            zoom: true,
            pan: true,
            reset: true
          }
        }
      },
      colors: [config[type].color],
      stroke: {
        curve: 'smooth',
        width: 3
      },
      markers: {
        size: 5
      },
      xaxis: {
        type: 'datetime',
        title: {
          text: 'Time'
        },
        labels: {
          datetimeUTC: false,
          format: 'HH:mm'
        }
      },
      yaxis: {
        title: {
          text: `${config[type].title} (${config[type].unit})`
        },
        min: config[type].minRange,
        max: config[type].maxRange
      },
      tooltip: {
        x: {
          format: 'dd MMM yyyy HH:mm'
        }
      }
    }
  };

  return (
    <ReactApexChart 
      options={chartData.options} 
      series={chartData.series} 
      type="line" 
      height={350} 
    />
  );
};

export default SensorChart;