import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { generateTokenAndSendCookie } from "../utils/generateToken.js";

// Sign Up Function
export async function signup(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill in all fields." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password must be at least 6 characters long.",
        });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    generateTokenAndSendCookie(res, newUser._id);

    const { password: _, ...userWithoutPassword } = newUser._doc;
    res.status(201).json({ success: true, user: userWithoutPassword });
  } catch (error) {
    console.error("Error in signup controller:", error.message);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
}

// Login Function
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill in all fields." });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });
    }

    await generateTokenAndSendCookie(res, user._id, user.role);

    const { password: _, ...userWithoutPassword } = user._doc;
    res.status(200).json({ success: true, user: userWithoutPassword });
  } catch (error) {
    console.error("Error in login controller:", error.message);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Logout Function
export const logout = async (_, res) => {
  try {
    res.clearCookie("jwt-buekom");
    return res.status(200).json({ success: true, message: "Logged out." });
  } catch (error) {
    console.error("Error in logout controller:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};
