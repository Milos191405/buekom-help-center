import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const token = req.cookies["jwt-buekom"];

  // Log the cookie for debugging
  console.log("Received Token in Cookies:", token);

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    // Verify and decode the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Log the decoded token for debugging
    console.log("Decoded JWT:", decoded);

    // Attach the decoded token's data (user ID, role, etc.) to the request object
    req.user = decoded;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.log("Error in authenticate middleware", error.message);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};
