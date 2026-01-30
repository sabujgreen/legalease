import mongoose from "mongoose";

const lawyerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    barRegistrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    barCouncilState: {
      type: String,
      required: true,
      trim: true,
    },

    specialization: {
      type: [String],
      required: true,
    },

    experienceYears: {
      type: Number,
      min: 0,
      required: true,
    },

    location: {
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
        required: true,
      },
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    verificationStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    rejectionReason: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const LawyerProfile = mongoose.model(
  "LawyerProfile",
  lawyerProfileSchema
);

export default LawyerProfile;
