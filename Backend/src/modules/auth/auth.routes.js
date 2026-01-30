import express from "express";
import { register, login, verifyEmailOtp } from "./auth.controller.js";
import {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
} from "./auth.schema.js";

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

export default router;
