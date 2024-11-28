import express from "express";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import { connectDB } from "./config/db.js"; // Import the connectDB function
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import path from "path"; // Import path for serving static files

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; // Set default port if ENV_VARS is not set

// Define allowed origins (local and production frontends)
const allowedOrigins = [
  "http://localhost:5173", // Local development frontend
  "https://buekom-help-center.onrender.com", // Production frontend
  // Add other environments as needed
];

// Configure CORS middleware
const corsOptions = {
  origin: function (origin, callback) {
    // Allow the request if the origin is in the allowed list, or if the origin is undefined (for local dev)
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"), false);
    }
  },
  credentials: true, // Allow cookies (JWT tokens) to be sent
};

// Use CORS middleware with the defined options
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Main async function to start the server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Define routes
    app.use("/api/auth", authRoutes); // Authentication routes
    app.use("/api/upload", uploadRoutes); // File upload routes
    app.use("/api/admin", adminRoutes); // Admin routes (protected by JWT)

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error.message);
    process.exit(1); // Exit the process with a failure code
  }
};

// Invoke the function to start the server
startServer();
