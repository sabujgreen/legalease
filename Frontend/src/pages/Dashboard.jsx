import { useAuth } from "../context/AuthContext";
import UserDashboard from "./UserDashboard";
import LawyerDashboard from "./LawyerDashboard";
import AdminDashboard from "./AdminDashboard";

const Dashboard = () => {
    const { user } = useAuth();

    // Render dashboard based on user role
    if (user?.role === "ADMIN") {
        return <AdminDashboard />;
    }

    if (user?.role === "LAWYER") {
        return <LawyerDashboard />;
    }

    // Default to user dashboard
    return <UserDashboard />;
};

export default Dashboard;
