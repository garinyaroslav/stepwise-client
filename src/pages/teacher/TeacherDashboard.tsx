import { Topbar } from "@/components/general/Topbar";
import { CreateWorkModal } from "@/components/teacher/CreateWorkModal";
// import { ProfileModal } from "@/components/teacher/ProfileModal";
import { StudentWorksView } from "@/components/teacher/StudentWorksView";
import { TemplatesManagement } from "@/components/teacher/TemplatesManagement";

// type View = 'templates' | 'create-work' | 'student-works' | 'profile';

const TeacherDashboard = () => {
    const topbarItems = [
        { name: 'Работы студентов', onClick: () => { } },
        { name: 'Управление шаблонами', onClick: () => { } },
        { name: 'Создание академической работы', onClick: () => { } },
    ];


    return (
        <div className="min-h-screen">
            <Topbar items={topbarItems} />

            {/* <main className="max-w-7xl mx-auto px-6 py-8"> */}
            {/*     {currentView === 'templates' && <TemplatesManagement />} */}
            {/*     {currentView === 'create-work' && <CreateWorkModal />} */}
            {/*     {currentView === 'student-works' && <StudentWorksView />} */}
            {/* </main> */}

            {/* {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />} */}
        </div >
    );
}

export default TeacherDashboard;
