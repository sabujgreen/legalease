import LawyerProfile from "../../models/lawyer/LawyerProfile.model.js";
import User from "../../models/User.model.js";

/**
 * Get all lawyer applications
 */
export const getLawyerApplications = async (req, res) => {
  const applications = await LawyerProfile.find().populate(
    "userId",
    "name email role"
  );

  res.json(applications);
};

/**
 * Approve lawyer
 */
export const approveLawyer = async (req, res) => {
  const { id } = req.params;

  const profile = await LawyerProfile.findById(id);

  if (!profile) {
    return res.status(404).json({ message: "Lawyer application not found" });
  }

  profile.verificationStatus = "APPROVED";
  profile.rejectionReason = null;
  await profile.save();

  // Upgrade user role
  await User.findByIdAndUpdate(profile.userId, {
    role: "LAWYER",
  });

  res.json({ message: "Lawyer approved successfully" });
};

/**
 * Reject lawyer
 */
export const rejectLawyer = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  const profile = await LawyerProfile.findById(id);

  if (!profile) {
    return res.status(404).json({ message: "Lawyer application not found" });
  }

  profile.verificationStatus = "REJECTED";
  profile.rejectionReason = reason || "Not specified";
  await profile.save();

  res.json({ message: "Lawyer rejected" });
};
