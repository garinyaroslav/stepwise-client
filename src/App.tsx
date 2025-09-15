import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoadingFallback } from "./components/LoadingFallback";
import { UserRole } from "./types/auth/UserRole";
import { queryClient } from "./queryClient";
import { Unauthorized } from "./pages/Unauthorized";
import { useAuthStore } from "./stores/authStore";
const Login = lazy(() => import("./pages/Login"));

function AppContent() {
  const { isAuthenticated, user } = useAuthStore();

  // TODO: on load, check the token validity via Query
  // useEffect(() => {
  //   if (token) {
  //     queryClient.fetchQuery({ queryKey: ['user'], queryFn: validateToken });
  //   }
  // }, [token]);

  return (
    <Routes>
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
      />
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
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
            <div>student dashboard</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/dashboard"
        element={
          <ProtectedRoute allowedRoles={[UserRole.TEACHER]}>
            <div>teacher dashboard</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <div>admin dashboard</div>
          </ProtectedRoute>
        }
      />

      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LoadingFallback />}>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </Suspense>
    </QueryClientProvider>
  );
}

export default App;
