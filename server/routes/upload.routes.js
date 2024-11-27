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
      .map((tag) => tag.trim().replace(/^-\s*/, "")) // Remove leading '-'
      .filter((tag) => tag); // Remove empty strings
  }
  return [];
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
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Generate a unique filename
  },
});

// Multer upload configuration
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Set max file size to 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["application/pdf", "text/markdown"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type"), false); // Reject file if not allowed type
    }
    cb(null, true); // Accept file if valid
  },
});

// POST: Upload files
router.post("/", upload.array("files"), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded." });
  }

  try {
    const duplicateFiles = [];
    const newFiles = [];

    for (let file of req.files) {
      // Check if the file already exists in the database
      const existingFile = await File.findOne({
        originalName: file.originalname,
      });

      if (existingFile) {
        duplicateFiles.push(file.originalname); // Track duplicate file names
        continue; // Skip processing this file if it's a duplicate
      }

      const filePath = path.join(process.cwd(), "uploads", file.filename);
      let tags = [];
      let firstTag = null;

      if (file.mimetype === "text/markdown") {
        const data = fs.readFileSync(filePath, "utf8");
        tags = extractTagsFromMarkdown(data);
        firstTag = tags[0]; // Get the first tag
      }

      // Create a new file entry in the database
      const newFile = new File({
        filename: file.filename,
        originalName: file.originalname,
        tags: tags,
        firstTag: firstTag, // Store first tag in the database
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await newFile.save(); // Save the file metadata to MongoDB
      newFiles.push(newFile);
    }

    if (duplicateFiles.length > 0) {
      return res.status(400).json({
        message: `The following files already exist: ${duplicateFiles.join(
          ", "
        )}`,
      });
    }

    res.status(200).json({
      message: "Files uploaded successfully.",
      files: newFiles.map((file) => file.filename),
    });
  } catch (error) {
    console.error("Error uploading files:", error);
    res.status(500).json({ message: "Error uploading files." });
  }
});

// GET: Retrieve all uploaded files with tags grouped
router.get("/", async (req, res) => {
  try {
    // Fetch all files, including the updatedAt field
    const files = await File.find(
      {},
      { _id: 0, filename: 1, originalName: 1, tags: 1, updatedAt: 1 }
    );

    // Group files by tags
    const tagDir = {};
    files.forEach((file) => {
      if (file.tags && file.tags.length > 0) {
        file.tags.forEach((tag) => {
          if (!tagDir[tag]) tagDir[tag] = [];
          tagDir[tag].push(file);
        });
      } else {
        if (!tagDir["Untagged"]) tagDir["Untagged"] = [];
        tagDir["Untagged"].push(file);
      }
    });

    res.status(200).json({ tagDir, allTags: Object.keys(tagDir) });
  } catch (error) {
    console.error("Error retrieving files:", error);
    res.status(500).json({ message: "Error retrieving files." });
  }
});

// GET: Retrieve content of a specific file
router.get("/files/:filename", (req, res) => {
  const filePath = path.join(process.cwd(), "uploads", req.params.filename);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath); // Send the file to the client
  } else {
    res.status(404).json({ message: "File not found." });
  }
});

// DELETE: Delete a specific file and its metadata
router.delete("/:filename", async (req, res) => {
  const filePath = path.join(process.cwd(), "uploads", req.params.filename);

  // Check if the file exists in the database first
  const fileInDb = await File.findOne({ filename: req.params.filename });
  if (!fileInDb) {
    return res.status(404).json({ message: "File metadata not found in DB." });
  }

  // Check if the file exists on the filesystem
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found on the server." });
  }

  try {
    fs.unlinkSync(filePath); // Delete the file from the filesystem
    await File.deleteOne({ filename: req.params.filename }); // Delete the file's metadata from DB
    res.status(200).json({ message: "File deleted successfully." });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ message: "Error deleting file." });
  }
});

export default router;
