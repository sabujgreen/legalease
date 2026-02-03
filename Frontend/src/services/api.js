import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // ✅ REQUIRED for cookie auth
  headers: {
    "Content-Type": "application/json",
  },
});

// ❌ DO NOT attach Authorization header
// ❌ DO NOT read from localStorage
// Cookie will be sent automatically by browser

export default api;
