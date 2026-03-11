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

const statusConfig: Record<
    ItemStatus,
    { label: string; color: string; icon: React.ComponentType<{ className?: string }> }
> = {
    DRAFT: { label: 'Черновик', color: 'text-muted-foreground bg-muted', icon: FileText },
    SUBMITTED: { label: 'На проверке', color: 'text-chart-4 bg-chart-4/10', icon: Clock },
    APPROVED: { label: 'Одобрено', color: 'text-success bg-success/10', icon: CheckCircle },
    REJECTED: { label: 'Отклонено', color: 'text-destructive bg-destructive/10', icon: XCircle },
};

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

    const handleFileSelect = (itemId: number, file: File) => {
        setSelectedFile(file);
        setUploadingItemId(itemId);
    };

    const handleUpload = async (itemId: number) => {
        if (!selectedFile) return;
        try {
            const formData = new FormData();
            formData.append('projectId', id!);
            formData.append('file', selectedFile);
            console.log('Uploading file for item:', itemId);
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
            <div className="bg-background">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-primary hover:text-primary-hover mb-6 transition-colors text-sm">
                    <ArrowLeft className="w-4 h-4" />
                    Назад к работам
                </button>
                <div className="bg-card border border-border rounded-lg p-12 text-center">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2 text-card-foreground">Проект не найден</h3>
                </div>
            </div>
        );
    }

    const allItemsApproved = project.items.length > 0 && project.items.every((i) => i.status === 'APPROVED');
    const chapters = work.chapters ?? [];

    return (
        <div>
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-primary hover:text-primary-hover mb-6 transition-colors text-sm">
                <ArrowLeft className="w-4 h-4" />
                Назад к работам
            </button>

            <div className="bg-card border border-border rounded-lg p-6 mb-6">
                {isEditing ? (
                    <div>
                        <div className="mb-4">
                            <label className="text-xs text-muted-foreground mb-1.5 block">Название проекта</label>
                            <input
                                autoFocus
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-card-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="Название проекта"
                            />
                        </div>
                        <div className="mb-5">
                            <label className="text-xs text-muted-foreground mb-1.5 block">Описание</label>
                            <textarea
                                rows={3}
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-card-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                                placeholder="Описание проекта"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleSaveEdit}
                                disabled={isSaving || !editTitle.trim()}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium disabled:opacity-50"
                            >
                                {isSaving
                                    ? <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                                    : <Check className="w-4 h-4" />}
                                Сохранить
                            </button>
                            <button
                                onClick={handleCancelEdit}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors text-sm text-muted-foreground"
                            >
                                <X className="w-4 h-4" />
                                Отмена
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <h1 className="text-2xl font-semibold text-card-foreground">{project.title}</h1>
                            <button
                                onClick={handleStartEdit}
                                className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg hover:bg-accent transition-colors text-xs text-muted-foreground flex-shrink-0"
                            >
                                <Pencil className="w-3.5 h-3.5" />
                                Редактировать
                            </button>
                        </div>
                        {project.description && (
                            <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                        )}

                        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-border">
                            <div className="flex items-center gap-1.5 bg-muted rounded-full px-3 py-1.5">
                                <User className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                                <span className="text-xs text-muted-foreground">
                                    {work.teacherLastName} {work.teacherName?.[0]}.{work.teacherMiddleName?.[0]}.
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-muted rounded-full px-3 py-1.5">
                                <FileText className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                                <span className="text-xs text-muted-foreground">{work.groupName}</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-primary/10 rounded-full px-3 py-1.5">
                                <Clock className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                                <span className="text-xs text-primary font-medium">
                                    {work.countOfChapters} {work.countOfChapters === 1 ? 'раздел' : work.countOfChapters < 5 ? 'раздела' : 'разделов'}
                                </span>
                            </div>
                        </div>
                    </>
                )}

                {!isEditing && allItemsApproved && (
                    <div className={`mt-4 p-4 rounded-lg border ${project.isApprovedForDefense ? 'bg-success/10 border-success' : 'bg-chart-4/10 border-chart-4'}`}>
                        {project.isApprovedForDefense ? (
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                                <div>
                                    <div className="font-semibold text-card-foreground mb-1">Допущен к защите</div>
                                    <p className="text-sm text-muted-foreground">Свяжитесь с преподавателем для согласования даты защиты.</p>
                                    <button className="mt-3 flex items-center gap-2 text-sm text-primary hover:text-primary-hover transition-colors">
                                        <Mail className="w-4 h-4" />
                                        Написать преподавателю
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-chart-4 flex-shrink-0 mt-0.5" />
                                <div>
                                    <div className="font-semibold text-card-foreground mb-1">Ожидание допуска к защите</div>
                                    <p className="text-sm text-muted-foreground">Все разделы одобрены. Ожидайте решения преподавателя.</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

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
                        <div key={chapter.index} className="bg-card border border-border rounded-lg overflow-hidden">
                            <div className="p-6">
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
                                            {deadline && (
                                                <div className={`flex items-center gap-1.5 text-xs ${isOverdue && item?.status !== 'APPROVED' ? 'text-destructive' : 'text-muted-foreground'}`}>
                                                    <CalendarClock className="w-3.5 h-3.5 flex-shrink-0" />
                                                    <span>
                                                        Срок: {format(deadline, 'd MMM yyyy, HH:mm', { locale: ru })}
                                                        {isOverdue && item?.status !== 'APPROVED'
                                                            ? ' — просрочено'
                                                            : ` (${formatDistanceToNow(deadline, { locale: ru, addSuffix: true })})`}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {item ? (
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 flex-shrink-0 ${statusConfig[item.status].color}`}>
                                            {(() => { const Icon = statusConfig[item.status].icon; return <Icon className="w-3 h-3" />; })()}
                                            {statusConfig[item.status].label}
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 flex-shrink-0 text-muted-foreground bg-muted">
                                            <FileText className="w-3 h-3" />
                                            Не начат
                                        </span>
                                    )}
                                </div>

                                {chapterUnlocked ? (
                                    <div className="mt-4 pt-4 border-t border-border">
                                        {needsReupload && item && item.history.length > 0 && (
                                            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                                                <div className="flex items-start gap-2">
                                                    <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                                                    <div className="text-sm">
                                                        <div className="font-medium text-card-foreground mb-1">Требуется доработка</div>
                                                        <p className="text-muted-foreground">
                                                            {item.history[0]?.teacherComment || 'Работа отклонена преподавателем'}
                                                        </p>
                                                    </div>
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
                                                    <label
                                                        htmlFor={fileInputId}
                                                        className="flex-1 px-4 py-2 border border-border rounded-lg cursor-pointer hover:bg-accent transition-colors text-sm text-muted-foreground flex items-center gap-2"
                                                    >
                                                        <Upload className="w-4 h-4" />
                                                        {selectedFile && uploadingItemId === uploadKey
                                                            ? selectedFile.name
                                                            : item?.fileName || 'Выберите файл (.pdf)'}
                                                    </label>
                                                    {canSubmit && item && (
                                                        <button
                                                            onClick={() => handleSubmit(item.id)}
                                                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium whitespace-nowrap"
                                                        >
                                                            Отправить на проверку
                                                        </button>
                                                    )}
                                                </div>
                                                {selectedFile && uploadingItemId === uploadKey && (
                                                    <button
                                                        onClick={() => handleUpload(uploadKey)}
                                                        className="mt-2 w-full px-4 py-2 bg-success text-success-foreground rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                                                    >
                                                        Загрузить файл
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className="mt-4 pt-4 border-t border-border">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <AlertCircle className="w-4 h-4" />
                                            Необходимо одобрение предыдущего раздела
                                        </div>
                                    </div>
                                )}
                            </div>

                            {item && item.history.length > 0 && (
                                <div className="border-t border-border">
                                    <button
                                        onClick={() => setExpandedHistory(expandedHistory === item.id ? null : item.id)}
                                        className="w-full px-6 py-3 flex items-center justify-between hover:bg-accent transition-colors"
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
                                                        <span className={`px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ${statusConfig[h.newStatus]?.color ?? ''}`}>
                                                            {statusConfig[h.newStatus]?.label ?? h.newStatus}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-muted-foreground mb-2">
                                                        {new Date(h.changedAt).toLocaleString('ru-RU')}
                                                    </div>
                                                    {h.teacherComment && (
                                                        <div className="mt-3 p-3 bg-background rounded border border-border">
                                                            <div className="flex items-start gap-2">
                                                                <User className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                                                                <div>
                                                                    <div className="text-xs text-muted-foreground mb-1">
                                                                        {h.changedBy?.lastName && h.changedBy?.firstName
                                                                            ? `${h.changedBy.lastName} ${h.changedBy.firstName[0]}.`
                                                                            : 'Преподаватель'}
                                                                    </div>
                                                                    <p className="text-sm text-card-foreground">{h.teacherComment}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {h.fileName && (
                                                        <button className="mt-3 flex items-center gap-2 text-xs text-primary hover:text-primary-hover transition-colors">
                                                            <Download className="w-3 h-3" />
                                                            Скачать файл
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function ProjectSkeleton() {
    return (
        <div className="bg-background animate-pulse">
            <div className="h-5 bg-muted rounded w-32 mb-6" />
            <div className="bg-card border border-border rounded-lg p-6 mb-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="h-7 bg-muted rounded w-2/3" />
                    <div className="h-8 bg-muted rounded w-32" />
                </div>
                <div className="h-4 bg-muted rounded w-full mb-1.5" />
                <div className="h-4 bg-muted rounded w-4/5" />
                <div className="mt-4 pt-4 border-t border-border flex gap-3">
                    <div className="h-6 bg-muted rounded-full w-28" />
                    <div className="h-6 bg-muted rounded-full w-24" />
                    <div className="h-6 bg-muted rounded-full w-20" />
                </div>
            </div>
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-10 h-10 bg-muted rounded-lg flex-shrink-0" />
                            <div className="flex-1">
                                <div className="h-5 bg-muted rounded w-1/3 mb-2" />
                                <div className="h-3.5 bg-muted rounded w-3/4" />
                            </div>
                            <div className="h-6 bg-muted rounded-full w-24" />
                        </div>
                        <div className="pt-4 border-t border-border">
                            <div className="h-9 bg-muted rounded w-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
