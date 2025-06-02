import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Grid, CircularProgress } from '@mui/material';

const Time = () => {
    const [motorInput, setMotorInput] = useState({
        temperature: '',
        humidity: '',
        soil_moisture: '',
        water_level: '',
    });
    const [motorOnTime, setMotorOnTime] = useState(null);
    const [motorOnTime2, setMotorOnTime2] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleMotorPrediction = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Validate inputs
            if (!motorInput.temperature || !motorInput.humidity || 
                !motorInput.soil_moisture || !motorInput.water_level) {
                throw new Error('Please fill in all fields');
            }

            const response = await fetch('https://dlhofls0c3ep8.cloudfront.net/predict-motor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(motorInput),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setMotorOnTime(data.motor_on_time);
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleMotorPrediction2 = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Validate inputs
            if (!motorInput.temperature || !motorInput.humidity || 
                !motorInput.soil_moisture || !motorInput.water_level) {
                throw new Error('Please fill in all fields');
            }

            const response = await fetch('https://dlhofls0c3ep8.cloudfront.net/predict-motor-2', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(motorInput),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setMotorOnTime2(data.motor_on_time);
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Motor On-Time Prediction
            </Typography>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            label="Temperature"
                            type="number"
                            value={motorInput.temperature}
                            onChange={(e) => setMotorInput({ ...motorInput, temperature: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            label="Humidity"
                            type="number"
                            value={motorInput.humidity}
                            onChange={(e) => setMotorInput({ ...motorInput, humidity: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            label="Soil Moisture"
                            type="number"
                            value={motorInput.soil_moisture}
                            onChange={(e) => setMotorInput({ ...motorInput, soil_moisture: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            label="Water Level"
                            type="number"
                            value={motorInput.water_level}
                            onChange={(e) => setMotorInput({ ...motorInput, water_level: e.target.value })}
                        />
                    </Grid>
                </Grid>

                {error && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {error}
                    </Typography>
                )}

                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button 
                        variant="contained" 
                        onClick={handleMotorPrediction}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Predict Motor On-Time (Model 1)'}
                    </Button>
                    <Button 
                        variant="contained" 
                        onClick={handleMotorPrediction2}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Predict Motor On-Time (Model 2)'}
                    </Button>
                </Box>
            </Paper>

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Model 1 Prediction
                        </Typography>
                        {motorOnTime !== null && (
                            <Typography variant="h4" color="primary">
                                Next-suggesting Motor on time: {motorOnTime} minutes
                            </Typography>
                        )}
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Model 2 Prediction
                        </Typography>
                        {motorOnTime2 !== null && (
                            <Typography variant="h4" color="primary">
                                Motor On-Time: {motorOnTime2} seconds
                            </Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Time;