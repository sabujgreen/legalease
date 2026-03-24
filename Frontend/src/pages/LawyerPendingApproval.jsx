import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Replace axios import with api import
import api from "../services/api";

const LawyerPendingApproval = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkApplicationStatus = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await api.get("/lawyer/status/application", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setStatus(response.data);

            // Redirect if approved
            if (response.data.status === "APPROVED") {
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Error checking status:", error);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        checkApplicationStatus();
    }, [checkApplicationStatus]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-xl border border-borderColor p-8 text-center">
                {/* Icon */}
                <div className="mb-6">
                    {status?.status === "PENDING" && (
                        <div className="w-20 h-20 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    )}

                    {status?.status === "DECLINED" && (
                        <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    {status?.status === "PENDING" && "Application Pending"}
                    {status?.status === "DECLINED" && "Application Declined"}
                    {status?.status === "NOT_APPLIED" && "No Application Found"}
                </h1>

                {/* Message */}
                <p className="text-gray-600 mb-6">
                    {status?.message}
                </p>

                {status?.status === "PENDING" && (
                    <>
                        <p className="text-sm text-gray-500 mb-6">
                            Your lawyer application is currently under review by our admin team.
                            You will be notified once your profile is approved.
                        </p>

                        {/* Status Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium mb-8">
                            <span className="w-2 h-2 bg-yellow-600 rounded-full animate-pulse"></span>
                            Current Status: {status.status}
                        </div>
                    </>
                )}

                {status?.status === "DECLINED" && (
                    <p className="text-sm text-gray-500 mb-8">
                        We regret to inform you that your lawyer application has been declined.
                        Please contact support for more information.
                    </p>
                )}

                {/* Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={() => navigate("/")}
                        className="w-full px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dull transition-colors"
                    >
                        Go to Home
                    </button>

                    {status?.status === "PENDING" && (
                        <button
                            onClick={checkApplicationStatus}
                            className="w-full px-6 py-3 bg-white border border-borderColor text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                            Refresh Status
                        </button>
                    )}
                </div>

                {/* Applied date */}
                {status?.appliedAt && (
                    <p className="text-xs text-gray-400 mt-6">
                        Applied on {new Date(status.appliedAt).toLocaleDateString()}
                    </p>
                )}
            </div>
        </div>
    );
};

export default LawyerPendingApproval;
