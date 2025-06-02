import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const TimeSeriesChart = ({ data }) => {
  if (!data || data.length === 0) return <div>No data available</div>;

  const chartData = {
    datasets: [
      {
        label: 'Temperature',
        data: data.map(row => ({ x: row.Timestamp, y: row.Temperature })),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Humidity',
        data: data.map(row => ({ x: row.Timestamp, y: row.Humidity })),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: 'Water Level',
        data: data.map(row => ({ x: row.Timestamp, y: row['Water Level'] })),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Moisture Level',
        data: data.map(row => ({ x: row.Timestamp, y: row['Moisture Level'] })),
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Time-Series Analysis of Sensor Data',
      },
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
          text: 'Timestamp'
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
          text: 'Sensor Readings'
        }
      }
    }
  };

  return (
    <div style={{ height: '400px', marginBottom: '2rem' }}>
      <Line options={options} data={chartData} />
    </div>
  );
};

export default TimeSeriesChart;