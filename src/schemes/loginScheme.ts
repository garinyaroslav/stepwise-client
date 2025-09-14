import z from "zod";

export const loginScheme = z.object({
    username: z.string().min(2, "Слишком короткое").max(50, "Слишком длинное"),
    password: z.string().min(1, "Введите пароль").max(50, "Слишком длинный"),
});
