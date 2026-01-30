import Case from "../../models/case/Case.model.js";

export const createCase = async (req, res) => {
  const newCase = await Case.create({
    userId: req.user._id,
    ...req.body,
  });

  res.status(201).json({
    message: "Case submitted successfully",
    caseId: newCase.caseId,
    status: newCase.status,
  });
};


/**
 * Get all cases of logged-in user
 */
export const getMyCases = async (req, res) => {
  const cases = await Case.find({ userId: req.user._id })
    .select("caseId title status createdAt")
    .sort({ createdAt: -1 });

  res.json(cases);
};

/**
 * Get single case by Case ID
 */
export const getCaseByCaseId = async (req, res) => {
  const { caseId } = req.params;

  const caseData = await Case.findOne({
    caseId,
    userId: req.user._id,
  });

  if (!caseData) {
    return res.status(404).json({ message: "Case not found" });
  }

  res.json(caseData);
};
