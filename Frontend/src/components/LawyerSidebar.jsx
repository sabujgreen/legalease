import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import defaultLawyer from "../assets/default-lawyer.png";

const LawyerSidebar = () => {
    const { user } = useAuth();

    const getProfileImage = () => {
        // For now, return default avatar
        // Later, fetch lawyer's profile photo from their profile
        return defaultLawyer;
    };

    return (
        <aside className="w-64 bg-white border-r border-borderColor px-6 py-8">

            {/* PROFILE SECTION */}
            <div className="flex flex-col items-center mb-10">
                <div className="relative">
                    <img
                        src={getProfileImage()}
                        alt="Profile"
                        className="w-20 h-20 rounded-full border object-cover"
                    />
                </div>

                <p className="mt-3 font-medium text-gray-800">
                    {user?.name || "Lawyer"}
                </p>
                <p className="text-xs text-gray-500">Lawyer Account</p>
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
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Dashboard
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
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Profile
                </NavLink>

                <NavLink
                    to="/dashboard/cases"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition
            ${isActive
                            ? "bg-primary text-white"
                            : "text-gray-700 hover:bg-light"}`
                    }
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    My Cases
                </NavLink>

                <NavLink
                    to="/dashboard/consultations"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition
            ${isActive
                            ? "bg-primary text-white"
                            : "text-gray-700 hover:bg-light"}`
                    }
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Consultations
                </NavLink>

            </nav>
        </aside>
    );
};

export default LawyerSidebar;
