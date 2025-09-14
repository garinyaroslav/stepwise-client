import type { UserRole } from "./UserRole";

export interface User {
    id: string;
    role: UserRole;
}
