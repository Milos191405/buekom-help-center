import jwt from "jsonwebtoken";


export const generateTokenAndSendCookie = (res, userId, role) => {
  try {
   
    const token = jwt.sign(
      { id: userId, role },
      process.env.JWT_SECRET, 
      { expiresIn: "1h" } 
    );

    //
    res.cookie("jwt-buekom", token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", 
      sameSite: "Strict", 
      maxAge: 3600000, 
    });

    
    return token;
  } catch (error) {
    console.error("Error generating token:", error.message);
    
    throw new Error("Error generating token");
  }
};
