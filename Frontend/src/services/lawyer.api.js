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
