import Otp from "../../models/otp/Otp.model.js";
import User from "../../models/User.model.js";

const OTP_EXPIRY_MINUTES = 10;

/**
 * Generate a 6-digit OTP
 */
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Create & store OTP
 */
export const createOtp = async ({ userId, purpose }) => {
  const otp = generateOtp();

  const expiresAt = new Date(
    Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
  );

  await Otp.create({
    userId,
    otp,
    purpose,
    expiresAt,
  });

  return otp; // email layer will use this
};

/**
 * Verify OTP
 */
export const verifyOtp = async ({ userId, otp, purpose }) => {
  const record = await Otp.findOne({
    userId,
    otp,
    purpose,
  });

  if (!record) return false;

  // Mark user verified
  await User.findByIdAndUpdate(userId, {
    isVerified: true,
  });

  // OTP is one-time use
  await record.deleteOne();

  return true;
};
