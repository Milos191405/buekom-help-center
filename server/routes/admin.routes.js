import express from "express";
import { createAdmin, createUser } from "../controllers/admin.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { checkAdmin } from "../middleware/checkAdmin.js";

const router = express.Router();

// Route to create a new admin (only allowed if no admin exists)
// If no admin exists, this is the only route for creating an admin
router.post("/create-admin", authenticate, checkAdmin, createAdmin); // Ensure only admin can create another admin

// Route to create a new user (only accessible to authenticated admin users)
router.post("/create-user", authenticate, checkAdmin, createUser);

export default router;
