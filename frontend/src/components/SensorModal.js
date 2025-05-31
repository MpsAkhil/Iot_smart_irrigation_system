// src/components/SensorModal.js
import React from 'react';
import { Modal, Box, Typography, Grid, Paper, IconButton } from '@mui/material';
import { X } from 'lucide-react';
import SensorChart from './SensorChart';

const SensorModal = ({ open, onClose, sensorData }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Box
        sx={{
          width: '90%',
          maxWidth: 1200,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5">Sensor Data Details</Typography>
          <IconButton onClick={onClose}>
            <X size={24} />
          </IconButton>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
              <SensorChart type="temperature" data={sensorData?.temperature} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
              <SensorChart type="humidity" data={sensorData?.humidity} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
              <SensorChart type="moisture_level" data={sensorData?.moisture_level} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
              <SensorChart type="water_level" data={sensorData?.water_level} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default SensorModal;