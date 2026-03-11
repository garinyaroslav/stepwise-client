import { Outlet, useNavigate } from "react-router";
import { Topbar } from "@/components/general/Topbar";

const TeacherDashboard = () => {
    const navigate = useNavigate();

    const topbarItems = [
        { name: 'Работы студентов', onClick: () => navigate("") },
        { name: 'Управление шаблонами', onClick: () => navigate("template") },
        { name: 'Создание академической работы', onClick: () => navigate("create-work") },
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

export default TeacherDashboard;
