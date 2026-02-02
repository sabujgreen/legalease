import LawyerProfile from "../../models/lawyer/LawyerProfile.model.js";

/**
 * Normalize strings for tolerant matching
 */
const normalize = (str = "") =>
  str.toLowerCase().replace(/\s+/g, "");

/**
 * Map AI specializations to related lawyer specializations
 * This helps match when we don't have exact specialization matches
 */
const getRelatedSpecializations = (aiSpec) => {
  const normalized = normalize(aiSpec);

  // Property/Real Estate → Civil Law
  if (normalized.includes("property") || normalized.includes("realestate") || normalized.includes("land")) {
    return ["civillaw", "generalpractice", "propertylaw"];
  }

  // Family matters → Family Law or General
  if (normalized.includes("family") || normalized.includes("divorce") || normalized.includes("custody")) {
    return ["familylaw", "generalpractice"];
  }

  // Business/Corporate → Corporate Law or General
  if (normalized.includes("corporate") || normalized.includes("business") || normalized.includes("company")) {
    return ["corporatelaw", "generalpractice"];
  }

  // Criminal cases → Criminal Law
  if (normalized.includes("criminal") || normalized.includes("theft") || normalized.includes("assault")) {
    return ["criminallaw", "generalpractice"];
  }

  // Civil disputes → Civil Law
  if (normalized.includes("civil") || normalized.includes("dispute") || normalized.includes("contract")) {
    return ["civillaw", "generalpractice", "civildisputes"];
  }

  // Default: return the normalized spec and general practice
  return [normalized, "generalpractice"];
};

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

  console.log("📋 Case Analysis Data:", {
    aiAnalysis,
    caseLocation,
  });

  if (!aiAnalysis || !aiAnalysis.suggestedSpecializations?.length) {
    console.log("❌ No AI analysis or specializations found");
    return [];
  }

  const normalizedAISpecs = aiAnalysis.suggestedSpecializations.map(normalize);
  console.log("🎯 Normalized AI Specializations:", normalizedAISpecs);

  // 1️⃣ Fetch APPROVED lawyers only
  const lawyers = await LawyerProfile.find({
    verificationStatus: "APPROVED",
  }).populate("userId", "name email");

  console.log(`👨‍⚖️ Found ${lawyers.length} approved lawyers in database`);

  if (lawyers.length > 0) {
    console.log("First lawyer example:", {
      name: lawyers[0].userId?.name,
      specialization: lawyers[0].specialization,
      verificationStatus: lawyers[0].verificationStatus,
    });
  }

  const results = [];

  for (const lawyer of lawyers) {
    let score = 0;

    // 2️⃣ Smart specialization match with related specs
    const hasSpecMatch = lawyer.specialization.some((lawyerSpec) => {
      const normLawyerSpec = normalize(lawyerSpec);

      return normalizedAISpecs.some((aiSpec) => {
        // Direct partial match
        if (aiSpec.includes(normLawyerSpec) || normLawyerSpec.includes(aiSpec)) {
          return true;
        }

        // Check related specializations
        const relatedSpecs = getRelatedSpecializations(aiSpec);
        return relatedSpecs.some(related =>
          related.includes(normLawyerSpec) || normLawyerSpec.includes(related)
        );
      });
    });

    console.log(`🔍 Evaluating: ${lawyer.userId?.name}`, {
      specs: lawyer.specialization,
      hasMatch: hasSpecMatch,
    });

    // Only skip if NO match AND confidence is very high (90%+)
    if (!hasSpecMatch && aiAnalysis.confidenceScore > 0.9) {
      console.log("Skipping - no spec match");
      continue;
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

    console.log(`📊 Score: ${score}, Match: ${hasSpecMatch}`);

    // Lower threshold to match more lawyers
    if (hasSpecMatch && score >= 20) {
      results.push({
        _id: lawyer._id, // ✅ ADD THIS - Lawyer Profile ID for navigation
        lawyerId: lawyer.userId._id,
        name: lawyer.userId.name,
        email: lawyer.userId.email,
        specialization: lawyer.specialization,
        experienceYears: lawyer.experienceYears,
        location: lawyer.location,
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
