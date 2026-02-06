import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardSidebar from "../components/DashboardSidebar";
import api from "../services/api";

const UserDashboard = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyConsultations();
  }, []);

  const fetchMyConsultations = async () => {
    try {
      // Fetch user's consultations from backend
      const response = await api.get("/consultation/my-requests");
      setConsultations(response.data);
    } catch (error) {
      console.error("Error fetching consultations:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Pending" },
      ACCEPTED: { bg: "bg-green-100", text: "text-green-700", label: "Accepted" },
      REJECTED: { bg: "bg-red-100", text: "text-red-700", label: "Rejected" },
      COMPLETED: { bg: "bg-blue-100", text: "text-blue-700", label: "Completed" },
    };

    const config = statusConfig[status] || statusConfig.PENDING;

    return (
      <span className={`px-3 py-1 rounded-full text-xs ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <DashboardLayout>
      {/* SIDEBAR COMPONENT */}
      <DashboardSidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">My Consultations</h1>
          <p className="text-gray-600 mt-2">View and track your consultation requests</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading consultations...</p>
            </div>
          </div>
        ) : consultations.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-borderColor">
            <svg
              className="w-20 h-20 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Consultations Yet</h3>
            <p className="text-gray-600 mb-6">You haven't requested any consultations</p>
            <Link
              to="/contact-lawyer"
              className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dull transition-colors"
            >
              Find a Lawyer
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-borderColor overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-borderColor">
                  <tr>
                    <th className="px-6 py-4 text-left text-gray-700 font-semibold">Case Type</th>
                    <th className="px-6 py-4 text-left text-gray-700 font-semibold">Lawyer</th>
                    <th className="px-6 py-4 text-left text-gray-700 font-semibold">Requested On</th>
                    <th className="px-6 py-4 text-left text-gray-700 font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-gray-700 font-semibold">Description</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-borderColor">
                  {consultations.map((consultation) => (
                    <tr key={consultation._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {consultation.caseType || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {consultation.lawyerId?.userId?.name || "Unassigned"}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {new Date(consultation.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(consultation.status)}</td>
                      <td className="px-6 py-4 text-gray-700 max-w-md truncate">
                        {consultation.description || "No description"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </DashboardLayout>
  );
};

export default UserDashboard;
