import { Outlet, useNavigate } from "react-router";
import { Topbar } from "@/components/general/Topbar";

const StudentDashboard = () => {
    const navigate = useNavigate();

    const topbarItems = [
        { name: 'Мои работы', onClick: () => navigate("") },
    ];

    return (
        <div className="min-h-screen">
            <Topbar items={topbarItems} />
            <main className="max-w-7xl mx-auto px-6 py-8">
                <Outlet />
            </main>
        </div >
    );
}

export default StudentDashboard;
