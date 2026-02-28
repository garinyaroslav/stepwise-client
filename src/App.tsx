import { QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router";
import { ProjectAddForm } from "./components/admin/ProjectAddForm";
import { ProjectDetailsForm } from "./components/admin/ProjectDitailsForm";
import { LoadingFallback } from "./components/general/LoadingFallback";
import { ProtectedRoute } from "./components/general/ProtectedRoute";
import { CreateWorkPage } from "./components/teacher/CreateWorkPage";
import { TemplateModal } from "./components/teacher/TemplateModal";
import { Toaster } from "./components/ui/sonner";
import { GroupsManagement } from "./pages/admin/GroupsManagement";
import { ProjectManagement } from "./pages/admin/ProjectManagement";
import { UserManagement } from "./pages/admin/UserManagement";
import { Profile } from "./pages/general/Profile";
import { ResetPassword } from "./pages/general/ResetPassword";
import { Unauthorized } from "./pages/general/Unauthorized";
import { queryClient } from "./queryClient";
import { useAuthStore } from "./stores/authStore";
import { UserRole } from "./types/auth/UserRole";
import { TemplatesManagement } from "./pages/teacher/TemplatesManagement";
import { StudentWorksPage } from "./pages/teacher/StudentWorksPage";
import { TemplateDetailPage } from "./pages/teacher/TemplateDetailPage";

const Login = lazy(() => import("./pages/general/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const TeacherDashboard = lazy(() => import("./pages/teacher/TeacherDashboard"));
const StudentDashboard = lazy(() => import("./pages/student/StudentDashboard"));

function AppContent() {
    const { isAuthenticated, user } = useAuthStore();
    const location = useLocation();

    const backgroundLocation = location.state?.backgroundLocation;

    return (
        <>
            <Routes location={backgroundLocation ?? location}>
                <Route
                    path="/login"
                    element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
                />
                <Route path="/reset" element={<ResetPassword />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="*" element={<Navigate to="/login" />} />

                <Route
                    path="/dashboard"
                    element={
                        isAuthenticated ? (
                            <Navigate to={`/${user?.role}/dashboard`} replace />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />

                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                >
                    <Route path="" element={<UserManagement />} />
                    <Route path="groups" element={<GroupsManagement />} />
                    <Route path="projects">
                        <Route path="" element={<ProjectManagement />} />
                        <Route path="add" element={<ProjectAddForm />} />
                        <Route path=":projectId" element={<ProjectDetailsForm />} />
                    </Route>
                </Route>

                <Route
                    path="/teacher/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={[UserRole.TEACHER]}>
                            <TeacherDashboard />
                        </ProtectedRoute>
                    }
                >
                    <Route path="" element={<StudentWorksPage />} />
                    <Route path="create-work" element={<CreateWorkPage />} />
                    <Route path="template" element={<TemplatesManagement />} />
                    <Route path="template/:id" element={<TemplateDetailPage />} />
                    <Route path="profile" element={<Profile />} />
                </Route>

                <Route
                    path="/student/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>

            {backgroundLocation && (
                <Routes>
                    <Route path="/TEACHER/dashboard/template/new" element={<TemplateModal />} />
                    <Route path="/TEACHER/dashboard/template/:id/edit" element={<TemplateModal />} />
                </Routes>
            )}
        </>
    );
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Suspense fallback={<LoadingFallback />}>
                <BrowserRouter>
                    <AppContent />
                    <Toaster />
                </BrowserRouter>
            </Suspense>
        </QueryClientProvider>
    );
}

export default App;
