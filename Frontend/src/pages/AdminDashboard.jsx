import { useCallback, useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminSidebar from "../components/AdminSidebar";
import api from "../services/api";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        pending: 0,
        approved: 0,
        total: 0,
    });

    const fetchStats = useCallback(async () => {
        try {
            // Use cookies for authentication
            const [pendingRes, approvedRes] = await Promise.all([
                api.get("/admin/lawyers/pending"),
                api.get("/lawyer/"),
            ]);

            setStats({
                pending: pendingRes.data.length || 0,
                approved: approvedRes.data.length || 0,
                total: (pendingRes.data.length || 0) + (approvedRes.data.length || 0),
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchStats();
        }, 0);

        return () => clearTimeout(timeoutId);
    }, [fetchStats]);

    return (
        <DashboardLayout>
            <AdminSidebar />

            <main className="flex-1 p-10">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                        <p className="text-gray-600 mt-2">Manage lawyer registrations and system overview</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Pending Approvals */}
                        <div className="bg-white border border-borderColor rounded-xl p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Pending Approvals</p>
                                    <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                                </div>
                                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-4">Awaiting review</p>
                        </div>

                        {/* Approved Lawyers */}
                        <div className="bg-white border border-borderColor rounded-xl p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Approved Lawyers</p>
                                    <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-4">Active in system</p>
                        </div>

                        {/* Total Registrations */}
                        <div className="bg-white border border-borderColor rounded-xl p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Total Registrations</p>
                                    <p className="text-3xl font-bold text-primary">{stats.total}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-4">All time</p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white border border-borderColor rounded-xl p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <a
                                href="/dashboard/lawyer-approvals"
                                className="flex items-center gap-4 p-4 border border-borderColor rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-800">Review Pending Applications</h3>
                                    <p className="text-sm text-gray-600">{stats.pending} applications awaiting approval</p>
                                </div>
                            </a>

                            <a
                                href="/dashboard/all-lawyers"
                                className="flex items-center gap-4 p-4 border border-borderColor rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-800">Manage Lawyers</h3>
                                    <p className="text-sm text-gray-600">View and manage all approved lawyers</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </DashboardLayout>
    );
};

export default AdminDashboard;
