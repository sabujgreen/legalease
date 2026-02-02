import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminSidebar from "../components/AdminSidebar";
import axios from "axios";

const AdminLawyerApproval = () => {
    const [pendingLawyers, setPendingLawyers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);

    useEffect(() => {
        fetchPendingLawyers();
    }, []);

    const fetchPendingLawyers = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                "http://localhost:5000/api/admin/lawyers/pending",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setPendingLawyers(response.data);
        } catch (error) {
            console.error("Error fetching pending lawyers:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (lawyerId) => {
        if (!window.confirm("Are you sure you want to approve this lawyer?")) return;

        try {
            setProcessing(lawyerId);
            const token = localStorage.getItem("token");
            await axios.put(
                `http://localhost:5000/api/admin/lawyers/${lawyerId}/approve`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            alert("Lawyer approved successfully!");
            // Remove from list
            setPendingLawyers(pendingLawyers.filter((l) => l._id !== lawyerId));
        } catch (error) {
            console.error("Error approving lawyer:", error);
            alert(error.response?.data?.message || "Failed to approve lawyer");
        } finally {
            setProcessing(null);
        }
    };

    const handleDecline = async (lawyerId) => {
        if (!window.confirm("Are you sure you want to decline this application?")) return;

        try {
            setProcessing(lawyerId);
            const token = localStorage.getItem("token");
            await axios.put(
                `http://localhost:5000/api/admin/lawyers/${lawyerId}/decline`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            alert("Lawyer application declined");
            // Remove from list
            setPendingLawyers(pendingLawyers.filter((l) => l._id !== lawyerId));
        } catch (error) {
            console.error("Error declining lawyer:", error);
            alert(error.response?.data?.message || "Failed to decline lawyer");
        } finally {
            setProcessing(null);
        }
    };

    return (
        <DashboardLayout>
            <AdminSidebar />

            <main className="flex-1 p-10">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Lawyer Approvals</h1>
                        <p className="text-gray-600 mt-2">Review and approve pending lawyer applications</p>
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                                <p className="mt-4 text-gray-500">Loading applications...</p>
                            </div>
                        </div>
                    ) : pendingLawyers.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl border border-borderColor">
                            <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Pending Applications</h3>
                            <p className="text-gray-600">All lawyer applications have been reviewed</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-borderColor overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-borderColor">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Lawyer Name</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Specialization</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Bar Number</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Experience</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Applied On</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-borderColor">
                                        {pendingLawyers.map((lawyer) => (
                                            <tr key={lawyer._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <p className="font-medium text-gray-900">{lawyer.userId?.name || "N/A"}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-gray-700">{lawyer.userId?.email || "N/A"}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap gap-1">
                                                        {lawyer.specialization?.slice(0, 2).map((spec, idx) => (
                                                            <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                                                {spec}
                                                            </span>
                                                        ))}
                                                        {lawyer.specialization?.length > 2 && (
                                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                                                +{lawyer.specialization.length - 2}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-mono text-gray-700">{lawyer.barRegistrationNumber}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-gray-700">{lawyer.experienceYears} years</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-gray-700">
                                                        {new Date(lawyer.createdAt).toLocaleDateString()}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleApprove(lawyer._id)}
                                                            disabled={processing === lawyer._id}
                                                            className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors disabled:opacity-50"
                                                        >
                                                            {processing === lawyer._id ? "..." : "Approve"}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDecline(lawyer._id)}
                                                            disabled={processing === lawyer._id}
                                                            className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
                                                        >
                                                            {processing === lawyer._id ? "..." : "Decline"}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </DashboardLayout>
    );
};

export default AdminLawyerApproval;
