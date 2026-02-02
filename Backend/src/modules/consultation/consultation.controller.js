import Consultation from "../../models/consultation/Consultation.model.js";

/**
 * Create a consultation request (User only)
 */
export const createConsultation = async (req, res) => {
    try {
        const { lawyerId, caseId, caseType, description } = req.body;

        // Validate required fields
        if (!lawyerId || !caseType || !description) {
            return res.status(400).json({
                message: "lawyerId, caseType, and description are required",
            });
        }

        // Create consultation
        const consultation = await Consultation.create({
            userId: req.user._id,
            lawyerId,
            caseId: caseId || null,
            caseType,
            description,
            status: "PENDING",
        });

        // Populate user and lawyer details
        await consultation.populate("userId", "name email");
        await consultation.populate("lawyerId", "name email");

        res.status(201).json({
            message: "Consultation request sent successfully",
            consultation,
        });
    } catch (error) {
        console.error("Create consultation error:", error);
        res.status(500).json({
            message: "Failed to create consultation request",
            error: error.message,
        });
    }
};

/**
 * Get user's consultation requests
 */
export const getMyConsultations = async (req, res) => {
    try {
        const consultations = await Consultation.find({ userId: req.user._id })
            .populate("lawyerId", "name email")
            .populate("userId", "name email")
            .sort({ createdAt: -1 });

        res.json(consultations);
    } catch (error) {
        console.error("Get my consultations error:", error);
        res.status(500).json({
            message: "Failed to fetch consultations",
            error: error.message,
        });
    }
};

/**
 * Get all consultation cases for a lawyer
 */
export const getLawyerCases = async (req, res) => {
    try {
        const consultations = await Consultation.find({ lawyerId: req.user._id })
            .populate("userId", "name email")
            .sort({ createdAt: -1 });

        res.json(consultations);
    } catch (error) {
        console.error("Get lawyer cases error:", error);
        res.status(500).json({
            message: "Failed to fetch consultation cases",
            error: error.message,
        });
    }
};

/**
 * Update consultation status (Lawyer only)
 */
export const updateConsultationStatus = async (req, res) => {
    try {
        const { consultationId } = req.params;
        const { status } = req.body;

        // Validate status
        const validStatuses = ["PENDING", "ACCEPTED", "DECLINED", "COMPLETED"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
            });
        }

        // Find consultation
        const consultation = await Consultation.findOne({
            consultationId,
            lawyerId: req.user._id,
        });

        if (!consultation) {
            return res.status(404).json({
                message: "Consultation not found or you don't have permission",
            });
        }

        // Validate status transitions
        const currentStatus = consultation.status;

        // Can't change from DECLINED or COMPLETED
        if (currentStatus === "DECLINED" || currentStatus === "COMPLETED") {
            return res.status(400).json({
                message: `Cannot change status from ${currentStatus}`,
            });
        }

        // Can't go from ACCEPTED to PENDING
        if (currentStatus === "ACCEPTED" && status === "PENDING") {
            return res.status(400).json({
                message: "Cannot change status from ACCEPTED to PENDING",
            });
        }

        // Update status
        consultation.status = status;
        await consultation.save();

        await consultation.populate("userId", "name email");

        res.json({
            message: "Consultation status updated successfully",
            consultation,
        });
    } catch (error) {
        console.error("Update consultation status error:", error);
        res.status(500).json({
            message: "Failed to update consultation status",
            error: error.message,
        });
    }
};
