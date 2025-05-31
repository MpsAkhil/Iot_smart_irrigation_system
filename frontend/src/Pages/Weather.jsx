import React, { useState } from "react";
import { Box, Typography, Toolbar } from "@mui/material";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const Weather = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const drawerWidth = 240;
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar sidebarOpen={sidebarOpen} handleSidebarToggle={handleSidebarToggle} />
      <Sidebar sidebarOpen={sidebarOpen} handleSidebarToggle={handleSidebarToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${sidebarOpen ? drawerWidth : 0}px)`,
          transition: "width 0.3s ease, margin 0.3s ease",
        }}
      >
        <Toolbar /> {/* Spacing for fixed Navbar */}
        <Typography variant="h2" gutterBottom sx={{ fontWeight: "bold" }}>
          Weather Page
        </Typography>
        <Typography variant="h5">
          This is the weather page of the IoT Smart Irrigation System.
        </Typography>
        <Footer />
      </Box>
    </Box>
  );
};

export default Weather;