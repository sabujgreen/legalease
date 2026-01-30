import LawyerProfile from "../models/lawyer/LawyerProfile.model.js";

export const onlyApprovedLawyer = async (req, res, next) => {
  const profile = await LawyerProfile.findOne({
    userId: req.user._id,
  });

  if (!profile) {
    return res.status(403).json({
      message: "Lawyer profile not found",
    });
  }

  if (profile.verificationStatus !== "APPROVED") {
    return res.status(403).json({
      message: "Lawyer not approved yet",
      status: profile.verificationStatus,
    });
  }

  req.lawyerProfile = profile; // attach for later use
  next();
};
