import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import File from "../models/File.js"; // Import the File model

const router = express.Router();

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir); // Create the uploads directory if it doesn't exist
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Endpoint for uploading multiple files
router.post("/", upload.array("files"), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded." });
  }

  try {
    const fileDocs = req.files.map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
    }));
    await File.insertMany(fileDocs); // Save multiple files in MongoDB

    res.status(200).json({
      message: "Files uploaded successfully.",
      files: req.files.map((file) => file.filename),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving file metadata." });
  }
});

// Endpoint to retrieve all uploaded files
router.get("/", async (req, res) => {
  try {
    const files = await File.find();
    res.status(200).json({ files });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving files." });
  }
});

// Endpoint to serve a file's content
router.get("/files/:filename", (req, res) => {
  const filePath = path.join(process.cwd(), "uploads", req.params.filename);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: "File not found." });
  }
});

// Endpoint to delete a file
router.delete("/:filename", async (req, res) => {
  const filePath = path.join(process.cwd(), "uploads", req.params.filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found." });
  }

  try {
    fs.unlinkSync(filePath);
    const result = await File.deleteOne({ filename: req.params.filename });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "File metadata not found." });
    }

    res.status(200).json({ message: "File deleted successfully." });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ message: "Error deleting file." });
  }
});

export default router;
