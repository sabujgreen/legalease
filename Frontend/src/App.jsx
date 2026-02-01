import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Chatbot from "./pages/Chatbot";
import SubmitQuery from "./pages/SubmitQuery";
import LegalDocuments from "./pages/LegalDocuments";
import ContactLawyer from "./pages/ContactLawyer";
import Contact from "./pages/Contact";
import LoginModal from "./components/LoginModal";
import { useAppContext } from "./context/AppContext";
import RegisterModal from "./components/RegisterModal";
import OtpModal from "./components/OtpModal";



function App() {
  const { showLogin, showRegister, showOtp } = useAppContext();



  return (
    <>
      {showLogin && <LoginModal />}
      {showRegister && <RegisterModal />}
      {showOtp && <OtpModal />}



      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/submit-query" element={<SubmitQuery />} />
          <Route path="/legal-documents" element={<LegalDocuments />} />
          <Route path="/contact-lawyer" element={<ContactLawyer />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
