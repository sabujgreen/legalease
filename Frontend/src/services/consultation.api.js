import api from "./api";

/**
 * Request a consultation with a lawyer
 */
export const requestConsultation = (data) => {
    return api.post("/consultation/request", data);
};

/**
 * Get user's consultation requests
 */
export const getMyConsultations = () => {
    return api.get("/consultation/my-requests");
};

/**
 * Get lawyer's consultation cases
 */
export const getLawyerCases = () => {
    return api.get("/consultation/lawyer/cases");
};

/**
 * Update consultation status (lawyer only)
 */
export const updateConsultationStatus = (consultationId, status) => {
    return api.put(`/consultation/${consultationId}/status`, { status });
};
