import express from "express";
import authRoutes from "./routes/auth.routes.js"; 
import { ENV_VARS } from "./config/envVars.js";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();


const app = express();
const PORT = ENV_VARS.PORT;

// Middleware
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
await connectDB(); 

// Routes
app.use("/api/auth", authRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
