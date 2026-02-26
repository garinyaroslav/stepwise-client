import { ArrowLeft, Edit, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { WorkTemplate } from '@/types/WorkTemplate';
import { useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { getTemplate } from '@/api/endpoints';

export function TemplateDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [template, setTemplate] = useState<WorkTemplate | null>(null);

    useEffect(() => {
        (async () => {
            const t = await getTemplate(Number(id));
            setTemplate(t);
        })();
    }, [id]);

    const onEdit = () => { };

    if (!template) {
        return <TemplateDetailSkeleton />;
    }

    return (
        <div>
            <div className="mb-6">
                <Button variant="ghost" onClick={() => navigate("/teacher/dashboard/template")} className="mb-4 text-muted-foreground hover:text-foreground px-0">
                    <ArrowLeft className="w-5 h-5" />
                    Назад к списку шаблонов
                </Button>

                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-semibold">{template.title}</h1>
                            <span className="px-3 py-1 bg-secondary text-secondary-foreground text-sm font-medium rounded-full">
                                {template.type}
                            </span>
                        </div>
                        <p className="text-muted-foreground">{template.description}</p>
                    </div>
                    <Button onClick={onEdit}>
                        <Edit className="w-4 h-4" />
                        Редактировать
                    </Button>
                </div>
            </div>

            <div className="bg-card text-card-foreground rounded-lg border border-border p-6 mb-6">
                <h2 className="font-semibold mb-4">Детали работы</h2>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Название работы</label>
                        <p className="text-foreground">{template.workTitle}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                            Дата создания шаблона
                        </label>
                        <p className="text-foreground">
                            {new Date(template.createdAt).toLocaleDateString('ru-RU', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Описание работы</label>
                        <p className="text-foreground">{template.workDescription}</p>
                    </div>
                </div>
            </div>

            <div className="bg-card text-card-foreground rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-semibold">
                        Разделы пояснительной записки ({template.chapters.length})
                    </h2>
                </div>

                {template.chapters.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        В этом шаблоне пока нет разделов
                    </div>
                ) : (
                    <div className="space-y-4">
                        {template.chapters.map((chapter, index) => (
                            <div
                                key={chapter.index}
                                className="p-5 border border-border rounded-lg hover:border-primary/50 transition-colors"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full font-semibold flex-shrink-0 text-sm">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg mb-2">{chapter.title}</h3>
                                        <p className="text-muted-foreground text-sm mb-3">{chapter.description}</p>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="w-4 h-4" />
                                            <span>
                                                Срок сдачи:{' '}
                                                <span className="font-medium text-foreground">
                                                    {new Date(chapter.deadline).toLocaleDateString('ru-RU', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                    <FileText className="w-6 h-6 text-muted-foreground flex-shrink-0" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {template.chapters.length > 0 && (
                <div className="bg-card text-card-foreground rounded-lg border border-border p-6 mt-6">
                    <h2 className="font-semibold mb-6">Временная шкала разделов</h2>
                    <div className="relative">
                        {[...template.chapters]
                            .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                            .map((chapter, index, arr) => (
                                <div key={chapter.index} className="flex items-start gap-4 mb-6 last:mb-0">
                                    <div className="flex flex-col items-center">
                                        <div className="w-3 h-3 bg-primary rounded-full" />
                                        {index < arr.length - 1 && (
                                            <div className="w-0.5 h-12 bg-secondary my-1" />
                                        )}
                                    </div>
                                    <div className="flex-1 pb-4">
                                        <div className="text-sm font-medium text-foreground mb-1">{chapter.title}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {new Date(chapter.deadline).toLocaleDateString('ru-RU')}
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function TemplateDetailSkeleton() {
    return (
        <div>
            {/* Header skeleton */}
            <div className="mb-6">
                <Skeleton className="h-5 w-48 mb-4" />
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <Skeleton className="h-8 w-96" />
                            <Skeleton className="h-6 w-28 rounded-full" />
                        </div>
                        <Skeleton className="h-4 w-72 mt-1" />
                    </div>
                    <Skeleton className="h-9 w-36 rounded-md" />
                </div>
            </div>

            {/* Work details skeleton */}
            <div className="bg-card rounded-lg border border-border p-6 mb-6">
                <Skeleton className="h-5 w-32 mb-4" />
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-5 w-40" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-5 w-44" />
                    </div>
                    <div className="col-span-2 space-y-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-5 w-full" />
                    </div>
                </div>
            </div>

            {/* Chapters skeleton */}
            <div className="bg-card rounded-lg border border-border p-6">
                <Skeleton className="h-5 w-64 mb-6" />
                <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="p-5 border border-border rounded-lg">
                            <div className="flex items-start gap-4">
                                <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-5 w-48" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-36 mt-1" />
                                </div>
                                <Skeleton className="w-6 h-6 flex-shrink-0" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Timeline skeleton */}
            <div className="bg-card rounded-lg border border-border p-6 mt-6">
                <Skeleton className="h-5 w-48 mb-6" />
                <div className="space-y-0">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-start gap-4 mb-6 last:mb-0">
                            <div className="flex flex-col items-center">
                                <Skeleton className="w-3 h-3 rounded-full" />
                                {i < 3 && <Skeleton className="w-0.5 h-12 my-1" />}
                            </div>
                            <div className="flex-1 pb-4 space-y-1.5">
                                <Skeleton className="h-4 w-36" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
