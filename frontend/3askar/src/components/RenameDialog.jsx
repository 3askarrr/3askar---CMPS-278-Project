import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

function RenameDialog({ open, file, onClose, onSubmit }) {
  const [value, setValue] = React.useState(file?.name || "");

  React.useEffect(() => {
    setValue(file?.name || "");
  }, [file]);

  const handleSubmit = () => {
    if (!value.trim()) return;
    onSubmit(value.trim());
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Rename</DialogTitle>

      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="File name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ mt: 1 }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RenameDialog;
