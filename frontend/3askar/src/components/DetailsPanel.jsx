import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  Divider,
  TextField,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import { API_BASE_URL } from "../services/apiClient";
import { useFiles } from "../context/fileContext";
import { useEffect } from "react";

// --- HELPERS FOR FORMATTING ---
const formatSize = (bytes) => {
  if (bytes === 0 || bytes === undefined) return "0 B";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const val = bytes / Math.pow(1024, i);
  return `${val.toFixed(val >= 10 ? 0 : 1)} ${sizes[i]}`;
};

const formatDate = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
};

const formatType = (file) => {
  if (!file) return "";

  const mime = (file.type || "").toLowerCase();
  const name = (file.name || "").toLowerCase();
  const ext = name.split(".").pop();

  if ((file.type || "").toLowerCase() === "folder") return "Folder";

  if (mime.includes("pdf") || ext === "pdf") return "PDF document";

  if (
    mime.includes("word") ||
    mime.includes("wordprocessing") ||
    ["doc", "docx"].includes(ext)
  ) {
    return "Word document";
  }

  if (
    mime.includes("presentation") ||
    ["ppt", "pptx"].includes(ext)
  ) {
    return "Presentation";
  }

  if (
    mime.includes("spreadsheet") ||
    ["xls", "xlsx", "csv"].includes(ext)
  ) {
    return "Spreadsheet";
  }

  if (mime.startsWith("image/")) return "Image";
  if (mime.startsWith("video/")) return "Video";
  if (mime.startsWith("audio/")) return "Audio";

  return mime || "Unknown type";
};





export default function DetailsPanel({ open, file, onClose, onManageAccess }) {
  if (!file) return null;

  const [description, setDescription] = useState(file.description || "");
  const { refreshFiles } = useFiles();
  const theme = useTheme();

  useEffect(() => {
  setDescription(file.description || "");
  }, [file]);

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const drawerWidth = isMobile ? "100vw" : 360;

  // access data temp until backend is ready
  const accessList = [
    {
      name: file.owner,
      role: "Owner",
      picture: file.ownerPicture || null,
    },
    ...file.sharedWith.map((entry) => ({
      name: entry.name,
      role: entry.permission === "write" ? "Editor" : "Viewer",
      picture: entry.picture,
    })),
];

  // --- FILE ICON LOOKUP ---
  const getFileIcon = (file) => {
    if (file.icon) return file.icon;

    const ext = file.name.split(".").pop().toLowerCase();

    if (ext === "pdf") return "https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_pdf_x16.png";
    if (["doc", "docx"].includes(ext))
      return "https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_word_x16.png";
    if (["xls", "xlsx"].includes(ext))
      return "https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_excel_x16.png";
    if (["ppt", "pptx"].includes(ext))
      return "https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_ppt_x16.png";

    return "https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_generic_x16.png";
  };

  const getInitial = (name) => {


  return name?.charAt(0)?.toUpperCase() || "?";
  };

  
  const handleSaveDescription = async () => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/files/${file.id}/description`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ description }),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to update description");
    }

    const data = await res.json();

    // update UI inside the panel
    setDescription(data.file.description);

    // refresh global file list
    refreshFiles();

  } catch (err) {
    console.error(err);
    alert("Unable to save description.");
  }
};


  return (
    <Drawer
      anchor="right"
      open={open}
      variant="persistent"
      hideBackdrop
      transitionDuration={250}
      PaperProps={{
        sx: {
          width: drawerWidth,
          p: 0,
          mt: 0.5,
          boxSizing: "border-box",
          position: "fixed",
          top: "64px !important",
          height: "calc(100vh - 64px)",
          borderRadius: "16px 0 0 16px",
          overflow: "hidden",
          border: "none",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.25s cubic-bezier(.4,0,.2,1)",
          transform: open ? "translateX(0)" : "translateX(100%)",

        }
      }}
    >

      {/* ---------- HEADER ---------- */}
      <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
        <img
          src={getFileIcon(file)}
          alt="file icon"
          style={{
            width: 32,
            height: 32,
            objectFit: "contain",
            marginRight: 12,
          }}
        />

        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            flexGrow: 1,
            wordBreak: "break-word",
            whiteSpace: "normal",
            lineHeight: 1.2,
          }}
        >
          {file.name}
        </Typography>

        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      {/* ---------- CONTENT ---------- */}
      <Box sx={{ p: 2, overflowY: "auto", flexGrow: 1 }}>
        <Typography sx={{ fontWeight: "bold" }}>Type</Typography>
        <Typography sx={{ mb: 2 }}>{formatType(file)}</Typography>

        <Typography sx={{ fontWeight: "bold" }}>Size</Typography>
        <Typography sx={{ mb: 2 }}>{formatSize(file.size)}</Typography>

        <Typography sx={{ fontWeight: "bold" }}>Location</Typography>
        <Typography sx={{ mb: 2 }}>{file.location}</Typography>

        <Typography sx={{ fontWeight: "bold" }}>Owner</Typography>
        <Typography sx={{ mb: 2 }}>{file.owner}</Typography>

        <Typography sx={{ fontWeight: "bold" }}>Upload Date</Typography>
        <Typography sx={{ mb: 2 }}>{formatDate(file.uploadedAt)}</Typography>

        {/* ACCESS SECTION */}
        <Box sx={{ mt: 3 }}>
          <Typography sx={{ fontWeight: "bold", mb: 1 }}>
            Who has access
          </Typography>

          {/* Users list */}
          {accessList.map((user, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1,
                borderRadius: 2,
                "&:hover": { backgroundColor: "#f8f9fa" },
              }}
            >
              {/* Left: avatar + name */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    backgroundColor: "#e8f0fe",
                    color: "#1a73e8",
                    fontWeight: 600,
                    fontSize: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {getInitial(user.name)}
                </Box>

                <Typography sx={{ fontSize: 15, color: "#202124" }}>
                  {user.name}
                </Typography>
              </Box>

              {/* Right: role */}
              <Typography sx={{ color: "#5f6368", fontSize: 13 }}>
                {user.role}
              </Typography>
            </Box>
          ))}

          {/* Manage access button */}
          <Box
            sx={{
              mt: 2,
              px: 2,
              py: 1,
              width: "fit-content",
              fontWeight: 600,
              borderRadius: 2,
              color: "#1a73e8",
              backgroundColor: "#e8f0fe",
              cursor: "pointer",
              "&:hover": { backgroundColor: "#dbe8fc" },
            }}
            onClick={() =>onManageAccess(file)}
          >
            Manage access
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography sx={{ fontWeight: "bold", mb: 1 }}>Description</Typography>

        <TextField
          fullWidth
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a description"
          sx={{ mb: 1 }}
        />

        <Box
          sx={{
            backgroundColor: "#e8f0fe",
            color: "#1a73e8",
            px: 2,
            py: 1,
            width: "fit-content",
            borderRadius: 2,
            fontWeight: 600,
            cursor: "pointer",
          }}
          onClick={handleSaveDescription}
        >
          Save
        </Box>
      </Box>
    </Drawer>
  );
}
