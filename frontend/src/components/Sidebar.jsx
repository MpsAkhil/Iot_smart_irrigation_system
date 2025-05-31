import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
} from "@mui/material";
import { Home, Map, Timeline, Person,LocationOn, Memory,Sensors,BarChart } from "@mui/icons-material";
import { Link } from "react-router-dom";

const drawerWidth = 240;

const Sidebar = ({ sidebarOpen, handleSidebarToggle }) => {
  return (
    <Drawer
      variant="temporary"
      open={sidebarOpen}
      onClose={handleSidebarToggle}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          borderRight: "1px solid rgba(0, 0, 0, 0.1)",
          transition: "transform 0.3s ease",
        },
      }}
    >
      <Toolbar />
      <Divider />
      <List>
        {[
          { text: "Home", icon: <Home />, path: "/" },
          { text: "SensorData", icon: <Sensors />, path: "/dash" },
          { text: "Weather-Analytics", icon: <BarChart />, path: "/analytics" },
          { text: "Motor-Prediction", icon: <Memory />, path: "/Time" },
          
          { text: "Mapping", icon: <LocationOn />, path: "/Map" },
          { text: "Profile", icon: <Person />, path: "/profile" },
          
        ].map((item, index) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            onClick={handleSidebarToggle}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;