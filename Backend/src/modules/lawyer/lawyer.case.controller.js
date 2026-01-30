import Case from "../../models/case/Case.model.js";

export const getAssignedCases = async (req, res) => {
  const cases = await Case.find({
    assignedLawyerId: req.user._id,
    status: "ASSIGNED",
  });

  res.json({ cases });
};


export const respondToCase = async (req, res) => {
  const { caseId } = req.params;
  const { action } = req.body; // ACCEPTED or REJECTED

  const caseData = await Case.findOne({
    caseId,
    assignedLawyerId: req.user._id,
  });

  if (!caseData) {
    return res.status(404).json({ message: "Case not found" });
  }

  if (caseData.status !== "ASSIGNED") {
    return res.status(400).json({ message: "Invalid case state" });
  }

  if (action === "ACCEPTED") {
    caseData.status = "ACCEPTED";
    caseData.lawyerResponse = "ACCEPTED";
  } else if (action === "REJECTED") {
    caseData.status = "REJECTED";
    caseData.lawyerResponse = "REJECTED";
    caseData.assignedLawyerId = null;
  } else {
    return res.status(400).json({ message: "Invalid action" });
  }

  await caseData.save();

  res.json({
    message: `Case ${action.toLowerCase()}`,
    status: caseData.status,
  });
};
