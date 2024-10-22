import express from "express";
import authRoutes from "./routes/auth.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import { ENV_VARS } from "./config/envVars.js";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import path from "path"; // Import path for serving static files

// Load environment variables
dotenv.config();

const app = express();
const PORT = ENV_VARS.PORT || 5000; // Set default port if ENV_VARS is not set

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Allow CORS from the frontend
app.use(express.json());
app.use(cookieParser());

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Connect to MongoDB
await connectDB();

// Define routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/upload", uploadRoutes); // File upload routes

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
