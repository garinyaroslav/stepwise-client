import { useState } from 'react';
import { PasswordResetForm } from '@/components/general/PasswordResetForm';
import { PasswordResetRequestForm } from '@/components/general/PasswordResetRequestForm';
import { useSearchParams, useNavigate } from 'react-router';

export function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const tokenFromUrl = searchParams.get('token') ?? '';

    const [step, setStep] = useState<'request' | 'reset'>(
        tokenFromUrl ? 'reset' : 'request'
    );

    return (
        <div className="flex justify-center items-center size-full">
            <div className="w-full max-w-md rounded-md border border-border bg-card p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-center mb-6">Сброс пароля</h2>

                {step === 'request' && (
                    <PasswordResetRequestForm
                        onSuccess={() => setStep('reset')}
                    />
                )}

                {step === 'reset' && (
                    <PasswordResetForm
                        initialToken={tokenFromUrl}
                        onSuccess={() => navigate('/login')}
                        onCancel={() => setStep('request')}
                    />
                )}
            </div>
        </div>
    );
}
