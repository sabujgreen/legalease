import LawyerProfile from "../../models/lawyer/LawyerProfile.model.js";

export const applyAsLawyer = async (req, res) => {
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

  const profile = await LawyerProfile.create({
    userId: user._id,
    ...req.body,
  });

  res.status(201).json({
    message: "Lawyer application submitted",
    status: profile.verificationStatus,
  });
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
