import { useState } from 'react';
import { X, Award, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { defendProject } from '@/api/endpoints';
import { ProjectDetails } from '@/types/ProjectDetails';
import { cn } from '@/lib/utils';

interface Props {
    project: ProjectDetails;
    onClose: () => void;
    onSuccess: (projectId: number, grade: number) => void;
}

const GRADE_LABELS: Record<number, { label: string; color: string; bg: string; border: string }> = {
    1: { label: 'Неудовлетворительно', color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/40' },
    2: { label: 'Неудовлетворительно', color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/40' },
    3: { label: 'Удовлетворительно', color: 'text-chart-4', bg: 'bg-chart-4/10', border: 'border-chart-4/40' },
    4: { label: 'Хорошо', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/40' },
    5: { label: 'Отлично', color: 'text-success', bg: 'bg-success/10', border: 'border-success/40' },
};

export function DefendProjectModal({ project, onClose, onSuccess }: Props) {
    const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!selectedGrade) return;
        setIsLoading(true);
        setError(null);
        try {
            await defendProject(project.id, selectedGrade);
            onSuccess(project.id, selectedGrade);
            onClose();
        } catch {
            setError('Не удалось выставить оценку. Попробуйте снова.');
        } finally {
            setIsLoading(false);
        }
    };

    const cfg = selectedGrade ? GRADE_LABELS[selectedGrade] : null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-md mx-4">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Award className="w-4 h-4 text-primary" />
                        </div>
                        <h2 className="font-semibold text-card-foreground">Выставить оценку за защиту</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-card-foreground transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="px-6 py-5 space-y-5">
                    <div className="flex items-center gap-3 p-3.5 bg-muted/50 rounded-xl border border-border">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-semibold text-primary">
                                {project.owner?.lastName?.[0]}{project.owner?.firstName?.[0]}
                            </span>
                        </div>
                        <div>
                            <p className="font-medium text-card-foreground text-sm">
                                {project.owner?.lastName} {project.owner?.firstName} {project.owner?.middleName}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{project.title}</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground mb-3">Выберите оценку</p>
                        <div className="flex gap-2">
                            {[2, 3, 4, 5].map((grade) => {
                                const isSelected = selectedGrade === grade;
                                const gcfg = GRADE_LABELS[grade];
                                return (
                                    <button
                                        key={grade}
                                        onClick={() => setSelectedGrade(grade)}
                                        className={cn(
                                            'flex-1 h-14 rounded-xl border font-bold text-xl transition-all',
                                            isSelected
                                                ? `${gcfg.bg} ${gcfg.border} ${gcfg.color} scale-105 shadow-sm`
                                                : 'bg-muted border-border text-muted-foreground hover:bg-accent hover:border-border hover:text-card-foreground'
                                        )}
                                    >
                                        {grade}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-3 h-7 flex items-center">
                            {cfg && (
                                <div className={cn('inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-medium', cfg.bg, cfg.color)}>
                                    <Star className="w-3.5 h-3.5" />
                                    {cfg.label}
                                </div>
                            )}
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
                            {error}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2.5 px-6 py-4 border-t border-border">
                    <Button variant="outline" className="flex-1" onClick={onClose} disabled={isLoading}>
                        Отмена
                    </Button>
                    <Button
                        className="flex-1"
                        disabled={!selectedGrade || isLoading}
                        onClick={handleSubmit}
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                Сохранение...
                            </span>
                        ) : 'Подтвердить'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
