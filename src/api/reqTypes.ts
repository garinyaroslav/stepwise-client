import { UserRole } from "@/types/auth/UserRole";
import { ProjectType } from "@/types/ProjectType";
import { TemplateChapter } from "@/types/TemplateChapter";

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

export interface CreateAcademicWork {
    groupId: number;
    workTemplateId: number;
    deadlines: ChapterDeadline[];
}

export interface ChapterDeadline {
    chapterIndex: number;
    deadline: Date;
}

export interface SaveWorkTemplate {
    id?: string;
    title: string;
    description: string;
    workTitle: string;
    workDescription: string;
    type: ProjectType;
    teacherId: number;
    chapters: TemplateChapter[];
}

export interface UpdateProject {
    id: number;
    title: string;
    description: string;
}

