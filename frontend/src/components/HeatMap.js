// HeatMap.jsx (separate component)
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Colors
} from 'chart.js';
import { HeatmapController, MatrixElement } from 'chartjs-chart-heatmap';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Colors,
  HeatmapController,
  MatrixElement
);

export const HeatMap = ({ data, xLabels, yLabels }) => {
  const chartData = {
    labels: xLabels,
    datasets: [{
      label: 'Correlation',
      data: data.flatMap((row, i) => 
        row.map((value, j) => ({ x: j, y: i, v: value }))
      ),
      backgroundColor: (ctx) => {
        const value = ctx.dataset.data[ctx.dataIndex].v;
        const alpha = Math.abs(value);
        return value > 0 
          ? `rgba(255, 99, 71, ${alpha})` // Red for positive
          : `rgba(65, 105, 225, ${alpha})`; // Blue for negative
      },
      borderWidth: 1,
      borderColor: '#fff',
      width: (ctx) => {
        const { chart } = ctx;
        const { width } = chart.chartArea;
        return width / xLabels.length - 1;
      },
      height: (ctx) => {
        const { chart } = ctx;
        const { height } = chart.chartArea;
        return height / yLabels.length - 1;
      }
    }]
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          title: (items) => {
            if (!items.length) return '';
            const { dataIndex } = items[0];
            const x = xLabels[items[0].parsed.x];
            const y = yLabels[items[0].parsed.y];
            return `${x} vs ${y}`;
          },
          label: (item) => {
            const v = item.dataset.data[item.dataIndex].v;
            return `Correlation: ${v.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          display: true
        },
        grid: {
          display: false
        }
      },
      y: {
        ticks: {
          display: true
        },
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div style={{ height: '400px' }}>
      <Chart type="heatmap" data={chartData} options={options} />
    </div>
  );
};
export default HeatMap;