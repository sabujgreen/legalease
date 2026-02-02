import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import defaultLawyer from "../assets/default-lawyer.png";

const AdminSidebar = () => {
    const { user } = useAuth();

    return (
        <aside className="w-64 bg-white border-r border-borderColor px-6 py-8">
            {/* PROFILE SECTION */}
            <div className="flex flex-col items-center mb-10">
                <div className="relative">
                    <div className="w-20 h-20 rounded-full border bg-gradient-to-br from-purple-400 to-primary flex items-center justify-center text-white text-2xl font-bold">
                        {user?.name?.[0]?.toUpperCase() || "A"}
                    </div>
                </div>

                <p className="mt-3 font-medium text-gray-800">
                    {user?.name || "Admin"}
                </p>
                <p className="text-xs text-gray-500">Admin Account</p>
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
                    to="/dashboard/lawyer-approvals"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition
            ${isActive
                            ? "bg-primary text-white"
                            : "text-gray-700 hover:bg-light"}`
                    }
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Lawyer Approvals
                </NavLink>

                <NavLink
                    to="/dashboard/all-lawyers"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition
            ${isActive
                            ? "bg-primary text-white"
                            : "text-gray-700 hover:bg-light"}`
                    }
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    All Lawyers
                </NavLink>
            </nav>
        </aside>
    );
};

export default AdminSidebar;
