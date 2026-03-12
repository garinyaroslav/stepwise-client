import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
    ArrowLeft,
    FileText,
    Upload,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    Download,
    History,
    Mail,
    User,
    Pencil,
    X,
    Check,
    CalendarClock,
} from 'lucide-react';
import { ItemStatus } from '@/types/ItemStatus';
import { ProjectDetails } from '@/types/ProjectDetails';
import { AcademicWork } from '@/types/AcademicWork';
import { getStudentProjectByWorkId, getAcademicWorkById, updateProject } from '@/api/endpoints';
import { toast } from 'sonner';
import { format, isPast, formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const statusConfig: Record<
    ItemStatus,
    { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ComponentType<{ className?: string }> }
> = {
    DRAFT: { label: 'Черновик', variant: 'secondary', icon: FileText },
    SUBMITTED: { label: 'На проверке', variant: 'outline', icon: Clock },
    APPROVED: { label: 'Одобрено', variant: 'default', icon: CheckCircle },
    REJECTED: { label: 'Отклонено', variant: 'destructive', icon: XCircle },
};

function ProjectSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-5 w-32" />
            <Card>
                <CardContent className="p-6 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                        <Skeleton className="h-7 w-2/3" />
                        <Skeleton className="h-8 w-32" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <div className="flex gap-2 pt-1">
                        <Skeleton className="h-6 w-28 rounded-full" />
                        <Skeleton className="h-6 w-24 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                </CardContent>
            </Card>
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <Card key={i}>
                        <CardContent className="p-6">
                            <div className="flex items-start gap-3 mb-4">
                                <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-5 w-1/3" />
                                    <Skeleton className="h-3.5 w-3/4" />
                                </div>
                                <Skeleton className="h-6 w-24 rounded-full" />
                            </div>
                            <Separator className="mb-4 bg-input" />
                            <Skeleton className="h-9 w-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export function StudentWorkDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [work, setWork] = useState<AcademicWork | null>(null);
    const [project, setProject] = useState<ProjectDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [uploadingItemId, setUploadingItemId] = useState<number | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [expandedHistory, setExpandedHistory] = useState<number | null>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const fetchData = async () => {
        try {
            const [workData, projectsData] = await Promise.all([
                getAcademicWorkById(Number(id)),
                getStudentProjectByWorkId(Number(id)),
            ]);
            setWork(workData);
            setProject(Array.isArray(projectsData) ? projectsData[0] ?? null : projectsData);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleStartEdit = () => {
        if (!project) return;
        setEditTitle(project.title);
        setEditDescription(project.description ?? '');
        setIsEditing(true);
    };

    const handleCancelEdit = () => setIsEditing(false);

    const handleSaveEdit = async () => {
        if (!project || !editTitle.trim()) return;
        setIsSaving(true);
        try {
            await updateProject({ id: project.id, title: editTitle.trim(), description: editDescription.trim() });
            toast.success('Проект обновлён');
            setIsEditing(false);
            await fetchData();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Ошибка сохранения');
        } finally {
            setIsSaving(false);
        }
    };

    const handleFileSelect = (key: number, file: File) => {
        setSelectedFile(file);
        setUploadingItemId(key);
    };

    const handleUpload = async (key: number) => {
        if (!selectedFile) return;
        try {
            const formData = new FormData();
            formData.append('projectId', id!);
            formData.append('file', selectedFile);
            console.log('Uploading file for item:', key);
            setTimeout(() => { setUploadingItemId(null); setSelectedFile(null); }, 1000);
        } catch (error) {
            console.error('Failed to upload file:', error);
        }
    };

    const handleSubmit = async (itemId: number) => {
        try {
            console.log('Submitting item:', itemId);
        } catch (error) {
            console.error('Failed to submit item:', error);
        }
    };

    if (isLoading) return <ProjectSkeleton />;

    if (!work || !project) {
        return (
            <div className="space-y-6">
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2 text-muted-foreground">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Назад к работам
                </Button>
                <Card>
                    <CardContent className="p-12 text-center">
                        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-card-foreground">Проект не найден</h3>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const allItemsApproved = project.items.length > 0 && project.items.every((i) => i.status === 'APPROVED');
    const chapters = work.chapters ?? [];

    return (
        <div className="space-y-6">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2 text-muted-foreground">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Назад к работам
            </Button>

            <Card>
                <CardContent className="p-6">
                    {isEditing ? (
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <Label>Название проекта</Label>
                                <Input
                                    autoFocus
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    placeholder="Название проекта"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Описание</Label>
                                <Textarea
                                    rows={3}
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    placeholder="Описание проекта"
                                    className="resize-none"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Button size="sm" onClick={handleSaveEdit} disabled={isSaving || !editTitle.trim()}>
                                    {isSaving
                                        ? <div className="w-3.5 h-3.5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-1.5" />
                                        : <Check className="w-3.5 h-3.5 mr-1.5" />}
                                    Сохранить
                                </Button>
                                <Button variant="outline" size="sm" onClick={handleCancelEdit} disabled={isSaving}>
                                    <X className="w-3.5 h-3.5 mr-1.5" />
                                    Отмена
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-start justify-between gap-4 mb-2">
                                <h1 className="text-2xl font-semibold text-card-foreground">{project.title}</h1>
                                <Button variant="outline" size="sm" onClick={handleStartEdit} className="flex-shrink-0">
                                    <Pencil className="w-3.5 h-3.5 mr-1.5" />
                                    Редактировать
                                </Button>
                            </div>
                            {project.description && (
                                <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                            )}
                            <Separator className="mb-4 bg-input" />
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="secondary" className="rounded-full font-normal text-sm gap-1.5 py-1">
                                    <User className="w-3 h-3" />
                                    {work.teacherLastName} {work.teacherName?.[0]}.{work.teacherMiddleName?.[0]}.
                                </Badge>
                                <Badge variant="secondary" className="rounded-full font-normal text-sm gap-1.5 py-1">
                                    <FileText className="w-3 h-3" />
                                    {work.groupName}
                                </Badge>
                                <Badge variant="outline" className="rounded-full font-normal text-sm gap-1.5 py-1">
                                    <Clock className="w-3 h-3" />
                                    {work.countOfChapters} {work.countOfChapters === 1 ? 'раздел' : work.countOfChapters < 5 ? 'раздела' : 'разделов'}
                                </Badge>
                            </div>
                        </>
                    )}

                    {!isEditing && allItemsApproved && (
                        <div className={`mt-5 p-4 rounded-lg border ${project.isApprovedForDefense ? 'bg-success/10 border-success' : 'bg-chart-4/10 border-chart-4'}`}>
                            {project.isApprovedForDefense ? (
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-card-foreground mb-1">Допущен к защите</p>
                                        <p className="text-sm text-muted-foreground">Свяжитесь с преподавателем для согласования даты защиты.</p>
                                        <Button variant="link" size="sm" className="px-0 mt-1 h-auto text-primary">
                                            <Mail className="w-3.5 h-3.5 mr-1.5" />
                                            Написать преподавателю
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-start gap-3">
                                    <Clock className="w-5 h-5 text-chart-4 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-card-foreground mb-1">Ожидание допуска к защите</p>
                                        <p className="text-sm text-muted-foreground">Все разделы одобрены. Ожидайте решения преподавателя.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="space-y-4">
                {chapters.map((chapter, index) => {
                    const item = project.items.find((i) => i.orderNumber === index);
                    const deadline = chapter.deadline ? new Date(chapter.deadline) : null;
                    const isOverdue = deadline ? isPast(deadline) : false;

                    const prevItem = index === 0 ? null : project.items.find((i) => i.orderNumber === index - 1);
                    const chapterUnlocked = index === 0 || prevItem?.status === 'APPROVED';

                    const canSubmit = item?.status === 'DRAFT' && item?.fileName;
                    const needsReupload = item?.status === 'REJECTED';
                    const fileInputId = `file-chapter-${index}`;
                    const uploadKey = item?.id ?? -(index + 1);

                    return (
                        <Card key={chapter.index} className="overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div className="flex items-start gap-3 flex-1">
                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <span className="font-semibold text-primary text-sm">{index + 1}</span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg mb-1 text-card-foreground">{chapter.title}</h3>
                                            {chapter.description && (
                                                <p className="text-sm text-muted-foreground mb-2">{chapter.description}</p>
                                            )}
                                            {deadline && (() => {
                                                const approved = item?.status === 'APPROVED';
                                                const overdue = isOverdue && !approved;
                                                return (
                                                    <div className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full border mt-1 ${approved
                                                        ? 'bg-success/10 border-success/30 text-success'
                                                        : overdue
                                                            ? 'bg-destructive/10 border-destructive/30 text-destructive'
                                                            : 'bg-muted border-border text-muted-foreground'
                                                        }`}>
                                                        <CalendarClock className="w-3 h-3 flex-shrink-0" />
                                                        <span>{format(deadline, 'd MMM yyyy', { locale: ru })}</span>
                                                        <span className="opacity-50">·</span>
                                                        <span>
                                                            {approved
                                                                ? 'сдано вовремя'
                                                                : overdue
                                                                    ? 'просрочено'
                                                                    : formatDistanceToNow(deadline, { locale: ru, addSuffix: true })}
                                                        </span>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                    {item ? (
                                        <Badge variant={statusConfig[item.status].variant} className="flex-shrink-0 gap-1.5">
                                            {(() => { const Icon = statusConfig[item.status].icon; return <Icon className="w-3 h-3" />; })()}
                                            {statusConfig[item.status].label}
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="flex-shrink-0 gap-1.5 text-sm text-muted-foreground">
                                            <FileText className="w-3 h-3" />
                                            Не начат
                                        </Badge>
                                    )}
                                </div>

                                <Separator className="mb-4 bg-input" />

                                {chapterUnlocked ? (
                                    <div className="space-y-3">
                                        {needsReupload && item && item.history.length > 0 && (
                                            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-2">
                                                <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                                                <div className="text-sm">
                                                    <p className="font-medium text-card-foreground mb-0.5">Требуется доработка</p>
                                                    <p className="text-muted-foreground">
                                                        {item.history[0]?.teacherComment || 'Работа отклонена преподавателем'}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {item?.status === 'APPROVED' ? (
                                            <div className="flex items-center gap-2 text-sm text-success">
                                                <CheckCircle className="w-4 h-4" />
                                                Раздел одобрен преподавателем
                                            </div>
                                        ) : item?.status === 'SUBMITTED' ? (
                                            <div className="flex items-center gap-2 text-sm text-chart-4">
                                                <Clock className="w-4 h-4" />
                                                Файл отправлен на проверку, ожидайте ответа преподавателя
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="file"
                                                        id={fileInputId}
                                                        onChange={(e) => {
                                                            const f = e.target.files?.[0];
                                                            if (f) handleFileSelect(uploadKey, f);
                                                        }}
                                                        className="hidden"
                                                        accept=".pdf"
                                                    />
                                                    <Label
                                                        htmlFor={fileInputId}
                                                        className="flex-1 h-9 px-3 border border-input rounded-md cursor-pointer hover:bg-accent transition-colors text-sm text-muted-foreground flex items-center gap-2 font-normal"
                                                    >
                                                        <Upload className="w-4 h-4 flex-shrink-0" />
                                                        <span className="truncate">
                                                            {selectedFile && uploadingItemId === uploadKey
                                                                ? selectedFile.name
                                                                : item?.fileName || 'Выберите файл (.pdf)'}
                                                        </span>
                                                    </Label>
                                                    {canSubmit && item && (
                                                        <Button size="sm" onClick={() => handleSubmit(item.id)}>
                                                            Отправить на проверку
                                                        </Button>
                                                    )}
                                                </div>
                                                {selectedFile && uploadingItemId === uploadKey && (
                                                    <Button
                                                        variant="outline"
                                                        className="w-full border-success text-success hover:bg-success/10 hover:text-success"
                                                        onClick={() => handleUpload(uploadKey)}
                                                    >
                                                        <Upload className="w-4 h-4 mr-2" />
                                                        Загрузить файл
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <AlertCircle className="w-4 h-4" />
                                        Необходимо одобрение предыдущего раздела
                                    </div>
                                )}
                            </CardContent>

                            {item && item.history.length > 0 && (
                                <>
                                    <Separator className="bg-input" />
                                    <button
                                        onClick={() => setExpandedHistory(expandedHistory === item.id ? null : item.id)}
                                        className="w-full px-6 py-3 flex items-center justify-between hover:bg-accent transition-colors text-left"
                                    >
                                        <span className="text-sm font-medium text-card-foreground flex items-center gap-2">
                                            <History className="w-4 h-4 text-muted-foreground" />
                                            История ({item.history.length})
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {expandedHistory === item.id ? 'Скрыть' : 'Показать'}
                                        </span>
                                    </button>

                                    {expandedHistory === item.id && (
                                        <div className="px-6 pb-4 space-y-3">
                                            {item.history.map((h) => (
                                                <div key={h.id} className="p-4 bg-muted/40 rounded-lg border border-border">
                                                    <div className="flex items-start justify-between gap-4 mb-2">
                                                        <div className="flex items-center gap-2 min-w-0">
                                                            <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                                            <span className="text-sm font-medium text-card-foreground truncate">
                                                                {h.fileName ?? '—'}
                                                            </span>
                                                        </div>
                                                        <Badge
                                                            variant={statusConfig[h.newStatus]?.variant ?? 'secondary'}
                                                            className="flex-shrink-0 text-xs"
                                                        >
                                                            {statusConfig[h.newStatus]?.label ?? h.newStatus}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mb-2">
                                                        {new Date(h.changedAt).toLocaleString('ru-RU')}
                                                    </p>
                                                    {h.teacherComment && (
                                                        <div className="mt-2 p-3 bg-background rounded-md border border-border flex items-start gap-2">
                                                            <User className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                                                            <div>
                                                                <p className="text-xs text-muted-foreground mb-1">
                                                                    {h.changedBy?.lastName && h.changedBy?.firstName
                                                                        ? `${h.changedBy.lastName} ${h.changedBy.firstName[0]}.`
                                                                        : 'Преподаватель'}
                                                                </p>
                                                                <p className="text-sm text-card-foreground">{h.teacherComment}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {h.fileName && (
                                                        <Button variant="link" size="sm" className="mt-1 px-0 h-auto text-xs gap-1.5">
                                                            <Download className="w-3 h-3" />
                                                            Скачать файл
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
