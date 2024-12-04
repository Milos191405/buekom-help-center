import express from "express";
import { signup, login, logout } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { createAdmin, createUser } from "../controllers/admin.controller.js";
import { checkAdmin } from "../middleware/checkAdmin.js";
import { User } from "../models/user.model.js";

const router = express.Router();

// Auth routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Admin creation route (Only authenticated users)
router.post("/admin/create-admin", authenticate, checkAdmin, createAdmin); // Only admins can create other admins

// User creation route (Only admins can create users)
router.post("/admin/create-user", authenticate, checkAdmin, createUser);

// Fetch all users (Only accessible to admin)
router.get("/users", authenticate, checkAdmin, async (req, res) => {
  // Only admins can access users list
  try {
    const users = await User.find().select("-password"); // Exclude password
    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
});

// Profile fetching route (Only authenticated users can fetch their own profile)
router.get("/profile", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// Delete user route (Only admins can delete users)
router.delete(
  "/delete-user/:id",
  authenticate,
  checkAdmin,
  async (req, res) => {
    try {
      // Ensure the requesting user is an admin
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
      console.error("Error deleting user:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  }
);

// Check if an admin exists (for the first admin check)
router.get("/admin/existence", async (req, res) => {
  try {
    const admin = await User.findOne({ role: "admin" });
    res.status(200).json({ exists: !!admin });
  } catch (error) {
    console.error("Error checking for admin existence:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

export default router;
