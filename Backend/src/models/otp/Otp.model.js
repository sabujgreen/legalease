import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    otp: {
      type: String,
      required: true,
    },

    purpose: {
      type: String,
      enum: ["EMAIL_VERIFICATION", "PASSWORD_RESET"],
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// Auto-delete OTP after expiry (VERY IMPORTANT)
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Otp = mongoose.model("Otp", otpSchema);
export default Otp;
