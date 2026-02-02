import { useEffect, useState } from "react";
import { getLawyerCases, updateConsultationStatus } from "../services/consultation.api";
import DashboardLayout from "../layouts/DashboardLayout";
import LawyerSidebar from "../components/LawyerSidebar";

const LawyerMyCases = () => {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL");
    const [updating, setUpdating] = useState(null);

    useEffect(() => {
        fetchCases();
    }, []);

    const fetchCases = async () => {
        try {
            setLoading(true);
            const response = await getLawyerCases();
            setCases(response.data);
        } catch (error) {
            console.error("Error fetching cases:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (consultationId, newStatus) => {
        try {
            setUpdating(consultationId);
            await updateConsultationStatus(consultationId, newStatus);

            // Update local state
            setCases(cases.map(c =>
                c.consultationId === consultationId
                    ? { ...c, status: newStatus }
                    : c
            ));

            alert("Status updated successfully");
        } catch (error) {
            console.error("Error updating status:", error);
            alert(error.response?.data?.message || "Failed to update status");
        } finally {
            setUpdating(null);
        }
    };

    const getFilteredCases = () => {
        if (filter === "ALL") return cases;
        return cases.filter(c => c.status === filter);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "PENDING":
                return "bg-yellow-100 text-yellow-800";
            case "ACCEPTED":
                return "bg-blue-100 text-blue-800";
            case "DECLINED":
                return "bg-red-100 text-red-800";
            case "COMPLETED":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const filteredCases = getFilteredCases();

    return (
        <DashboardLayout>
            <LawyerSidebar />

            <main className="flex-1 p-10">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">My Cases</h1>
                        <p className="text-gray-600 mt-2">Manage your consultation requests</p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2 mb-6 overflow-x-auto">
                        {["ALL", "PENDING", "ACCEPTED", "DECLINED", "COMPLETED"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${filter === status
                                    ? "bg-primary text-white"
                                    : "bg-white text-gray-700 border border-borderColor hover:bg-gray-50"
                                    }`}
                            >
                                {status}
                                <span className="ml-2 text-sm">
                                    ({status === "ALL" ? cases.length : cases.filter(c => c.status === status).length})
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Cases Table */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                                <p className="mt-4 text-gray-500">Loading cases...</p>
                            </div>
                        </div>
                    ) : filteredCases.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl border border-borderColor">
                            <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">No cases yet</h3>
                            <p className="text-gray-600">
                                {filter === "ALL"
                                    ? "Start accepting consultation requests to see them here"
                                    : `No ${filter.toLowerCase()} cases found`}
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-borderColor overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-borderColor">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Consultation ID</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Client Name</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Case Type</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Description</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-borderColor">
                                        {filteredCases.map((consultation) => (
                                            <tr key={consultation._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <span className="font-mono text-sm text-gray-900">{consultation.consultationId}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{consultation.userId.name}</p>
                                                        <p className="text-sm text-gray-500">{consultation.userId.email}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                                                        {consultation.caseType}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 max-w-xs">
                                                    <p className="text-sm text-gray-700 truncate" title={consultation.description}>
                                                        {consultation.description}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(consultation.status)}`}>
                                                        {consultation.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {consultation.status === "PENDING" ? (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleStatusUpdate(consultation.consultationId, "ACCEPTED")}
                                                                disabled={updating === consultation.consultationId}
                                                                className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors disabled:opacity-50"
                                                            >
                                                                Accept
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusUpdate(consultation.consultationId, "DECLINED")}
                                                                disabled={updating === consultation.consultationId}
                                                                className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
                                                            >
                                                                Decline
                                                            </button>
                                                        </div>
                                                    ) : consultation.status === "ACCEPTED" ? (
                                                        <button
                                                            onClick={() => handleStatusUpdate(consultation.consultationId, "COMPLETED")}
                                                            disabled={updating === consultation.consultationId}
                                                            className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors disabled:opacity-50"
                                                        >
                                                            Mark Complete
                                                        </button>
                                                    ) : (
                                                        <span className="text-sm text-gray-500">No actions</span>
                                                    )}
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

export default LawyerMyCases;
