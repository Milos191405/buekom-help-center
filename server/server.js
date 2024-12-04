import express from "express";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Set up CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://buekom-help-center.onrender.com",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"), false);
    }
  },
  credentials: true,
};

// Middleware setup
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Connect to MongoDB and start the server
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const startServer = async () => {
  try {
    await connectDB();

    // Define API routes
    app.use("/api/auth", authRoutes);
    app.use("/api/upload", uploadRoutes);
    app.use("/api/admin", adminRoutes);

    // Serve static files for React app
    app.use(express.static(path.join(__dirname, "..", "client", "build")));

    // Fallback route for React SPA
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
    });

    // Start listening
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error.message);
    process.exit(1); // Exit on failure
  }
};

startServer();
