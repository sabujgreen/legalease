import { NavLink } from "react-router-dom";
import { useState } from "react";

const DashboardSidebar = () => {
  const [profileImage, setProfileImage] = useState(
    "https://i.pravatar.cc/100"
  );

  // TEMP: frontend only (backend later)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setProfileImage(previewUrl);
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-borderColor px-6 py-8">

      {/* PROFILE SECTION */}
      <div className="flex flex-col items-center mb-10">
        <div className="relative">
          <img
            src={profileImage}
            alt="Profile"
            className="w-20 h-20 rounded-full border object-cover"
          />

          {/* Upload Button */}
          <label className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 cursor-pointer text-xs">
            ✎
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        </div>

        <p className="mt-3 font-medium text-gray-800">
          Chirag
        </p>
      </div>

      {/* NAVIGATION */}
      <nav className="space-y-1">

        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition
            ${isActive
              ? "bg-primary text-white"
              : "text-gray-700 hover:bg-light"}`
          }
        >
          My Cases
        </NavLink>

        <NavLink
          to="/dashboard/documents"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition
            ${isActive
              ? "bg-primary text-white"
              : "text-gray-700 hover:bg-light"}`
          }
        >
          My Documents
        </NavLink>

        <NavLink
          to="/dashboard/notifications"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition
            ${isActive
              ? "bg-primary text-white"
              : "text-gray-700 hover:bg-light"}`
          }
        >
          Notifications
        </NavLink>

        <NavLink
          to="/dashboard/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition
            ${isActive
              ? "bg-primary text-white"
              : "text-gray-700 hover:bg-light"}`
          }
        >
          My Profile
        </NavLink>

      </nav>
    </aside>
  );
};

export default DashboardSidebar;
