import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';

const AnomalyTable = ({ anomalies }) => {
  if (!anomalies || anomalies.length === 0) {
    return <Typography>No anomalies detected</Typography>;
  }

  const columns = [
    { 
      field: 'Timestamp', 
      headerName: 'Timestamp', 
      width: 200,
      valueFormatter: (params) => {
        try {
          return new Date(params.value).toLocaleString();
        } catch (e) {
          return params.value;
        }
      }
    },
    { field: 'Temperature', headerName: 'Temperature', width: 120 },
    { field: 'Humidity', headerName: 'Humidity', width: 120 },
    { field: 'Water Level', headerName: 'Water Level', width: 120 },
    { field: 'Moisture Level', headerName: 'Moisture Level', width: 120 },
  ];

  const rows = anomalies.map((row, index) => {
    // Create a new object with the correct structure
    const rowData = {
      id: index,
      Timestamp: row.Timestamp, // Keep the original timestamp
      Temperature: row.Temperature,
      Humidity: row.Humidity,
      'Water Level': row['Water Level'],
      'Moisture Level': row['Moisture Level']
    };
    return rowData;
  });

  return (
    <Box sx={{ height: 400, width: '100%', marginBottom: '2rem' }}>
      <Typography variant="h6" gutterBottom>Anomalies Detected (Z-Score &gt; 3 or &lt; -3)</Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick
      />
    </Box>
  );
};

export default AnomalyTable;