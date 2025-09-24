import { UserRole } from "@/types/auth/UserRole";

export interface Credentials {
    password: string;
}

export interface Group {
    id: number;
    name: string;
}

export interface StudentForCreate {
    username: string;
    email: string;
    password: string;
    role: UserRole;
    groupId: number;
}
