import { useState } from 'react';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { resetPassword } from '@/api/endpoints';
import { HttpStatusCode } from 'axios';
import { toast } from 'sonner';
import { validatePassword } from '@/utils/validatePassword';

interface Props {
    initialToken?: string;
    onSuccess: () => void;
    onCancel?: () => void;
}

export function PasswordResetForm({ initialToken = '', onSuccess, onCancel }: Props) {
    const [token, setToken] = useState(initialToken);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
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
            const res = await resetPassword(token, newPassword);
            if (res.status !== HttpStatusCode.Ok) throw new Error();

            toast.success('Пароль успешно изменён');
            onSuccess();
        } catch {
            toast.error('Ошибка сброса пароля. Проверьте токен и попробуйте снова');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-muted-foreground">
                Введите токен из письма и новый пароль
            </p>

            <div>
                <label className="block text-sm font-medium mb-1">Токен сброса</label>
                <Input
                    required
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Введите токен из email"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Новый пароль</label>
                <InputGroup>
                    <InputGroupAddon><Lock /></InputGroupAddon>
                    <InputGroupInput
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Введите новый пароль"
                    />
                </InputGroup>
                <p className="text-xs text-muted-foreground mt-1">
                    Минимум 8 символов, включая заглавные, строчные буквы, цифры и спецсимволы
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Подтвердите пароль</label>
                <InputGroup>
                    <InputGroupAddon><Lock /></InputGroupAddon>
                    <InputGroupInput
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Повторите новый пароль"
                    />
                </InputGroup>
            </div>

            {passwordError && (
                <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                    <p className="text-sm text-destructive">{passwordError}</p>
                </div>
            )}

            <div className="mt-4 p-4 bg-muted rounded-lg">
                <h3 className="text-sm font-medium mb-2">Требования к паролю:</h3>
                <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• От 8 до 100 символов</li>
                    <li>• Минимум одна заглавная буква (A-Z)</li>
                    <li>• Минимум одна строчная буква (a-z)</li>
                    <li>• Минимум одна цифра (0-9)</li>
                    <li>• Минимум один специальный символ (@#$%^&+=)</li>
                </ul>
            </div>

            <div className="flex gap-3">
                {onCancel && (
                    <Button variant="outline" size="lg" type="button" onClick={onCancel} className="flex-1">
                        Отмена
                    </Button>
                )}
                <Button type="submit" size="lg" className="flex-1">
                    Сбросить пароль
                </Button>
            </div>
        </form>
    );
}
