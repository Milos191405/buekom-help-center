import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import File from "../models/File.js";

const router = express.Router();

// Helper function to extract tags from Markdown content
const extractTagsFromMarkdown = (content) => {
  const tagPattern = /tags:\s*([\s\S]*?)\n\n/; // Match tags section
  const match = content.match(tagPattern);

  if (match && match[1]) {
    return match[1]
      .split("\n")
      .map((tag) => tag.trim().replace(/^-\s*/, "")) // Remove the leading '-'
      .filter((tag) => tag); // Remove any empty strings
  }
  return []; // Return empty array if no tags found
};

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

// Endpoint for uploading multiple files with tags extracted from the .md file
router.post("/", upload.array("files"), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded." });
  }

  try {
    // Process each uploaded file
    for (let file of req.files) {
      const filePath = path.join(process.cwd(), "uploads", file.filename);

      // Read the file content to extract tags
      const data = fs.readFileSync(filePath, "utf8");

      // Extract tags from the .md file content
      const tags = extractTagsFromMarkdown(data);

      // Create a new file entry with tags and metadata
      const newFile = new File({
        filename: file.filename,
        originalName: file.originalname,
        tags: tags, // Store the extracted tags
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Save the file metadata in MongoDB
      await newFile.save();
    }

    // Return a success response with the file names
    res.status(200).json({
      message: "Files uploaded successfully.",
      files: req.files.map((file) => file.filename),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing files." });
  }
});

// Endpoint to retrieve all uploaded files with their tags
router.get("/", async (req, res) => {
  try {
    const files = await File.find();
    res.status(200).json({ files });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving files." });
  }
});

// Endpoint to retrieve a file's content
router.get("/files/:filename", (req, res) => {
  const filePath = path.join(process.cwd(), "uploads", req.params.filename);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: "File not found." });
  }
});

// Endpoint to delete a file and its metadata
router.delete("/:filename", async (req, res) => {
  const filePath = path.join(process.cwd(), "uploads", req.params.filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found." });
  }

  try {
    // Delete the file from the filesystem
    fs.unlinkSync(filePath);

    // Delete the file metadata from MongoDB
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
