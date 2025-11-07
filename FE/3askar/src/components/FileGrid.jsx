import { Box, Grid, Paper, Typography } from "@mui/material";

const mockFiles = [
  { name: "Project Proposal.pdf", type: "PDF" },
  { name: "Budget.xlsx", type: "Excel" },
  { name: "Notes.txt", type: "Text" },
  { name: "Presentation.pptx", type: "PowerPoint" },
];

export default function FileGrid() {
  return (
    <Box sx={{ p: 3, overflowY: "auto", flexGrow: 1 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        My Drive
      </Typography>
      <Grid container spacing={2}>
        {mockFiles.map((file, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                cursor: "pointer",
                borderRadius: 3,
                "&:hover": { boxShadow: 3 },
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {file.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {file.type}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
