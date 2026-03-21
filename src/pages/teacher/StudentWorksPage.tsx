import { useState, useEffect } from 'react';
import {
    Users,
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    ArrowLeft,
    Search,
    ChevronRight,
    GraduationCap,
    Award,
    BookOpen,
    TrendingUp,
    BarChart2,
} from 'lucide-react';
import { ItemHistoryModal } from '@/components/teacher/ItemHistoryModal';

type ItemStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';

type Group = {
    id: number;
    name: string;
    studentCount: number;
};

type AcademicWork = {
    id: number;
    title: string;
    description: string;
    countOfChapters: number;
    groupName: string;
    chapters: Array<{
        index: number;
        title: string;
        description: string;
        deadline?: string;
    }>;
};

type HistoryItem = {
    id: number;
    previousStatus: ItemStatus;
    newStatus: ItemStatus;
    teacherComment?: string;
    changedAt: string;
    fileName: string;
    changedBy: {
        id: number;
        firstName: string;
        lastName: string;
    };
};

type ExplanatoryNoteItem = {
    id: number;
    orderNumber: number;
    status: ItemStatus;
    history: HistoryItem[];
};

type Project = {
    id: number;
    title: string;
    description: string;
    owner: {
        id: number;
        firstName: string;
        lastName: string;
        middleName?: string;
        email: string;
    };
    items: ExplanatoryNoteItem[];
    isApprovedForDefense: boolean;
};

const statusConfig: Record<
    ItemStatus,
    { label: string; color: string; bgColor: string; borderColor: string; dotColor: string; icon: React.ComponentType<any> }
> = {
    DRAFT: {
        label: 'Черновик',
        color: 'text-muted-foreground',
        bgColor: 'bg-muted',
        borderColor: 'border-border',
        dotColor: 'bg-muted-foreground',
        icon: FileText,
    },
    SUBMITTED: {
        label: 'На проверке',
        color: 'text-chart-4',
        bgColor: 'bg-chart-4/10',
        borderColor: 'border-chart-4/40',
        dotColor: 'bg-chart-4',
        icon: Clock,
    },
    APPROVED: {
        label: 'Одобрено',
        color: 'text-success',
        bgColor: 'bg-success/10',
        borderColor: 'border-success/40',
        dotColor: 'bg-success',
        icon: CheckCircle,
    },
    REJECTED: {
        label: 'Отклонено',
        color: 'text-destructive',
        bgColor: 'bg-destructive/10',
        borderColor: 'border-destructive/40',
        dotColor: 'bg-destructive',
        icon: XCircle,
    },
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
        id: 1,
        title: 'Курсовая работа по программированию',
        description: 'Разработка веб-приложения с использованием современных технологий',
        countOfChapters: 4,
        groupName: 'ИВТ-401',
        chapters: [
            { index: 0, title: 'Введение', description: 'Актуальность темы', deadline: '2024-03-10' },
            { index: 1, title: 'Обзор литературы', description: 'Анализ решений', deadline: '2024-03-20' },
            { index: 2, title: 'Проектирование', description: 'Архитектура', deadline: '2024-04-10' },
            { index: 3, title: 'Реализация', description: 'Разработка', deadline: '2024-05-01' },
        ],
    },
    {
        id: 2,
        title: 'Лабораторная работа по алгоритмам',
        description: 'Анализ и реализация алгоритмов сортировки',
        countOfChapters: 2,
        groupName: 'ИВТ-401',
        chapters: [
            { index: 0, title: 'Цель работы', description: 'Формулировка целей', deadline: '2024-03-05' },
            { index: 1, title: 'Ход выполнения', description: 'Описание процесса', deadline: '2024-03-12' },
        ],
    },
];

const mockProjects: Project[] = [
    {
        id: 101,
        title: 'Проект студента Иванов И.И.',
        description: 'Курсовая работа',
        owner: {
            id: 1,
            firstName: 'Иван',
            lastName: 'Иванов',
            middleName: 'Иванович',
            email: 'ivanov@student.edu',
        },
        isApprovedForDefense: false,
        items: [
            {
                id: 1,
                orderNumber: 0,
                status: 'APPROVED',
                history: [
                    {
                        id: 1,
                        previousStatus: 'SUBMITTED',
                        newStatus: 'APPROVED',
                        teacherComment: 'Хорошая работа, раскрыта тема',
                        fileName: 'introduction.pdf',
                        changedAt: '2024-03-01T10:00:00',
                        changedBy: { id: 10, firstName: 'Петр', lastName: 'Петров' },
                    },
                    {
                        id: 11,
                        previousStatus: 'DRAFT',
                        newStatus: 'SUBMITTED',
                        fileName: 'introduction_draft.pdf',
                        changedAt: '2024-02-28T09:00:00',
                        changedBy: { id: 1, firstName: 'Иван', lastName: 'Иванов' },
                    },
                ],
            },
            {
                id: 2,
                orderNumber: 1,
                status: 'SUBMITTED',
                history: [
                    {
                        id: 2,
                        previousStatus: 'DRAFT',
                        newStatus: 'SUBMITTED',
                        fileName: 'literature_review.pdf',
                        changedAt: '2024-03-05T14:00:00',
                        changedBy: { id: 1, firstName: 'Иван', lastName: 'Иванов' },
                    },
                ],
            },
            { id: 3, orderNumber: 2, status: 'DRAFT', history: [] },
            { id: 4, orderNumber: 3, status: 'DRAFT', history: [] },
        ],
    },
    {
        id: 102,
        title: 'Проект студента Петров П.П.',
        description: 'Курсовая работа',
        owner: {
            id: 2,
            firstName: 'Петр',
            lastName: 'Петров',
            middleName: 'Петрович',
            email: 'petrov@student.edu',
        },
        isApprovedForDefense: false,
        items: [
            {
                id: 5,
                orderNumber: 0,
                status: 'REJECTED',
                history: [
                    {
                        id: 3,
                        previousStatus: 'SUBMITTED',
                        newStatus: 'REJECTED',
                        teacherComment: 'Необходимо доработать структуру. Введение не раскрывает актуальность.',
                        fileName: 'introduction_v1.pdf',
                        changedAt: '2024-03-02T11:00:00',
                        changedBy: { id: 10, firstName: 'Петр', lastName: 'Петров' },
                    },
                ],
            },
            { id: 6, orderNumber: 1, status: 'DRAFT', history: [] },
            { id: 7, orderNumber: 2, status: 'DRAFT', history: [] },
            { id: 8, orderNumber: 3, status: 'DRAFT', history: [] },
        ],
    },
    {
        id: 103,
        title: 'Проект студента Сидоров С.С.',
        description: 'Курсовая работа',
        owner: {
            id: 3,
            firstName: 'Сергей',
            lastName: 'Сидоров',
            middleName: 'Сергеевич',
            email: 'sidorov@student.edu',
        },
        isApprovedForDefense: true,
        items: [
            {
                id: 9,
                orderNumber: 0,
                status: 'APPROVED',
                history: [
                    {
                        id: 4,
                        previousStatus: 'SUBMITTED',
                        newStatus: 'APPROVED',
                        teacherComment: 'Отлично',
                        fileName: 'introduction.pdf',
                        changedAt: '2024-03-01T09:00:00',
                        changedBy: { id: 10, firstName: 'Петр', lastName: 'Петров' },
                    },
                ],
            },
            {
                id: 10,
                orderNumber: 1,
                status: 'APPROVED',
                history: [
                    {
                        id: 5,
                        previousStatus: 'SUBMITTED',
                        newStatus: 'APPROVED',
                        fileName: 'literature_review.pdf',
                        changedAt: '2024-03-05T15:00:00',
                        changedBy: { id: 10, firstName: 'Петр', lastName: 'Петров' },
                    },
                ],
            },
            {
                id: 11,
                orderNumber: 2,
                status: 'APPROVED',
                history: [
                    {
                        id: 6,
                        previousStatus: 'SUBMITTED',
                        newStatus: 'APPROVED',
                        fileName: 'design.pdf',
                        changedAt: '2024-04-11T10:00:00',
                        changedBy: { id: 10, firstName: 'Петр', lastName: 'Петров' },
                    },
                ],
            },
            {
                id: 12,
                orderNumber: 3,
                status: 'APPROVED',
                history: [
                    {
                        id: 7,
                        previousStatus: 'SUBMITTED',
                        newStatus: 'APPROVED',
                        fileName: 'implementation.pdf',
                        changedAt: '2024-05-02T12:00:00',
                        changedBy: { id: 10, firstName: 'Петр', lastName: 'Петров' },
                    },
                ],
            },
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
    const [selectedItem, setSelectedItem] = useState<{
        item: ExplanatoryNoteItem;
        project: Project;
        chapterTitle: string;
    } | null>(null);

    const selectedGroup = groups.find((g) => g.id === selectedGroupId);
    const selectedWork = works.find((w) => w.id === selectedWorkId);

    useEffect(() => {
        setGroups(mockGroups);
    }, []);

    useEffect(() => {
        if (!selectedGroupId) return;
        setIsLoading(true);
        setTimeout(() => {
            setWorks(mockWorks);
            setIsLoading(false);
        }, 300);
    }, [selectedGroupId]);

    useEffect(() => {
        if (!selectedWorkId) return;
        setIsLoading(true);
        setTimeout(() => {
            setProjects(mockProjects);
            setIsLoading(false);
        }, 300);
    }, [selectedWorkId]);

    const handleItemClick = (item: ExplanatoryNoteItem, project: Project) => {
        if (item.status === 'DRAFT') return;
        const chapter = selectedWork?.chapters.find((ch) => ch.index === item.orderNumber);
        if (!chapter) return;
        setSelectedItem({ item, project, chapterTitle: chapter.title });
    };

    const handleApproveDefense = async (projectId: number) => {
        setProjects((prev) =>
            prev.map((p) => (p.id === projectId ? { ...p, isApprovedForDefense: true } : p))
        );
    };

    const handleGoToTable = () => {
        if (selectedGroupId && selectedWorkId) {
            setPageView('table');
        }
    };

    const handleBack = () => {
        setPageView('selection');
    };

    const filteredGroups = groups.filter((group) =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Stats for table header
    const totalStudents = projects.length;
    const approvedDefense = projects.filter((p) => p.isApprovedForDefense).length;
    const pendingReview = projects.reduce(
        (acc, p) => acc + p.items.filter((i) => i.status === 'SUBMITTED').length,
        0
    );
    const totalApproved = projects.reduce(
        (acc, p) => acc + p.items.filter((i) => i.status === 'APPROVED').length,
        0
    );
    const totalItems = projects.reduce((acc, p) => acc + p.items.length, 0);
    const progressPercent = totalItems > 0 ? Math.round((totalApproved / totalItems) * 100) : 0;

    // ─── Selection Page ────────────────────────────────────────────────────────
    if (pageView === 'selection') {
        return (
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-card-foreground mb-1">Работы студентов</h1>
                        <p className="text-muted-foreground text-sm">
                            Выберите группу и академическую работу для просмотра прогресса
                        </p>
                    </div>
                    {selectedGroupId && selectedWorkId && (
                        <button
                            onClick={handleGoToTable}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors"
                        >
                            Открыть таблицу
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Breadcrumb pills */}
                {(selectedGroupId || selectedWorkId) && (
                    <div className="flex items-center gap-2 text-sm">
                        {selectedGroup && (
                            <>
                                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20">
                                    {selectedGroup.name}
                                </span>
                                {selectedWork && (
                                    <>
                                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20">
                                            {selectedWork.title}
                                        </span>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* Group Selection */}
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
                        <input
                            type="text"
                            placeholder="Поиск группы..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-3 py-2.5 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-card-foreground text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {filteredGroups.map((group) => (
                            <button
                                key={group.id}
                                onClick={() => {
                                    setSelectedGroupId(group.id);
                                    setSelectedWorkId(null);
                                    setProjects([]);
                                }}
                                className={`p-4 border-2 rounded-xl transition-all text-left group relative overflow-hidden ${selectedGroupId === group.id
                                    ? 'border-primary bg-primary/5 shadow-sm'
                                    : 'border-border hover:border-primary/50 hover:bg-accent'
                                    }`}
                            >
                                {selectedGroupId === group.id && (
                                    <div className="absolute top-2 right-2">
                                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                                    </div>
                                )}
                                <GraduationCap
                                    className={`w-6 h-6 mb-2 ${selectedGroupId === group.id ? 'text-primary' : 'text-muted-foreground'
                                        }`}
                                />
                                <div className="font-semibold text-card-foreground">{group.name}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">
                                    {group.studentCount} студ.
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Work Selection */}
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
                                {[1, 2].map((i) => (
                                    <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />
                                ))}
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
                                                <div
                                                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${selectedWorkId === work.id ? 'bg-primary/10' : 'bg-muted'
                                                        }`}
                                                >
                                                    <FileText
                                                        className={`w-4 h-4 ${selectedWorkId === work.id ? 'text-primary' : 'text-muted-foreground'
                                                            }`}
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-card-foreground">{work.title}</h3>
                                                    <p className="text-sm text-muted-foreground mt-0.5">{work.description}</p>
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0 flex items-center gap-2">
                                                <span className="text-xs px-2.5 py-1 bg-muted rounded-full text-muted-foreground border border-border">
                                                    {work.countOfChapters} разд.
                                                </span>
                                                {selectedWorkId === work.id && (
                                                    <CheckCircle className="w-5 h-5 text-primary" />
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* CTA Banner */}
                {selectedGroupId && selectedWorkId && (
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            <div>
                                <p className="font-medium text-card-foreground">Всё готово к просмотру</p>
                                <p className="text-sm text-muted-foreground">
                                    Откройте таблицу прогресса для группы {selectedGroup?.name}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleGoToTable}
                            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors"
                        >
                            Открыть таблицу
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Empty state */}
                {!selectedGroupId && (
                    <div className="bg-card border border-border rounded-xl p-14 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold text-card-foreground mb-2">Выберите группу</h3>
                        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                            Выберите группу студентов выше, чтобы продолжить
                        </p>
                    </div>
                )}
            </div>
        );
    }

    // ─── Table Page ────────────────────────────────────────────────────────────
    return (
        <div className="space-y-5">
            {/* Page Header with breadcrumb */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-card-foreground hover:bg-accent rounded-lg transition-colors border border-border"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Назад
                    </button>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Работы студентов</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span className="text-card-foreground font-medium">{selectedGroup?.name}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span className="text-card-foreground font-medium">{selectedWork?.title}</span>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
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
                                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden w-14">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Table Card */}
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
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                    {/* Table header */}
                    <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card">
                        <div>
                            <h2 className="font-semibold text-card-foreground">{selectedWork?.title}</h2>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {selectedGroup?.name} · {projects.length} студентов
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-muted/60 border-b border-border">
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide sticky left-0 bg-muted/60 z-10 min-w-[220px]">
                                        Студент
                                    </th>
                                    {selectedWork?.chapters.map((chapter) => (
                                        <th
                                            key={chapter.index}
                                            className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide min-w-[160px]"
                                        >
                                            <div className="text-card-foreground normal-case font-semibold text-sm">{chapter.title}</div>
                                            {chapter.deadline && (
                                                <div className="text-xs font-normal text-muted-foreground mt-0.5 normal-case tracking-normal">
                                                    до {new Date(chapter.deadline).toLocaleDateString('ru-RU')}
                                                </div>
                                            )}
                                        </th>
                                    ))}
                                    <th className="px-4 py-3.5 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide min-w-[120px]">
                                        Защита
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {projects.map((project, rowIdx) => {
                                    const allApproved = project.items.every((item) => item.status === 'APPROVED');
                                    const approvedCount = project.items.filter((i) => i.status === 'APPROVED').length;
                                    const totalCount = project.items.length;

                                    return (
                                        <tr
                                            key={project.id}
                                            className={`transition-colors hover:bg-accent/40 ${rowIdx % 2 === 0 ? '' : 'bg-muted/20'
                                                }`}
                                        >
                                            {/* Student cell */}
                                            <td className={`px-5 py-3.5 sticky left-0 z-10 ${rowIdx % 2 === 0 ? 'bg-card' : 'bg-muted/20'} hover:bg-accent/40`}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                        <span className="text-xs font-semibold text-primary">
                                                            {project.owner.lastName[0]}{project.owner.firstName[0]}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-card-foreground text-sm">
                                                            {project.owner.lastName} {project.owner.firstName[0]}.{project.owner.middleName?.[0]}.
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-0.5">
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

                                            {/* Item cells */}
                                            {selectedWork?.chapters.map((chapter) => {
                                                const item = project.items.find((i) => i.orderNumber === chapter.index);
                                                if (!item) {
                                                    return <td key={chapter.index} className="px-4 py-3.5" />;
                                                }

                                                const cfg = statusConfig[item.status];
                                                const StatusIcon = cfg.icon;
                                                const isClickable = item.status !== 'DRAFT';

                                                return (
                                                    <td key={chapter.index} className="px-4 py-3.5">
                                                        <button
                                                            onClick={() => handleItemClick(item, project)}
                                                            disabled={!isClickable}
                                                            title={isClickable ? `Открыть историю: ${chapter.title}` : 'Нет данных'}
                                                            className={`
                                w-full px-3 py-2 rounded-lg border flex items-center gap-2 transition-all text-left
                                ${cfg.bgColor} ${cfg.borderColor}
                                ${isClickable
                                                                    ? 'hover:opacity-80 hover:shadow-sm cursor-pointer active:scale-95'
                                                                    : 'opacity-40 cursor-default'
                                                                }
                              `}
                                                        >
                                                            <StatusIcon className={`w-3.5 h-3.5 flex-shrink-0 ${cfg.color}`} />
                                                            <span className={`text-xs font-medium ${cfg.color}`}>
                                                                {cfg.label}
                                                            </span>
                                                        </button>
                                                    </td>
                                                );
                                            })}

                                            {/* Defense cell */}
                                            <td className="px-4 py-3.5">
                                                <div className="flex justify-center">
                                                    {project.isApprovedForDefense ? (
                                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-success/10 border border-success/30 rounded-lg">
                                                            <CheckCircle className="w-3.5 h-3.5 text-success" />
                                                            <span className="text-xs font-medium text-success">Допущен</span>
                                                        </div>
                                                    ) : allApproved ? (
                                                        <button
                                                            onClick={() => handleApproveDefense(project.id)}
                                                            className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary-hover transition-colors"
                                                        >
                                                            Допустить
                                                        </button>
                                                    ) : (
                                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted border border-border rounded-lg">
                                                            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                                            <span className="text-xs text-muted-foreground">Ожидание</span>
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

            {/* Legend */}
            {!isLoading && projects.length > 0 && (
                <div className="flex items-center gap-6 px-1">
                    <span className="text-xs text-muted-foreground">Статусы:</span>
                    {(Object.entries(statusConfig) as [ItemStatus, typeof statusConfig[ItemStatus]][]).map(([key, cfg]) => (
                        <div key={key} className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${cfg.dotColor}`} />
                            <span className="text-xs text-muted-foreground">{cfg.label}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Item History Modal */}
            {selectedItem && (
                <ItemHistoryModal
                    item={selectedItem.item}
                    project={selectedItem.project}
                    chapterTitle={selectedItem.chapterTitle}
                    onClose={() => setSelectedItem(null)}
                    onUpdate={() => setSelectedItem(null)}
                />
            )}
        </div>
    );
}
