import { User } from "../models/user.model.js"; // Adjust the path as necessary

export const checkAdmin = async (req, res, next) => {
  try {
    // Ensure req.user is populated from your authentication middleware
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Log the user ID and role for debugging
    console.log("User ID from token:", req.user.id);
    console.log("Authenticated User Role:", req.user.role);

    // Fetch the user from the database to check the role
    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if the user's role is "admin"
    if (user.role !== "admin") {
      console.log("Access Denied: User is not an admin."); // Log denial of access
      return res
        .status(403)
        .json({ success: false, message: "Admin access required" });
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error in checkAdmin middleware:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
