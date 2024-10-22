// auth.routes.js
import express from "express";
import { signup, login, logout } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

// User signup route
router.post("/signup", signup);

// User login route
router.post("/login", login);

// User logout route
router.post("/logout", logout);

// User profile route
router.get("/profile", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Export the authentication router
export default router;
