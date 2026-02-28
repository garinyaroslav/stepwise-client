import { ProjectType } from "@/types/ProjectType";

export const projectType = Object.values(ProjectType) as [typeof ProjectType[keyof typeof ProjectType], ...typeof ProjectType[keyof typeof ProjectType][]];
