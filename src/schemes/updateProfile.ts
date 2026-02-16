import { z } from "zod";

const phoneRegex = /^(\+7|8)[0-9]{10}$/;

export const updateProrileSchema = z.object({
    firstName: z
        .string()
        .min(2, "Имя должно содержать от 2 до 20 символов")
        .max(20, "Имя должно содержать от 2 до 20 символов")
        .optional(),
    lastName: z
        .string()
        .min(2, "Фамилия должна содержать от 2 до 20 символов")
        .max(20, "Фамилия должна содержать от 2 до 20 символов")
        .optional(),
    middleName: z
        .string()
        .min(2, "Отчество должно содержать от 2 до 20 символов")
        .max(20, "Отчество должно содержать от 2 до 20 символов")
        .optional(),
    phoneNumber: z
        .string()
        .regex(phoneRegex, "Номер телефона должен начинаться с +7 или 8 и содержать 10 цифр")
        .optional(),
    address: z
        .string()
        .min(2, "Адрес должен содержать от 2 до 50 символов")
        .max(50, "Адрес должен содержать от 2 до 50 символов")
        .optional(),
});
