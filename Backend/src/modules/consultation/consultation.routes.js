import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";
import {
    createConsultation,
    getMyConsultations,
    getLawyerCases,
    updateConsultationStatus,
} from "./consultation.controller.js";

const router = express.Router();

// User routes
router.post("/request", protect, createConsultation);
router.get("/my-requests", protect, getMyConsultations);

// Lawyer routes
router.get("/lawyer/cases", protect, allowRoles("LAWYER"), getLawyerCases);
router.put(
    "/:consultationId/status",
    protect,
    allowRoles("LAWYER"),
    updateConsultationStatus
);

export default router;
