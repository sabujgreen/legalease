export const lawyerDashboard = async (req, res) => {
  res.json({
    message: "Welcome to lawyer dashboard",
    lawyer: {
      id: req.lawyerProfile._id,
      specialization: req.lawyerProfile.specialization,
      experienceYears: req.lawyerProfile.experienceYears,
    },
  });
};


