import { useState } from 'react';
import { Search, Plus, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { TemplateDetailView } from './TemplateDetailView';
import { TemplateModal } from './TemplateModal';

export type WorkTemplateChapter = {
    id: string;
    title: string;
    description: string;
    deadline: string;
};

export type WorkTemplate = {
    id: string;
    templateTitle: string;
    templateDescription: string;
    workTitle: string;
    workDescription: string;
    type: string;
    workTemplateChapters: WorkTemplateChapter[];
    createdAt: string;
};

const mockTemplates: WorkTemplate[] = [
    {
        id: '1',
        templateTitle: 'Шаблон курсовой работы по программированию',
        templateDescription: 'Стандартный шаблон для курсовых работ по дисциплинам программирования',
        workTitle: 'Курсовая работа',
        workDescription: 'Разработка программного обеспечения',
        type: 'Курсовая работа',
        createdAt: '2024-01-15',
        workTemplateChapters: [
            {
                id: 'ch1',
                title: 'Введение',
                description: 'Актуальность темы, цели и задачи работы',
                deadline: '2024-03-10',
            },
            {
                id: 'ch2',
                title: 'Обзор литературы',
                description: 'Анализ существующих решений и технологий',
                deadline: '2024-03-20',
            },
            {
                id: 'ch3',
                title: 'Проектирование',
                description: 'Разработка архитектуры и проектных решений',
                deadline: '2024-04-10',
            },
            {
                id: 'ch4',
                title: 'Реализация',
                description: 'Описание процесса разработки и реализации',
                deadline: '2024-05-01',
            },
            {
                id: 'ch5',
                title: 'Тестирование',
                description: 'Результаты тестирования и анализ',
                deadline: '2024-05-15',
            },
            {
                id: 'ch6',
                title: 'Заключение',
                description: 'Выводы и результаты работы',
                deadline: '2024-05-25',
            },
        ],
    },
    {
        id: '2',
        templateTitle: 'Шаблон дипломной работы бакалавра',
        templateDescription: 'Шаблон для выпускной квалификационной работы бакалавра',
        workTitle: 'Дипломная работа',
        workDescription: 'Выпускная квалификационная работа',
        type: 'Дипломная работа',
        createdAt: '2024-01-20',
        workTemplateChapters: [
            {
                id: 'ch1',
                title: 'Введение',
                description: 'Обоснование актуальности, цели и задачи',
                deadline: '2024-02-28',
            },
            {
                id: 'ch2',
                title: 'Аналитическая часть',
                description: 'Анализ предметной области',
                deadline: '2024-03-15',
            },
            {
                id: 'ch3',
                title: 'Теоретическая часть',
                description: 'Теоретические основы решения задачи',
                deadline: '2024-04-01',
            },
            {
                id: 'ch4',
                title: 'Практическая часть',
                description: 'Разработка и реализация решения',
                deadline: '2024-04-25',
            },
        ],
    },
    {
        id: '3',
        templateTitle: 'Шаблон исследовательской работы',
        templateDescription: 'Для научно-исследовательских проектов студентов',
        workTitle: 'Научная работа',
        workDescription: 'Исследовательский проект',
        type: 'Научная работа',
        createdAt: '2024-02-01',
        workTemplateChapters: [
            {
                id: 'ch1',
                title: 'Постановка проблемы',
                description: 'Определение исследовательской проблемы',
                deadline: '2024-03-05',
            },
            {
                id: 'ch2',
                title: 'Методология исследования',
                description: 'Описание методов и подходов',
                deadline: '2024-03-25',
            },
            {
                id: 'ch3',
                title: 'Результаты',
                description: 'Полученные результаты исследования',
                deadline: '2024-04-20',
            },
        ],
    },
    {
        id: '4',
        templateTitle: 'Шаблон лабораторной работы',
        templateDescription: 'Для оформления лабораторных работ',
        workTitle: 'Лабораторная работа',
        workDescription: 'Практическая лабораторная работа',
        type: 'Лабораторная работа',
        createdAt: '2024-02-10',
        workTemplateChapters: [
            {
                id: 'ch1',
                title: 'Цель работы',
                description: 'Определение целей и задач лабораторной работы',
                deadline: '2024-03-01',
            },
            {
                id: 'ch2',
                title: 'Теоретические основы',
                description: 'Краткое теоретическое введение',
                deadline: '2024-03-08',
            },
            {
                id: 'ch3',
                title: 'Выполнение работы',
                description: 'Описание хода выполнения работы',
                deadline: '2024-03-15',
            },
        ],
    },
    {
        id: '5',
        templateTitle: 'Шаблон магистерской диссертации',
        templateDescription: 'Для магистерских диссертационных исследований',
        workTitle: 'Магистерская диссертация',
        workDescription: 'Выпускная работа магистра',
        type: 'Диссертация',
        createdAt: '2024-02-15',
        workTemplateChapters: [
            {
                id: 'ch1',
                title: 'Введение',
                description: 'Актуальность и научная новизна исследования',
                deadline: '2024-03-01',
            },
            {
                id: 'ch2',
                title: 'Обзор литературы',
                description: 'Критический анализ научных источников',
                deadline: '2024-03-20',
            },
        ],
    },
    {
        id: '6',
        templateTitle: 'Шаблон проектной работы',
        templateDescription: 'Для командных проектных работ',
        workTitle: 'Проектная работа',
        workDescription: 'Командный проект',
        type: 'Проектная работа',
        createdAt: '2024-02-20',
        workTemplateChapters: [
            {
                id: 'ch1',
                title: 'Описание проекта',
                description: 'Общее описание и цели проекта',
                deadline: '2024-03-10',
            },
        ],
    },
];

const ITEMS_PER_PAGE = 5;

export function TemplatesManagement() {
    const [templates, setTemplates] = useState<WorkTemplate[]>(mockTemplates);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<WorkTemplate | null>(null);
    const [viewingTemplate, setViewingTemplate] = useState<WorkTemplate | null>(null);

    // Filter templates by search query
    const filteredTemplates = templates.filter(
        (template) =>
            template.templateTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.workTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination
    const totalPages = Math.ceil(filteredTemplates.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedTemplates = filteredTemplates.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handleDelete = (id: string) => {
        if (confirm('Вы уверены, что хотите удалить этот шаблон?')) {
            setTemplates(templates.filter((t) => t.id !== id));
        }
    };

    const handleEdit = (template: WorkTemplate) => {
        setSelectedTemplate(template);
        setShowModal(true);
    };

    const handleCreateNew = () => {
        setSelectedTemplate(null);
        setShowModal(true);
    };

    const handleSaveTemplate = (template: WorkTemplate) => {
        if (selectedTemplate) {
            // Update existing
            setTemplates(templates.map((t) => (t.id === template.id ? template : t)));
        } else {
            // Create new
            setTemplates([...templates, { ...template, id: Date.now().toString(), createdAt: new Date().toISOString() }]);
        }
        setShowModal(false);
        setSelectedTemplate(null);
    };

    const handleView = (template: WorkTemplate) => {
        setViewingTemplate(template);
    };

    if (viewingTemplate) {
        return (
            <TemplateDetailView
                template={viewingTemplate}
                onBack={() => setViewingTemplate(null)}
                onEdit={() => {
                    setSelectedTemplate(viewingTemplate);
                    setShowModal(true);
                }}
            />
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold mb-2">Управление шаблонами работ</h1>
                <p className="text-gray-600 text-sm">
                    Создавайте и управляйте шаблонами для различных типов академических работ
                </p>
            </div>

            {/* Search and Create */}
            <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex-1 max-w-md relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Поиск по шаблонам..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <button
                    onClick={handleCreateNew}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Создать шаблон
                </button>
            </div>

            {/* Templates List */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {paginatedTemplates.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        {searchQuery ? 'Шаблоны не найдены' : 'Пока нет шаблонов. Создайте первый!'}
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {paginatedTemplates.map((template) => (
                            <div key={template.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold">{template.templateTitle}</h3>
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                                {template.type}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-3">{template.templateDescription}</p>
                                        <div className="flex items-center gap-6 text-xs text-gray-500">
                                            <span>Разделов: {template.workTemplateChapters.length}</span>
                                            <span>
                                                Создан: {new Date(template.createdAt).toLocaleDateString('ru-RU')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleView(template)}
                                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                            title="Просмотр"
                                        >
                                            <Eye className="w-5 h-5 text-gray-600" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(template.id)}
                                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                            title="Удалить"
                                        >
                                            <Trash2 className="w-5 h-5 text-red-600" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        Показано {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredTemplates.length)} из{' '}
                        {filteredTemplates.length}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-1 rounded-lg transition-colors ${currentPage === page
                                        ? 'bg-blue-600 text-white'
                                        : 'hover:bg-gray-100 text-gray-700'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <TemplateModal
                    template={selectedTemplate}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedTemplate(null);
                    }}
                    onSave={handleSaveTemplate}
                />
            )}
        </div>
    );
}

