import { NavLink, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { name: "Home", path: "/" },
  { name: "AI Chat", path: "/chatbot" },
  { name: "Submit Query", path: "/submit-query" },
  { name: "Documents", path: "/legal-documents" },
  { name: "Contact Lawyer", path: "/contact-lawyer" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const { setShowLogin } = useAppContext();
  const navigate = useNavigate();

  return (
    <nav className="relative px-8 py-4 border-b border-borderColor bg-light">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* LEFT: Logo */}
        <h1 className="text-xl font-bold text-primary">
          LegalEase
        </h1>

        {/* CENTER: Navigation */}
        <div className="absolute left-1/2 -translate-x-1/2 flex gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-gray-600 hover:text-primary"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 text-sm rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition"
            >
              Dashboard
            </button>
          )}

          {isAuthenticated ? (
            <button
              onClick={logout}
              className="px-4 py-2 text-sm rounded-lg border border-primary text-primary"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="px-4 py-2 text-sm rounded-lg border border-primary text-primary"
            >
              Login
            </button>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
