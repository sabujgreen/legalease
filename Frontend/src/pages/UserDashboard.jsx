import { Link } from "react-router-dom";

const UserDashboard = () => {
  return (
    <div className="flex min-h-screen bg-light">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-borderColor px-6 py-8">
        {/* Profile */}
        <div className="flex flex-col items-center mb-10">
          <img
            src="https://i.pravatar.cc/100"
            alt="profile"
            className="w-20 h-20 rounded-full border"
          />
          <p className="mt-3 font-medium text-gray-800">Chirag</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <Link className="flex items-center gap-3 px-4 py-2 rounded-lg bg-primary text-white">
            Dashboard
          </Link>

          <Link className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-light">
            My Legal Cases
          </Link>

          <Link className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-light">
            Documents
          </Link>

          <Link className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-light">
            Notifications
          </Link>

          <Link className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-light">
            Profile
          </Link>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10">
        {/* Page Header */}
        <h1 className="text-3xl font-semibold text-gray-900 mb-8">
          My Legal Cases
        </h1>

        {/* CASE TABLE */}
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
    </div>
  );
};

export default UserDashboard;
