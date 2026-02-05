import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import LawyerSidebar from "../components/LawyerSidebar";
import api from "../services/api";

const LawyerDashboard = () => {
    const [cases, setCases] = useState([]);
    const [stats, setStats] = useState({
        active: 0,
        total: 0,
        pending: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCases();
    }, []);

    const fetchCases = async () => {
        try {
            const response = await api.get("/consultation/lawyer/cases");

            const data = response.data;
            setCases(data);

            // Calculate stats
            const activeCount = data.filter(c => c.status === 'ACCEPTED').length;
            const pendingCount = data.filter(c => c.status === 'PENDING').length;

            setStats({
                active: activeCount,
                total: data.length,
                pending: pendingCount
            });

        } catch (error) {
            console.error("Error fetching lawyer cases:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const config = {
            PENDING: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Pending" },
            ACCEPTED: { bg: "bg-blue-100", text: "text-blue-700", label: "Accepted" },
            COMPLETED: { bg: "bg-green-100", text: "text-green-700", label: "Completed" },
            DECLINED: { bg: "bg-red-100", text: "text-red-700", label: "Declined" },
        };
        const style = config[status] || config.PENDING;

        return (
            <span className={`px-3 py-1 rounded-full text-xs ${style.bg} ${style.text}`}>
                {style.label}
            </span>
        );
    };

    return (
        <DashboardLayout>
            <LawyerSidebar />

            <main className="flex-1 p-10">
                <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                    Lawyer Dashboard
                </h1>
                <p className="text-gray-600 mb-8">
                    Manage your cases, consultations, and profile
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Active Cases */}
                    <div className="bg-white rounded-xl border border-borderColor p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Active Cases</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.active}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Pending Requests - Changed from 'Consultations' to be more specific */}
                    <div className="bg-white rounded-xl border border-borderColor p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Pending Requests</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Total Cases */}
                    <div className="bg-white rounded-xl border border-borderColor p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Consultations</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Cases */}
                <div className="bg-white rounded-xl border border-borderColor overflow-hidden">
                    <div className="px-6 py-4 border-b border-borderColor">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Consultations</h2>
                    </div>

                    {loading ? (
                        <div className="p-10 text-center text-gray-500">Loading cases...</div>
                    ) : cases.length === 0 ? (
                        <div className="p-10 text-center text-gray-500">No consultation requests found.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-gray-700 border-b border-borderColor">
                                    <tr>
                                        <th className="px-6 py-4 text-left">Case ID</th>
                                        <th className="px-6 py-4 text-left">Client Name</th>
                                        <th className="px-6 py-4 text-left">Case Type</th>
                                        <th className="px-6 py-4 text-left">Date</th>
                                        <th className="px-6 py-4 text-left">Status</th>
                                        <th className="px-6 py-4 text-left">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-borderColor">
                                    {cases.map((c) => (
                                        <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {c.consultationId || "N/A"}
                                            </td>
                                            <td className="px-6 py-4 text-gray-700">
                                                {c.userId?.name || "Unknown Client"}
                                            </td>
                                            <td className="px-6 py-4 text-gray-700">
                                                {c.caseType}
                                            </td>
                                            <td className="px-6 py-4 text-gray-700">
                                                {new Date(c.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(c.status)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button className="text-primary font-medium hover:underline">
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </DashboardLayout>
    );
};

export default LawyerDashboard;
