import { useState } from 'react';
import {
    FileText, Download, CheckCircle, XCircle, Clock, User,
    MessageSquare, AlertCircle, History, ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type ItemStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';

type HistoryItem = {
    id: number; previousStatus: ItemStatus; newStatus: ItemStatus; teacherComment?: string;
    changedAt: string; fileName: string; changedBy: { id: number; firstName: string; lastName: string };
};

type ExplanatoryNoteItem = { id: number; orderNumber: number; status: ItemStatus; history: HistoryItem[] };

type Project = {
    id: number;
    owner: { id: number; firstName: string; lastName: string; middleName?: string; email: string };
};

type Props = {
    item: ExplanatoryNoteItem;
    project: Project;
    chapterTitle: string;
    onClose: () => void;
    onUpdate: () => void;
};

const statusConfig: Record<ItemStatus, { label: string; color: string; bgColor: string; borderColor: string; icon: React.ComponentType<any> }> = {
    DRAFT: { label: 'Черновик', color: 'text-muted-foreground', bgColor: 'bg-muted', borderColor: 'border-border', icon: FileText },
    SUBMITTED: { label: 'На проверке', color: 'text-chart-4', bgColor: 'bg-chart-4/10', borderColor: 'border-chart-4/30', icon: Clock },
    APPROVED: { label: 'Одобрено', color: 'text-success', bgColor: 'bg-success/10', borderColor: 'border-success/30', icon: CheckCircle },
    REJECTED: { label: 'Отклонено', color: 'text-destructive', bgColor: 'bg-destructive/10', borderColor: 'border-destructive/30', icon: XCircle },
};

type Tab = 'current' | 'history' | 'review';

export function ItemHistoryModal({ item, project, chapterTitle, onClose, onUpdate }: Props) {
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>(item.status === 'SUBMITTED' ? 'review' : 'current');

    const currentVersion = item.history[0];
    const pastHistory = item.history.slice(1);
    const canReview = item.status === 'SUBMITTED';

    const handleApprove = async () => {
        setIsSubmitting(true);
        setMessage(null);
        try {
            await new Promise((r) => setTimeout(r, 800));
            setMessage({ type: 'success', text: 'Работа успешно одобрена' });
            setTimeout(() => onUpdate(), 1200);
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
            await new Promise((r) => setTimeout(r, 800));
            setMessage({ type: 'success', text: 'Работа отклонена' });
            setTimeout(() => onUpdate(), 1200);
        } catch {
            setMessage({ type: 'error', text: 'Ошибка при отклонении работы' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDownload = (itemId: number, historyId: number) => {
        console.log('Downloading file for item:', itemId, 'history:', historyId);
    };

    const StatusIcon = statusConfig[item.status].icon;
    const cfg = statusConfig[item.status];

    const tabs: { id: Tab; label: string; icon: React.ComponentType<any>; show: boolean }[] = [
        { id: 'current', label: 'Текущий файл', icon: FileText, show: !!currentVersion },
        { id: 'history', label: `История (${pastHistory.length})`, icon: History, show: pastHistory.length > 0 },
        { id: 'review', label: 'Проверка', icon: MessageSquare, show: canReview },
    ].filter((t) => t.show);

    return (
        <Dialog open onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-2xl max-h-[88vh] flex flex-col p-0 gap-0 overflow-hidden">
                <div className="p-6 border-b border-border">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <DialogTitle className="text-xl font-semibold text-card-foreground truncate">
                                {chapterTitle}
                            </DialogTitle>
                            <div className="flex items-center gap-3 mt-2 flex-wrap">
                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <User className="w-3.5 h-3.5" />
                                    <span>{project.owner.lastName} {project.owner.firstName} {project.owner.middleName}</span>
                                </div>
                                <div className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium', cfg.bgColor, cfg.borderColor, cfg.color)}>
                                    <StatusIcon className="w-3.5 h-3.5" />
                                    {cfg.label}
                                </div>
                            </div>
                        </div>
                    </div>

                    {tabs.length > 1 && (
                        <div className="flex gap-1 mt-4 p-1 bg-muted rounded-xl w-fit">
                            {tabs.map((tab) => {
                                const TabIcon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={cn(
                                            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                                            activeTab === tab.id
                                                ? 'bg-card text-card-foreground shadow-sm'
                                                : 'text-muted-foreground hover:text-card-foreground'
                                        )}
                                    >
                                        <TabIcon className="w-3.5 h-3.5" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    {message && (
                        <div className={cn('mb-5 p-4 rounded-xl flex items-start gap-3 border', message.type === 'success' ? 'bg-success/10 border-success/30' : 'bg-destructive/10 border-destructive/30')}>
                            {message.type === 'success'
                                ? <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                                : <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                            }
                            <p className="text-sm text-card-foreground">{message.text}</p>
                        </div>
                    )}

                    {(activeTab === 'current' || tabs.length === 1) && currentVersion && (
                        <div>
                            <div className="bg-muted/60 border border-border rounded-xl p-5">
                                <div className="flex items-center justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                                            <FileText className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-card-foreground">{currentVersion.fileName}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {new Date(currentVersion.changedAt).toLocaleString('ru-RU')}
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => handleDownload(item.id, currentVersion.id)} className="text-primary border-primary/20 hover:bg-primary/10 hover:text-primary">
                                        <Download className="w-4 h-4" /> Скачать
                                    </Button>
                                </div>

                                <div className="flex items-center gap-2 mb-3">
                                    <span className={cn('text-xs px-2 py-0.5 rounded-full border', statusConfig[currentVersion.previousStatus].bgColor, statusConfig[currentVersion.previousStatus].borderColor, statusConfig[currentVersion.previousStatus].color)}>
                                        {statusConfig[currentVersion.previousStatus].label}
                                    </span>
                                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                                    <span className={cn('text-xs px-2 py-0.5 rounded-full border', statusConfig[currentVersion.newStatus].bgColor, statusConfig[currentVersion.newStatus].borderColor, statusConfig[currentVersion.newStatus].color)}>
                                        {statusConfig[currentVersion.newStatus].label}
                                    </span>
                                    <span className="ml-auto text-xs text-muted-foreground">
                                        {currentVersion.changedBy.firstName} {currentVersion.changedBy.lastName}
                                    </span>
                                </div>

                                {currentVersion.teacherComment && (
                                    <div className="mt-3 p-4 bg-card rounded-xl border border-border">
                                        <div className="flex items-start gap-2">
                                            <MessageSquare className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1.5">Комментарий преподавателя</p>
                                                <p className="text-sm text-card-foreground">{currentVersion.teacherComment}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'history' && pastHistory.length > 0 && (
                        <div>
                            <p className="text-sm text-muted-foreground mb-4">Все предыдущие версии файла в хронологическом порядке</p>
                            <div className="relative">
                                <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
                                <div className="space-y-4">
                                    {pastHistory.map((historyItem) => {
                                        const hCfg = statusConfig[historyItem.newStatus];
                                        const HIcon = hCfg.icon;
                                        return (
                                            <div key={historyItem.id} className="flex gap-4">
                                                <div className="relative z-10 flex-shrink-0">
                                                    <div className={cn('w-8 h-8 rounded-full border-2 flex items-center justify-center', hCfg.bgColor, hCfg.borderColor)}>
                                                        <HIcon className={cn('w-3.5 h-3.5', hCfg.color)} />
                                                    </div>
                                                </div>
                                                <div className="flex-1 bg-muted/40 border border-border rounded-xl p-4 mb-1">
                                                    <div className="flex items-start justify-between gap-3 mb-2">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <FileText className="w-4 h-4 text-muted-foreground" />
                                                            <span className="text-sm font-medium text-card-foreground">{historyItem.fileName}</span>
                                                            <span className={cn('text-xs px-2 py-0.5 rounded-full border', hCfg.bgColor, hCfg.borderColor, hCfg.color)}>
                                                                {hCfg.label}
                                                            </span>
                                                        </div>
                                                        <Button variant="ghost" size="icon" onClick={() => handleDownload(item.id, historyItem.id)} className="h-7 w-7 flex-shrink-0" title="Скачать">
                                                            <Download className="w-4 h-4 text-muted-foreground" />
                                                        </Button>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-1">
                                                        <span>{new Date(historyItem.changedAt).toLocaleString('ru-RU')}</span>
                                                        <span>·</span>
                                                        <span>{historyItem.changedBy.firstName} {historyItem.changedBy.lastName}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 mt-2">
                                                        <span className={cn('text-xs', statusConfig[historyItem.previousStatus].color)}>
                                                            {statusConfig[historyItem.previousStatus].label}
                                                        </span>
                                                        <ArrowRight className="w-3 h-3 text-muted-foreground" />
                                                        <span className={cn('text-xs', hCfg.color)}>{hCfg.label}</span>
                                                    </div>
                                                    {historyItem.teacherComment && (
                                                        <div className="mt-3 p-3 bg-card rounded-lg border border-border">
                                                            <div className="flex items-start gap-2">
                                                                <User className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                                                                <p className="text-sm text-card-foreground">{historyItem.teacherComment}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'review' && canReview && (
                        <div className="space-y-5">
                            {currentVersion && (
                                <div className="flex items-center gap-3 p-3 bg-muted/60 border border-border rounded-xl">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <FileText className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-card-foreground truncate">{currentVersion.fileName}</p>
                                        <p className="text-xs text-muted-foreground">Загружен {new Date(currentVersion.changedAt).toLocaleString('ru-RU')}</p>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => handleDownload(item.id, currentVersion.id)} className="text-xs text-primary border-primary/20 hover:bg-primary/10 hover:text-primary flex-shrink-0">
                                        <Download className="w-3.5 h-3.5" /> Скачать
                                    </Button>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-card-foreground mb-2">
                                    Комментарий
                                    <span className="text-muted-foreground font-normal ml-1.5 text-xs">(обязателен при отклонении)</span>
                                </label>
                                <Textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Введите комментарий для студента..."
                                    rows={5}
                                    maxLength={400}
                                    className="resize-none"
                                />
                                <div className="flex justify-end mt-1">
                                    <span className="text-xs text-muted-foreground">{comment.length}/400</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button
                                    onClick={handleApprove}
                                    disabled={isSubmitting}
                                    className="flex-1 bg-success text-success-foreground hover:bg-success/90 py-3 h-auto"
                                >
                                    {isSubmitting
                                        ? <div className="w-4 h-4 border-2 border-success-foreground border-t-transparent rounded-full animate-spin" />
                                        : <CheckCircle className="w-4 h-4" />
                                    }
                                    Одобрить
                                </Button>
                                <Button
                                    onClick={handleReject}
                                    disabled={isSubmitting}
                                    variant="destructive"
                                    className="flex-1 py-3 h-auto"
                                >
                                    {isSubmitting
                                        ? <div className="w-4 h-4 border-2 border-destructive-foreground border-t-transparent rounded-full animate-spin" />
                                        : <XCircle className="w-4 h-4" />
                                    }
                                    Отклонить
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 border-t border-border bg-muted/30">
                    <Button variant="outline" onClick={onClose} className="w-full">
                        Закрыть
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
