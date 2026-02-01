import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";

const OtpModal = () => {
  const {
    setShowOtp,
    setShowRegister,
    setShowLogin,
    otpSource,
  } = useAppContext();

  const [timer, setTimer] = useState(60);
  const [otp, setOtp] = useState("");

  // Countdown timer
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = () => {
    setTimer(60);
    // later: resend OTP API
  };

  const handleBack = () => {
    setShowOtp(false);

    if (otpSource === "register") {
      setShowRegister(true);
    } else if (otpSource === "forgot") {
      setShowLogin(true); // later replace with Forgot modal
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md bg-white rounded-xl p-6 border border-borderColor relative">

        {/* Back */}
        <button
          onClick={handleBack}
          className="text-sm text-primary font-medium mb-4"
        >
          ← Back
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900">
          Verify OTP
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Enter the 6-digit OTP sent to your email.
        </p>

        {/* OTP Input */}
        <input
          type="text"
          maxLength="6"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="mt-6 w-full px-4 py-3 text-center tracking-widest text-lg rounded-lg border border-borderColor focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {/* Verify Button */}
        <button
          className="w-full mt-6 px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-dull transition-colors"
        >
          Verify OTP
        </button>

        {/* Resend */}
        <div className="mt-4 text-center text-sm text-gray-500">
          {timer > 0 ? (
            <span>Resend OTP in {timer}s</span>
          ) : (
            <button
              onClick={handleResend}
              className="text-primary font-medium"
            >
              Resend OTP
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default OtpModal;
