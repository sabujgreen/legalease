import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminSidebar from "../components/AdminSidebar";
import axios from "axios";
import defaultLawyer from "../assets/default-lawyer.png";

const AdminRejectedLawyers = () => {
    const [lawyers, setLawyers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLawyer, setSelectedLawyer] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchRejectedLawyers();
    }, []);

    const fetchRejectedLawyers = async () => {
        try {
            // Use cookies for authentication
            const response = await axios.get(
                "http://localhost:5000/api/admin/lawyers/rejected",
                {
                    withCredentials: true,
                }
            );
            setLawyers(response.data);
        } catch (error) {
            console.error("Error fetching rejected lawyers:", error);
            alert("Failed to fetch rejected lawyers. Please refresh and try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (lawyer) => {
        setSelectedLawyer(lawyer);
        setShowModal(true);
    };

    const getProfileImage = (lawyer) => {
        if (lawyer?.profilePhoto) {
            return `http://localhost:5000/${lawyer.profilePhoto.replace(/\\/g, "/")}`;
        }
        return defaultLawyer;
    };

    return (
        <DashboardLayout>
            <AdminSidebar />

            <main className="flex-1 p-10">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Rejected Lawyers</h1>
                        <p className="text-gray-600 mt-2">View all rejected lawyer applications</p>
                    </div>

                    {/* Stats */}
                    <div className="mb-6">
                        <div className="bg-white border border-borderColor rounded-xl p-4 inline-flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Rejected Applications</p>
                                <p className="text-2xl font-bold text-gray-800">{lawyers.length}</p>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                                <p className="mt-4 text-gray-500">Loading rejected lawyers...</p>
                            </div>
                        </div>
                    ) : lawyers.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl border border-borderColor">
                            <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Rejected Lawyers</h3>
                            <p className="text-gray-600">There are no rejected applications</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-borderColor overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-borderColor">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Lawyer</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rejection Reason</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Location</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-borderColor">
                                        {lawyers.map((lawyer) => (
                                            <tr
                                                key={lawyer._id}
                                                className="hover:bg-gray-50 transition-colors cursor-pointer"
                                                onClick={() => handleViewDetails(lawyer)}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={getProfileImage(lawyer)}
                                                            alt={lawyer.userId?.name}
                                                            className="w-10 h-10 rounded-full object-cover grayscale" // Grayscale for rejected
                                                            onError={(e) => {
                                                                e.target.src = defaultLawyer;
                                                            }}
                                                        />
                                                        <p className="font-medium text-gray-900">{lawyer.userId?.name || "N/A"}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-gray-700">{lawyer.userId?.email || "N/A"}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-red-600 font-medium">
                                                        {lawyer.rejectionReason || "Not specified"}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-gray-700">
                                                        {lawyer.location?.city}, {lawyer.location?.state}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        onClick={() => handleViewDetails(lawyer)}
                                                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors border border-gray-300"
                                                    >
                                                        View Details
                                                    </button>
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

            {/* Detail Modal */}
            {showModal && selectedLawyer && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-borderColor px-6 py-4 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-800">Rejected Application Details</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Rejection Alert */}
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                                <h3 className="text-red-800 font-semibold mb-1">Application Rejected</h3>
                                <p className="text-red-700">Reason: {selectedLawyer.rejectionReason || "Not specified"}</p>
                            </div>

                            {/* Profile Section */}
                            <div className="flex items-center gap-6 pb-6 border-b border-borderColor">
                                <img
                                    src={getProfileImage(selectedLawyer)}
                                    alt={selectedLawyer.userId?.name}
                                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 grayscale"
                                    onError={(e) => {
                                        e.target.src = defaultLawyer;
                                    }}
                                />
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800">{selectedLawyer.userId?.name}</h3>
                                    <p className="text-gray-600">{selectedLawyer.userId?.email}</p>
                                    <p className="text-sm text-gray-500 mt-1">Bar Council: {selectedLawyer.barCouncilState}</p>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Personal Info */}
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-3">Personal Information</h4>
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <span className="text-gray-500">Mobile:</span>
                                            <span className="ml-2 text-gray-800">{selectedLawyer.mobile || "N/A"}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Location:</span>
                                            <span className="ml-2 text-gray-800">
                                                {selectedLawyer.location?.city}, {selectedLawyer.location?.state}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Professional Info */}
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-3">Professional Information</h4>
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <span className="text-gray-500">Bar Registration:</span>
                                            <span className="ml-2 text-gray-800 font-mono">{selectedLawyer.barRegistrationNumber}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Experience:</span>
                                            <span className="ml-2 text-gray-800">{selectedLawyer.experienceYears} years</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Year of Enrollment:</span>
                                            <span className="ml-2 text-gray-800">{selectedLawyer.yearOfEnrollment || "N/A"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="sticky bottom-0 bg-gray-50 border-t border-borderColor px-6 py-4 flex justify-end items-center">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default AdminRejectedLawyers;
