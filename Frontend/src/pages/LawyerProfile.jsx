import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchLawyerById } from "../services/lawyer.api";
import { requestConsultation } from "../services/consultation.api";
import { useAuth } from "../context/AuthContext";
import defaultLawyer from "../assets/default-lawyer.png";

const LawyerProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [lawyer, setLawyer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [consultForm, setConsultForm] = useState({
        caseType: "",
        description: "",
    });

    useEffect(() => {
        const loadLawyer = async () => {
            try {
                setLoading(true);
                const res = await fetchLawyerById(id);
                setLawyer(res.data);
            } catch (err) {
                console.error("Failed to fetch lawyer profile", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadLawyer();
        }
    }, [id]);

    const getProfileImage = () => {
        if (lawyer?.profilePhoto) {
            return `http://localhost:5000/${lawyer.profilePhoto.replace(/\\/g, "/")}`;
        }
        return defaultLawyer;
    };

    if (loading) {
        return (
            <section className="px-8 py-12 bg-gray-50 min-h-screen">
                <div className="max-w-5xl mx-auto">
                    <div className="flex justify-center items-center py-20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
                            <p className="mt-4 text-gray-500">Loading lawyer profile...</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (!lawyer) {
        return (
            <section className="px-8 py-12 bg-gray-50 min-h-screen">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center py-20">
                        <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Lawyer Not Found</h2>
                        <p className="text-gray-600 mb-6">The lawyer profile you're looking for doesn't exist.</p>
                        <button
                            onClick={() => navigate("/contact-lawyer")}
                            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dull transition-colors"
                        >
                            Back to Lawyers List
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="px-8 py-12 bg-gray-50 min-h-screen">
            <div className="max-w-5xl mx-auto">

                {/* Back Button */}
                <button
                    onClick={() => navigate("/contact-lawyer")}
                    className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-6"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Lawyers
                </button>

                <div className="bg-white border border-borderColor rounded-xl overflow-hidden">

                    {/* Header Section with Profile */}
                    <div className="bg-gradient-to-r from-primary to-primary-dull p-8 text-white">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            {/* Profile Picture */}
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
                                <img
                                    src={getProfileImage()}
                                    alt={lawyer.userId.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = defaultLawyer;
                                    }}
                                />
                            </div>

                            {/* Basic Info */}
                            <div className="text-center md:text-left flex-1">
                                <h1 className="text-3xl font-bold">{lawyer.userId.name}</h1>
                                <p className="text-lg mt-1 opacity-90">{lawyer.barCouncilState}</p>
                                <p className="mt-2 opacity-80">{lawyer.userId.email}</p>

                                {/* Badges */}
                                <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                                    <span className="px-3 py-1 bg-white text-primary rounded-full text-sm font-medium">
                                        {lawyer.experienceYears} Years Experience
                                    </span>
                                    <span className="px-3 py-1 bg-white text-primary rounded-full text-sm font-medium">
                                        {lawyer.consultationType || "Both"} Consultation
                                    </span>
                                    {lawyer.verificationStatus === "APPROVED" && (
                                        <span className="px-3 py-1 bg-green-500 rounded-full text-sm flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Verified
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Contact Button */}
                            <div className="flex flex-col gap-3">
                                <button className="px-6 py-3 bg-white text-primary rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-md">
                                    Contact Lawyer
                                </button>
                                <p className="text-center text-lg font-semibold">
                                    ₹{lawyer.consultationFee || "Negotiable"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="p-8 space-y-8">

                        {/* Professional Bio */}
                        {lawyer.professionalBio && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-3">About</h2>
                                <p className="text-gray-600 leading-relaxed">{lawyer.professionalBio}</p>
                            </div>
                        )}

                        {/* Specializations */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">Specializations</h2>
                            <div className="flex flex-wrap gap-2">
                                {lawyer.specialization.map((spec, idx) => (
                                    <span
                                        key={idx}
                                        className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                                    >
                                        {spec}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Professional Details Grid */}
                        <div className="grid md:grid-cols-2 gap-6">

                            {/* Left Column */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-800 mb-3">Professional Details</h2>

                                <div>
                                    <p className="text-sm text-gray-500">Bar Council Registration</p>
                                    <p className="font-medium text-gray-800">{lawyer.barRegistrationNumber}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Year of Enrollment</p>
                                    <p className="font-medium text-gray-800">{lawyer.yearOfEnrollment || "N/A"}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Courts Practiced In</p>
                                    <p className="font-medium text-gray-800">{lawyer.courtsPracticedIn || "N/A"}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Languages Spoken</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {lawyer.languagesSpoken.map((lang, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                                {lang}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-800 mb-3">Education & Location</h2>

                                <div>
                                    <p className="text-sm text-gray-500">Law Degree</p>
                                    <p className="font-medium text-gray-800">{lawyer.lawDegree || "N/A"}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">University</p>
                                    <p className="font-medium text-gray-800">{lawyer.universityName || "N/A"}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Year of Graduation</p>
                                    <p className="font-medium text-gray-800">{lawyer.graduationYear || "N/A"}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Location</p>
                                    <p className="font-medium text-gray-800">
                                        {lawyer.location.city}, {lawyer.location.state}
                                    </p>
                                    {lawyer.location.jurisdiction && (
                                        <p className="text-sm text-gray-600 mt-1">Jurisdiction: {lawyer.location.jurisdiction}</p>
                                    )}
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Availability Status</p>
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${lawyer.availabilityStatus === "Available"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                        }`}>
                                        {lawyer.availabilityStatus}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Section */}
                        <div className="bg-light border border-borderColor rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium text-gray-800">{lawyer.userId.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm text-gray-500">Mobile</p>
                                        <p className="font-medium text-gray-800">{lawyer.mobile || "Not Provided"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-center pt-4">
                            <button
                                onClick={() => {
                                    if (!isAuthenticated) {
                                        alert("Please log in to request a consultation");
                                        navigate("/");
                                        return;
                                    }
                                    setShowModal(true);
                                }}
                                className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dull transition-colors"
                            >
                                Request Consultation
                            </button>
                        </div>

                    </div>
                </div>

                {/* Consultation Request Modal */}
                {showModal && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0, 0, 0, 0.25)' }}
                        onClick={() => setShowModal(false)}
                    >
                        <div
                            className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl transform transition-all"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">Request Consultation</h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-700 transition-colors hover:rotate-90 transform transition-transform duration-200"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={async (e) => {
                                e.preventDefault();

                                if (consultForm.description.length < 20) {
                                    alert("Please provide at least 20 characters description");
                                    return;
                                }

                                try {
                                    setSubmitting(true);
                                    await requestConsultation({
                                        lawyerId: lawyer.userId._id,
                                        caseType: consultForm.caseType,
                                        description: consultForm.description,
                                    });

                                    alert("Consultation request sent successfully!");
                                    setShowModal(false);
                                    setConsultForm({ caseType: "", description: "" });
                                } catch (error) {
                                    console.error("Error requesting consultation:", error);
                                    alert(error.response?.data?.message || "Failed to send consultation request");
                                } finally {
                                    setSubmitting(false);
                                }
                            }}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Case Type <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={consultForm.caseType}
                                            onChange={(e) => setConsultForm({ ...consultForm, caseType: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 border border-borderColor rounded-lg focus:outline-none focus:border-primary"
                                        >
                                            <option value="">Select Case Type</option>
                                            <option value="Criminal Law">Criminal Law</option>
                                            <option value="Civil Law">Civil Law</option>
                                            <option value="Family Law">Family Law</option>
                                            <option value="Property Law">Property Law</option>
                                            <option value="Corporate Law">Corporate Law</option>
                                            <option value="Labour Law">Labour Law</option>
                                            <option value="Consumer Law">Consumer Law</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Case Description <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={consultForm.description}
                                            onChange={(e) => setConsultForm({ ...consultForm, description: e.target.value })}
                                            required
                                            rows="4"
                                            placeholder="Describe your legal issue (minimum 20 characters)"
                                            className="w-full px-4 py-2 border border-borderColor rounded-lg focus:outline-none focus:border-primary resize-none"
                                        />
                                        <p className="text-sm text-gray-500 mt-1">
                                            {consultForm.description.length}/20 characters minimum
                                        </p>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dull transition-colors disabled:opacity-50"
                                        >
                                            {submitting ? "Sending..." : "Send Request"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default LawyerProfile;
