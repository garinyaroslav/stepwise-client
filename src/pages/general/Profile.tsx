import { updateMyProfile } from '@/api/endpoints';
import { PasswordResetForm } from '@/components/general/PasswordResetForm';
import { PasswordResetRequestForm } from '@/components/general/PasswordResetRequestForm';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { useProfile } from '@/hooks/useProfile';
import { updateProrileSchema } from '@/schemes/updateProfile';
import { useAuthStore } from '@/stores/authStore';
import { ProfileDto, Profile as ProfileType } from '@/types/Profile';
import { useLogout } from '@/utils/useLogout';
import { zodResolver } from '@hookform/resolvers/zod';
import { HttpStatusCode } from 'axios';
import { Lock, LogOut, MapPin, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router';
import { toast } from 'sonner';

export function Profile() {
    const { profile } = useProfile();
    const { logout } = useLogout();
    const { user } = useAuthStore();
    const [searchParams] = useSearchParams();
    const tokenFromUrl = searchParams.get('token');
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

    const [resetStep, setResetStep] = useState<'idle' | 'request' | 'reset'>(
        tokenFromUrl ? 'reset' : 'idle'
    );

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

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-semibold mb-2">Настройки профиля</h1>
                <p className="text-muted-foreground text-sm">
                    Управляйте своей личной информацией и безопасностью аккаунта
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card text-card-foreground rounded-lg border border-border p-6">
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
                                <Button variant="outline" size="lg" onClick={() => {
                                    if (profile == null) return;
                                    form.reset({
                                        firstName: profile.firstName || '',
                                        lastName: profile.lastName || '',
                                        middleName: profile.middleName || '',
                                        phoneNumber: profile.phoneNumber || '',
                                        address: profile.address || '',
                                    });
                                }} >
                                    Отмена
                                </Button>
                                <Button variant="default" size="lg" type="submit">
                                    Сохранить изменения
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>

                <div className="bg-card text-card-foreground rounded-lg border border-border p-6">
                    <h2 className="font-semibold text-lg mb-6">Безопасность</h2>

                    {resetStep === 'idle' && (
                        <div className="space-y-4">
                            <div>
                                <Label className='mb-1'>
                                    Текущий пароль
                                </Label>
                                <InputGroup>
                                    <InputGroupAddon><Lock /></InputGroupAddon>
                                    <InputGroupInput type="password" value="***********" disabled />
                                </InputGroup>
                            </div>
                            <Button onClick={() => setResetStep('request')} size="lg" className="w-full">
                                Сбросить пароль
                            </Button>
                        </div>
                    )}

                    {resetStep === 'request' && (
                        <PasswordResetRequestForm
                            email={profile?.email ?? ''}
                            onSuccess={() => setResetStep('reset')}
                            onCancel={() => setResetStep('idle')}
                        />
                    )}

                    {resetStep === 'reset' && (
                        <PasswordResetForm
                            initialToken={tokenFromUrl ?? ''}
                            onSuccess={() => setResetStep('idle')}
                            onCancel={() => setResetStep('idle')}
                        />
                    )}

                    {resetStep !== 'reset' &&
                        <div className="mt-6 p-4 bg-muted rounded-lg">
                            <h3 className="text-sm font-medium text-foreground mb-2">Требования к паролю:</h3>
                            <ul className="text-xs text-muted-foreground space-y-1">
                                <li>• От 8 до 100 символов</li>
                                <li>• Минимум одна заглавная буква (A-Z)</li>
                                <li>• Минимум одна строчная буква (a-z)</li>
                                <li>• Минимум одна цифра (0-9)</li>
                                <li>• Минимум один специальный символ (@#$%^&+=)</li>
                            </ul>
                        </div>
                    }
                </div>

                <div className="bg-card text-card-foreground rounded-lg border border-border p-6">
                    <h2 className="font-semibold text-lg mb-4">Выход из аккаунта</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        Завершите текущую сессию и выйдите из системы
                    </p>
                    <Button
                        onClick={logout}
                        variant="destructive"
                        className="flex items-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        Выйти из аккаунта
                    </Button>
                </div>
            </div>
        </div>
    );
}
