import { FormEvent, FC, useState } from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { passwordResetReq } from '@/api/endpoints';
import { HttpStatusCode } from 'axios';
import { toast } from 'sonner';

interface Props {
    email?: string;
    onSuccess: () => void;
    onCancel?: () => void;
}

export const PasswordResetRequestForm: FC<Props> = ({ email: initialEmail = '', onSuccess, onCancel }) => {
    const [email, setEmail] = useState(initialEmail);
    const isEmailFixed = !!initialEmail;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const res = await passwordResetReq(email);
            if (res.status !== HttpStatusCode.Ok) throw new Error();
            toast.success('Ссылка для сброса пароля отправлена на email');
            onSuccess();
        } catch {
            toast.error('Произошла ошибка при отправке ссылки, проверьте адрес электронной почты');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-muted-foreground">
                На email будет отправлена ссылка для сброса пароля
            </p>

            <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <InputGroup>
                    <InputGroupAddon><Mail /></InputGroupAddon>
                    <InputGroupInput
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isEmailFixed}
                        placeholder="your.email@university.edu"
                    />
                </InputGroup>
            </div>

            <div className="flex gap-3">
                {onCancel && (
                    <Button variant="outline" size="lg" type="button" onClick={onCancel} className="flex-1">
                        Отмена
                    </Button>
                )}
                <Button size="lg" type="submit" className="flex-1">
                    Отправить ссылку
                </Button>
            </div>
        </form>
    );
};
