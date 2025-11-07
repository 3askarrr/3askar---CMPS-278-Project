import { AppBar, Toolbar, Typography, InputBase, Box } from "@mui/material";
import { Search } from "@mui/icons-material";

export default function Navbar() {
  return (
    <AppBar position="static" sx={{ backgroundColor: "white", color: "black", boxShadow: 1 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: "bold", mr: 3 }}>
          Drive
        </Typography>
        <Box sx={{ position: "relative", flexGrow: 1, maxWidth: 500 }}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: 8,
              transform: "translateY(-50%)",
              color: "gray",
            }}
          >
            <Search />
          </Box>
          <InputBase
            placeholder="Search in Drive"
            sx={{
              width: "100%",
              pl: 5,
              pr: 2,
              py: 0.5,
              borderRadius: 2,
              backgroundColor: "#f1f3f4",
            }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
