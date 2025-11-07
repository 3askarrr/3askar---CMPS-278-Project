import { Box, Button, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Add, Folder, Star, Delete } from "@mui/icons-material";

export default function Sidebar() {
  return (
    <Box
      sx={{
        width: 240,
        backgroundColor: "white",
        borderRight: "1px solid #e0e0e0",
        display: "flex",
        flexDirection: "column",
        p: 2,
      }}
    >
      <Button
        variant="contained"
        startIcon={<Add />}
        sx={{
          mb: 2,
          textTransform: "none",
          borderRadius: 10,
          backgroundColor: "#1a73e8",
          "&:hover": { backgroundColor: "#1765cc" },
        }}
      >
        New
      </Button>

      <List>
        <ListItem button>
          <ListItemIcon><Folder /></ListItemIcon>
          <ListItemText primary="My Drive" />
        </ListItem>
        <ListItem button>
          <ListItemIcon><Star /></ListItemIcon>
          <ListItemText primary="Starred" />
        </ListItem>
        <ListItem button>
          <ListItemIcon><Delete /></ListItemIcon>
          <ListItemText primary="Trash" />
        </ListItem>
      </List>
    </Box>
  );
}
