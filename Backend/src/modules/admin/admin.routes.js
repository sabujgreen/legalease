import express from "express";
import {
  getLawyerApplications,
  approveLawyer,
  rejectLawyer,
  revokeLawyer,
  getPendingLawyers,
  getApprovedLawyers,
  getRejectedLawyers,
} from "./admin.controller.js";

import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

const router = express.Router();

// ADMIN only - Specific routes MUST come before general routes

// Debug all admin requests
router.use((req, res, next) => {
  console.log(`🔎 ADMIN ROUTER HIT: ${req.method} ${req.url}`);
  next();
});

// Get pending lawyers (specific route)
router.get(
  "/lawyers/pending",
  protect,
  allowRoles("ADMIN"),
  getPendingLawyers
);

// Get approved lawyers (specific route)
router.get(
  "/lawyers/approved",
  protect,
  allowRoles("ADMIN"),
  getApprovedLawyers
);

// Get rejected lawyers (specific route)
router.get(
  "/lawyers/rejected",
  protect,
  allowRoles("ADMIN"),
  getRejectedLawyers
);

// Get all lawyers (general route)
router.get(
  "/lawyers",
  protect,
  allowRoles("ADMIN"),
  getLawyerApplications
);

router.put(
  "/lawyers/:id/approve",
  protect,
  allowRoles("ADMIN"),
  approveLawyer
);

router.put(
  "/lawyers/:id/decline",
  protect,
  allowRoles("ADMIN"),
  rejectLawyer
);

// Revoke lawyer approval
router.patch(
  "/lawyers/:id/revoke",
  protect,
  allowRoles("ADMIN"),
  revokeLawyer
);

export default router;
