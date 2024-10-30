// controllers/user.controller.js

import { User } from "../models/user.model.js";

// Get User Details
export const getUserDetails = async (req, res) => {
  try {
    const userId = req.user._id; 

    const user = await User.findById(userId).select("-password"); // Exclude password from response
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error in getUserDetails controller:", error.message);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// You can add more user-specific functionalities as needed
