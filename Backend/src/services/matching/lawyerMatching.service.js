import LawyerProfile from "../../models/lawyer/LawyerProfile.model.js";

/**
 * Normalize strings for tolerant matching
 */
const normalize = (str = "") =>
  str.toLowerCase().replace(/\s+/g, "");

/**
 * Get location score based on AI importance
 */
const getLocationScore = (importance, sameState, sameCity) => {
  if (!sameState) return 0;

  if (importance === "High") {
    return sameCity ? 30 : 20;
  }

  if (importance === "Medium") {
    return sameCity ? 20 : 15;
  }

  return 5;
};

export const matchLawyersForCase = async (caseData) => {
  const { aiAnalysis, location: caseLocation } = caseData;

  if (!aiAnalysis || !aiAnalysis.suggestedSpecializations?.length) {
    return [];
  }

  const normalizedAISpecs = aiAnalysis.suggestedSpecializations.map(normalize);

  // 1️⃣ Fetch APPROVED lawyers only
  const lawyers = await LawyerProfile.find({
    verificationStatus: "APPROVED",
  }).populate("userId", "name email");

  const results = [];

  for (const lawyer of lawyers) {
    let score = 0;

    // 2️⃣ Specialization match (AI tolerant)
// 2️⃣ Specialization match (AI tolerant)
    const hasSpecMatch = lawyer.specialization.some((spec) => {
      const normSpec = normalize(spec);
      return normalizedAISpecs.some(
        (aiSpec) =>
          aiSpec.includes(normSpec) || normSpec.includes(aiSpec)
      );
    });

    // 🔴 ADD THIS RIGHT HERE
    if (!hasSpecMatch && aiAnalysis.confidenceScore > 0.7) {
      continue; // skip irrelevant lawyers
    }


    if (hasSpecMatch) score += 40;

    // 3️⃣ Location score (AI weighted)
    const sameState =
      caseLocation?.state &&
      lawyer.location?.state === caseLocation.state;

    const sameCity =
      sameState &&
      caseLocation?.city &&
      lawyer.location?.city === caseLocation.city;

    score += getLocationScore(
      aiAnalysis.locationImportance,
      sameState,
      sameCity
    );

    // 4️⃣ Experience
    if (lawyer.experienceYears >= 5) score += 20;

    // 5️⃣ Availability
    if (lawyer.isAvailable) score += 10;

    // 6️⃣ Urgency boost
    if (aiAnalysis.urgency === "High" && lawyer.isAvailable) {
      score += 10;
    }

    // Ignore low-relevance lawyers
  if (hasSpecMatch && score >= 40) {
    results.push({
      lawyerId: lawyer.userId._id,
      name: lawyer.userId.name,
      email: lawyer.userId.email,
      specialization: lawyer.specialization,
      experienceYears: lawyer.experienceYears,
      score,
      reason: "Matched based on specialization, location, experience, and availability",
    });
  }




    }
  

  // 7️⃣ Sort & return top 5
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
};
