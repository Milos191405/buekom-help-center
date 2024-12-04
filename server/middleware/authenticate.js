// Middleware to authenticate the user by verifying the JWT token
export const authenticate = (req, res, next) => {
  let token = req.cookies["jwt-buekom"];

  // If no token is found in cookies, try extracting from Authorization header
  if (!token && req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1]; // Get token from Authorization header
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    // Verify and decode the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user info to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.log("Error in authenticate middleware", error.message);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};
