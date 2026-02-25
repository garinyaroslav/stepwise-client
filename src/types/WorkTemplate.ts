import { ProjectChapter } from "./ProjectChapter";
import { ProjectType } from "./ProjectType";

export type WorkTemplate = {
    id: string;
    title: string;
    description: string;
    workTitle: string;
    workDescription: string;
    type: ProjectType;
    chapters: ProjectChapter[];
    createdAt: string;
};
