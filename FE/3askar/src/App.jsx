import { Box } from "@mui/material";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import FileGrid from "./components/FileGrid";
import "./App.css";

export default function App() {
  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f9fafb" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <FileGrid />
      </Box>
    </Box>
  );
}
