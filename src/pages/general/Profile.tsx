import { FormEvent, useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProrileSchema } from '@/schemes/updateProfile';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { passowrdResetReq, resetPassword, updateMyProfile } from '@/api/endpoints';
import { HttpStatusCode } from 'axios';
import { ProfileDto, Profile as ProfileType } from '@/types/Profile';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

export function Profile() {
    const { profile, isProfileLoading, profileError } = useProfile();
    const { user } = useAuthStore();
    const form = useForm<ProfileType>({
        resolver: zodResolver(updateProrileSchema),
        defaultValues: { firstName: '', lastName: '', middleName: '', phoneNumber: '', address: '' }
    });

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

    const [resetToken, setResetToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetStep, setResetStep] = useState<'idle' | 'request' | 'reset'>("reset");
    const [passwordError, setPasswordError] = useState('');

    const onSubmit = async (data: ProfileType) => {
        if (user == null) {
            toast.error("Произошла ошибка при сохранении профиля");
            throw new Error('Failed to get current user');
        }

        const res = await updateMyProfile({ ...data, id: user.id } as unknown as ProfileDto);
        if (res.status !== HttpStatusCode.Ok) {
            toast.error("Произошла ошибка при сохранении профиля");
            throw new Error('Failed to update profile');
        }

        form.reset({
            firstName: res.data.firstName || '',
            lastName: res.data.lastName || '',
            middleName: res.data.middleName || '',
            phoneNumber: res.data.phoneNumber || '',
            address: res.data.address || '',
        });
        toast.success("Профиль успешно сохранен");
    };

    const handleRequestPasswordReset = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const res = await passowrdResetReq(profile?.email || '');

            if (res.status !== HttpStatusCode.Ok) {
                toast.error('Произошла ошибка при отправке ссылки для сброса пароля');
                throw new Error('Failed to request password reset');
            }

            toast.success('Ссылка для сброса пароля отправлена на email');
            setResetStep('reset');

        } catch (error) {
            toast.error('Произошла ошибка при отправке ссылки для сброса пароля, проверьте адрес электронной почты и попробуйте снова');
        }
    };

    const validatePassword = (password: string): string | null => {
        if (password.length < 8 || password.length > 100)
            return 'Пароль должен быть от 8 до 100 символов';

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).{8,}$/;
        if (!passwordRegex.test(password))
            return 'Пароль должен содержать минимум одну заглавную букву, одну строчную букву, одну цифру и один специальный символ';

        return null;
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
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
            const res = await resetPassword(resetToken, newPassword);

            if (res.status !== HttpStatusCode.Ok)
                throw new Error('Failed to reset password');

            toast.success('Пароль успешно изменен');
            setResetStep('idle');
            setResetToken('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            toast.error('Произошла ошибка при сбросе пароля. Проверьте токен и попробуйте снова');
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

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="font-semibold text-lg mb-6">Безопасность</h2>

                    {resetStep === 'idle' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Текущий пароль
                                </label>
                                <div className="relative">
                                    <InputGroup>
                                        <InputGroupAddon>
                                            <Lock />
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            type="password"
                                            value={'***********'}
                                            disabled
                                        />
                                    </InputGroup>
                                </div>
                            </div>

                            <Button
                                onClick={() => setResetStep('request')}
                                size="lg"
                                className="w-full"
                            >
                                Сбросить пароль
                            </Button>
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
                                    <InputGroup>
                                        <InputGroupAddon>
                                            <Mail />
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            type="email"
                                            required
                                            value={(profile ? profile.email : '')}
                                            disabled
                                            placeholder="your.email@university.edu"
                                        />
                                    </InputGroup>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={() => setResetStep('idle')}
                                    className="flex-1"
                                >
                                    Отмена
                                </Button>
                                <Button
                                    size="lg"
                                    type="submit"
                                    className="flex-1"
                                >
                                    Отправить ссылку
                                </Button>
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
                                <Input
                                    required
                                    value={resetToken}
                                    onChange={(e) => setResetToken(e.target.value)}
                                    placeholder="Введите токен из email"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Новый пароль
                                </label>
                                <div className="relative">
                                    <InputGroup>
                                        <InputGroupAddon>
                                            <Lock />
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            type="password"
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Введите новый пароль"
                                        />
                                    </InputGroup>
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
                                    <InputGroup>
                                        <InputGroupAddon>
                                            <Lock />
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            type="password"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Повторите новый пароль"
                                        />
                                    </InputGroup>
                                </div>
                            </div>

                            {passwordError && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-800">{passwordError}</p>
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={() => {
                                        setResetStep('idle');
                                        setResetToken('');
                                        setNewPassword('');
                                        setConfirmPassword('');
                                        setPasswordError('');
                                    }}
                                    className="flex-1"
                                >
                                    Отмена
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1"
                                >
                                    Сбросить пароль
                                </Button>
                            </div>
                        </form>
                    )}

                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Требования к паролю:</h3>
                        <ul className="text-xs text-gray-600 space-y-1">
                            <li>• От 8 до 100 символов</li>
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
