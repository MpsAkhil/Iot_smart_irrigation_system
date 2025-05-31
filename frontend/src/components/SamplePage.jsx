import React from "react";
import { Box, Typography } from "@mui/material";

const SamplePage = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h2" gutterBottom sx={{ fontWeight: "bold" }}>
        Welcome to the IoT Smart Irrigation System
      </Typography>
      <Typography variant="h5">
        This is a sample page. You can add your content here, such as real-time
        graphs, weather maps, or ML predictions.
      </Typography>
    </Box>
  );
};

export default SamplePage;