import express from "express";
import { register, login, verifyEmailOtp } from "./auth.controller.js";
import {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
} from "./auth.schema.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    const issues = err?.issues || err?.errors;

    if (Array.isArray(issues) && issues.length > 0) {
      return res.status(400).json({
        message: issues[0].message,
        errors: issues,
      });
    }

    return res.status(400).json({ message: "Invalid request payload" });
  }
};

router.post("/register", validate(registerSchema), register);
router.post("/verify-otp", validate(verifyOtpSchema), verifyEmailOtp);
router.post("/login", validate(loginSchema), login);

// ✅ Auth check (used by frontend AuthContext)
router.get("/me", protect, (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      role: req.user.role,
      email: req.user.email,
      profileImage: req.user.profileImage,
    },
  });
});

// ✅ Logout (clears cookie)
router.post("/logout", (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("token", {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    path: "/",
  });

  res.json({ message: "Logged out successfully" });
});

export default router;
