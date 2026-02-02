import express from "express";
import { applyAsLawyer } from "./lawyer.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";
import { applyLawyerSchema } from "./lawyer.schema.js";
import { onlyApprovedLawyer } from "../../middlewares/lawyer.middleware.js";
import { lawyerDashboard } from "./lawyer.dashboard.controller.js";
import { getAssignedCases, respondToCase } from "./lawyer.case.controller.js";
import { getApprovedLawyers, getLawyerById, getMyProfile, updateLawyerProfile, getMyApplicationStatus } from "./lawyer.controller.js";
import { lawyerRegistrationUpload } from "../../middlewares/upload.middleware.js";




const router = express.Router();

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    return res.status(400).json({ error: err.errors });
  }
};

// Only verified USERS can apply (with file uploads)
router.post(
  "/apply",
  protect,
  allowRoles("USER"),
  lawyerRegistrationUpload,  // ✅ Add multer middleware for file uploads
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

// Get lawyer's own profile
router.get(
  "/my-profile",
  protect,
  allowRoles("LAWYER"),
  getMyProfile
);

// Update lawyer's profile
router.put(
  "/profile",
  protect,
  allowRoles("LAWYER"),
  lawyerRegistrationUpload,
  updateLawyerProfile
);

router.get("/", getApprovedLawyers);
router.get("/:id", getLawyerById);

// Get application status
router.get("/status/application", protect, getMyApplicationStatus);


export default router;
