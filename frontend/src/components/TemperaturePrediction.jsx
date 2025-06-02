import React, { useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Box, FormGroup, FormControlLabel, Checkbox, Paper } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SensorPrediction = ({ data, models }) => {
  // State for checkbox selections - moved before any conditional returns
  const [selectedSensors, setSelectedSensors] = useState({
    Temperature: true,
    Humidity: true,
    'Water Level': true,
    'Moisture Level': true
  });

  // Early return after hook declaration
  if (!data || data.length === 0 || !models) return <div>No prediction data available</div>;

  // Handle checkbox changes
  const handleCheckboxChange = (sensor) => {
    setSelectedSensors(prev => ({
      ...prev,
      [sensor]: !prev[sensor]
    }));
  };

  // Prepare data for chart
  const timestamps = data.map(row => row.Timestamp.getTime());
  const sensorData = {
    Temperature: data.map(row => row.Temperature),
    Humidity: data.map(row => row.Humidity),
    'Water Level': data.map(row => row['Water Level']),
    'Moisture Level': data.map(row => row['Moisture Level'])
  };

  // Generate predictions
  const minTime = Math.min(...timestamps);
  const maxTime = Math.max(...timestamps);
  const predictionTimes = [
    minTime - (maxTime - minTime) * 0.1,
    ...timestamps,
    maxTime + (maxTime - minTime) * 0.1
  ].sort((a, b) => a - b);

  // Color scheme for sensors
  const colorScheme = {
    Temperature: {
      actual: 'rgba(255, 99, 132, 0.5)',
      predicted: 'rgba(255, 99, 132, 1)'
    },
    Humidity: {
      actual: 'rgba(54, 162, 235, 0.5)',
      predicted: 'rgba(54, 162, 235, 1)'
    },
    'Water Level': {
      actual: 'rgba(75, 192, 192, 0.5)',
      predicted: 'rgba(75, 192, 192, 1)'
    },
    'Moisture Level': {
      actual: 'rgba(153, 102, 255, 0.5)',
      predicted: 'rgba(153, 102, 255, 1)'
    }
  };

  // Generate datasets based on selected sensors
  const datasets = Object.entries(selectedSensors)
    .filter(([_, isSelected]) => isSelected)
    .flatMap(([sensor]) => [
      // Actual data points
      {
        label: `Actual ${sensor}`,
        data: timestamps.map((time, i) => ({ x: time, y: sensorData[sensor][i] })),
        backgroundColor: colorScheme[sensor].actual,
        pointRadius: 5,
      },
      // Prediction line
      {
        label: `Predicted ${sensor}`,
        data: predictionTimes.map(time => ({
          x: time,
          y: models[sensor].intercept + models[sensor].slope * time
        })),
        backgroundColor: colorScheme[sensor].actual,
        pointRadius: 2,
        showLine: true,
        borderColor: colorScheme[sensor].predicted,
        borderWidth: 2,
        fill: false,
      }
    ]);

  const chartData = { datasets };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Sensor Predictions using Linear Regression',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label;
            const value = context.parsed.y;
            const date = new Date(context.parsed.x);
            const formattedDate = date.toLocaleString();
            return `${label}: ${value.toFixed(2)} at ${formattedDate}`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'hour',
          displayFormats: {
            hour: 'MMM d, HH:mm'
          },
          tooltipFormat: 'MMM d, HH:mm'
        },
        title: {
          display: true,
          text: 'Timestamp',
        },
        ticks: {
          source: 'auto',
          autoSkip: true,
          maxTicksLimit: 8
        }
      },
      y: {
        title: {
          display: true,
          text: 'Sensor Values',
        }
      }
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ mb: 2 }}>
        <FormGroup row sx={{ justifyContent: 'center', gap: 2 }}>
          {Object.entries(selectedSensors).map(([sensor, isSelected]) => (
            <FormControlLabel
              key={sensor}
              control={
                <Checkbox
                  checked={isSelected}
                  onChange={() => handleCheckboxChange(sensor)}
                  sx={{
                    color: colorScheme[sensor].predicted,
                    '&.Mui-checked': {
                      color: colorScheme[sensor].predicted,
                    },
                  }}
                />
              }
              label={sensor}
            />
          ))}
        </FormGroup>
      </Box>
      <Box sx={{ height: '400px' }}>
        <Scatter options={options} data={chartData} />
      </Box>
    </Paper>
  );
};

export default SensorPrediction;