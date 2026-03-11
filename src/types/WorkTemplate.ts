import { ProjectType } from "./ProjectType";
import { TemplateChapter } from "./TemplateChapter";

export type WorkTemplate = {
    id: string;
    title: string;
    description: string;
    workTitle: string;
    workDescription: string;
    type: ProjectType;
    chapters: TemplateChapter[];
    createdAt: string;
};
