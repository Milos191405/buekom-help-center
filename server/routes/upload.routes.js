import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import File from "../models/File.js"; // Import your File model

const router = express.Router();

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), "uploads");
    // Create the uploads directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Create a unique filename using timestamp and random number
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Initialize multer with the defined storage
const upload = multer({ storage });

// Endpoint for uploading a single file
router.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  try {
    // Create a new file document
    const newFile = new File({
      filename: req.file.filename, // File name saved in the uploads folder
      originalName: req.file.originalname, // Original file name uploaded by the user
    });

    // Save the file document to MongoDB
    await newFile.save();

    res.status(200).json({
      message: "File uploaded successfully.",
      file: req.file.filename, // Respond with the filename
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving file metadata." });
  }
});

// Endpoint to retrieve uploaded files
router.get("/", async (req, res) => {
  try {
    const files = await File.find(); // Fetch all files from the database
    res.status(200).json({ files });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving files." });
  }
});

// Endpoint to serve the uploaded files
router.get("/files/:filename", (req, res) => {
  const fileName = req.params.filename; // Get the filename from the request parameters
  const filePath = path.join(process.cwd(), "uploads", fileName); // Construct the file path

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Send the file to the client
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: "File not found." });
  }
});

// Export the upload router
export default router;
