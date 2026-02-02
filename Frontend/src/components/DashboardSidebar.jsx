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
          <label
            htmlFor="profile-upload"
            className="absolute bottom-0 right-0 w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-dull transition"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </label>
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>

        <p className="mt-3 font-medium text-gray-800">John Doe</p>
        <p className="text-xs text-gray-500">User</p>
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

        <a
          href="#"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition text-gray-700 hover:bg-light"
        >
          My Documents
        </a>

        <a
          href="#"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition text-gray-700 hover:bg-light"
        >
          Notifications
        </a>

        <a
          href="#"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition text-gray-700 hover:bg-light"
        >
          My Profile
        </a>

      </nav>
    </aside>
  );
};

export default DashboardSidebar;
