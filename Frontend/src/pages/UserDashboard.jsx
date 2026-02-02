import DashboardLayout from "../layouts/DashboardLayout";
import DashboardSidebar from "../components/DashboardSidebar";

const UserDashboard = () => {
  return (
    <DashboardLayout>
      {/* SIDEBAR COMPONENT */}
      <DashboardSidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-semibold text-gray-900 mb-8">
          My Legal Cases
        </h1>

        <div className="bg-white rounded-xl border border-borderColor overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-light text-gray-700">
              <tr>
                <th className="px-6 py-4 text-left">Case ID</th>
                <th className="px-6 py-4 text-left">Case Type</th>
                <th className="px-6 py-4 text-left">Filed On</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Lawyer</th>
                <th className="px-6 py-4 text-left">Authority</th>
                <th className="px-6 py-4 text-left">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              <tr className="hover:bg-light">
                <td className="px-6 py-4 font-medium">LE-CASE-1021</td>
                <td className="px-6 py-4">Municipal Dispute</td>
                <td className="px-6 py-4">12 Jan 2026</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                    In Progress
                  </span>
                </td>
                <td className="px-6 py-4">Adv. R. Sharma</td>
                <td className="px-6 py-4">Nagar Nigam</td>
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

export default UserDashboard;
