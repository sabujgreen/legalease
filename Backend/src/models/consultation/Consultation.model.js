import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const consultationSchema = new mongoose.Schema(
    {
        consultationId: {
            type: String,
            unique: true,
            default: () => `CONS-${uuidv4().slice(0, 8).toUpperCase()}`,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        lawyerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        caseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Case",
            default: null,
        },
        caseType: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
            minlength: 20,
        },
        status: {
            type: String,
            enum: ["PENDING", "ACCEPTED", "DECLINED", "COMPLETED"],
            default: "PENDING",
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
consultationSchema.index({ lawyerId: 1, status: 1 });
consultationSchema.index({ userId: 1 });

const Consultation = mongoose.model("Consultation", consultationSchema);

export default Consultation;
