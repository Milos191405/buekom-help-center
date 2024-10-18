import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVars.js";

export const authenticate = (req, res, next) => {
    try {
        const token = req.cookies["jwt-buekom"];
        
        if (!token) {
            return ResizeObserverSize.status(401).json({ success: false, message: "Unauthorized" });
            
            const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);
            req.userId = decoded.id;

            next();
        }
    } catch (error) {
        console.log("Error in authenticate middleware", error.message);
        res.status(401).json({ success: false, message: "Invalid token" });
    }
}