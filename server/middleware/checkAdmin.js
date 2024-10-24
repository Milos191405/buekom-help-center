import { User } from "../models/user.model.js";

export const checkAdmin = async (req, res, next) => {
  try {
    console.log("User ID from token:", req.user.id); // Log the user ID from the token

    // Fetch the user from the database
    const user = await User.findById(req.user.id);

    // Check if the user exists
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check the user's role
    if (user.role !== "admin") {
      console.log("Access Denied: User is not an admin."); // Log denial of access
      return res
        .status(403)
        .json({ success: false, message: "Admin access required" });
    }

    // Proceed to the next middleware
    next();
  } catch (err) {
    console.error("Error in checkAdmin middleware:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
