import Case from "../../models/case/Case.model.js";

export const assignLawyerToCase = async (req, res) => {
  const { caseId } = req.params;
  const { lawyerId } = req.body;

  const caseData = await Case.findOne({
    caseId,
    userId: req.user._id,
  });

  if (!caseData) {
    return res.status(404).json({ message: "Case not found" });
  }

  if (caseData.status !== "AI_PROCESSED") {
    return res
      .status(400)
      .json({ message: "Case not ready for assignment" });
  }

  const isSuggested = caseData.aiSuggestions.some(
    (s) => s.lawyerId.toString() === lawyerId
  );

  if (!isSuggested) {
    return res
      .status(400)
      .json({ message: "Lawyer not in suggestion list" });
  }

  caseData.assignedLawyerId = lawyerId;
  caseData.status = "ASSIGNED";
  caseData.lawyerResponse = "PENDING";

  await caseData.save();

  res.json({
    message: "Lawyer assigned successfully",
    caseId,
    lawyerId,
    status: caseData.status,
  });
};
