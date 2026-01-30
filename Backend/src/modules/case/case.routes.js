import express from "express";
import { createCase, getMyCases, getCaseByCaseId } from "./case.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { createCaseSchema } from "./case.schema.js";
import { analyzeCase } from "./case.ai.controller.js";
import { assignLawyerToCase } from "./case.assignment.controller.js";
import { allowRoles } from "../../middlewares/role.middleware.js";





const router = express.Router();

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    return res.status(400).json({ error: err.errors });
  }
};

// USER submits case
router.post(
  "/",
  protect,
  validate(createCaseSchema),
  createCase
);

// Get all cases of logged-in user
router.get(
  "/my",
  protect,
  getMyCases
);

// Get case details by Case ID
router.get(
  "/:caseId",
  protect,
  getCaseByCaseId
);

// Trigger AI analysis
router.post(
  "/:caseId/analyze",
  protect,
  analyzeCase
);

router.post(
  "/:caseId/assign",
  protect,
  allowRoles("USER"),
  assignLawyerToCase
);


export default router;
