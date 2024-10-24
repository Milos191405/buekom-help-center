import express from "express";
import { signup, login, logout } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { createAdmin, createUser } from "../controllers/admin.controller.js";
import { checkAdmin } from "../middleware/checkAdmin.js";
import { User } from "../models/user.model.js"; // Import User model

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Admin creation route (Only authenticated users)
router.post("/admin/create-admin", authenticate, createAdmin);

// User creation route (Only admins can create users)
router.post("/admin/create-user", authenticate, checkAdmin, createUser);

// Profile fetching route (Only authenticated users)
router.get("/profile", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;
