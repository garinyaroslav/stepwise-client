import { UserRole } from "@/types/auth/UserRole";
import { ProjectChapter } from "@/types/ProjectChapter";
import { ProjectType } from "@/types/ProjectType";

export interface Credentials {
    username: string;
    password: string;
}

export interface Group {
    id: number;
    name: string;
    studentsCount: number;
}

export interface UserForCreate {
    username: string;
    email: string;
    password: string;
    role: UserRole;
}

export interface StudentForCreate extends UserForCreate {
    groupId: number;
}

export interface GroupCreate {
    name: string;
    studentIds: number[];
}

export interface CreateAcademicProject {
    title: string;
    description: string;
    type: ProjectType;
    groupId: string;
    teacherId: string;
    chapters: ProjectChapter[];
}
