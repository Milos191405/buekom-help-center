import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";

// Hash Password Helper
export const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

// Check if Username Exists
export const checkUsernameExists = async (username) => {
  return await User.findOne({ username });
};

// Create New User Helper
export const createNewUser = async (username, password, role) => {
  // Check if the username already exists
  const existingUser = await checkUsernameExists(username);
  if (existingUser) {
    throw new Error("Username already exists");
  }

  // Hash the password
  const hashedPassword = await hashPassword(password);

  // Create a new user
  const newUser = new User({
    username,
    password: hashedPassword,
    role,
  });

  // Save the new user to the database
  await newUser.save();

  return newUser;
};
