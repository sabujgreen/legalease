import { useAuth } from "../context/AuthContext";

const DashboardNavbar = () => {
  const { user } = useAuth();

  return (
    <nav className="px-8 py-4 border-b border-borderColor bg-light">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* LEFT: Logo - Now clickable */}
        <a href="/" className="text-xl font-bold text-primary hover:text-primary-dull transition-colors cursor-pointer">
          LegalEase
        </a>

        {/* RIGHT: Welcome */}
        <p className="text-sm font-medium text-gray-700">
          Welcome, <span className="text-primary">{user?.name || "User"}</span>
        </p>

      </div>
    </nav>
  );
};

export default DashboardNavbar;
