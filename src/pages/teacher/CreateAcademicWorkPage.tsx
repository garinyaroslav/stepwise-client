import { createAcademicWork, getGroups, getMyTemplates } from '@/api/endpoints';
import { ChapterDeadline, Group } from '@/api/reqTypes';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { WorkTemplate } from '@/types/WorkTemplate';
import { getWorkTypeNameByType } from '@/utils/getWorkTypeNameByType';
import { useDebounce } from '@/hooks/useDebounce';
import { format, formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ArrowRight, Calendar, CheckCircle, Clock, FileText, Search, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function CreateAcademicWorkPage() {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [templates, setTemplates] = useState<WorkTemplate[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [isGroupsLoading, setIsGroupsLoading] = useState(false);
    const [isTemplatesLoading, setIsTemplatesLoading] = useState(false);

    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

    const [deadlines, setDeadlines] = useState<ChapterDeadline[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [groupSearch, setGroupSearch] = useState('');
    const [templateSearch, setTemplateSearch] = useState('');

    const debouncedGroupSearch = useDebounce(groupSearch, 400);
    const debouncedTemplateSearch = useDebounce(templateSearch, 400);

    useEffect(() => {
        setIsGroupsLoading(true);
        getGroups(debouncedGroupSearch)
            .then(setGroups)
            .catch(console.error)
            .finally(() => setIsGroupsLoading(false));
    }, [debouncedGroupSearch]);

    useEffect(() => {
        setIsTemplatesLoading(true);
        getMyTemplates(0, 20, debouncedTemplateSearch)
            .then((res) => setTemplates(res.data))
            .catch(console.error)
            .finally(() => setIsTemplatesLoading(false));
    }, [debouncedTemplateSearch]);

    const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);
    const selectedGroup = groups.find((g) => g.id === selectedGroupId);

    const handleSelectGroup = (groupId: number) => {
        setSelectedGroupId(groupId);
        setStep(2);
        setGroupSearch('');
    };

    const handleSelectTemplate = (templateId: string) => {
        setSelectedTemplateId(templateId);
        const template = templates.find((t) => t.id === templateId);
        if (template) {
            setDeadlines(template.chapters.map((_, idx) => ({ chapterIndex: idx, deadline: new Date() })));
            setStep(3);
            setTemplateSearch('');
        }
    };

    const handleDeadlineChange = (chapterIndex: number, deadline: Date) => {
        setDeadlines((prev) =>
            prev.map((d) => (d.chapterIndex === chapterIndex ? { ...d, deadline } : d))
        );
    };

    const handleReset = () => {
        setSelectedGroupId(null);
        setSelectedTemplateId(null);
        setDeadlines([]);
        setStep(1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (deadlines.some((d) => !d.deadline)) {
            toast.error('Необходимо установить дедлайны для всех разделов');
            return;
        }

        setIsSubmitting(true);
        try {
            await createAcademicWork({
                groupId: selectedGroupId!,
                workTemplateId: Number(selectedTemplateId),
                deadlines: deadlines.map((d) => ({
                    chapterIndex: d.chapterIndex,
                    deadline: new Date(d.deadline),
                })),
            });

            toast.success(`Академическая работа успешно создана для группы ${selectedGroup?.name}`);
            setTimeout(handleReset, 1500);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Произошла ошибка');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-semibold mb-2">Создание академической работы</h1>
                <p className="text-muted-foreground text-sm">
                    Создайте новую академическую работу и назначьте её студентам группы
                </p>
            </div>

            <div className="bg-card border border-border rounded-lg py-6 pl-6 pr-10 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm
                            ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                            {step > 1 ? <CheckCircle className="w-4 h-4" /> : '1'}
                        </div>
                        <div>
                            <div className="text-sm font-medium">Выбор группы</div>
                            <div className="text-xs text-muted-foreground">
                                {selectedGroup ? selectedGroup.name : 'Не выбрано'}
                            </div>
                        </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-muted-foreground" />

                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm
                            ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                            {step > 2 ? <CheckCircle className="w-4 h-4" /> : '2'}
                        </div>
                        <div>
                            <div className="text-sm font-medium">Выбор шаблона</div>
                            <div className="text-xs text-muted-foreground truncate max-w-32">
                                {selectedTemplate ? selectedTemplate.title : 'Не выбрано'}
                            </div>
                        </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-muted-foreground" />

                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm
                            ${step === 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                            3
                        </div>
                        <div>
                            <div className="text-sm font-medium">Дедлайны</div>
                            <div className="text-xs text-muted-foreground">
                                {step === 3 ? 'Заполните даты' : 'Ожидание'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {step === 1 && (
                <div className="bg-card border border-border rounded-lg p-6">
                    <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        Выберите группу студентов
                    </h2>

                    <div className="mb-4 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        <Input
                            placeholder="Поиск группы..."
                            value={groupSearch}
                            onChange={(e) => setGroupSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {isGroupsLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />
                            ))}
                        </div>
                    ) : groups.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {groups.map((group) => (
                                <button
                                    key={group.id}
                                    onClick={() => handleSelectGroup(group.id)}
                                    className="p-4 border border-border rounded-lg hover:border-primary hover:bg-accent transition-colors text-left"
                                >
                                    <div className="font-semibold text-sm mb-1">{group.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                        Студентов: {group.studentsCount}
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            Группы не найдены
                        </div>
                    )}
                </div>
            )}

            {step === 2 && (
                <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-lg flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
                            Выберите шаблон работы
                        </h2>
                        <button
                            onClick={() => setStep(1)}
                            className="text-sm text-primary hover:underline transition-colors"
                        >
                            Изменить группу
                        </button>
                    </div>

                    <div className="mb-4 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        <Input
                            placeholder="Поиск шаблона..."
                            value={templateSearch}
                            onChange={(e) => setTemplateSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {isTemplatesLoading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />
                            ))}
                        </div>
                    ) : templates.length > 0 ? (
                        <div className="space-y-3">
                            {templates.map((template) => (
                                <button
                                    key={template.id}
                                    onClick={() => handleSelectTemplate(template.id)}
                                    className="w-full p-4 border border-border rounded-lg hover:border-primary hover:bg-accent transition-colors text-left"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="font-semibold text-sm">{template.title}</h3>
                                                <span className="px-2.5 py-0.5 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">
                                                    {getWorkTypeNameByType(template.type)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-1">{template.description}</p>
                                            <div className="text-xs text-muted-foreground">
                                                Разделов: {template.chapters.length}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">Шаблоны не найдены</div>
                    )}
                </div>
            )}

            {step === 3 && selectedTemplate && (
                <form onSubmit={handleSubmit}>
                    <div className="bg-card border border-border rounded-lg p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold text-lg flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-primary" />
                                Установите дедлайны для разделов
                            </h2>
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="text-sm text-primary hover:underline transition-colors"
                            >
                                Изменить шаблон
                            </button>
                        </div>

                        <div className="border border-border rounded-xl mb-6 overflow-hidden">
                            <div className="bg-muted/40 px-4 py-2.5 border-b border-border">
                                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Сводка задания
                                </span>
                            </div>
                            <div className="grid grid-cols-2 divide-x divide-border">
                                <div className="px-5 py-4 flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <FileText className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground mb-0.5">Шаблон</div>
                                        <div className="font-semibold text-sm leading-tight">{selectedTemplate.title}</div>
                                    </div>
                                </div>
                                <div className="px-5 py-4 flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Users className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground mb-0.5">Группа</div>
                                        <div className="font-semibold text-sm leading-tight">{selectedGroup?.name}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {selectedTemplate.chapters.map((chapter, idx) => {
                                const deadlineDate = deadlines[idx]?.deadline
                                    ? new Date(deadlines[idx].deadline)
                                    : undefined;

                                return (
                                    <div key={chapter.index} className="p-4 border border-border rounded-lg">
                                        <div className="flex items-start gap-4">
                                            <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full font-semibold flex-shrink-0 text-sm">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-sm mb-1">{chapter.title}</h3>
                                                {chapter.description && (
                                                    <p className="text-sm text-muted-foreground mb-3">{chapter.description}</p>
                                                )}
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                className={cn(
                                                                    "w-64 justify-start text-left font-normal gap-2",
                                                                    !deadlineDate && "text-muted-foreground"
                                                                )}
                                                            >
                                                                <Calendar className="w-4 h-4" />
                                                                {deadlineDate
                                                                    ? format(deadlineDate, "d MMM yyyy, HH:mm", { locale: ru })
                                                                    : "Выберите дату и время"}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <CalendarComponent
                                                                mode="single"
                                                                selected={deadlineDate}
                                                                captionLayout="dropdown"
                                                                onSelect={(date) => {
                                                                    if (!date) return;
                                                                    const existing = deadlines[idx]?.deadline
                                                                        ? new Date(deadlines[idx].deadline)
                                                                        : new Date();
                                                                    date.setHours(existing.getHours(), existing.getMinutes());
                                                                    handleDeadlineChange(idx, date);
                                                                }}
                                                            />
                                                            <div className="border-t border-border p-3 flex items-center gap-2">
                                                                <Clock className="w-4 h-4 text-muted-foreground" />
                                                                <span className="text-sm text-muted-foreground">Время:</span>
                                                                <div className="flex items-center gap-1">
                                                                    <select
                                                                        className="h-9 rounded-md border border-input bg-transparent px-2 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-primary transition-[color,box-shadow] cursor-pointer"
                                                                        value={deadlineDate ? String(deadlineDate.getHours()).padStart(2, '0') : '00'}
                                                                        onChange={(e) => {
                                                                            const base = deadlineDate ? new Date(deadlineDate) : new Date();
                                                                            base.setHours(Number(e.target.value));
                                                                            handleDeadlineChange(idx, base);
                                                                        }}
                                                                    >
                                                                        {Array.from({ length: 24 }, (_, i) => (
                                                                            <option key={i} value={String(i).padStart(2, '0')}>
                                                                                {String(i).padStart(2, '0')}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                    <span className="text-muted-foreground text-sm font-medium">:</span>
                                                                    <select
                                                                        className="h-9 rounded-md border border-input bg-transparent px-2 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-primary transition-[color,box-shadow] cursor-pointer"
                                                                        value={deadlineDate ? String(deadlineDate.getMinutes()).padStart(2, '0') : '00'}
                                                                        onChange={(e) => {
                                                                            const base = deadlineDate ? new Date(deadlineDate) : new Date();
                                                                            base.setMinutes(Number(e.target.value));
                                                                            handleDeadlineChange(idx, base);
                                                                        }}
                                                                    >
                                                                        {Array.from({ length: 12 }, (_, i) => (
                                                                            <option key={i} value={String(i * 5).padStart(2, '0')}>
                                                                                {String(i * 5).padStart(2, '0')}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>

                                                    {deadlineDate && (
                                                        <span className="text-xs text-muted-foreground">
                                                            {formatDistanceToNow(deadlineDate, { addSuffix: true, locale: ru })}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3">
                        <Button type="button" variant="outline" onClick={handleReset}>
                            Отмена
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                                    Создание...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4" />
                                    Создать академическую работу
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}
