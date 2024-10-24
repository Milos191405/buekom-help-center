import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSendCookie } from "../utils/generateToken.js";

// Function to create an admin
export const createAdmin = async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Please fill in all fields" });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters",
    });
  }

  try {
    const existingAdmin = await User.findOne({ username });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password:", hashedPassword); // Log hashed password

    // Create a new admin user
    const newAdmin = new User({
      username,
      password: hashedPassword,
      role: "admin",
    });

    await newAdmin.save();
    console.log("New Admin User Created:", newAdmin); // Log the new user details

    // Optionally generate a token and send cookie
    generateTokenAndSendCookie(res, newAdmin._id, "admin");

    // Send success response with user data (without password)
    const { password: _, ...userWithoutPassword } = newAdmin._doc;
    res.status(201).json({ success: true, user: userWithoutPassword });
  } catch (error) {
    console.error("Error in createAdmin controller:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Function to create a user
export const createUser = async (req, res) => {
  // Ensure the requester is an admin
  console.log("Authenticated User Role:", req.user.role); // Log the role for debugging
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  const { username, password, role } = req.body;

  // Validate input
  if (!username || !password || !role) {
    return res
      .status(400)
      .json({ success: false, message: "Please fill in all fields" });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters",
    });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hashing the password
    console.log("Hashed Password for User:", hashedPassword); // Log hashed password

    // Create a new user with the specified role
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();
    console.log("New User Created:", newUser); // Log the new user details

    // Optionally generate a token and send cookie if needed
    generateTokenAndSendCookie(res, newUser._id);

    // Send success response with user data (without password)
    const { password: _, ...userWithoutPassword } = newUser._doc;
    res.status(201).json({ success: true, user: userWithoutPassword });
  } catch (error) {
    console.error("Error in createUser controller:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
