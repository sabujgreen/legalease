import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {

  const [showLogin, setShowLogin] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [otpSource, setOtpSource] = useState(null); 
  const [otpUserId, setOtpUserId] = useState(null);





  const value = {
    showLogin,
    setShowLogin,
    showOtp,
    setShowOtp,
    showForgotPassword,
    setShowForgotPassword,
    showResetPassword,
    setShowResetPassword,
    otpEmail,
    setOtpEmail,
    showRegister,
    setShowRegister,
    otpSource,
    setOtpSource,
    otpUserId,
    setOtpUserId,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
