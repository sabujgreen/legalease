import Case from "../../models/case/Case.model.js";
import { analyzeCaseWithGroq } from "../../services/ai/groq.service.js";
import { matchLawyersForCase } from "../../services/matching/lawyerMatching.service.js";

export const analyzeCase = async (req, res) => {
  const { caseId } = req.params;

  const caseData = await Case.findOne({
    caseId,
    userId: req.user._id,
  });

  if (!caseData) {
    return res.status(404).json({ message: "Case not found" });
  }

  try {
    // 1️⃣ Run AI analysis
    caseData.status = "AI_PROCESSING";
    await caseData.save();



    const aiResult = await analyzeCaseWithGroq({
      title: caseData.title,
      description: caseData.description,
      location: caseData.location,
    });



    caseData.aiAnalysis = aiResult;
    caseData.status = "AI_PROCESSED";

    // 2️⃣ Run lawyer matching

    const suggestions = await matchLawyersForCase(caseData);


    caseData.aiSuggestions = suggestions;
    await caseData.save();

    res.json({
      message: "AI analysis & lawyer matching completed",
      aiAnalysis: aiResult,
      suggestions,
    });
  } catch (error) {
    console.error("❌ AI Analysis Error:", error);

    caseData.status = "AI_FAILED";
    await caseData.save();

    res.status(500).json({
      message: "AI analysis failed",
      error: error.message,
    });
  }
};
