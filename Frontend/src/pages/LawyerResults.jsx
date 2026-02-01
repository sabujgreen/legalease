import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getCaseById } from "../services/case.api";

const LawyerResults = () => {
    const { caseId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [caseData, setCaseData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Try to get data from navigation state first, otherwise fetch from API
    useEffect(() => {
        const loadCaseData = async () => {
            // If we have data in navigation state, use it
            if (location.state?.aiAnalysis && location.state?.lawyers) {
                setCaseData({
                    aiAnalysis: location.state.aiAnalysis,
                    suggestions: location.state.lawyers,
                });
                return;
            }

            // Otherwise, fetch from backend
            try {
                setLoading(true);
                const res = await getCaseById(caseId);
                setCaseData({
                    aiAnalysis: res.data.aiAnalysis,
                    suggestions: res.data.aiSuggestions,
                });
            } catch (err) {
                console.error("Failed to fetch case data:", err);
                alert("Failed to load case results. Please try again.");
                navigate("/submit-query");
            } finally {
                setLoading(false);
            }
        };

        loadCaseData();
    }, [caseId, location.state, navigate]);

    if (loading) {
        return (
            <section className="px-8 py-12">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (!caseData) {
        return null;
    }

    const { aiAnalysis, suggestions } = caseData;

    return (
        <section className="px-8 py-12">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-semibold text-primary">
                        Case Analysis Complete
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Our AI has analyzed your case and matched you with the best lawyers
                    </p>
                </div>

                {/* AI Analysis Section */}
                {aiAnalysis && (
                    <div className="bg-white border border-borderColor rounded-xl p-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            📋 AI Case Analysis
                        </h2>

                        <div className="space-y-4">
                            {aiAnalysis.caseType && (
                                <div>
                                    <span className="font-medium text-gray-700">Case Type:</span>
                                    <p className="text-gray-600 mt-1">{aiAnalysis.caseType}</p>
                                </div>
                            )}

                            {aiAnalysis.severity && (
                                <div>
                                    <span className="font-medium text-gray-700">Severity:</span>
                                    <p className="text-gray-600 mt-1">{aiAnalysis.severity}</p>
                                </div>
                            )}

                            {aiAnalysis.recommendedActions && aiAnalysis.recommendedActions.length > 0 && (
                                <div>
                                    <span className="font-medium text-gray-700">Recommended Actions:</span>
                                    <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                                        {aiAnalysis.recommendedActions.map((action, index) => (
                                            <li key={index}>{action}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {aiAnalysis.summary && (
                                <div>
                                    <span className="font-medium text-gray-700">Summary:</span>
                                    <p className="text-gray-600 mt-1 leading-relaxed">{aiAnalysis.summary}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Matched Lawyers Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        👨‍⚖️ Matched Lawyers ({suggestions?.length || 0})
                    </h2>

                    {suggestions && suggestions.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {suggestions.map((lawyer, index) => (
                                <div
                                    key={lawyer._id || index}
                                    className="bg-white border border-borderColor rounded-xl p-5 hover:shadow-lg transition-shadow"
                                >
                                    {/* Match Score Badge */}
                                    {lawyer.matchScore && (
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                                {Math.round(lawyer.matchScore * 100)}% Match
                                            </span>
                                            <span className="text-yellow-500 text-lg">⭐ {lawyer.rating || "N/A"}</span>
                                        </div>
                                    )}

                                    {/* Lawyer Name */}
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {lawyer.userId?.name || lawyer.name || "Unknown Lawyer"}
                                    </h3>

                                    {/* Specialization */}
                                    <p className="mt-2 text-sm text-gray-600">
                                        <span className="font-medium">Specialization:</span>{" "}
                                        {Array.isArray(lawyer.specialization)
                                            ? lawyer.specialization.join(", ")
                                            : lawyer.specialization || "General"}
                                    </p>

                                    {/* Location */}
                                    {lawyer.location && (
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Location:</span>{" "}
                                            {lawyer.location.city}, {lawyer.location.state}
                                        </p>
                                    )}

                                    {/* Experience */}
                                    {lawyer.experienceYears && (
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Experience:</span>{" "}
                                            {lawyer.experienceYears} years
                                        </p>
                                    )}

                                    {/* Match Reason */}
                                    {lawyer.reason && (
                                        <p className="mt-3 text-sm text-gray-500 italic">
                                            "{lawyer.reason}"
                                        </p>
                                    )}

                                    {/* Contact Button */}
                                    <button
                                        onClick={() => {
                                            // TODO: Implement contact/assign lawyer functionality
                                            alert(`Contacting ${lawyer.userId?.name || lawyer.name}...`);
                                        }}
                                        className="mt-4 w-full px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dull transition-colors"
                                    >
                                        Contact Lawyer
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                            <p className="text-gray-600">
                                No lawyers matched for this case. Please try submitting with more details or contact support.
                            </p>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => navigate("/")}
                        className="px-6 py-3 rounded-lg border border-borderColor text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                        Back to Home
                    </button>
                    <button
                        onClick={() => navigate("/submit-query")}
                        className="px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-dull transition-colors"
                    >
                        Submit Another Query
                    </button>
                </div>
            </div>
        </section>
    );
};

export default LawyerResults;
