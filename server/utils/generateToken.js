import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVars.js";

export const generateTokenAndSendCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "60d",
  });

  // Set cookie
  res.cookie("jwt-buekom", token, {
    maxAge: 60 * 24 * 60 * 60 * 1000, // 60 days
    httpOnly: true, // Prevents XSS attacks
    sameSite: "strict", // CSRF protection
    secure: ENV_VARS.NODE_ENV === "production", // Secure cookies only in production
  });

  return token;
};
