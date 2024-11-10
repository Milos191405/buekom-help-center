import express from "express";
import { createAdmin, createUser } from "../controllers/admin.controller.js"; // Import your controller functions
import { authenticate } from "../middleware/authenticate.js"; // Middleware to check if a user is authenticated
import { checkAdmin } from "../middleware/checkAdmin.js"; // Middleware to check if a user is an admin

const router = express.Router(); // Create a new Express router instance

// Route to create a new admin
// If no admin exists, allows creating the first admin without authentication
router.post("/create-admin", createAdmin);

// Route to create a new user (only accessible to authenticated admin users)
router.post("/create-user", authenticate, checkAdmin, createUser);

// Export the router
export default router;
