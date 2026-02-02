import DashboardLayout from "../layouts/DashboardLayout";
import LawyerSidebar from "../components/LawyerSidebar";

const LawyerDashboard = () => {
    return (
        <DashboardLayout>
            {/* SIDEBAR COMPONENT */}
            <LawyerSidebar />

            {/* MAIN CONTENT */}
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
                                <p className="text-3xl font-bold text-gray-900">12</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Consultations */}
                    <div className="bg-white rounded-xl border border-borderColor p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Consultations</p>
                                <p className="text-3xl font-bold text-gray-900">8</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Client Reviews */}
                    <div className="bg-white rounded-xl border border-borderColor p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Client Reviews</p>
                                <p className="text-3xl font-bold text-gray-900">4.8</p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Cases */}
                <div className="bg-white rounded-xl border border-borderColor overflow-hidden">
                    <div className="px-6 py-4 border-b border-borderColor">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Cases</h2>
                    </div>

                    <table className="w-full text-sm">
                        <thead className="bg-light text-gray-700">
                            <tr>
                                <th className="px-6 py-4 text-left">Case ID</th>
                                <th className="px-6 py-4 text-left">Client Name</th>
                                <th className="px-6 py-4 text-left">Case Type</th>
                                <th className="px-6 py-4 text-left">Date</th>
                                <th className="px-6 py-4 text-left">Status</th>
                                <th className="px-6 py-4 text-left">Action</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            <tr className="hover:bg-light">
                                <td className="px-6 py-4 font-medium">LE-CASE-1021</td>
                                <td className="px-6 py-4">Rahul Sharma</td>
                                <td className="px-6 py-4">Property Dispute</td>
                                <td className="px-6 py-4">12 Jan 2026</td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                                        In Progress
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button className="text-primary font-medium hover:underline">
                                        View
                                    </button>
                                </td>
                            </tr>

                            <tr className="hover:bg-light">
                                <td className="px-6 py-4 font-medium">LE-CASE-1019</td>
                                <td className="px-6 py-4">Priya Patel</td>
                                <td className="px-6 py-4">Civil Case</td>
                                <td className="px-6 py-4">10 Jan 2026</td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
                                        Completed
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button className="text-primary font-medium hover:underline">
                                        View
                                    </button>
                                </td>
                            </tr>

                            <tr className="hover:bg-light">
                                <td className="px-6 py-4 font-medium">LE-CASE-1015</td>
                                <td className="px-6 py-4">Amit Kumar</td>
                                <td className="px-6 py-4">Criminal Defense</td>
                                <td className="px-6 py-4">08 Jan 2026</td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                                        Pending
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button className="text-primary font-medium hover:underline">
                                        View
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </main>
        </DashboardLayout>
    );
};

export default LawyerDashboard;
