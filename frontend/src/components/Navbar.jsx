import React, { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const Navbar = ({ handleSidebarToggle, sidebarOpen }) => {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: "100%",
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        boxShadow: "none",
        borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="toggle sidebar"
          edge="start"
          onClick={handleSidebarToggle}
          sx={{ mr: 2, color: "black" }}
        >
          {sidebarOpen ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
        <Typography variant="h6" noWrap sx={{ flexGrow: 1, color: "black" }}>
          IoT Smart Irrigation System
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;