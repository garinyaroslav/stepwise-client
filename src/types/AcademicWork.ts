import { ProjectChapter } from "./ProjectChapter";
import { ProjectType } from "./ProjectType";

export interface AcademicWork {
    id: number;
    title: string;
    description: string;
    countOfChapters: number;
    type: ProjectType;
    teacherEmail: string;
    teacherName: string;
    teacherLastName: string;
    teacherMiddleName: string;
    groupName: string;
    chapters: ProjectChapter[];
}
