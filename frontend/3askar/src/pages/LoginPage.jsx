import React from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

const LoginPage = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Paper elevation={3} sx={{ p: 5, textAlign: "center" }}>
        <Typography variant="h5" mb={3}>
          Sign in to 3askar Drive
        </Typography>
        <Button
          variant="contained"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleLogin}
          sx={{
            textTransform: "none",
            backgroundColor: "#4285F4",
            "&:hover": { backgroundColor: "#357ae8" },
          }}
        >
          Continue with Google
        </Button>
      </Paper>
    </Box>
  );
};

export default LoginPage;
