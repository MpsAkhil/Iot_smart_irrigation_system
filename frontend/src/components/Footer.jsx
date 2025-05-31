import React from "react";
import { Box, Typography, Container } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(10px)",
        borderTop: "1px solid rgba(0, 0, 0, 0.1)",
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="h5" align="center" gutterBottom>
          About Us
        </Typography>
        <Typography variant="body1" align="center">
          We are a team of developers building the future of IoT-based smart
          irrigation systems.
        </Typography>
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          © 2023 IoT Smart Irrigation System. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;