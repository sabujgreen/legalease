import DashboardLayout from "../layouts/DashboardLayout";
import LawyerSidebar from "../components/LawyerSidebar";

const LawyerConsultation = () => {
    return (
        <DashboardLayout>
            <LawyerSidebar />
            <main className="flex-1 p-10 flex flex-col items-center justify-center min-h-[80vh]">
                <div className="text-center">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Coming Soon</h1>
                    <p className="text-xl text-gray-600 max-w-lg mx-auto">
                        We are building a comprehensive consultation management system for you.
                        Stay tuned for updates!
                    </p>
                    <div className="mt-8 flex justify-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></span>
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></span>
                    </div>
                </div>
            </main>
        </DashboardLayout>
    );
};

export default LawyerConsultation;
