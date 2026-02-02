import LawyerProfile from "../../models/lawyer/LawyerProfile.model.js";
import User from "../../models/User.model.js";

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

    // Update user role to LAWYER
    await User.findByIdAndUpdate(user._id, { role: "LAWYER" });

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
    const lawyers = await LawyerProfile.find({
      verificationStatus: "APPROVED",
      isAvailable: true,
    }).populate("userId", "name email");

    res.json(lawyers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch lawyers" });
  }
};
