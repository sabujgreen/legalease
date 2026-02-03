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
  console.log(`👨‍⚖️ ADMIN APPROVE REQUEST: ID=${id}`);


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

/**
 * Revoke lawyer approval (cancel registration)
 */
export const revokeLawyer = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await LawyerProfile.findById(id);

    if (!profile) {
      return res.status(404).json({ message: "Lawyer not found" });
    }

    if (profile.verificationStatus !== "APPROVED") {
      return res.status(400).json({
        message: "Can only revoke approved lawyers"
      });
    }

    // Update verification status
    profile.verificationStatus = "REJECTED";
    profile.rejectionReason = "Registration cancelled by admin";
    await profile.save();

    // Downgrade user role back to USER
    await User.findByIdAndUpdate(profile.userId, {
      role: "USER",
    });

    res.json({
      message: "Lawyer registration cancelled successfully",
      profile
    });
  } catch (error) {
    console.error("Error revoking lawyer:", error);
    res.status(500).json({
      message: "Failed to revoke lawyer",
      error: error.message,
    });
  }
};

/**
 * Get pending lawyers
 */
export const getPendingLawyers = async (req, res) => {
  try {
    const pendingLawyers = await LawyerProfile.find({
      verificationStatus: "PENDING"
    }).populate("userId", "name email role");

    // Filter out corrupted profiles where user does not exist
    const validPendingLawyers = pendingLawyers.filter(lawyer => lawyer.userId);

    if (pendingLawyers.length !== validPendingLawyers.length) {
      console.warn(`⚠️ Warning: Found ${pendingLawyers.length - validPendingLawyers.length} lawyer profiles with missing User references.`);
    }

    res.json(validPendingLawyers);
  } catch (error) {
    console.error("Error fetching pending lawyers:", error);
    res.status(500).json({
      message: "Failed to fetch pending lawyers",
      error: error.message,
    });
  }
};

/**
 * Get all approved lawyers
 */
export const getApprovedLawyers = async (req, res) => {
  try {
    const approvedLawyers = await LawyerProfile.find({
      verificationStatus: "APPROVED"
    }).populate("userId", "name email role");

    // Filter out corrupted profiles
    const validApprovedLawyers = approvedLawyers.filter(l => l.userId);

    res.json(validApprovedLawyers);
  } catch (error) {
    console.error("Error fetching approved lawyers:", error);
    res.status(500).json({
      message: "Failed to fetch approved lawyers",
      error: error.message,
    });
  }
};

/**
 * Get all rejected lawyers
 */
export const getRejectedLawyers = async (req, res) => {
  try {
    const rejectedLawyers = await LawyerProfile.find({
      verificationStatus: "REJECTED"
    }).populate("userId", "name email role");

    // Filter out corrupted profiles
    const validRejectedLawyers = rejectedLawyers.filter(l => l.userId);

    res.json(validRejectedLawyers);
  } catch (error) {
    console.error("Error fetching rejected lawyers:", error);
    res.status(500).json({
      message: "Failed to fetch rejected lawyers",
      error: error.message,
    });
  }
};
