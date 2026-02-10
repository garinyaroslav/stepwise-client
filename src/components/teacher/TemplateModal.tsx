import { useState } from 'react';
import { X, Plus, Trash2, Calendar } from 'lucide-react';
import { WorkTemplate, WorkTemplateChapter } from './TemplatesManagement';

type TemplateModalProps = {
    template: WorkTemplate | null;
    onClose: () => void;
    onSave: (template: WorkTemplate) => void;
};

export function TemplateModal({ template, onClose, onSave }: TemplateModalProps) {
    const [formData, setFormData] = useState<Omit<WorkTemplate, 'id' | 'createdAt'>>({
        templateTitle: template?.templateTitle || '',
        templateDescription: template?.templateDescription || '',
        workTitle: template?.workTitle || '',
        workDescription: template?.workDescription || '',
        type: template?.type || '',
        workTemplateChapters: template?.workTemplateChapters || [],
    });

    const handleAddChapter = () => {
        setFormData({
            ...formData,
            workTemplateChapters: [
                ...formData.workTemplateChapters,
                {
                    id: `ch${Date.now()}`,
                    title: '',
                    description: '',
                    deadline: '',
                },
            ],
        });
    };

    const handleRemoveChapter = (id: string) => {
        setFormData({
            ...formData,
            workTemplateChapters: formData.workTemplateChapters.filter((ch) => ch.id !== id),
        });
    };

    const handleChapterChange = (id: string, field: keyof WorkTemplateChapter, value: string) => {
        setFormData({
            ...formData,
            workTemplateChapters: formData.workTemplateChapters.map((ch) =>
                ch.id === id ? { ...ch, [field]: value } : ch
            ),
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (template) {
            onSave({ ...template, ...formData });
        } else {
            onSave({
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                ...formData,
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold">
                        {template ? 'Редактировать шаблон' : 'Создать новый шаблон'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-6">
                        {/* Template Info */}
                        <div>
                            <h3 className="font-semibold mb-4">Информация о шаблоне</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Название шаблона *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.templateTitle}
                                        onChange={(e) => setFormData({ ...formData, templateTitle: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Например: Шаблон курсовой работы"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Описание шаблона *
                                    </label>
                                    <textarea
                                        required
                                        value={formData.templateDescription}
                                        onChange={(e) =>
                                            setFormData({ ...formData, templateDescription: e.target.value })
                                        }
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Краткое описание назначения шаблона"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Название работы *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.workTitle}
                                            onChange={(e) => setFormData({ ...formData, workTitle: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Курсовая работа"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Тип работы *
                                        </label>
                                        <select
                                            required
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Выберите тип</option>
                                            <option value="Курсовая работа">Курсовая работа</option>
                                            <option value="Дипломная работа">Дипломная работа</option>
                                            <option value="Научная работа">Научная работа</option>
                                            <option value="Лабораторная работа">Лабораторная работа</option>
                                            <option value="Диссертация">Диссертация</option>
                                            <option value="Проектная работа">Проектная работа</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Описание работы *
                                    </label>
                                    <textarea
                                        required
                                        value={formData.workDescription}
                                        onChange={(e) => setFormData({ ...formData, workDescription: e.target.value })}
                                        rows={2}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Описание академической работы"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Chapters */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold">Разделы пояснительной записки</h3>
                                <button
                                    type="button"
                                    onClick={handleAddChapter}
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Добавить раздел
                                </button>
                            </div>

                            {formData.workTemplateChapters.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                                    Нет разделов. Добавьте первый раздел.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {formData.workTemplateChapters.map((chapter, index) => (
                                        <div key={chapter.id} className="p-4 border border-gray-200 rounded-lg space-y-3">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                                                            {index + 1}
                                                        </span>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={chapter.title}
                                                            onChange={(e) =>
                                                                handleChapterChange(chapter.id, 'title', e.target.value)
                                                            }
                                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            placeholder="Название раздела"
                                                        />
                                                    </div>

                                                    <textarea
                                                        required
                                                        value={chapter.description}
                                                        onChange={(e) =>
                                                            handleChapterChange(chapter.id, 'description', e.target.value)
                                                        }
                                                        rows={2}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Описание содержания раздела"
                                                    />

                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        <label className="text-sm text-gray-600">Срок сдачи:</label>
                                                        <input
                                                            type="date"
                                                            required
                                                            value={chapter.deadline}
                                                            onChange={(e) =>
                                                                handleChapterChange(chapter.id, 'deadline', e.target.value)
                                                            }
                                                            className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                        />
                                                    </div>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveChapter(chapter.id)}
                                                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-5 h-5 text-red-600" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {template ? 'Сохранить изменения' : 'Создать шаблон'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

