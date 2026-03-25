import { useState } from "react";
import { registerUser } from "../services/auth.api";
import { useAppContext } from "../context/AppContext";

const RegisterModal = () => {
  const {
    setShowRegister,
    setShowLogin,
    setShowOtp,
    setOtpSource,
    setOtpUserId,
  } = useAppContext();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail || !password) {
      alert("Please fill in name, email, and password.");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      const res = await registerUser({
        name: trimmedName,
        email: trimmedEmail,
        password,
      });

      // store userId for OTP verification
      setOtpUserId(res.data.userId);
      setOtpSource("register");

      // switch modals
      setShowRegister(false);
      setShowOtp(true);

    } catch (e) {
      const backendMessage =
        e.response?.data?.message ||
        e.response?.data?.errors?.[0]?.message ||
        "Registration failed";

      alert(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md bg-white rounded-xl p-6 border border-borderColor relative">

        {/* Close */}
        <button
          onClick={() => setShowRegister(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900">
          Create an Account
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Register to access legal assistance and saved queries.
        </p>

        {/* Form */}
        <div className="mt-6 space-y-4">

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 rounded-lg border border-borderColor focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

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
              placeholder="Create a password (min 8 chars)"
              className="w-full px-4 py-2 rounded-lg border border-borderColor focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Register Button */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full mt-2 px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-dull transition-colors disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register"}
          </button>

        </div>

        {/* Switch */}
        <p className="mt-4 text-sm text-center text-gray-500">
          Already registered?{" "}
          <span
            onClick={goToLogin}
            className="text-primary font-medium cursor-pointer"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
};

export default RegisterModal;
