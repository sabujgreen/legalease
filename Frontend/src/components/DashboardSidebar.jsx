import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

import defaultAvatar from "../assets/image.png";

const DashboardSidebar = () => {
  const { user, setUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Use user's image, preview image, or default
  const displayImage = previewImage || user?.profileImage?.url || defaultAvatar;

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show immediate preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewImage(objectUrl);
    setUploading(true);

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await api.post("/user/profile/photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update global user context with new image
      setUser((prev) => ({
        ...prev,
        profileImage: response.data.profileImage,
      }));

      // Clear preview (now using real URL)
      // setPreviewImage(null); // Optional: keep preview or switch to URL
    } catch (error) {
      console.error("Error uploading profile photo:", error);
      alert("Failed to upload profile photo");
      setPreviewImage(null); // Revert on failure
    } finally {
      setUploading(false);
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-borderColor px-6 py-8 flex flex-col min-h-full">

      {/* PROFILE SECTION */}
      <div className="flex flex-col items-center mb-10">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full border-2 border-gray-100 p-1">
            <img
              src={displayImage}
              alt="Profile"
              className={`w-full h-full rounded-full object-cover transition-opacity ${uploading ? 'opacity-50' : ''}`}
            />
          </div>

          {/* Upload Loader Overlay */}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          )}

          {/* Upload Button */}
          <label
            htmlFor="profile-upload"
            className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-dull transition shadow-md transform group-hover:scale-105"
            title="Upload Profile Photo"
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
            disabled={uploading}
          />
        </div>

        <h3 className="mt-4 font-semibold text-gray-800 text-lg">
          {user?.name || "User"}
        </h3>
        <p className="text-sm text-gray-500 capitalize">{user?.role?.toLowerCase() || "User"}</p>
      </div>

      {/* NAVIGATION */}
      <nav className="space-y-1 flex-1">

        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition duration-200
            ${isActive
              ? "bg-primary text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`
          }
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          My Dashboard
        </NavLink>

        {/* Only show My Cases if user is a Lawyer (although likely they use LawyerSidebar) */}
        {user?.role === "LAWYER" && (
          <NavLink
            to="/dashboard/cases"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition duration-200
              ${isActive
                ? "bg-primary text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`
            }
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            My Cases
          </NavLink>
        )}

      </nav>
    </aside>
  );
};

export default DashboardSidebar;
