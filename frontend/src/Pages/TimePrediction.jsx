import React, { useState } from "react";
import { Box, Typography, Toolbar } from "@mui/material";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Lstm from "../components/time";

const Predictions = () => {
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
        <Lstm />
      </Box>
    </Box>
  );
};

export default Predictions;