import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';

const StatsTable = ({ stats }) => {
  if (!stats) return <Typography>No statistics available</Typography>;

  const formatValue = (value) => {
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    return value;
  };

  const columns = [
    { field: 'metric', headerName: 'Metric', width: 120 },
    { field: 'Temperature', headerName: 'Temperature', width: 120 },
    { field: 'Humidity', headerName: 'Humidity', width: 120 },
    { field: 'Water Level', headerName: 'Water Level', width: 120 },
    { field: 'Moisture Level', headerName: 'Moisture Level', width: 120 },
  ];

  const rows = [
    { id: 1, metric: 'count', ...Object.fromEntries(Object.entries(stats).map(([k, v]) => [k, v.count])) },
    { id: 2, metric: 'mean', ...Object.fromEntries(Object.entries(stats).map(([k, v]) => [k, formatValue(v.mean)])) },
    { id: 3, metric: 'std', ...Object.fromEntries(Object.entries(stats).map(([k, v]) => [k, formatValue(v.std)])) },
    { id: 4, metric: 'min', ...Object.fromEntries(Object.entries(stats).map(([k, v]) => [k, formatValue(v.min)])) },
    { id: 5, metric: '25%', ...Object.fromEntries(Object.entries(stats).map(([k, v]) => [k, formatValue(v['25%'])])) },
    { id: 6, metric: '50%', ...Object.fromEntries(Object.entries(stats).map(([k, v]) => [k, formatValue(v['50%'])])) },
    { id: 7, metric: '75%', ...Object.fromEntries(Object.entries(stats).map(([k, v]) => [k, formatValue(v['75%'])])) },
    { id: 8, metric: 'max', ...Object.fromEntries(Object.entries(stats).map(([k, v]) => [k, formatValue(v.max)])) },
  ];

  return (
    <Box sx={{ height: 400, width: '100%', marginBottom: '2rem' }}>
      <Typography variant="h6" gutterBottom>Summary Statistics</Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={8}
        rowsPerPageOptions={[8]}
        disableSelectionOnClick
      />
    </Box>
  );
};

export default StatsTable;