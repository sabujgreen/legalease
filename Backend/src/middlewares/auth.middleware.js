import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.model.js";

export const protect = async (req, res, next) => {
  try {
    // ✅ Read token from cookie instead of Authorization header
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // attach user to request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
