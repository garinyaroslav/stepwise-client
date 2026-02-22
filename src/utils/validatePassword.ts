export const validatePassword = (password: string): string | null => {
    if (password.length < 8 || password.length > 100)
        return 'Пароль должен быть от 8 до 100 символов';

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).{8,}$/;
    if (!passwordRegex.test(password))
        return 'Пароль должен содержать минимум одну заглавную букву, строчную букву, цифру и спецсимвол';

    return null;
};
