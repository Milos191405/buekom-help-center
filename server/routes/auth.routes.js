
// auth.routes.js
import express, { application } from "express";
import { signup, login, logout } from "../controllers/auth.controller.js"; // Import auth controller functions
import { authenticate } from "../middleware/authenticate.js";
import { createAdmin, createUser } from "../controllers/admin.controller.js";
import { checkAdmin } from "../middleware/checkAdmin.js";
import { User } from "../models/user.model.js"; // Import User model

const router = express.Router(); // Create a new router instance

// Auth routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Admin creation route (Only authenticated users)
router.post("/admin/create-admin", authenticate, createAdmin);

// User creation route (Only admins can create users)
router.post("/admin/create-user", authenticate, checkAdmin, createUser);

// Fetch all users (Only accessible to admin)
router.get("/users", authenticate, async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user.id);

    if (requestingUser.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized." });
    }

    // Fetch all users, excluding sensitive information like passwords
    const users = await User.find().select("-password");
    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// Profile fetching route (Only authenticated users)
router.get("/profile", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

router.delete("/delete-user/:id", authenticate, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized request" });
    }

    const requestingUser = await User.findById(req.user.id);
    if (!requestingUser || requestingUser.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized." });
    }

    // Logging user to delete and requesting user info for troubleshooting
    console.log("Requesting Admin User:", requestingUser);
    console.log("User to Delete ID:", req.params.id);

    // Directly find and delete user
    const userToDelete = await User.findByIdAndDelete(req.params.id);
    if (!userToDelete) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user at user ID:", req.params.id, error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

router.get("/admin/existence", async (req, res) => {
  try {
    const admin = await User.findOne({ role: "admin" }); 
    res.setHeader("Content-Type", "application/json");
    res.json({ exists: !!admin });
  } catch (error) {
    console.error("Error checking for admin existence:", error);
    res.status(500).json({ error: "Server error" });
  }
});



export default router; // Export the router
