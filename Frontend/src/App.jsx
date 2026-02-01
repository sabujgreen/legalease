import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Chatbot from "./pages/Chatbot";
import SubmitQuery from "./pages/SubmitQuery";
import LegalDocuments from "./pages/LegalDocuments";
import ContactLawyer from "./pages/ContactLawyer";
import Contact from "./pages/Contact";
import LawyerResults from "./pages/LawyerResults";

import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import OtpModal from "./components/OtpModal";

import ProtectedRoute from "./routes/ProtectedRoute";
import UserDashboard from "./pages/UserDashboard";

import { useAppContext } from "./context/AppContext";

function App() {
  const { showLogin, showRegister, showOtp } = useAppContext();

  return (
    <>
      {/* AUTH MODALS */}
      {showLogin && <LoginModal />}
      {showRegister && <RegisterModal />}
      {showOtp && <OtpModal />}

      <Routes>
        <Route element={<MainLayout />}>

          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/legal-documents" element={<LegalDocuments />} />
          <Route path="/contact" element={<Contact />} />

          {/* PROTECTED ROUTES */}
          <Route
            path="/chatbot"
            element={
              <ProtectedRoute>
                <Chatbot />
              </ProtectedRoute>
            }
          />

          <Route
            path="/submit-query"
            element={
              <ProtectedRoute>
                <SubmitQuery />
              </ProtectedRoute>
            }
          />

          <Route
            path="/case-result/:caseId"
            element={
              <ProtectedRoute>
                <LawyerResults />
              </ProtectedRoute>
            }
          />

          <Route
            path="/contact-lawyer"
            element={
              <ProtectedRoute>
                <ContactLawyer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

        </Route>
      </Routes>
    </>
  );
}

export default App;
