import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const CorrelationHeatmap = ({ matrix }) => {
  if (!matrix) return <Typography>No correlation data available</Typography>;

  const labels = Object.keys(matrix);
  const data = labels.map(rowLabel => 
    labels.map(colLabel => matrix[rowLabel][colLabel])
  );

  const getColor = (value) => {
    const alpha = Math.abs(value);
    return value > 0 
      ? `rgba(255, 99, 71, ${alpha})` // Red for positive
      : `rgba(65, 105, 225, ${alpha})`; // Blue for negative
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>Correlation Matrix</Typography>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: `auto ${labels.map(() => '1fr').join(' ')}`,
        gap: 1,
        '& > div': {
          padding: 1,
          textAlign: 'center',
          minWidth: '80px'
        }
      }}>
        {/* Header row */}
        <div></div>
        {labels.map(label => (
          <div key={label} style={{ fontWeight: 'bold' }}>{label}</div>
        ))}
        
        {/* Matrix rows */}
        {labels.map((rowLabel, i) => (
          <React.Fragment key={rowLabel}>
            <div style={{ fontWeight: 'bold' }}>{rowLabel}</div>
            {data[i].map((value, j) => (
              <div
                key={`${i}-${j}`}
                style={{
                  backgroundColor: getColor(value),
                  color: Math.abs(value) > 0.5 ? 'white' : 'black'
                }}
              >
                {value.toFixed(2)}
              </div>
            ))}
          </React.Fragment>
        ))}
      </Box>
    </Paper>
  );
};

export default CorrelationHeatmap;

