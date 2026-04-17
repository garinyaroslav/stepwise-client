import { approveProjectForDefense, getAcademicWorkById, getProjectsByWorkForTeacher } from '@/api/endpoints';
import { DefendProjectModal } from '@/components/teacher/DefendProjectModal';
import { DefenseCalendar } from '@/components/teacher/DefenseCalendar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { AcademicWork } from '@/types/AcademicWork';
import { ExplanatoryNoteItem } from '@/types/ExplanatoryNoteItem';
import { ItemStatus } from '@/types/ItemStatus';
import { ProjectDetails } from '@/types/ProjectDetails';
import { ProjectStatus } from '@/types/ProjectStatus';
import {
    ArrowLeft,
    Award, BarChart2,
    CheckCircle,
    ChevronRight,
    Clock,
    FileText,
    Users,
    XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';

const statusConfig: Record<ItemStatus, {
    label: string; color: string; bgColor: string;
    borderColor: string; dotColor: string; icon: React.ComponentType<any>
}> = {
    DRAFT: { label: 'Черновик', color: 'text-muted-foreground', bgColor: 'bg-muted', borderColor: 'border-border', dotColor: 'bg-muted-foreground', icon: FileText },
    SUBMITTED: { label: 'На проверке', color: 'text-chart-4', bgColor: 'bg-chart-4/10', borderColor: 'border-chart-4/40', dotColor: 'bg-chart-4', icon: Clock },
    APPROVED: { label: 'Одобрено', color: 'text-success', bgColor: 'bg-success/10', borderColor: 'border-success/40', dotColor: 'bg-success', icon: CheckCircle },
    REJECTED: { label: 'Отклонено', color: 'text-destructive', bgColor: 'bg-destructive/10', borderColor: 'border-destructive/40', dotColor: 'bg-destructive', icon: XCircle },
};

export function StudentWorksTablePage() {
    const { workId } = useParams<{ workId: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const [work, setWork] = useState<AcademicWork | null>(null);
    const [projects, setProjects] = useState<ProjectDetails[]>([]);
    const [isLoadingWork, setIsLoadingWork] = useState(true);
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [defendTarget, setDefendTarget] = useState<ProjectDetails | null>(null);

    const id = Number(workId);

    useEffect(() => {
        if (!id) return;
        setIsLoadingWork(true);
        getAcademicWorkById(id)
            .then(setWork)
            .catch(() => setError('Не удалось загрузить данные работы'))
            .finally(() => setIsLoadingWork(false));
    }, [id]);

    useEffect(() => {
        if (!id) return;
        setIsLoadingProjects(true);
        getProjectsByWorkForTeacher(id)
            .then(setProjects)
            .catch(() => setError('Не удалось загрузить проекты студентов'))
            .finally(() => setIsLoadingProjects(false));
    }, [id]);

    const handleItemClick = (item: ExplanatoryNoteItem, project: ProjectDetails) => {
        if (item.status === ItemStatus.DRAFT) return;
        navigate(
            `/teacher/dashboard/works/${id}/item/${item.id}`,
            {
                state: {
                    backgroundLocation: location,
                    item,
                    project,
                    chapterTitle: work?.chapters.find((ch) => ch.index === item.orderNumber)?.title ?? '',
                },
            }
        );
    };

    const handleDefendSuccess = (projectId: number, grade: number) => {
        setProjects((prev) =>
            prev.map((p) => p.id === projectId
                ? { ...p, status: ProjectStatus.DEFENDED, grade }
                : p
            )
        );
    };

    const handleApproveDefense = async (projectId: number) => {
        try {
            await approveProjectForDefense(projectId);
            setProjects((prev) =>
                prev.map((p) => p.id === projectId ? { ...p, approvedForDefense: true } : p)
            );
        } catch {
            setError('Не удалось допустить студента к защите');
        }
    };

    const refreshProjects = async () => {
        if (!id) return;
        try {
            const updated = await getProjectsByWorkForTeacher(id);
            setProjects(updated);
        } catch { }
    };

    const isLoading = isLoadingWork || isLoadingProjects;

    const totalStudents = projects.length;
    const approvedDefense = projects.filter((p) => p.status === ProjectStatus.APPROVED_FOR_DEFENSE).length;
    const pendingReview = projects.reduce((acc, p) => acc + p.items.filter((i) => i.status === 'SUBMITTED').length, 0);
    const totalApproved = projects.reduce((acc, p) => acc + p.items.filter((i) => i.status === 'APPROVED').length, 0);
    const totalItems = projects.reduce((acc, p) => acc + p.items.length, 0);
    const progressPercent = totalItems > 0 ? Math.round((totalApproved / totalItems) * 100) : 0;

    return (
        <div className="space-y-5">
            <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={() => navigate('/teacher/dashboard')}>
                    <ArrowLeft className="w-4 h-4" /> Назад
                </Button>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Работы студентов</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                    {work && (
                        <>
                            <span className="text-muted-foreground">{work.groupName}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                            <span className="text-card-foreground font-medium">{work.title}</span>
                        </>
                    )}
                </div>
            </div>

            {error && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            {!isLoading && projects.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Студентов</p>
                            <p className="font-semibold text-card-foreground">{totalStudents}</p>
                        </div>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-chart-4/10 flex items-center justify-center flex-shrink-0">
                            <Clock className="w-5 h-5 text-chart-4" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">На проверке</p>
                            <p className="font-semibold text-card-foreground">{pendingReview}</p>
                        </div>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                            <Award className="w-5 h-5 text-success" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Допущено к защите</p>
                            <p className="font-semibold text-card-foreground">{approvedDefense}</p>
                        </div>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <BarChart2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Общий прогресс</p>
                            <div className="flex items-center gap-2">
                                <p className="font-semibold text-card-foreground">{progressPercent}%</p>
                                <Progress value={progressPercent} className="w-14 h-1.5" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="bg-card border border-border rounded-xl p-12 text-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">Загрузка данных...</p>
                </div>
            ) : projects.length === 0 ? (
                <div className="bg-card border border-border rounded-xl p-12 text-center">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
                    <h3 className="font-semibold text-card-foreground mb-1">Нет студентов</h3>
                    <p className="text-muted-foreground text-sm">По данной работе нет проектов студентов</p>
                </div>
            ) : (
                <div className="bg-card border border-border rounded-xl">
                    <div className="px-6 py-4 border-b border-border bg-card rounded-t-xl">
                        <h2 className="font-semibold text-card-foreground">{work?.title}</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {work?.groupName} · {projects.length} студентов
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide min-w-[220px] bg-muted/60 border-r border-border/80">
                                        Студент
                                    </th>
                                    {work?.chapters.map((chapter) => (
                                        <th key={chapter.index} className="px-5 py-4 text-left bg-muted/60 min-w-[185px]">
                                            <div className="text-card-foreground font-semibold text-sm">{chapter.title}</div>
                                            {chapter.deadline && (
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    до {new Date(chapter.deadline).toLocaleDateString('ru-RU')}
                                                </div>
                                            )}
                                        </th>
                                    ))}
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide min-w-[150px] bg-muted/60 border-l border-border/80">
                                        Защита
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {projects.map((project) => {
                                    const totalWorkCount = work?.chapters.length;
                                    const allApproved = project.items.every((i) => i.status === ItemStatus.APPROVED) && project.items.length === totalWorkCount;
                                    const approvedCount = project.items.filter((i) => i.status === ItemStatus.APPROVED).length;

                                    return (
                                        <tr key={project.id} className="transition-colors hover:bg-accent/40 bg-card">
                                            <td className="px-6 py-4 sticky left-0 z-30 border-r border-border bg-card shadow-[2px_0_8px_-2px_rgb(0,0,0,0.07)]">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                        <span className="text-sm font-semibold text-primary">
                                                            {project.owner?.lastName?.[0]}{project.owner?.firstName?.[0]}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-card-foreground">
                                                            {project.owner?.lastName} {project.owner?.firstName?.[0]}.{project.owner?.middleName?.[0]}.
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div className="flex gap-0.5">
                                                                {project.items.map((item) => (
                                                                    <div key={item.id} className={`w-1.5 h-1.5 rounded-full ${statusConfig[item.status].dotColor}`} />
                                                                ))}
                                                            </div>
                                                            <span className="text-xs text-muted-foreground">{approvedCount}/{totalWorkCount}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {work?.chapters.map((chapter) => {
                                                const item = project.items.find((i) => i.orderNumber === chapter.index);
                                                if (!item) return <td key={chapter.index} className="px-5 py-4" />;

                                                const cfg = statusConfig[item.status];
                                                const StatusIcon = cfg.icon;
                                                const isClickable = item.status !== ItemStatus.DRAFT;

                                                return (
                                                    <td key={chapter.index} className="px-5 py-4">
                                                        <button
                                                            onClick={() => handleItemClick(item, project)}
                                                            disabled={!isClickable}
                                                            className={cn(
                                                                'w-full px-4 py-3 rounded-2xl border flex items-center gap-2.5 text-left transition-all',
                                                                cfg.bgColor, cfg.borderColor,
                                                                isClickable
                                                                    ? 'hover:shadow hover:-translate-y-px active:scale-[0.985] cursor-pointer'
                                                                    : 'opacity-40 cursor-default'
                                                            )}
                                                        >
                                                            <StatusIcon className={`w-4 h-4 ${cfg.color}`} />
                                                            <span className={`font-medium text-sm ${cfg.color}`}>{cfg.label}</span>
                                                        </button>
                                                    </td>
                                                );
                                            })}

                                            <td className="px-6 py-4 sticky right-0 z-30 border-l border-border bg-card">
                                                <div className="flex justify-center">
                                                    {project.status === ProjectStatus.DEFENDED ? (
                                                        <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary/10 border border-primary/30 rounded-2xl">
                                                            <Award className="w-4 h-4 text-primary" />
                                                            <span className="text-base font-semibold text-primary">{project.grade ?? '—'}</span>
                                                        </div>
                                                    ) : project.status === ProjectStatus.APPROVED_FOR_DEFENSE ? (
                                                        <div className="flex flex-col items-center gap-2">
                                                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/30 rounded-2xl">
                                                                <CheckCircle className="w-4 h-4 text-success" />
                                                                <span className="text-sm font-medium text-success">Допущен</span>
                                                            </div>
                                                            <Button size="sm" variant="outline" onClick={() => setDefendTarget(project)}>
                                                                Защитить
                                                            </Button>
                                                        </div>
                                                    ) : allApproved ? (
                                                        <Button size="sm" onClick={() => handleApproveDefense(project.id)}>
                                                            Допустить
                                                        </Button>
                                                    ) : (
                                                        <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-muted border border-border rounded-2xl">
                                                            <Clock className="w-4 h-4 text-muted-foreground" />
                                                            <span className="text-sm text-muted-foreground">Ожидание</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {!isLoading && projects.length > 0 && (
                <div className="flex items-center gap-6 px-1">
                    <span className="text-xs text-muted-foreground">Статусы:</span>
                    {(Object.entries(statusConfig) as [ItemStatus, typeof statusConfig[ItemStatus]][]).map(([key, cfg]) => (
                        <div key={key} className="flex items-center gap-1.5">
                            <div className={cn('w-2 h-2 rounded-full', cfg.dotColor)} />
                            <span className="text-xs text-muted-foreground">{cfg.label}</span>
                        </div>
                    ))}
                </div>
            )}

            {workId && work && (
                <DefenseCalendar
                    academicWorkId={Number(workId)}
                    workTitle={work.title}
                />
            )}

            {defendTarget && (
                <DefendProjectModal
                    project={defendTarget}
                    onClose={() => setDefendTarget(null)}
                    onSuccess={handleDefendSuccess}
                />
            )}
        </div>
    );
}
