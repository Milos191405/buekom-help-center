import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSendCookie } from "../utils/generateToken.js";

// Function to create an admin
export const createAdmin = async (req, res) => {
  console.log("Request Body:", req.body); // Log the request body for debugging
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Please fill in all fields" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Password must be at least 6 characters",
      });
  }

  try {
    // Check if an admin already exists
    const adminExist = await User.findOne({ role: "admin" });

    // If no admin exists, allow creating the first admin without authentication
    if (!adminExist) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
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

      // Save the new admin to the database
      await newAdmin.save();
      console.log("New Admin User Created:", newAdmin); // Log the new user details

      // Generate a token and send cookie
      generateTokenAndSendCookie(res, newAdmin._id, "admin");

      // Send success response without password
      const { password: _, ...userWithoutPassword } = newAdmin._doc;
      return res.status(201).json({ success: true, user: userWithoutPassword });
    }

    // If an admin exists, check if the request comes from an authenticated admin
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({
          success: false,
          message: "Forbidden: You must be an admin to create another admin.",
        });
    }

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
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

    // Save the new admin to the database
    await newAdmin.save();
    console.log("New Admin User Created:", newAdmin); // Log the new user details

    // Generate a token and send cookie
    generateTokenAndSendCookie(res, newAdmin._id, "admin");

    // Send success response without password
    const { password: _, ...userWithoutPassword } = newAdmin._doc;
    return res.status(201).json({ success: true, user: userWithoutPassword });
  } catch (error) {
    console.error("Error in createAdmin controller:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Function to create a user
export const createUser = async (req, res) => {
  // Ensure the requester is an admin
  console.log("Authenticated User Role:", req.user.role);
  if (!req.user || req.user.role !== "admin") {
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
    return res
      .status(400)
      .json({
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

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password for User:", hashedPassword);

    // Create a new user with the specified role
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();
    console.log("New User Created:", newUser);

    // Send success response without password
    const { password: _, ...userWithoutPassword } = newUser._doc;
    return res.status(201).json({ success: true, user: userWithoutPassword });
  } catch (error) {
    console.error("Error in createUser controller:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
