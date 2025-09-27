import z from "zod";

export const groupNameScheme = z.object({
    groupName: z
        .string()
        .regex(
            new RegExp("[А-Яа-яA-Za-z]{1,4}-\\d{3}"),
            "Название группы должно быть в формате: 1-4 буквы, дефис, 3 цифры (например, ПИН-122 или ПМИз-123)",
        ),
});
