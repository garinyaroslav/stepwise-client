import { X, User, Mail, Phone, Briefcase } from 'lucide-react';

type ProfileModalProps = {
    onClose: () => void;
};

export function ProfileModal({ onClose }: ProfileModalProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold">Профиль преподавателя</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="flex items-start gap-6 mb-6">
                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                            <User className="w-10 h-10 text-gray-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-1">Иванова Анна Петровна</h3>
                            <p className="text-gray-600">Преподаватель</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <Mail className="w-5 h-5 text-gray-500" />
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Email</div>
                                <div className="font-medium">anna.ivanova@university.edu</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <Phone className="w-5 h-5 text-gray-500" />
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Телефон</div>
                                <div className="font-medium">+7 (495) 123-45-67</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <Briefcase className="w-5 h-5 text-gray-500" />
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Кафедра</div>
                                <div className="font-medium">Информатика и программирование</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    );
}

