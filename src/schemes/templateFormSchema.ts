import { z } from "zod";

export const templateChapterSchema = z.object({
    title: z.string().min(1, "Название раздела обязательно"),
    description: z.string().min(1, "Описание раздела обязательно"),
    deadline: z.string().min(1, "Срок сдачи обязателен"),
});

export const templateFormSchema = z.object({
    templateTitle: z.string().min(1, "Название шаблона обязательно"),
    templateDescription: z.string().min(1, "Описание шаблона обязательно"),
    workTitle: z.string().min(1, "Название работы обязательно"),
    workDescription: z.string().min(1, "Описание работы обязательно"),
    type: z.string().min(1, "Тип работы обязателен"),
    workTemplateChapters: z
        .array(templateChapterSchema)
        .min(1, "Добавьте хотя бы один раздел"),
});

export type TemplateFormValues = z.infer<typeof templateFormSchema>;
