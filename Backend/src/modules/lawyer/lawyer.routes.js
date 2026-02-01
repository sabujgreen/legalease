import express from "express";
import { applyAsLawyer } from "./lawyer.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";
import { applyLawyerSchema } from "./lawyer.schema.js";
import { onlyApprovedLawyer } from "../../middlewares/lawyer.middleware.js";
import { lawyerDashboard } from "./lawyer.dashboard.controller.js";
import {  getAssignedCases, respondToCase} from "./lawyer.case.controller.js";
import { getApprovedLawyers } from "./lawyer.controller.js";




const router = express.Router();

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    return res.status(400).json({ error: err.errors });
  }
};

// Only verified USERS can apply
router.post(
  "/apply",
  protect,
  allowRoles("USER"),
  validate(applyLawyerSchema),
  applyAsLawyer
);
router.get(
  "/dashboard",
  protect,
  allowRoles("LAWYER"),
  onlyApprovedLawyer,
  lawyerDashboard
);

router.get(
  "/cases",
  protect,
  allowRoles("LAWYER"),
  getAssignedCases
);

router.post(
  "/cases/:caseId/respond",
  protect,
  allowRoles("LAWYER"),
  respondToCase
);


router.get("/", getApprovedLawyers);


export default router;
