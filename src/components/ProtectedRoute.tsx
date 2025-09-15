import { useAuthStore } from "@/stores/authStore";
import type { UserRole } from "@/types/auth/UserRole";
import { hasRoleAccess } from "@/utils/hasRoleAccess";
import { Navigate } from "react-router";

interface Props {
    children: React.ReactNode;
    allowedRoles: UserRole[];
    fallbackPath?: string;
}

export const ProtectedRoute = ({
    children,
    allowedRoles,
    fallbackPath = "/unauthorized",
}: Props) => {
    const { user, isAuthenticated } = useAuthStore();

    if (!user) return <Navigate to={fallbackPath} replace />;

    if (!isAuthenticated || !hasRoleAccess(user.role, allowedRoles)) {
        return <Navigate to={fallbackPath} replace />;
    }

    return <>{children}</>;
};
