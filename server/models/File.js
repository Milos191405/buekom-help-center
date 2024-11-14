// File.js
import mongoose from "mongoose";

// Define the schema for storing file metadata
const fileSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
      unique: true, // Ensure filename uniqueness
    },
    originalName: {
      type: String,
      required: true,
    },
    tags: {
      type: [String], 
      default:[], 
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt timestamps
  }
);

// Create a Mongoose model for the file schema
const File = mongoose.model("File", fileSchema);

// Export the File model
export default File;
