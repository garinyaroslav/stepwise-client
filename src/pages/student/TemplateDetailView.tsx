import { ArrowLeft, Edit, Calendar, FileText } from 'lucide-react';
import { WorkTemplate } from './TemplatesManagement';

type TemplateDetailViewProps = {
    template: WorkTemplate;
    onBack: () => void;
    onEdit: () => void;
};

export function TemplateDetailView({ template, onBack, onEdit }: TemplateDetailViewProps) {
    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="text-sm font-medium">Назад к списку шаблонов</span>
                </button>

                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-semibold">{template.templateTitle}</h1>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                                {template.type}
                            </span>
                        </div>
                        <p className="text-gray-600">{template.templateDescription}</p>
                    </div>
                    <button
                        onClick={onEdit}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Edit className="w-4 h-4" />
                        Редактировать
                    </button>
                </div>
            </div>

            {/* Work Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h2 className="font-semibold mb-4">Детали работы</h2>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Название работы</label>
                        <p className="text-gray-900">{template.workTitle}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Дата создания шаблона
                        </label>
                        <p className="text-gray-900">
                            {new Date(template.createdAt).toLocaleDateString('ru-RU', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Описание работы</label>
                        <p className="text-gray-900">{template.workDescription}</p>
                    </div>
                </div>
            </div>

            {/* Chapters */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-semibold">
                        Разделы пояснительной записки ({template.workTemplateChapters.length})
                    </h2>
                </div>

                {template.workTemplateChapters.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        В этом шаблоне пока нет разделов
                    </div>
                ) : (
                    <div className="space-y-4">
                        {template.workTemplateChapters.map((chapter, index) => (
                            <div
                                key={chapter.id}
                                className="p-5 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-semibold flex-shrink-0">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg mb-2">{chapter.title}</h3>
                                        <p className="text-gray-600 text-sm mb-3">{chapter.description}</p>
                                        <div className="flex items-center gap-6 text-sm">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <Calendar className="w-4 h-4" />
                                                <span>
                                                    Срок сдачи:{' '}
                                                    <span className="font-medium text-gray-900">
                                                        {new Date(chapter.deadline).toLocaleDateString('ru-RU', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        })}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <FileText className="w-6 h-6 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Timeline Visualization */}
            {template.workTemplateChapters.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
                    <h2 className="font-semibold mb-6">Временная шкала разделов</h2>
                    <div className="relative">
                        {template.workTemplateChapters
                            .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                            .map((chapter, index) => (
                                <div key={chapter.id} className="flex items-start gap-4 mb-6 last:mb-0">
                                    <div className="flex flex-col items-center">
                                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                                        {index < template.workTemplateChapters.length - 1 && (
                                            <div className="w-0.5 h-12 bg-blue-200 my-1"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 pb-4">
                                        <div className="text-sm font-medium text-gray-900 mb-1">{chapter.title}</div>
                                        <div className="text-xs text-gray-500">
                                            {new Date(chapter.deadline).toLocaleDateString('ru-RU')}
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
}

