import z from "zod";

export const createAcademicProject = z.object({
  title: z.string().min(2, "Слишком короткое").max(100, "Слишком длинное"),
  description: z
    .string()
    .min(2, "Слишком короткое")
    .max(500, "Слишком длинное"),
});
