import { useState, useEffect } from 'react';
import {
    Users, FileText, CheckCircle, XCircle, Clock, ArrowLeft, Search,
    ChevronRight, GraduationCap, Award, BookOpen, TrendingUp, BarChart2,
} from 'lucide-react';
import { ItemHistoryModal } from '@/components/teacher/ItemHistoryModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

type ItemStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';

type Group = { id: number; name: string; studentCount: number };

type AcademicWork = {
    id: number; title: string; description: string; countOfChapters: number; groupName: string;
    chapters: Array<{ index: number; title: string; description: string; deadline?: string }>;
};

type HistoryItem = {
    id: number; previousStatus: ItemStatus; newStatus: ItemStatus; teacherComment?: string;
    changedAt: string; fileName: string; changedBy: { id: number; firstName: string; lastName: string };
};

type ExplanatoryNoteItem = { id: number; orderNumber: number; status: ItemStatus; history: HistoryItem[] };

type Project = {
    id: number; title: string; description: string;
    owner: { id: number; firstName: string; lastName: string; middleName?: string; email: string };
    items: ExplanatoryNoteItem[];
    isApprovedForDefense: boolean;
};

const statusConfig: Record<ItemStatus, { label: string; color: string; bgColor: string; borderColor: string; dotColor: string; icon: React.ComponentType<any> }> = {
    DRAFT: { label: 'Черновик', color: 'text-muted-foreground', bgColor: 'bg-muted', borderColor: 'border-border', dotColor: 'bg-muted-foreground', icon: FileText },
    SUBMITTED: { label: 'На проверке', color: 'text-chart-4', bgColor: 'bg-chart-4/10', borderColor: 'border-chart-4/40', dotColor: 'bg-chart-4', icon: Clock },
    APPROVED: { label: 'Одобрено', color: 'text-success', bgColor: 'bg-success/10', borderColor: 'border-success/40', dotColor: 'bg-success', icon: CheckCircle },
    REJECTED: { label: 'Отклонено', color: 'text-destructive', bgColor: 'bg-destructive/10', borderColor: 'border-destructive/40', dotColor: 'bg-destructive', icon: XCircle },
};

const mockGroups: Group[] = [
    { id: 1, name: 'ИВТ-401', studentCount: 25 },
    { id: 2, name: 'ИВТ-402', studentCount: 23 },
    { id: 3, name: 'ПИ-301', studentCount: 28 },
    { id: 4, name: 'ПИ-302', studentCount: 22 },
    { id: 5, name: 'КБ-401', studentCount: 19 },
];

const mockWorks: AcademicWork[] = [
    {
        id: 1, title: 'Курсовая работа по программированию', description: 'Разработка веб-приложения с использованием современных технологий',
        countOfChapters: 4, groupName: 'ИВТ-401',
        chapters: [
            { index: 0, title: 'Введение', description: 'Актуальность темы', deadline: '2024-03-10' },
            { index: 1, title: 'Обзор литературы', description: 'Анализ решений', deadline: '2024-03-20' },
            { index: 2, title: 'Проектирование', description: 'Архитектура', deadline: '2024-04-10' },
            { index: 3, title: 'Реализация', description: 'Разработка', deadline: '2024-05-01' },
            { index: 4, title: 'Реализация', description: 'Разработка', deadline: '2024-05-01' },
            { index: 5, title: 'Реализация', description: 'Разработка', deadline: '2024-05-01' },
        ],
    },
    {
        id: 2, title: 'Лабораторная работа по алгоритмам', description: 'Анализ и реализация алгоритмов сортировки',
        countOfChapters: 2, groupName: 'ИВТ-401',
        chapters: [
            { index: 0, title: 'Цель работы', description: 'Формулировка целей', deadline: '2024-03-05' },
            { index: 1, title: 'Ход выполнения', description: 'Описание процесса', deadline: '2024-03-12' },
        ],
    },
];

const mockProjects: Project[] = [
    {
        id: 101, title: 'Проект студента Иванов И.И.', description: 'Курсовая работа',
        owner: { id: 1, firstName: 'Иван', lastName: 'Иванов', middleName: 'Иванович', email: 'ivanov@student.edu' },
        isApprovedForDefense: false,
        items: [
            { id: 1, orderNumber: 0, status: 'APPROVED', history: [{ id: 1, previousStatus: 'SUBMITTED', newStatus: 'APPROVED', teacherComment: 'Хорошая работа, раскрыта тема', fileName: 'introduction.pdf', changedAt: '2024-03-01T10:00:00', changedBy: { id: 10, firstName: 'Петр', lastName: 'Петров' } }, { id: 11, previousStatus: 'DRAFT', newStatus: 'SUBMITTED', fileName: 'introduction_draft.pdf', changedAt: '2024-02-28T09:00:00', changedBy: { id: 1, firstName: 'Иван', lastName: 'Иванов' } }] },
            { id: 2, orderNumber: 1, status: 'SUBMITTED', history: [{ id: 2, previousStatus: 'DRAFT', newStatus: 'SUBMITTED', fileName: 'literature_review.pdf', changedAt: '2024-03-05T14:00:00', changedBy: { id: 1, firstName: 'Иван', lastName: 'Иванов' } }] },
            { id: 3, orderNumber: 2, status: 'DRAFT', history: [] },
            { id: 4, orderNumber: 3, status: 'DRAFT', history: [] },
        ],
    },
    {
        id: 102, title: 'Проект студента Петров П.П.', description: 'Курсовая работа',
        owner: { id: 2, firstName: 'Петр', lastName: 'Петров', middleName: 'Петрович', email: 'petrov@student.edu' },
        isApprovedForDefense: false,
        items: [
            { id: 5, orderNumber: 0, status: 'REJECTED', history: [{ id: 3, previousStatus: 'SUBMITTED', newStatus: 'REJECTED', teacherComment: 'Необходимо доработать структуру. Введение не раскрывает актуальность.', fileName: 'introduction_v1.pdf', changedAt: '2024-03-02T11:00:00', changedBy: { id: 10, firstName: 'Петр', lastName: 'Петров' } }] },
            { id: 6, orderNumber: 1, status: 'DRAFT', history: [] },
            { id: 7, orderNumber: 2, status: 'DRAFT', history: [] },
            { id: 8, orderNumber: 3, status: 'DRAFT', history: [] },
        ],
    },
    {
        id: 103, title: 'Проект студента Сидоров С.С.', description: 'Курсовая работа',
        owner: { id: 3, firstName: 'Сергей', lastName: 'Сидоров', middleName: 'Сергеевич', email: 'sidorov@student.edu' },
        isApprovedForDefense: true,
        items: [
            { id: 9, orderNumber: 0, status: 'APPROVED', history: [{ id: 4, previousStatus: 'SUBMITTED', newStatus: 'APPROVED', teacherComment: 'Отлично', fileName: 'introduction.pdf', changedAt: '2024-03-01T09:00:00', changedBy: { id: 10, firstName: 'Петр', lastName: 'Петров' } }] },
            { id: 10, orderNumber: 1, status: 'APPROVED', history: [{ id: 5, previousStatus: 'SUBMITTED', newStatus: 'APPROVED', fileName: 'literature_review.pdf', changedAt: '2024-03-05T15:00:00', changedBy: { id: 10, firstName: 'Петр', lastName: 'Петров' } }] },
            { id: 11, orderNumber: 2, status: 'APPROVED', history: [{ id: 6, previousStatus: 'SUBMITTED', newStatus: 'APPROVED', fileName: 'design.pdf', changedAt: '2024-04-11T10:00:00', changedBy: { id: 10, firstName: 'Петр', lastName: 'Петров' } }] },
            { id: 12, orderNumber: 3, status: 'APPROVED', history: [{ id: 7, previousStatus: 'SUBMITTED', newStatus: 'APPROVED', fileName: 'implementation.pdf', changedAt: '2024-05-02T12:00:00', changedBy: { id: 10, firstName: 'Петр', lastName: 'Петров' } }] },
        ],
    },
];

type PageView = 'selection' | 'table';

export function StudentWorksPage() {
    const [pageView, setPageView] = useState<PageView>('selection');
    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
    const [works, setWorks] = useState<AcademicWork[]>([]);
    const [selectedWorkId, setSelectedWorkId] = useState<number | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState<{ item: ExplanatoryNoteItem; project: Project; chapterTitle: string } | null>(null);

    const selectedGroup = groups.find((g) => g.id === selectedGroupId);
    const selectedWork = works.find((w) => w.id === selectedWorkId);

    useEffect(() => { setGroups(mockGroups); }, []);
    useEffect(() => {
        if (!selectedGroupId) return;
        setIsLoading(true);
        setTimeout(() => { setWorks(mockWorks); setIsLoading(false); }, 300);
    }, [selectedGroupId]);
    useEffect(() => {
        if (!selectedWorkId) return;
        setIsLoading(true);
        setTimeout(() => { setProjects(mockProjects); setIsLoading(false); }, 300);
    }, [selectedWorkId]);

    const handleItemClick = (item: ExplanatoryNoteItem, project: Project) => {
        if (item.status === 'DRAFT') return;
        const chapter = selectedWork?.chapters.find((ch) => ch.index === item.orderNumber);
        if (!chapter) return;
        setSelectedItem({ item, project, chapterTitle: chapter.title });
    };

    const handleApproveDefense = async (projectId: number) => {
        setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, isApprovedForDefense: true } : p)));
    };

    const handleGoToTable = () => { if (selectedGroupId && selectedWorkId) setPageView('table'); };
    const handleBack = () => setPageView('selection');
    const filteredGroups = groups.filter((g) => g.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const totalStudents = projects.length;
    const approvedDefense = projects.filter((p) => p.isApprovedForDefense).length;
    const pendingReview = projects.reduce((acc, p) => acc + p.items.filter((i) => i.status === 'SUBMITTED').length, 0);
    const totalApproved = projects.reduce((acc, p) => acc + p.items.filter((i) => i.status === 'APPROVED').length, 0);
    const totalItems = projects.reduce((acc, p) => acc + p.items.length, 0);
    const progressPercent = totalItems > 0 ? Math.round((totalApproved / totalItems) * 100) : 0;

    if (pageView === 'selection') {
        return (
            <div className="space-y-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-card-foreground mb-1">Работы студентов</h1>
                        <p className="text-muted-foreground text-sm">Выберите группу и академическую работу для просмотра прогресса</p>
                    </div>
                    {selectedGroupId && selectedWorkId && (
                        <Button onClick={handleGoToTable}>
                            Открыть таблицу <ChevronRight className="w-4 h-4" />
                        </Button>
                    )}
                </div>

                {(selectedGroupId || selectedWorkId) && (
                    <div className="flex items-center gap-2 text-sm">
                        {selectedGroup && (
                            <>
                                <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/20 rounded-full hover:bg-primary/10">
                                    {selectedGroup.name}
                                </Badge>
                                {selectedWork && (
                                    <>
                                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                        <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/20 rounded-full hover:bg-primary/10">
                                            {selectedWork.title}
                                        </Badge>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                )}

                <div className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-card-foreground">Выбор группы</h2>
                            <p className="text-xs text-muted-foreground">Нажмите на карточку группы</p>
                        </div>
                    </div>
                    <div className="relative mb-5">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Поиск группы..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {filteredGroups.map((group) => (
                            <button
                                key={group.id}
                                onClick={() => { setSelectedGroupId(group.id); setSelectedWorkId(null); setProjects([]); }}
                                className={`p-4 border-2 rounded-xl transition-all text-left group relative overflow-hidden ${selectedGroupId === group.id
                                    ? 'border-primary bg-primary/5 shadow-sm'
                                    : 'border-border hover:border-primary/50 hover:bg-accent'
                                    }`}
                            >
                                {selectedGroupId === group.id && (
                                    <div className="absolute top-2 right-2">
                                        <div className="w-2 h-2 rounded-full bg-primary" />
                                    </div>
                                )}
                                <GraduationCap className={`w-6 h-6 mb-2 ${selectedGroupId === group.id ? 'text-primary' : 'text-muted-foreground'}`} />
                                <div className="font-semibold text-card-foreground">{group.name}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">{group.studentCount} студ.</div>
                            </button>
                        ))}
                    </div>
                </div>

                {selectedGroupId && (
                    <div className="bg-card border border-border rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-card-foreground">Академическая работа</h2>
                                <p className="text-xs text-muted-foreground">Выберите работу для проверки</p>
                            </div>
                        </div>
                        {isLoading ? (
                            <div className="space-y-3">
                                {[1, 2].map((i) => <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />)}
                            </div>
                        ) : works.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
                                <p className="text-sm">У этой группы нет назначенных работ</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {works.map((work) => (
                                    <button
                                        key={work.id}
                                        onClick={() => setSelectedWorkId(work.id)}
                                        className={`w-full p-4 border-2 rounded-xl transition-all text-left ${selectedWorkId === work.id
                                            ? 'border-primary bg-primary/5 shadow-sm'
                                            : 'border-border hover:border-primary/50 hover:bg-accent'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-start gap-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${selectedWorkId === work.id ? 'bg-primary/10' : 'bg-muted'}`}>
                                                    <FileText className={`w-4 h-4 ${selectedWorkId === work.id ? 'text-primary' : 'text-muted-foreground'}`} />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-card-foreground">{work.title}</h3>
                                                    <p className="text-sm text-muted-foreground mt-0.5">{work.description}</p>
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0 flex items-center gap-2">
                                                <Badge variant="secondary">{work.countOfChapters} разд.</Badge>
                                                {selectedWorkId === work.id && <CheckCircle className="w-5 h-5 text-primary" />}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {selectedGroupId && selectedWorkId && (
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            <div>
                                <p className="font-medium text-card-foreground">Всё готово к просмотру</p>
                                <p className="text-sm text-muted-foreground">Откройте таблицу прогресса для группы {selectedGroup?.name}</p>
                            </div>
                        </div>
                        <Button onClick={handleGoToTable}>
                            Открыть таблицу <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                )}

                {!selectedGroupId && (
                    <div className="bg-card border border-border rounded-xl p-14 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold text-card-foreground mb-2">Выберите группу</h3>
                        <p className="text-muted-foreground text-sm max-w-sm mx-auto">Выберите группу студентов выше, чтобы продолжить</p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={handleBack}>
                        <ArrowLeft className="w-4 h-4" /> Назад
                    </Button>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Работы студентов</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span className="text-card-foreground font-medium">{selectedGroup?.name}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span className="text-card-foreground font-medium">{selectedWork?.title}</span>
                    </div>
                </div>
            </div>

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
                        <h2 className="font-semibold text-card-foreground">{selectedWork?.title}</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {selectedGroup?.name} · {projects.length} студентов
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-border">
                                    <th
                                        className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide
               min-w-[220px] bg-muted/60 border-r border-border/80"
                                    >
                                        Студент
                                    </th>

                                    {selectedWork?.chapters.map((chapter) => (
                                        <th
                                            key={chapter.index}
                                            className="px-5 py-4 text-left bg-muted/60 min-w-[185px]"
                                        >
                                            <div className="text-card-foreground font-semibold text-sm">
                                                {chapter.title}
                                            </div>
                                            {chapter.deadline && (
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    до {new Date(chapter.deadline).toLocaleDateString('ru-RU')}
                                                </div>
                                            )}
                                        </th>
                                    ))}

                                    <th
                                        className="px-6 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide
               min-w-[150px] bg-muted/60 border-l border-border/80"
                                    >
                                        Защита
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-border">
                                {projects.map((project, rowIdx) => {
                                    const allApproved = project.items.every((i) => i.status === 'APPROVED');
                                    const approvedCount = project.items.filter((i) => i.status === 'APPROVED').length;
                                    const totalCount = project.items.length;

                                    return (
                                        <tr
                                            key={project.id}
                                            className={`transition-colors hover:bg-accent/40 bg-card`}
                                        >
                                            <td className={`
                                                    px-6 py-4 sticky left-0 z-30 border-r border-border bg-card
                                                    shadow-[2px_0_8px_-2px_rgb(0,0,0,0.07)]
                                                `}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                        <span className="text-sm font-semibold text-primary">
                                                            {project.owner.lastName[0]}{project.owner.firstName[0]}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-card-foreground">
                                                            {project.owner.lastName} {project.owner.firstName[0]}.{project.owner.middleName?.[0]}.
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div className="flex gap-0.5">
                                                                {project.items.map((item) => (
                                                                    <div
                                                                        key={item.id}
                                                                        className={`w-1.5 h-1.5 rounded-full ${statusConfig[item.status].dotColor}`}
                                                                    />
                                                                ))}
                                                            </div>
                                                            <span className="text-xs text-muted-foreground">
                                                                {approvedCount}/{totalCount}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {selectedWork?.chapters.map((chapter) => {
                                                const item = project.items.find((i) => i.orderNumber === chapter.index);
                                                if (!item) return <td key={chapter.index} className="px-5 py-4" />;

                                                const cfg = statusConfig[item.status];
                                                const StatusIcon = cfg.icon;
                                                const isClickable = item.status !== 'DRAFT';

                                                return (
                                                    <td key={chapter.index} className="px-5 py-4">
                                                        <button
                                                            onClick={() => handleItemClick(item, project)}
                                                            disabled={!isClickable}
                                                            className={`
                                                    w-full px-4 py-3 rounded-2xl border flex items-center gap-2.5 text-left transition-all
                                                    ${cfg.bgColor} ${cfg.borderColor}
                                                    ${isClickable
                                                                    ? 'hover:shadow hover:-translate-y-px active:scale-[0.985] cursor-pointer'
                                                                    : 'opacity-40 cursor-default'
                                                                }
                                                `}
                                                        >
                                                            <StatusIcon className={`w-4 h-4 ${cfg.color}`} />
                                                            <span className={`font-medium text-sm ${cfg.color}`}>{cfg.label}</span>
                                                        </button>
                                                    </td>
                                                );
                                            })}

                                            <td className={`
                                                    px-6 py-4 sticky right-0 z-30 border-l border-border
                                                    bg-card
                                                `}>
                                                <div className="flex justify-center">
                                                    {project.isApprovedForDefense ? (
                                                        <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-success/10 border border-success/30 rounded-2xl">
                                                            <CheckCircle className="w-4 h-4 text-success" />
                                                            <span className="text-sm font-medium text-success">Допущен</span>
                                                        </div>
                                                    ) : allApproved ? (
                                                        <Button size="sm" variant="default" onClick={() => handleApproveDefense(project.id)}>
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
            )
            }

            {
                !isLoading && projects.length > 0 && (
                    <div className="flex items-center gap-6 px-1">
                        <span className="text-xs text-muted-foreground">Статусы:</span>
                        {(Object.entries(statusConfig) as [ItemStatus, typeof statusConfig[ItemStatus]][]).map(([key, cfg]) => (
                            <div key={key} className="flex items-center gap-1.5">
                                <div className={cn('w-2 h-2 rounded-full', cfg.dotColor)} />
                                <span className="text-xs text-muted-foreground">{cfg.label}</span>
                            </div>
                        ))}
                    </div>
                )
            }

            {
                selectedItem && (
                    <ItemHistoryModal
                        item={selectedItem.item}
                        project={selectedItem.project}
                        chapterTitle={selectedItem.chapterTitle}
                        onClose={() => setSelectedItem(null)}
                        onUpdate={() => setSelectedItem(null)}
                    />
                )
            }
        </div >
    );
}
