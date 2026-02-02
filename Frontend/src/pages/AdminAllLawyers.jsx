import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminSidebar from "../components/AdminSidebar";
import axios from "axios";
import defaultLawyer from "../assets/default-lawyer.png";

const AdminAllLawyers = () => {
    const [lawyers, setLawyers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLawyer, setSelectedLawyer] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchAllLawyers();
    }, []);

    const fetchAllLawyers = async () => {
        try {
            // Use cookies for authentication - no token needed
            const response = await axios.get(
                "http://localhost:5000/api/admin/lawyers/approved",
                {
                    withCredentials: true, // This automatically sends cookies
                }
            );
            setLawyers(response.data);
        } catch (error) {
            console.error("Error fetching lawyers:", error);
            alert("Failed to fetch lawyers. Please refresh and try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (lawyer) => {
        setSelectedLawyer(lawyer);
        setShowModal(true);
    };

    const handleRevokeApproval = async () => {
        if (!window.confirm("Are you sure you want to cancel this lawyer's registration? They will lose access to the lawyer dashboard.")) {
            return;
        }

        try {
            setProcessing(true);
            // Use cookies for authentication
            await axios.patch(
                `http://localhost:5000/api/admin/lawyers/${selectedLawyer._id}/revoke`,
                {},
                {
                    withCredentials: true,
                }
            );

            alert("Lawyer registration cancelled successfully!");
            setShowModal(false);
            setSelectedLawyer(null);
            // Remove from list
            setLawyers(lawyers.filter((l) => l._id !== selectedLawyer._id));
        } catch (error) {
            console.error("Error revoking lawyer:", error);
            alert(error.response?.data?.message || "Failed to revoke lawyer registration");
        } finally {
            setProcessing(false);
        }
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
                        <h1 className="text-3xl font-bold text-gray-800">All Lawyers</h1>
                        <p className="text-gray-600 mt-2">View and manage all approved lawyers</p>
                    </div>

                    {/* Stats */}
                    <div className="mb-6">
                        <div className="bg-white border border-borderColor rounded-xl p-4 inline-flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Approved Lawyers</p>
                                <p className="text-2xl font-bold text-gray-800">{lawyers.length}</p>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                                <p className="mt-4 text-gray-500">Loading lawyers...</p>
                            </div>
                        </div>
                    ) : lawyers.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl border border-borderColor">
                            <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Approved Lawyers</h3>
                            <p className="text-gray-600">No lawyers have been approved yet</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-borderColor overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-borderColor">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Lawyer</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Specialization</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Experience</th>
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
                                                            className="w-10 h-10 rounded-full object-cover"
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
                                                    <p className="text-sm text-gray-700">{lawyer.experienceYears} years</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-gray-700">
                                                        {lawyer.location?.city}, {lawyer.location?.state}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        onClick={() => handleViewDetails(lawyer)}
                                                        className="px-3 py-1 bg-primary text-white rounded-lg text-sm hover:bg-primary-dull transition-colors"
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
                            <h2 className="text-2xl font-bold text-gray-800">Lawyer Details</h2>
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
                            {/* Profile Section */}
                            <div className="flex items-center gap-6 pb-6 border-b border-borderColor">
                                <img
                                    src={getProfileImage(selectedLawyer)}
                                    alt={selectedLawyer.userId?.name}
                                    className="w-24 h-24 rounded-full object-cover border-4 border-primary"
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

                                {/* Specializations */}
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-3">Specializations</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedLawyer.specialization?.map((spec, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm">
                                                {spec}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Languages */}
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-3">Languages Spoken</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedLawyer.languagesSpoken?.map((lang, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                                                {lang}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Education */}
                                <div className="md:col-span-2">
                                    <h4 className="font-semibold text-gray-800 mb-3">Education</h4>
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <span className="text-gray-500">Law Degree:</span>
                                            <span className="ml-2 text-gray-800">{selectedLawyer.lawDegree || "N/A"}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">University:</span>
                                            <span className="ml-2 text-gray-800">{selectedLawyer.universityName || "N/A"}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Graduation Year:</span>
                                            <span className="ml-2 text-gray-800">{selectedLawyer.graduationYear || "N/A"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Bio */}
                                {selectedLawyer.professionalBio && (
                                    <div className="md:col-span-2">
                                        <h4 className="font-semibold text-gray-800 mb-3">Professional Bio</h4>
                                        <p className="text-sm text-gray-700">{selectedLawyer.professionalBio}</p>
                                    </div>
                                )}

                                {/* Consultation Details */}
                                <div className="md:col-span-2">
                                    <h4 className="font-semibold text-gray-800 mb-3">Consultation Details</h4>
                                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500">Type:</span>
                                            <span className="ml-2 text-gray-800">{selectedLawyer.consultationType || "Both"}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Fee:</span>
                                            <span className="ml-2 text-gray-800">₹{selectedLawyer.consultationFee || "Negotiable"}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Availability:</span>
                                            <span className="ml-2 text-gray-800">{selectedLawyer.availabilityStatus}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="sticky bottom-0 bg-gray-50 border-t border-borderColor px-6 py-4 flex justify-between items-center">
                            <p className="text-sm text-gray-500">
                                Approved on {new Date(selectedLawyer.createdAt).toLocaleDateString()}
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={handleRevokeApproval}
                                    disabled={processing}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                                >
                                    {processing ? "Processing..." : "Cancel Registration"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default AdminAllLawyers;
