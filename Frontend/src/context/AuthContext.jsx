import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Check auth status from backend using cookie
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
        setIsAuthenticated(true);
      } catch {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // ✅ Login function - fetch user data after cookie is set
  const login = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Failed to fetch user after login:", err);
      // Still set authenticated since cookie is set
      setIsAuthenticated(true);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // ⛔ Optional: prevent rendering until auth check completes
  if (loading) return null;

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, setUser, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
