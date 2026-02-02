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
    return res.status(400).json({ error: err.errors });
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
    },
  });
});

// ✅ Logout (clears cookie)
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });

  res.json({ message: "Logged out successfully" });
});

export default router;
