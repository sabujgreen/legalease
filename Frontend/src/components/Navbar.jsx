import { NavLink } from "react-router-dom";
import { useAppContext } from "../context/AppContext";


const navItems = [
  { name: "Home", path: "/" },
  { name: "AI Chat", path: "/chatbot" },
  { name: "Submit Query", path: "/submit-query" },
  { name: "Documents", path: "/legal-documents" },
  { name: "Contact Lawyer", path: "/contact-lawyer" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
    const { setShowLogin } = useAppContext();

  return (
    <nav className="relative px-8 py-4 border-b border-borderColor bg-light">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Left: Logo */}
        <h1 className="text-xl font-bold text-primary">
          LegalEase
        </h1>

        {/* Center: Links (absolute centered) */}
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

        {/* Right: Login */}
        <button
        onClick={() => setShowLogin(true)}
        className="px-4 py-2 text-sm font-medium rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
        >
        Login
        </button>


      </div>
    </nav>
  );
};

export default Navbar;
