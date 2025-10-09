import z from "zod";

export const chaptersSchema = z.object({
  index: z.number().min(0),
  title: z.string().min(1, "Название обязательно"),
  description: z.string().optional(),
  deadline: z.date(),
});

export const createAcademicProject = z.object({
  title: z.string().min(2, "Слишком короткое").max(100, "Слишком длинное"),
  description: z
    .string()
    .min(2, "Слишком короткое")
    .max(500, "Слишком длинное"),
  groupId: z.string({ error: "Выберите группу" }),
  teacherId: z.string({ error: "Выберите преподавателя" }),
  chapters: z.array(chaptersSchema).min(1, "Добавьте хотя бы один раздел"),
});
