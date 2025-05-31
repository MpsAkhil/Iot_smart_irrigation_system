import * as XLSX from 'xlsx';
import Papa from 'papaparse';

// Function to process Excel data similar to your notebook
export const processSensorData = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return {
      rawData: [],
      anomalies: [],
      dailyAverages: [],
      correlationMatrix: {},
      predictionModels: {},
      stats: {}
    };
  }

  // Convert timestamp and set as index (we'll handle dates differently in React)
  const processedData = data.map(row => {
    try {
      return {
        ...row,
        Timestamp: row.Timestamp instanceof Date ? row.Timestamp : new Date(row.Timestamp),
        Date: row.Timestamp instanceof Date ? row.Timestamp.toISOString().split('T')[0] : new Date(row.Timestamp).toISOString().split('T')[0],
        Temperature: parseFloat(row.Temperature) || 0,
        Humidity: parseFloat(row.Humidity) || 0,
        'Water Level': parseFloat(row['Water Level']) || 0,
        'Moisture Level': parseFloat(row['Moisture Level']) || 0
      };
    } catch (err) {
      console.error('Error processing row:', row, err);
      return null;
    }
  }).filter(Boolean);

  if (processedData.length === 0) {
    return {
      rawData: [],
      anomalies: [],
      dailyAverages: [],
      correlationMatrix: {},
      predictionModels: {},
      stats: {}
    };
  }

  // Calculate z-scores for anomaly detection
  const numericColumns = ['Temperature', 'Humidity', 'Water Level', 'Moisture Level'];
  const zscoreData = JSON.parse(JSON.stringify(processedData));
  
  numericColumns.forEach(col => {
    const values = processedData.map(row => row[col]).filter(v => !isNaN(v));
    if (values.length > 0) {
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const stdDev = Math.sqrt(values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length);
      
      zscoreData.forEach(row => {
        row[`${col}_zscore`] = stdDev !== 0 ? (row[col] - mean) / stdDev : 0;
      });
    }
  });

  // Find anomalies (z-score > 3 or < -3)
  const anomalies = zscoreData.filter(row => 
    numericColumns.some(col => 
      Math.abs(row[`${col}_zscore`]) > 3
    )
  );

  // Calculate daily averages
  const dailyAverages = {};
  processedData.forEach(row => {
    if (!dailyAverages[row.Date]) {
      dailyAverages[row.Date] = { count: 0, sum: {} };
    }
    numericColumns.forEach(col => {
      if (!dailyAverages[row.Date].sum[col]) dailyAverages[row.Date].sum[col] = 0;
      dailyAverages[row.Date].sum[col] += row[col];
    });
    dailyAverages[row.Date].count++;
  });

  const dailyAvgData = Object.keys(dailyAverages).map(date => {
    const avg = { Date: date };
    numericColumns.forEach(col => {
      avg[col] = dailyAverages[date].sum[col] / dailyAverages[date].count;
    });
    return avg;
  });

  // Prepare correlation matrix
  const correlationMatrix = {};
  numericColumns.forEach(col1 => {
    correlationMatrix[col1] = {};
    numericColumns.forEach(col2 => {
      const values1 = processedData.map(row => row[col1]).filter(v => !isNaN(v));
      const values2 = processedData.map(row => row[col2]).filter(v => !isNaN(v));
      
      // Make sure both arrays have the same length after filtering
      const minLength = Math.min(values1.length, values2.length);
      correlationMatrix[col1][col2] = calculatePearson(
        values1.slice(0, minLength),
        values2.slice(0, minLength)
      );
    });
  });

  // Temperature prediction (simplified linear regression)
  const timestamps = processedData.map(row => row.Timestamp.getTime());
  const predictionModels = {
    Temperature: simpleLinearRegression(
      timestamps.map((t, i) => [t, processedData[i].Temperature])
    ),
    Humidity: simpleLinearRegression(
      timestamps.map((t, i) => [t, processedData[i].Humidity])
    ),
    'Water Level': simpleLinearRegression(
      timestamps.map((t, i) => [t, processedData[i]['Water Level']])
    ),
    'Moisture Level': simpleLinearRegression(
      timestamps.map((t, i) => [t, processedData[i]['Moisture Level']])
    )
  };

  return {
    rawData: processedData,
    anomalies,
    dailyAverages: dailyAvgData,
    correlationMatrix,
    predictionModels,
    stats: calculateStatistics(processedData, numericColumns)
  };
};

// Helper function to calculate Pearson correlation
function calculatePearson(x, y) {
  if (x.length !== y.length || x.length === 0) return 0;

  // Convert values to numbers and filter out any NaN values
  const validPairs = x.map((val, i) => [Number(val), Number(y[i])])
                     .filter(([a, b]) => !isNaN(a) && !isNaN(b));
  
  if (validPairs.length < 2) return 0;  // Need at least 2 pairs for correlation

  const n = validPairs.length;
  const [sum_x, sum_y, sum_xy, sum_x2, sum_y2] = validPairs.reduce(
    ([sx, sy, sxy, sx2, sy2], [x, y]) => [
      sx + x,
      sy + y,
      sxy + x * y,
      sx2 + x * x,
      sy2 + y * y
    ],
    [0, 0, 0, 0, 0]
  );

  const numerator = sum_xy - (sum_x * sum_y) / n;
  const denominator = Math.sqrt(
    (sum_x2 - (sum_x * sum_x) / n) * (sum_y2 - (sum_y * sum_y) / n)
  );

  if (denominator === 0) return 0;
  const correlation = numerator / denominator;
  
  // Return correlation rounded to 2 decimal places
  return Math.round(correlation * 100) / 100;
}

// Simplified linear regression for the demo
function simpleLinearRegression(data) {
  const validData = data.filter(([x, y]) => !isNaN(x) && !isNaN(y));
  if (validData.length < 2) return { slope: 0, intercept: 0 };

  const n = validData.length;
  const sum_x = validData.reduce((sum, [x]) => sum + x, 0);
  const sum_y = validData.reduce((sum, [, y]) => sum + y, 0);
  const sum_xy = validData.reduce((sum, [x, y]) => sum + x * y, 0);
  const sum_x2 = validData.reduce((sum, [x]) => sum + x * x, 0);
  
  const slope = (n * sum_xy - sum_x * sum_y) / (n * sum_x2 - sum_x * sum_x);
  const intercept = (sum_y - slope * sum_x) / n;
  
  return { slope, intercept };
}

function calculateStatistics(data, columns) {
  const stats = {};
  columns.forEach(col => {
    const values = data.map(row => row[col]).filter(v => !isNaN(v));
    if (values.length === 0) return;
    
    const sorted = [...values].sort((a, b) => a - b);
    stats[col] = {
      count: values.length,
      mean: values.reduce((a, b) => a + b, 0) / values.length,
      std: Math.sqrt(values.reduce((a, b) => a + Math.pow(b - values.reduce((a, b) => a + b, 0) / values.length, 2), 0) / values.length),
      min: sorted[0],
      '25%': sorted[Math.floor(values.length * 0.25)],
      '50%': sorted[Math.floor(values.length * 0.5)],
      '75%': sorted[Math.floor(values.length * 0.75)],
      max: sorted[sorted.length - 1]
    };
  });
  return stats;
}