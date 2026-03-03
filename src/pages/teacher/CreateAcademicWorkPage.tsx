import { useState, useEffect } from 'react';
import { Calendar, Users, FileText, CheckCircle, ArrowRight, Search, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WorkTemplate } from '@/types/WorkTemplate';
import { getMyTemplates } from '@/api/endpoints';
import { getGroups } from '@/api/endpoints';
import { getWorkTypeNameByType } from '@/utils/getWorkTypeNameByType';
import { toast } from 'sonner';

type StudyGroup = {
    id: number;
    name: string;
};

type ChapterDeadline = {
    chapterIndex: number;
    deadline: string;
};

export function CreateAcademicWorkPage() {
    const [templates, setTemplates] = useState<WorkTemplate[]>([]);
    const [groups, setGroups] = useState<StudyGroup[]>([]);
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
    const [deadlines, setDeadlines] = useState<ChapterDeadline[]>([]);
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [groupSearch, setGroupSearch] = useState('');
    const [templateSearch, setTemplateSearch] = useState('');

    useEffect(() => {
        getGroups().then(setGroups).catch(console.error);
        getMyTemplates(0, 10, "").then((res) => setTemplates(res.data)).catch(console.error);
    }, []);

    const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);
    const selectedGroup = groups.find((g) => g.id === selectedGroupId);

    const filteredGroups = groups.filter((g) =>
        g.name.toLowerCase().includes(groupSearch.toLowerCase())
    );

    const filteredTemplates = templates.filter((t) =>
        t.title.toLowerCase().includes(templateSearch.toLowerCase()) ||
        t.type.toLowerCase().includes(templateSearch.toLowerCase())
    );

    const handleSelectGroup = (groupId: number) => {
        setSelectedGroupId(groupId);
        setStep(2);
        setGroupSearch('');
    };

    const handleSelectTemplate = (templateId: string) => {
        setSelectedTemplateId(templateId);
        const template = templates.find((t) => t.id === templateId);
        if (template) {
            setDeadlines(template.chapters.map((_, idx) => ({ chapterIndex: idx, deadline: '' })));
            setStep(3);
            setTemplateSearch('');
        }
    };

    const handleDeadlineChange = (chapterIndex: number, deadline: string) => {
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
            // await createAcademicWork({
            //     groupId: selectedGroupId!,
            //     workTemplateId: Number(selectedTemplateId),
            //     deadlines: deadlines.map((d) => ({
            //         chapterIndex: d.chapterIndex,
            //         deadline: new Date(d.deadline).toISOString(),
            //     })),
            // });

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
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold mb-2">Создание академической работы</h1>
                <p className="text-muted-foreground text-sm">
                    Создайте новую академическую работу и назначьте её студентам группы
                </p>
            </div>

            {/* Progress Steps */}
            <div className="bg-card border border-border rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between">
                    {/* Step 1 */}
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm
                            ${step > 1 ? 'bg-primary text-primary-foreground' : step === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
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

                    {/* Step 2 */}
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm
                            ${step > 2 ? 'bg-primary text-primary-foreground' : step === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
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

                    {/* Step 3 */}
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

            {/* Step 1: Select Group */}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredGroups.length > 0 ? (
                            filteredGroups.map((group) => (
                                <button
                                    key={group.id}
                                    onClick={() => handleSelectGroup(group.id)}
                                    className="p-4 border border-border rounded-lg hover:border-primary hover:bg-accent transition-colors text-left"
                                >
                                    <div className="font-semibold text-sm">{group.name}</div>
                                </button>
                            ))
                        ) : (
                            <div className="col-span-3 text-center py-8 text-muted-foreground">
                                Группы не найдены
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Step 2: Select Template */}
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

                    <div className="space-y-3">
                        {filteredTemplates.length > 0 ? (
                            filteredTemplates.map((template) => (
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
                                            <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                                            <div className="text-xs text-muted-foreground">
                                                Разделов: {template.chapters.length}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">Шаблоны не найдены</div>
                        )}
                    </div>
                </div>
            )}

            {/* Step 3: Set Deadlines */}
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

                        {/* Summary */}
                        <div className="bg-secondary rounded-lg p-4 mb-6">
                            <div className="text-xs font-medium text-muted-foreground mb-1">Выбранный шаблон</div>
                            <div className="font-semibold text-sm">{selectedTemplate.title}</div>
                            <div className="text-sm text-muted-foreground mt-0.5">
                                Группа: {selectedGroup?.name}
                            </div>
                        </div>

                        <div className="space-y-3">
                            {selectedTemplate.chapters.map((chapter, idx) => (
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
                                            <div className="flex items-center gap-3">
                                                <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                                <label className="text-sm text-muted-foreground">Срок сдачи:</label>
                                                <input
                                                    type="datetime-local"
                                                    required
                                                    value={deadlines[idx]?.deadline || ''}
                                                    onChange={(e) => handleDeadlineChange(idx, e.target.value)}
                                                    className="px-3 py-1.5 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
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
