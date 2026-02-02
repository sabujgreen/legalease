import axios from "axios";
import api from "./api.js";

const API_BASE = "http://localhost:5000/api";

export const fetchLawyers = (search = "") => {
  return axios.get(`${API_BASE}/lawyer`, {
    params: { search },
  });
};

/**
 * Register as a lawyer with form data and document uploads
 * @param {FormData} formData - Form data with all lawyer info and files
 * @returns {Promise<object>} Registration response
 */
export const registerLawyer = async (formData) => {
  const response = await api.post("/lawyer/apply", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * Fetch lawyer by ID
 * @param {string} id - Lawyer profile ID
 * @returns {Promise<object>} Lawyer profile data
 */
export const fetchLawyerById = (id) => {
  return axios.get(`${API_BASE}/lawyer/${id}`);
};

/**
 * Get authenticated lawyer's own profile
 * @returns {Promise<object>} Lawyer profile data
 */
export const getMyProfile = () => {
  return api.get("/lawyer/my-profile");
};

/**
 * Update authenticated lawyer's profile
 * @param {FormData} formData - Updated profile data
 * @returns {Promise<object>} Updated profile data
 */
export const updateLawyerProfile = (formData) => {
  return api.put("/lawyer/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * Check if current user has a lawyer profile (pending or approved)
 * @returns {Promise<object>} Status object with verificationStatus
 */
export const checkLawyerStatus = () => {
  return api.get("/lawyer/my-profile");
};
