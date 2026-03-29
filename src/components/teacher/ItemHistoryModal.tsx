import { useState, useEffect, useRef } from 'react';
import {
    FileText, Download, CheckCircle, XCircle, Clock, User,
    MessageSquare, AlertCircle, ArrowLeft, ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { ExplanatoryNoteItem } from '@/types/ExplanatoryNoteItem';
import { ItemStatus } from '@/types/ItemStatus';
import { ProjectDetails } from '@/types/ProjectDetails';
import { useLocation, useNavigate } from 'react-router';
import {
    approveExplanatoryNoteItem,
    downloadExplanatoryNoteFile,
    rejectExplanatoryNoteItem,
} from '@/api/endpoints';

const statusConfig: Record<ItemStatus, {
    label: string; color: string; bgColor: string;
    borderColor: string; dotColor: string; icon: React.ComponentType<any>
}> = {
    DRAFT: { label: 'Черновик', color: 'text-muted-foreground', bgColor: 'bg-muted', borderColor: 'border-border', dotColor: 'bg-muted-foreground', icon: FileText },
    SUBMITTED: { label: 'На проверке', color: 'text-chart-4', bgColor: 'bg-chart-4/10', borderColor: 'border-chart-4/40', dotColor: 'bg-chart-4', icon: Clock },
    APPROVED: { label: 'Одобрено', color: 'text-success', bgColor: 'bg-success/10', borderColor: 'border-success/40', dotColor: 'bg-success', icon: CheckCircle },
    REJECTED: { label: 'Отклонено', color: 'text-destructive', bgColor: 'bg-destructive/10', borderColor: 'border-destructive/40', dotColor: 'bg-destructive', icon: XCircle },
};

const useEscapeKey = (handler: () => void) => {
    useEffect(() => {
        const handleEsc = (event: globalThis.KeyboardEvent) => {
            if (event.key === 'Escape') handler();
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [handler]);
};

export function ItemHistoryModal() {
    const location = useLocation();
    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);

    const { item, project, chapterTitle } = location.state as {
        item: ExplanatoryNoteItem;
        project: ProjectDetails;
        chapterTitle: string;
    };

    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const canReview = item.status === ItemStatus.SUBMITTED;

    const chronological = item.history;

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ left: scrollRef.current.scrollWidth, behavior: 'instant' });
        }
    }, []);

    const handleClose = () => navigate(-1);

    const handleApprove = async () => {
        setIsSubmitting(true);
        setMessage(null);
        try {
            await approveExplanatoryNoteItem(item.id, comment.trim() || ' ');
            setMessage({ type: 'success', text: 'Работа успешно одобрена' });
            setTimeout(handleClose, 1000);
        } catch {
            setMessage({ type: 'error', text: 'Ошибка при одобрении работы' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReject = async () => {
        if (!comment.trim()) {
            setMessage({ type: 'error', text: 'Комментарий обязателен при отклонении' });
            return;
        }
        setIsSubmitting(true);
        setMessage(null);
        try {
            await rejectExplanatoryNoteItem(item.id, comment);
            setMessage({ type: 'success', text: 'Работа отклонена' });
            setTimeout(handleClose, 1000);
        } catch {
            setMessage({ type: 'error', text: 'Ошибка при отклонении работы' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDownload = async (historyId: number) => {
        try {
            await downloadExplanatoryNoteFile(project.owner.id, project.id, item.id, historyId);
        } catch {
            setMessage({ type: 'error', text: 'Ошибка при скачивании файла' });
        }
    };

    useEscapeKey(handleClose);

    const statusCfg = statusConfig[item.status];
    const StatusIcon = statusCfg.icon;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backdropFilter: 'blur(12px)', background: 'oklch(0 0 0 / 0.35)' }}
            onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
            <div className="w-full max-w-[95vw] flex flex-col" style={{ maxHeight: '90vh' }}>

                <div className="flex items-center justify-between mb-5 px-1">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleClose}
                            className="w-9 h-9 rounded-full bg-card/90 border border-border hover:bg-accent flex items-center justify-center transition-colors shadow-sm"
                        >
                            <ArrowLeft className="w-4 h-4 text-card-foreground" />
                        </button>
                        <div>
                            <h2 className="text-card-foreground font-semibold text-lg leading-tight">
                                {chapterTitle}
                            </h2>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <User className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="text-muted-foreground text-sm">
                                    {project.owner?.lastName} {project.owner?.firstName} {project.owner?.middleName}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium bg-card/90 shadow-sm',
                        statusCfg.borderColor, statusCfg.color
                    )}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusCfg.label}
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="overflow-x-auto pb-4"
                    style={{ scrollbarWidth: 'none' }}
                >
                    <div
                        className="flex items-start gap-0"
                        style={{ minWidth: 'max-content', paddingLeft: '8px', paddingRight: '8px' }}
                    >
                        {chronological.length === 0 && (
                            <div style={{ width: '260px' }}>
                                <div className="w-full rounded-2xl p-6 text-center bg-card border border-border shadow-sm">
                                    <FileText className="w-6 h-6 text-muted-foreground mx-auto mb-2 opacity-50" />
                                    <p className="text-xs text-muted-foreground">Файл ещё не загружен</p>
                                </div>
                            </div>
                        )}

                        {chronological.map((entry, idx) => {
                            const prevCfg = statusConfig[entry.previousStatus];
                            const cfg = statusConfig[entry.newStatus] ?? statusConfig[ItemStatus.DRAFT];
                            const Icon = cfg.icon;
                            const isLast = idx === chronological.length - 1;
                            const isReviewCard = isLast && canReview && entry.newStatus === ItemStatus.SUBMITTED;

                            return (
                                <div key={entry.id} className="flex items-start">

                                    <div
                                        className={cn(
                                            'relative flex flex-col rounded-2xl border bg-card shadow-sm transition-all',
                                            isLast
                                                ? 'ring-2 ring-primary/25 shadow-md border-primary/20'
                                                : 'border-border',
                                            'p-4'
                                        )}
                                        style={{ width: isReviewCard ? '320px' : '260px' }}
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className={cn(
                                                'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border',
                                                cfg.bgColor, cfg.borderColor
                                            )}>
                                                <Icon className={cn('w-4 h-4', cfg.color)} />
                                            </div>

                                            <div className="flex items-center gap-1.5">
                                                {prevCfg && (
                                                    <>
                                                        <span className={cn(
                                                            'text-xs px-1.5 py-0.5 rounded-full border',
                                                            prevCfg.bgColor, prevCfg.borderColor, prevCfg.color
                                                        )}>
                                                            {prevCfg.label}
                                                        </span>
                                                        <ArrowRight className="w-3 h-3 text-muted-foreground" />
                                                    </>
                                                )}
                                                <span className={cn(
                                                    'text-xs px-1.5 py-0.5 rounded-full border',
                                                    cfg.bgColor, cfg.borderColor, cfg.color
                                                )}>
                                                    {cfg.label}
                                                </span>
                                            </div>
                                        </div>

                                        {entry.fileName && (
                                            <div className="flex items-center gap-2 mb-2 px-2.5 py-1.5 rounded-lg bg-muted border border-border">
                                                <FileText className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                                                <span className="text-xs text-card-foreground truncate flex-1">{entry.fileName}</span>
                                                <button
                                                    onClick={() => handleDownload(entry.id)}
                                                    className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-accent transition-colors flex-shrink-0"
                                                >
                                                    <Download className="w-3.5 h-3.5 text-muted-foreground" />
                                                </button>
                                            </div>
                                        )}

                                        <div className="text-xs text-muted-foreground mb-1">
                                            {new Date(entry.changedAt).toLocaleString('ru-RU')}
                                            <span className="mx-1.5">·</span>
                                            {entry.changedBy?.firstName} {entry.changedBy?.lastName}
                                        </div>

                                        {entry.teacherComment && (
                                            <div className="mt-2 p-2.5 rounded-xl bg-muted border border-border">
                                                <div className="flex items-start gap-1.5">
                                                    <MessageSquare className="w-3 h-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                                                    <p className="text-xs text-card-foreground leading-relaxed">{entry.teacherComment}</p>
                                                </div>
                                            </div>
                                        )}

                                        {isReviewCard && (
                                            <div className="mt-3 pt-3 border-t border-border">
                                                <div className="flex items-center gap-1.5 mb-2.5">
                                                    <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center">
                                                        <MessageSquare className="w-3 h-3 text-primary" />
                                                    </div>
                                                    <span className="text-xs font-semibold text-card-foreground">Проверка</span>
                                                </div>

                                                {message && (
                                                    <div className={cn(
                                                        'mb-2.5 p-2.5 rounded-xl flex items-start gap-2 text-xs border',
                                                        message.type === 'success'
                                                            ? 'bg-success/10 border-success/40 text-success'
                                                            : 'bg-destructive/10 border-destructive/40 text-destructive'
                                                    )}>
                                                        {message.type === 'success'
                                                            ? <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                                                            : <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                                                        }
                                                        {message.text}
                                                    </div>
                                                )}

                                                <Textarea
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                    placeholder="Комментарий для студента..."
                                                    rows={3}
                                                    maxLength={400}
                                                    className="resize-none text-xs mb-1 w-full"
                                                />
                                                <div className="flex justify-end mb-2.5">
                                                    <span className="text-xs text-muted-foreground">{comment.length}/400</span>
                                                </div>

                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={handleApprove}
                                                        disabled={isSubmitting}
                                                        className="flex-1 bg-success text-success-foreground hover:bg-success/90 h-8 text-xs gap-1.5"
                                                    >
                                                        {isSubmitting
                                                            ? <div className="w-3 h-3 border border-success-foreground border-t-transparent rounded-full animate-spin" />
                                                            : <CheckCircle className="w-3.5 h-3.5" />
                                                        }
                                                        Одобрить
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={handleReject}
                                                        disabled={isSubmitting}
                                                        variant="destructive"
                                                        className="flex-1 h-8 text-xs gap-1.5"
                                                    >
                                                        {isSubmitting
                                                            ? <div className="w-3 h-3 border border-destructive-foreground border-t-transparent rounded-full animate-spin" />
                                                            : <XCircle className="w-3.5 h-3.5" />
                                                        }
                                                        Отклонить
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {idx < chronological.length - 1 && (
                                        <div className="flex items-center" style={{ width: '32px', marginTop: '20px' }}>
                                            <div className="h-px w-full bg-border" />
                                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-border" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
