import DashboardNavbar from "../components/DashboardNavbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-light">
      {/* TOP NAVBAR */}
      <DashboardNavbar />

      {/* CONTENT AREA */}
      <div className="flex flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
};


export default DashboardLayout;
