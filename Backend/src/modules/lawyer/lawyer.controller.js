import LawyerProfile from "../../models/lawyer/LawyerProfile.model.js";

export const applyAsLawyer = async (req, res) => {
  try {
    const user = req.user;

    // Block re-application
    const existingProfile = await LawyerProfile.findOne({
      userId: user._id,
    });

    if (existingProfile) {
      return res
        .status(400)
        .json({ message: "Lawyer application already exists" });
    }

    // Extract file paths from uploaded files
    const files = req.files;
    const filePaths = {
      profilePhoto: files?.profilePhoto?.[0]?.path || null,
      barCouncilCertificate: files?.barCouncilCertificate?.[0]?.path || null,
      identityProof: files?.identityProof?.[0]?.path || null,
      degreeCertificate: files?.degreeCertificate?.[0]?.path || null,
    };

    // Validate required document
    if (!filePaths.barCouncilCertificate) {
      return res.status(400).json({
        message: "Bar Council Certificate is required",
      });
    }

    // Parse arrays from string (if sent as JSON strings from frontend)
    const areasOfPractice = typeof req.body.areasOfPractice === "string"
      ? JSON.parse(req.body.areasOfPractice)
      : req.body.areasOfPractice || [];

    const languagesSpoken = typeof req.body.languagesSpoken === "string"
      ? JSON.parse(req.body.languagesSpoken)
      : req.body.languagesSpoken || [];

    // Create lawyer profile
    const profile = await LawyerProfile.create({
      userId: user._id,

      // Personal Information
      mobile: req.body.mobile,
      profilePhoto: filePaths.profilePhoto,

      // Professional Details
      barRegistrationNumber: req.body.barCouncilNumber,
      barCouncilState: req.body.stateBarCouncil,
      yearOfEnrollment: req.body.yearOfEnrollment ? Number(req.body.yearOfEnrollment) : null,
      experienceYears: req.body.totalExperience ? Number(req.body.totalExperience) : 0,
      specialization: areasOfPractice.length > 0 ? areasOfPractice : ["General Practice"],
      courtsPracticedIn: req.body.courtsPracticedIn || "",

      // Jurisdiction
      location: {
        city: req.body.currentCity || "",
        state: req.body.state || "Not Specified",
        jurisdiction: req.body.jurisdiction || "",
      },

      // Education
      lawDegree: req.body.lawDegree || "",
      universityName: req.body.universityName || "",
      graduationYear: req.body.graduationYear ? Number(req.body.graduationYear) : null,

      // Additional Information
      professionalBio: req.body.professionalBio || "",
      languagesSpoken: languagesSpoken,
      consultationType: req.body.consultationType || "Both",
      consultationFee: req.body.consultationFee ? Number(req.body.consultationFee) : 0,
      availabilityStatus: req.body.availabilityStatus || "Available",

      // Documents
      barCouncilCertificate: filePaths.barCouncilCertificate,
      identityProof: filePaths.identityProof,
      degreeCertificate: filePaths.degreeCertificate,
    });

    // Do not upgrade role yet - wait for admin approval
    // await User.findByIdAndUpdate(user._id, { role: "LAWYER" });

    res.status(201).json({
      message: "Lawyer application submitted successfully",
      status: profile.verificationStatus,
      profileId: profile._id,
    });
  } catch (error) {
    console.error("Lawyer registration error:", error);
    console.error("Error stack:", error.stack);
    console.error("Request body:", req.body);
    console.error("Request files:", req.files);

    res.status(500).json({
      message: "Failed to submit lawyer application",
      error: error.message,
    });
  }
};

export const getApprovedLawyers = async (req, res) => {
  try {
    const { search } = req.query;

    // Build query
    const query = {
      verificationStatus: "APPROVED",
      isAvailable: true,
    };

    // If search term provided, add search conditions
    if (search && search.trim()) {
      const searchRegex = new RegExp(search, "i"); // case-insensitive search

      // Search in multiple fields
      query.$or = [
        { specialization: searchRegex },
        { "location.city": searchRegex },
        { "location.state": searchRegex },
      ];
    }

    const lawyers = await LawyerProfile.find(query).populate("userId", "name email");

    // If searching by name, also filter by populated user name
    let results = lawyers;
    if (search && search.trim()) {
      const searchLower = search.toLowerCase();
      results = lawyers.filter((lawyer) =>
        lawyer.userId.name.toLowerCase().includes(searchLower) ||
        lawyer.specialization.some((spec) => spec.toLowerCase().includes(searchLower)) ||
        lawyer.location.city?.toLowerCase().includes(searchLower) ||
        lawyer.location.state?.toLowerCase().includes(searchLower)
      );
    }

    res.json(results);
  } catch (err) {
    console.error("Failed to fetch lawyers:", err);
    res.status(500).json({ message: "Failed to fetch lawyers" });
  }
};

export const getLawyerById = async (req, res) => {
  try {
    const { id } = req.params;

    const lawyer = await LawyerProfile.findById(id).populate("userId", "name email");

    if (!lawyer) {
      return res.status(404).json({ message: "Lawyer not found" });
    }

    res.json(lawyer);
  } catch (err) {
    console.error("Failed to fetch lawyer:", err);
    res.status(500).json({ message: "Failed to fetch lawyer profile" });
  }
};

/**
 * Get the authenticated lawyer's own profile
 */
export const getMyProfile = async (req, res) => {
  try {
    const lawyerProfile = await LawyerProfile.findOne({ userId: req.user._id }).populate(
      "userId",
      "name email"
    );

    if (!lawyerProfile) {
      return res.status(404).json({ message: "Lawyer profile not found" });
    }

    res.json(lawyerProfile);
  } catch (err) {
    console.error("Failed to fetch my profile:", err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

/**
 * Update the authenticated lawyer's profile
 */
export const updateLawyerProfile = async (req, res) => {
  try {
    const lawyerProfile = await LawyerProfile.findOne({ userId: req.user._id });

    if (!lawyerProfile) {
      return res.status(404).json({ message: "Lawyer profile not found" });
    }

    // Parse array fields if they come as JSON strings
    const areasOfPractice = req.body.specialization
      ? typeof req.body.specialization === "string"
        ? JSON.parse(req.body.specialization)
        : req.body.specialization
      : lawyerProfile.specialization;

    const languagesSpoken = req.body.languagesSpoken
      ? typeof req.body.languagesSpoken === "string"
        ? JSON.parse(req.body.languagesSpoken)
        : req.body.languagesSpoken
      : lawyerProfile.languagesSpoken;

    // Get file paths from multer
    const profilePhoto = req.files?.profilePhoto?.[0]?.path || lawyerProfile.profilePhoto;

    // Update profile fields
    const updatedData = {
      mobile: req.body.mobile || lawyerProfile.mobile,
      profilePhoto,
      barRegistrationNumber: req.body.barRegistrationNumber || lawyerProfile.barRegistrationNumber,
      barCouncilState: req.body.barCouncilState || lawyerProfile.barCouncilState,
      yearOfEnrollment: req.body.yearOfEnrollment
        ? Number(req.body.yearOfEnrollment)
        : lawyerProfile.yearOfEnrollment,
      experienceYears: req.body.experienceYears
        ? Number(req.body.experienceYears)
        : lawyerProfile.experienceYears,
      specialization: areasOfPractice,
      courtsPracticedIn: req.body.courtsPracticedIn || lawyerProfile.courtsPracticedIn,
      location: {
        city: req.body.city || lawyerProfile.location.city,
        state: req.body.state || lawyerProfile.location.state,
        jurisdiction: req.body.jurisdiction || lawyerProfile.location.jurisdiction,
      },
      lawDegree: req.body.lawDegree || lawyerProfile.lawDegree,
      universityName: req.body.universityName || lawyerProfile.universityName,
      graduationYear: req.body.graduationYear
        ? Number(req.body.graduationYear)
        : lawyerProfile.graduationYear,
      professionalBio: req.body.professionalBio || lawyerProfile.professionalBio,
      languagesSpoken,
      consultationType: req.body.consultationType || lawyerProfile.consultationType,
      consultationFee: req.body.consultationFee
        ? Number(req.body.consultationFee)
        : lawyerProfile.consultationFee,
      availabilityStatus: req.body.availabilityStatus || lawyerProfile.availabilityStatus,
    };

    // Update the profile
    const updated = await LawyerProfile.findByIdAndUpdate(
      lawyerProfile._id,
      updatedData,
      { new: true, runValidators: true }
    ).populate("userId", "name email");

    res.json({
      message: "Profile updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error("Failed to update profile:", err);
    res.status(500).json({
      message: "Failed to update profile",
      error: err.message,
    });
  }
};

/**
 * Get current user's lawyer application status
 */
export const getMyApplicationStatus = async (req, res) => {
  try {
    const profile = await LawyerProfile.findOne({ userId: req.user._id });

    if (!profile) {
      return res.json({
        status: "NOT_APPLIED",
        message: "No lawyer application found",
      });
    }

    res.json({
      status: profile.verificationStatus,
      appliedAt: profile.createdAt,
      message: profile.verificationStatus === "PENDING"
        ? "Your application is under review"
        : profile.verificationStatus === "APPROVED"
          ? "Your application has been approved"
          : "Your application has been declined",
    });
  } catch (error) {
    console.error("Error fetching application status:", error);
    res.status(500).json({
      message: "Failed to fetch application status",
      error: error.message,
    });
  }
};

