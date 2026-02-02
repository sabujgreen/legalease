import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.model.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // ✅ Check for token in cookie (for browser) OR Authorization header (for Postman/API)
    if (req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    console.log("🔐 AUTH DEBUG:");
    console.log("  Token exists:", !!token);
    if (token) {
      console.log("  Token preview:", token.substring(0, 30) + "...");
    }

    if (!token) {
      console.log("  ❌ No token provided");
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    const decoded = verifyToken(token);
    console.log("  ✅ Token decoded:", { id: decoded.id });

    const user = await User.findById(decoded.id);
    console.log("  ✅ User found:", {
      id: user?._id,
      name: user?.name,
      role: user?.role
    });

    if (!user) {
      console.log("  ❌ User not found in database");
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // attach user to request
    next();
  } catch (error) {
    console.error("  ❌ Auth error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
