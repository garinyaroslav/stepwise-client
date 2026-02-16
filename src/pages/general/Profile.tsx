import { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Lock, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProrileSchema } from '@/schemes/updateProfile';
import z from 'zod';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { updateMyProfile } from '@/api/endpoints';

export function Profile() {
    const { profile, isProfileLoading, profileError } = useProfile();
    const form = useForm<z.infer<typeof updateProrileSchema>>({ resolver: zodResolver(updateProrileSchema) });

    useEffect(() => {
        if (profile == null) return;

        form.reset({
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            middleName: profile.middleName || '',
            phoneNumber: profile.phoneNumber || '',
            address: profile.address || '',
        });
    }, [profile, form]);

    const [currentPassword, setCurrentPassword] = useState('********');
    const [resetEmail, setResetEmail] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetStep, setResetStep] = useState<'idle' | 'request' | 'reset'>('idle');
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [passwordError, setPasswordError] = useState('');

    const onSubmit = async (data: z.infer<typeof updateProrileSchema>) => {
        console.log(data);

        setMessage({ type: 'success', text: 'Профиль успешно сохранен' });
        setTimeout(() => setMessage(null), 3000);

        try {
            const res = await updateMyProfile(data);

            console.log("Student created:", data);
            downloadExcelFileWithXLSX(data.username, data.email, data.password);
            toast.success("Студент успешно создан.");
            form.reset();
        } catch (error: any) {
            if (error.response?.status === HttpStatusCode.Conflict) {
                toast.error("Студент с таким именем пользователя или электронной почтой уже существует.");
            } else {
                toast.error(`Произошла ошибка при создании студента: ${error.message}`);
            }
            console.error("Error creating student:", error);
        }
    };

    const handleRequestPasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        try {
            // Mock API call to POST /password-reset-requests
            const response = await fetch('/api/password-reset-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: resetEmail }),
            });

            if (response.ok) {
                setMessage({
                    type: 'success',
                    text: 'Ссылка для сброса пароля отправлена на email',
                });
                setResetStep('reset');
            } else {
                throw new Error('Failed to request password reset');
            }
        } catch (error) {
            // Mock success for demo
            console.log('Password reset requested for:', resetEmail);
            setMessage({
                type: 'success',
                text: 'Ссылка для сброса пароля отправлена на email',
            });
            setResetStep('reset');
        }
    };

    const validatePassword = (password: string): string | null => {
        if (password.length < 6 || password.length > 100) {
            return 'Пароль должен быть от 6 до 100 символов';
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return 'Пароль должен содержать минимум одну заглавную букву, одну строчную букву, одну цифру и один специальный символ';
        }
        return null;
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setPasswordError('');

        if (newPassword !== confirmPassword) {
            setPasswordError('Пароли не совпадают');
            return;
        }

        const validationError = validatePassword(newPassword);
        if (validationError) {
            setPasswordError(validationError);
            return;
        }

        try {
            // Mock API call to PATCH /passwords
            const response = await fetch('/api/passwords', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: resetToken,
                    newPassword: newPassword,
                }),
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Пароль успешно изменен' });
                setResetStep('idle');
                setResetEmail('');
                setResetToken('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                throw new Error('Failed to reset password');
            }
        } catch (error) {
            // Mock success for demo
            console.log('Password reset with token:', resetToken, 'New password:', newPassword);
            setMessage({ type: 'success', text: 'Пароль успешно изменен' });
            setResetStep('idle');
            setResetEmail('');
            setResetToken('');
            setNewPassword('');
            setConfirmPassword('');
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-semibold mb-2">Настройки профиля</h1>
                <p className="text-muted-foreground text-sm">
                    Управляйте своей личной информацией и безопасностью аккаунта
                </p>
            </div>

            {message && (
                <div
                    className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${message.type === 'success'
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                        }`}
                >
                    <AlertCircle className={`w-5 h-5 flex-shrink-0 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`} />
                    <p className={`text-sm ${message.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                        {message.text}
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="font-semibold text-lg mb-6">Личная информация</h2>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Имя</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Иван"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Фамилия</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Иванoв"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="middleName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Отчество</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Петрович"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Номер телефона</FormLabel>
                                        <FormControl>
                                            <InputGroup>
                                                <InputGroupAddon>
                                                    <Phone />
                                                </InputGroupAddon>
                                                <InputGroupInput
                                                    placeholder="+7 (999) 999-99-99"
                                                    {...field}
                                                />
                                            </InputGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Адрес</FormLabel>
                                        <FormControl>
                                            <InputGroup>
                                                <InputGroupAddon>
                                                    <MapPin />
                                                </InputGroupAddon>
                                                <InputGroupInput
                                                    placeholder="Город, улица, дом"
                                                    {...field}
                                                />
                                            </InputGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex items-center justify-end gap-3 pt-4">
                                <Button variant="outline" size="lg" type="submit">
                                    Отмена
                                </Button>
                                <Button variant="default" size="lg" type="submit">
                                    Сохранить изменения
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>

                {/* Security */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="font-semibold text-lg mb-6">Безопасность</h2>

                    {resetStep === 'idle' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Текущий пароль
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        disabled
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => setResetStep('request')}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Сбросить пароль
                            </button>
                        </div>
                    )}

                    {resetStep === 'request' && (
                        <form onSubmit={handleRequestPasswordReset} className="space-y-4">
                            <p className="text-sm text-gray-600 mb-4">
                                Введите ваш email, на который будет отправлена ссылка для сброса пароля
                            </p>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="email"
                                        required
                                        value={resetEmail}
                                        onChange={(e) => setResetEmail(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="your.email@university.edu"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setResetStep('idle')}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Отмена
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Отправить ссылку
                                </button>
                            </div>
                        </form>
                    )}

                    {resetStep === 'reset' && (
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <p className="text-sm text-gray-600 mb-4">
                                Введите токен из письма и новый пароль
                            </p>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Токен сброса
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={resetToken}
                                    onChange={(e) => setResetToken(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Введите токен из email"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Новый пароль
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Введите новый пароль"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Минимум 8 символов, включая заглавные, строчные буквы, цифры и спецсимволы
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Подтвердите новый пароль
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Повторите новый пароль"
                                    />
                                </div>
                            </div>

                            {passwordError && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-800">{passwordError}</p>
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setResetStep('idle');
                                        setResetEmail('');
                                        setResetToken('');
                                        setNewPassword('');
                                        setConfirmPassword('');
                                        setPasswordError('');
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Отмена
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Сбросить пароль
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Password requirements info */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Требования к паролю:</h3>
                        <ul className="text-xs text-gray-600 space-y-1">
                            <li>• От 6 до 100 символов</li>
                            <li>• Минимум одна заглавная буква (A-Z)</li>
                            <li>• Минимум одна строчная буква (a-z)</li>
                            <li>• Минимум одна цифра (0-9)</li>
                            <li>• Минимум один специальный символ (@#$%^&+=)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

