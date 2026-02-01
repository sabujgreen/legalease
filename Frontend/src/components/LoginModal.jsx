import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { loginUser } from "../services/auth.api";
import { useAuth } from "../context/AuthContext";

const LoginModal = () => {
  const { login } = useAuth();
  const { setShowLogin, setShowRegister } = useAppContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      await loginUser({
        email,
        password,
      });

      // Cookie is set by backend, now fetch user data
      await login();
      setShowLogin(false);

    } catch (e) {
      alert(e.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md bg-white rounded-xl p-6 border border-borderColor relative">

        {/* Close */}
        <button
          onClick={() => setShowLogin(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900">
          Login to LegalEase
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Access legal assistance and saved queries.
        </p>

        {/* Form */}
        <div className="mt-6 space-y-4">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg border border-borderColor focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 rounded-lg border border-borderColor focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full mt-2 px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-dull transition-colors disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        {/* Switch */}
        <p className="mt-4 text-sm text-center text-gray-500">
          Don’t have an account?{" "}
          <span
            onClick={() => {
              setShowLogin(false);
              setShowRegister(true);
            }}
            className="text-primary font-medium cursor-pointer"
          >
            Register
          </span>
        </p>

      </div>
    </div>
  );
};

export default LoginModal;
