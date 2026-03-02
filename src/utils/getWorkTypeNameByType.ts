import { ProjectType } from "@/types/ProjectType";

export const getWorkTypeNameByType = (type: ProjectType) => {
    switch (type) {
        case ProjectType.coursework:
            return "Курсовая работа";
        case ProjectType.thesis:
            return "Дипломная работа";
    }
};
