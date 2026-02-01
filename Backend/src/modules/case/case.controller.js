import Case from "../../models/case/Case.model.js";

export const createCase = async (req, res) => {
  try {
    const newCase = await Case.create({
      userId: req.user._id,
      ...req.body,
    });

    res.status(201).json({
      message: "Case submitted successfully",
      caseId: newCase.caseId,
      status: newCase.status,
    });
  } catch (error) {
    console.error("Create case error:", error);

    res.status(400).json({
      message: "Failed to create case",
      error: error.message,
    });
  }
};



/**
 * Get all cases of logged-in user
 */
export const getMyCases = async (req, res) => {
  try {
    const cases = await Case.find({ userId: req.user._id })
      .select("caseId title status createdAt")
      .sort({ createdAt: -1 });

    res.json(cases);
  } catch (error) {
    console.error("Error fetching cases:", error);
    res.status(500).json({ message: "Failed to fetch cases", error: error.message });
  }
};

/**
 * Get single case by Case ID
 */
export const getCaseByCaseId = async (req, res) => {
  try {
    const { caseId } = req.params;

    const caseData = await Case.findOne({
      caseId,
      userId: req.user._id,
    });

    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }

    res.json(caseData);
  } catch (error) {
    console.error("Error fetching case:", error);
    res.status(500).json({ message: "Failed to fetch case", error: error.message });
  }
};
