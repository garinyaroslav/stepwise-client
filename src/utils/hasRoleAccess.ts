import type { UserRole } from "@/types/auth/UserRole";

export const hasRoleAccess = (
    userRole: UserRole | null,
    allowedRoles: UserRole[],
): boolean => {
    return userRole ? allowedRoles.includes(userRole) : false;
};
