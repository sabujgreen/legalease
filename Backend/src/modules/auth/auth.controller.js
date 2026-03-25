import User from "../../models/User.model.js";
import { createOtp, verifyOtp } from "../../services/otp/otp.service.js";
import { generateToken } from "../../utils/jwt.js";
import { sendEmail } from "../../services/email/email.service.js";

/**
 * Register user
 */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(409).json({ message: "Email is already registered. Please login." });
      }

      // Keep unverified account details fresh and resend OTP.
      existingUser.name = name;
      existingUser.password = password;
      await existingUser.save();

      const otp = await createOtp({
        userId: existingUser._id,
        purpose: "EMAIL_VERIFICATION",
      });

      await sendEmail({
        to: existingUser.email,
        subject: "LegalEase - Verify Your Email",
        text: `Your verification code is: ${otp}`,
        html: `<p>Your verification code is: <strong>${otp}</strong></p><p>This code expires in 10 minutes.</p>`,
      });

      return res.status(200).json({
        message: "Account exists but is not verified. A new OTP has been sent.",
        userId: existingUser._id,
      });
    }

    const user = await User.create({ name, email: normalizedEmail, password });


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



    return res.status(201).json({
      message: "User registered. Verify OTP.",
      userId: user._id,
    });
  } catch (error) {
    if (error?.code === "EMAIL_CONFIG_MISSING") {
      return res.status(503).json({
        message: "OTP email service is not configured. Please contact support.",
      });
    }

    if (error?.code === "EMAIL_SEND_FAILED") {
      return res.status(502).json({
        message: "Unable to deliver OTP email right now. Please try again.",
      });
    }

    // Map common DB errors to user-friendly HTTP responses.
    if (error?.code === 11000 && error?.keyPattern?.email) {
      return res.status(409).json({
        message: "Email is already registered. Please login.",
      });
    }

    if (error?.name === "ValidationError") {
      const firstMessage = Object.values(error.errors || {})[0]?.message;
      return res.status(400).json({
        message: firstMessage || "Invalid registration data.",
      });
    }

    console.error("Registration error:", {
      name: error?.name,
      message: error?.message,
      code: error?.code,
      stack: error?.stack,
    });

    return res.status(500).json({
      message: "Registration failed. Please try again.",
    });
  }
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
    secure: true,      // localhost
    sameSite: "none",
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
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail }).select("+password");

    if (!user) {
      return res.status(400).json({
        message:
          process.env.NODE_ENV === "production"
            ? "Invalid credentials"
            : "No account found for this email",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Email not verified. Please verify OTP first.",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        message:
          process.env.NODE_ENV === "production"
            ? "Invalid credentials"
            : "Incorrect password",
      });
    }

    const token = generateToken({
      id: user._id,
      role: user.role,
    });

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login error:", {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
    });

    return res.status(500).json({ message: "Login failed. Please try again." });
  }

};

