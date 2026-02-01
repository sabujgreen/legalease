import mongoose from "mongoose";

const caseSchema = new mongoose.Schema(
  {
    caseId: {
      type: String,
      unique: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: String,
    description: String,

    location: {
      city: String,
      state: String,
    },

    status: {
      type: String,
      enum: [
        "NEW",
        "AI_PROCESSING",
        "AI_PROCESSED",
        "ASSIGNED",
        "ACCEPTED",
        "REJECTED",
        "CLOSED",
        "AI_FAILED",
      ],
      default: "NEW",
    },

    aiAnalysis: Object,

    aiSuggestions: [
      {
        lawyerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        score: Number,
        reason: String,
      },
    ],

    assignedLawyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    lawyerResponse: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

// Auto-generate caseId before saving
caseSchema.pre("save", function () {
  if (!this.caseId) {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.caseId = `CASE-${timestamp}-${randomStr}`;
  }
});


const Case = mongoose.model("Case", caseSchema);
export default Case;

