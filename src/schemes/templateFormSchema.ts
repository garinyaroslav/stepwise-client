import { z } from "zod";
import { projectType } from "./projectType";

export const templateChapterSchema = z.object({
    index: z.number().min(0),
    title: z.string().min(1, "Название раздела обязательно"),
    description: z.string().optional(),
});

export const templateFormSchema = z.object({
    templateTitle: z.string().min(2, "Слишком короткое").max(100, "Слишком длинное"),
    templateDescription: z
        .string()
        .min(2, "Слишком короткое")
        .max(500, "Слишком длинное"),
    workTitle: z.string().min(1, "Название работы обязательно"),
    workDescription: z.string().min(1, "Описание работы обязательно"),
    type: z.enum(projectType),
    chapters: z
        .array(templateChapterSchema)
        .min(1, "Добавьте хотя бы один раздел"),
});

export type TemplateFormValues = z.infer<typeof templateFormSchema>;
