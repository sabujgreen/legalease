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

    // Personal Information
    mobile: {
      type: String,
      required: true,
      trim: true,
    },

    profilePhoto: {
      type: String, // File path (will be Cloudinary URL later)
      default: null,
    },

    // Professional Details
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

    yearOfEnrollment: {
      type: Number,
      min: 1950,
      max: new Date().getFullYear(),
    },

    experienceYears: {
      type: Number,
      min: 0,
      required: true,
    },

    specialization: {
      type: [String],
      required: true,
    },

    courtsPracticedIn: {
      type: String,
      trim: true,
    },

    // Jurisdiction
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
      jurisdiction: {
        type: String,
        trim: true,
      },
    },

    // Education
    lawDegree: {
      type: String,
      trim: true,
    },

    universityName: {
      type: String,
      trim: true,
    },

    graduationYear: {
      type: Number,
      min: 1950,
      max: new Date().getFullYear(),
    },

    // Additional Information
    professionalBio: {
      type: String,
      trim: true,
    },

    languagesSpoken: {
      type: [String],
      default: [],
    },

    consultationType: {
      type: String,
      enum: ["Online", "In-Person", "Both"],
      default: "Both",
    },

    consultationFee: {
      type: Number,
      min: 0,
    },

    availabilityStatus: {
      type: String,
      enum: ["Available", "Busy", "Not Accepting"],
      default: "Available",
    },

    // Documents (file paths, Cloudinary URLs later)
    barCouncilCertificate: {
      type: String,
      required: true,
    },

    identityProof: {
      type: String,
    },

    degreeCertificate: {
      type: String,
    },

    // Verification
    verificationStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    rejectionReason: {
      type: String,
      default: null,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const LawyerProfile = mongoose.model(
  "LawyerProfile",
  lawyerProfileSchema
);

export default LawyerProfile;
