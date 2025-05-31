import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Box, Typography } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DailyAverages = ({ data }) => {
  if (!data || data.length === 0) return (
    <Typography>No daily average data available</Typography>
  );

  const labels = data.map(row => row.Date);
  const datasets = [
    {
      label: 'Temperature',
      data: data.map(row => row.Temperature),
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Humidity',
      data: data.map(row => row.Humidity),
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
    },
    {
      label: 'Water Level',
      data: data.map(row => row['Water Level']),
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
    },
    {
      label: 'Moisture Level',
      data: data.map(row => row['Moisture Level']),
      backgroundColor: 'rgba(153, 102, 255, 0.5)',
    }
  ];

  const chartData = {
    labels,
    datasets
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Daily Average Sensor Values',
        font: {
          size: 16
        }
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45
        },
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Values'
        },
        beginAtZero: true
      }
    }
  };

  return (
    <Box sx={{ height: '400px', marginBottom: '2rem' }}>
      <Bar options={options} data={chartData} />
    </Box>
  );
};

export default DailyAverages;