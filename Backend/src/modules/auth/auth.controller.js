import User from "../../models/User.model.js";
import { createOtp, verifyOtp } from "../../services/otp/otp.service.js";
import { generateToken } from "../../utils/jwt.js";
import { sendEmail } from "../../services/email/email.service.js";

/**
 * Register user
 */
export const register = async (req, res) => {
  const user = await User.create(req.body);


  const otp = await createOtp({
    userId: user._id,
    purpose: "EMAIL_VERIFICATION",
  });

  // Send OTP via email
  await sendEmail({
    to: user.email,
    subject: "LegalEase - Verify Your Email",
    text: `Your verification code is: ${otp}`,
    html: `<p>Your verification code is: <strong>${otp}</strong></p><p>This code expires in 10 minutes.</p>`,
  });



  res.status(201).json({
    message: "User registered. Verify OTP.",
    userId: user._id,
  });
};

/**
 * Verify email via OTP
 */
export const verifyEmailOtp = async (req, res) => {
  const { userId, otp } = req.body;

  const success = await verifyOtp({
    userId,
    otp,
    purpose: "EMAIL_VERIFICATION",
  });

  if (!success) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  const user = await User.findById(userId);

  const token = generateToken({
    id: user._id,
    role: user.role,
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,      // localhost
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // ✅ ADD THIS (7 days)
  });

  res.json({
    message: "Email verified successfully",
    token, // ✅ Return token for Postman/API testing
  });
};


/**
 * Login user
 */


export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user || !user.isVerified) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = generateToken({
    id: user._id,
    role: user.role,
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,      // localhost
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // ✅ ADD THIS (7 days)
  });

  res.json({
    message: "Login successful",
    token, // ✅ Return token for Postman/API testing
  });

};

