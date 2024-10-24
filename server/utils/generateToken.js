import jwt from "jsonwebtoken"; 

export const generateTokenAndSendCookie = (res, userId, role) => {
  try {
    const token = jwt.sign(
      { id: userId, role:role }, 
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send token in the cookie
    res.cookie("jwt-buekom", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    return token;
  } catch (error) {
    console.error("Error generating token:", error.message);
    throw new Error("Error generating token");
  }
};
