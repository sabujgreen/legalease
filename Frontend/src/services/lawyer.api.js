import axios from "axios";

const API_BASE = "http://localhost:5000/api";

export const fetchLawyers = (search = "") => {
  return axios.get(`${API_BASE}/lawyer`, {
    params: { search },
  });
};
