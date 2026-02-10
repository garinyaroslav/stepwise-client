import { FileText } from 'lucide-react';

export function CreateWorkModal() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-semibold mb-2">Создание академической работы</h1>
                <p className="text-gray-600 text-sm">
                    Создайте новую академическую работу и назначьте её студентам
                </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-12">
                <div className="max-w-md mx-auto text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Функционал в разработке</h3>
                    <p className="text-gray-600 text-sm">
                        Этот раздел будет содержать форму для создания новых академических работ на основе
                        шаблонов
                    </p>
                </div>
            </div>
        </div>
    );
}

