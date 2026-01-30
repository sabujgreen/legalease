import express from "express";
import {
  getLawyerApplications,
  approveLawyer,
  rejectLawyer,
} from "./admin.controller.js";

import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

const router = express.Router();

// ADMIN only
router.get(
  "/lawyers",
  protect,
  allowRoles("ADMIN"),
  getLawyerApplications
);

router.patch(
  "/lawyers/:id/approve",
  protect,
  allowRoles("ADMIN"),
  approveLawyer
);

router.patch(
  "/lawyers/:id/reject",
  protect,
  allowRoles("ADMIN"),
  rejectLawyer
);

export default router;
