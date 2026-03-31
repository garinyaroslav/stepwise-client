import { useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Clock,
    Users,
    X,
    Calendar,
    Check,
    MessageSquare,
    Trash2,
    Info,
} from 'lucide-react';

type Registration = {
    id: number;
    studentName: string;
    registeredAt: string;
    orderNumber?: number;
};

type DefenseSchedule = {
    id: number;
    academicWorkId: number;
    startTime: string;
    endTime?: string;
    maxStudents?: number;
    comment?: string;
    registrations: Registration[];
};

type CreateForm = {
    startTime: string;
    endTime: string;
    maxStudents: string;
    comment: string;
};

type Props = {
    academicWorkId: number;
    workTitle: string;
};

const DAYS_RU = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const MONTHS_RU = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];
const MONTHS_GEN_RU = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
];

const mockSchedules: DefenseSchedule[] = [
    {
        id: 1,
        academicWorkId: 1,
        startTime: '2026-04-10T09:00:00',
        endTime: '2026-04-10T13:00:00',
        maxStudents: 3,
        comment: 'Кабинет 305, 3 этаж',
        registrations: [
            { id: 1, studentName: 'Иванов Иван', registeredAt: '2026-03-25T10:00:00', orderNumber: 1 },
            { id: 2, studentName: 'Сидоров Сергей', registeredAt: '2026-03-25T11:00:00', orderNumber: 2 },
            { id: 3, studentName: 'Петров Петр', registeredAt: '2026-03-26T09:00:00', orderNumber: 3 },
        ],
    },
    {
        id: 2,
        academicWorkId: 1,
        startTime: '2026-04-15T14:00:00',
        endTime: '2026-04-15T18:00:00',
        maxStudents: 5,
        comment: 'Аудитория 201',
        registrations: [
            { id: 4, studentName: 'Козлов Алексей', registeredAt: '2026-03-26T10:00:00', orderNumber: 1 },
            { id: 5, studentName: 'Петров Иван', registeredAt: '2026-03-27T09:00:00', orderNumber: 2 },
        ],
    },
    {
        id: 3,
        academicWorkId: 1,
        startTime: '2026-04-22T10:00:00',
        maxStudents: 5,
        registrations: [],
    },
];

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
    const day = new Date(year, month, 1).getDay();
    return (day + 6) % 7; // 0=Mon, 6=Sun
}

function formatTime(isoStr: string) {
    return new Date(isoStr).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

export function DefenseCalendar({ academicWorkId, workTitle }: Props) {
    const today = new Date();

    const defaultMonth = today.getMonth() === 11 ? 0 : today.getMonth() + 1;
    const defaultYear = today.getMonth() === 11 ? today.getFullYear() + 1 : today.getFullYear();

    const [currentYear, setCurrentYear] = useState(defaultYear);
    const [currentMonth, setCurrentMonth] = useState(defaultMonth);
    const [schedules, setSchedules] = useState<DefenseSchedule[]>(
        mockSchedules.filter((s) => s.academicWorkId === academicWorkId)
    );
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [selectedSchedule, setSelectedSchedule] = useState<DefenseSchedule | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState<CreateForm>({ startTime: '', endTime: '', maxStudents: '', comment: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    const prevMonth = () => {
        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1); }
        else setCurrentMonth((m) => m - 1);
    };
    const nextMonth = () => {
        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1); }
        else setCurrentMonth((m) => m + 1);
    };

    const getSchedulesForDay = (day: number) =>
        schedules.filter((s) => {
            const d = new Date(s.startTime);
            return d.getFullYear() === currentYear && d.getMonth() === currentMonth && d.getDate() === day;
        });

    const isToday = (day: number) =>
        day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

    const isPast = (day: number) => {
        const d = new Date(currentYear, currentMonth, day);
        const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        return d < t;
    };

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfWeek(currentYear, currentMonth);
    const calendarDays: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) calendarDays.push(null);
    for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);
    while (calendarDays.length % 7 !== 0) calendarDays.push(null);

    const rows: (number | null)[][] = [];
    for (let i = 0; i < calendarDays.length; i += 7) rows.push(calendarDays.slice(i, i + 7));

    const openCreateModal = (day: number) => {
        if (isPast(day)) return;
        setSelectedDay(day);
        setSelectedSchedule(null);
        setForm({ startTime: '', endTime: '', maxStudents: '', comment: '' });
        setFormError('');
        setShowModal(true);
    };

    const openViewModal = (e: React.MouseEvent, schedule: DefenseSchedule) => {
        e.stopPropagation();
        setSelectedSchedule(schedule);
        setSelectedDay(null);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedDay(null);
        setSelectedSchedule(null);
    };

    const handleCreate = async () => {
        if (!selectedDay || !form.startTime) {
            setFormError('Укажите время начала защиты');
            return;
        }
        if (form.endTime && form.endTime <= form.startTime) {
            setFormError('Время окончания должно быть позже начала');
            return;
        }
        setIsSubmitting(true);
        setFormError('');

        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
        const startTime = `${dateStr}T${form.startTime}:00`;
        const endTime = form.endTime ? `${dateStr}T${form.endTime}:00` : undefined;

        await new Promise((r) => setTimeout(r, 600));

        const newSchedule: DefenseSchedule = {
            id: Date.now(),
            academicWorkId,
            startTime,
            endTime,
            maxStudents: form.maxStudents ? parseInt(form.maxStudents) : undefined,
            comment: form.comment.trim() || undefined,
            registrations: [],
        };

        setSchedules((prev) => [...prev, newSchedule]);
        setIsSubmitting(false);
        closeModal();
    };

    const handleDelete = (scheduleId: number) => {
        setSchedules((prev) => prev.filter((s) => s.id !== scheduleId));
        closeModal();
    };

    const formatSelectedDate = (day: number) =>
        `${day} ${MONTHS_GEN_RU[currentMonth]} ${currentYear}`;

    const monthSchedules = schedules.filter((s) => {
        const d = new Date(s.startTime);
        return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    });
    const totalSlots = monthSchedules.length;
    const totalRegistrations = monthSchedules.reduce((acc, s) => acc + s.registrations.length, 0);
    const fullSlots = monthSchedules.filter(
        (s) => s.maxStudents !== undefined && s.registrations.length >= s.maxStudents
    ).length;

    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-5 border-b border-border">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-card-foreground">Расписание защит</h3>
                            <p className="text-xs text-muted-foreground truncate max-w-[260px]">{workTitle}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={prevMonth}
                            className="p-2 hover:bg-accent rounded-lg transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                        </button>
                        <span className="text-card-foreground font-semibold min-w-[180px] text-center">
                            {MONTHS_RU[currentMonth]} {currentYear}
                        </span>
                        <button
                            onClick={nextMonth}
                            className="p-2 hover:bg-accent rounded-lg transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </button>
                    </div>

                    <div className="flex items-center gap-5 text-xs">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{totalSlots} слотов</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Users className="w-3.5 h-3.5" />
                            <span>{totalRegistrations} записано</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-success" />
                            <span className="text-muted-foreground">Есть места</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-destructive" />
                            <span className="text-muted-foreground">Заполнено</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-7 border-b border-border bg-muted/40">
                {DAYS_RU.map((day, i) => (
                    <div
                        key={day}
                        className={`py-2.5 text-center text-xs font-semibold tracking-wide ${i >= 5 ? 'text-destructive/60' : 'text-muted-foreground'
                            }`}
                    >
                        {day}
                    </div>
                ))}
            </div>

            <div>
                {rows.map((row, rowIdx) => (
                    <div key={rowIdx} className="grid grid-cols-7 border-b border-border last:border-b-0">
                        {row.map((day, colIdx) => {
                            if (day === null) {
                                return (
                                    <div
                                        key={colIdx}
                                        className="min-h-[120px] border-r border-border last:border-r-0 bg-muted/10"
                                    />
                                );
                            }

                            const daySchedules = getSchedulesForDay(day);
                            const isWeekend = colIdx >= 5;
                            const todayFlag = isToday(day);
                            const pastFlag = isPast(day);

                            return (
                                <div
                                    key={colIdx}
                                    onClick={() => openCreateModal(day)}
                                    className={`
                    min-h-[120px] border-r border-border last:border-r-0 p-2 relative
                    transition-colors group
                    ${isWeekend ? 'bg-muted/10' : ''}
                    ${todayFlag ? 'bg-primary/5' : ''}
                    ${pastFlag ? 'opacity-60' : !todayFlag ? 'hover:bg-accent/40 cursor-pointer' : 'hover:bg-primary/10 cursor-pointer'}
                  `}
                                >
                                    <div
                                        className={`w-7 h-7 rounded-full flex items-center justify-center mb-1.5 text-sm ${todayFlag
                                            ? 'bg-primary text-primary-foreground font-semibold'
                                            : isWeekend
                                                ? 'text-destructive/70'
                                                : 'text-card-foreground'
                                            }`}
                                    >
                                        {day}
                                    </div>

                                    <div className="space-y-1">
                                        {daySchedules.slice(0, 3).map((schedule) => {
                                            const isFull =
                                                schedule.maxStudents !== undefined &&
                                                schedule.registrations.length >= schedule.maxStudents;
                                            return (
                                                <button
                                                    key={schedule.id}
                                                    onClick={(e) => openViewModal(e, schedule)}
                                                    className={`
                            w-full px-1.5 py-1 rounded text-xs flex items-center gap-1
                            border transition-colors
                            ${isFull
                                                            ? 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20'
                                                            : 'bg-success/10 text-success border-success/20 hover:bg-success/20'
                                                        }
                          `}
                                                >
                                                    <Clock className="w-3 h-3 flex-shrink-0" />
                                                    <span className="truncate">{formatTime(schedule.startTime)}</span>
                                                    {schedule.maxStudents !== undefined && (
                                                        <span className="ml-auto flex-shrink-0 opacity-70 text-[10px]">
                                                            {schedule.registrations.length}/{schedule.maxStudents}
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                        {daySchedules.length > 3 && (
                                            <div className="text-[10px] text-muted-foreground px-1">
                                                +{daySchedules.length - 3} ещё
                                            </div>
                                        )}
                                    </div>

                                    {!pastFlag && (
                                        <div className="absolute bottom-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Plus className="w-3 h-3 text-primary" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div className="px-5 py-3 border-t border-border bg-muted/30 flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                <p className="text-xs text-muted-foreground">
                    Нажмите на день, чтобы добавить слот защиты. Нажмите на слот для просмотра деталей.
                </p>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={closeModal}
                    />
                    <div className="relative bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="p-5 border-b border-border flex items-start justify-between">
                            <div>
                                <h3 className="font-semibold text-card-foreground text-lg">
                                    {selectedSchedule ? 'Слот защиты' : 'Новый слот защиты'}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-0.5">
                                    {selectedSchedule
                                        ? new Date(selectedSchedule.startTime).toLocaleDateString('ru-RU', {
                                            day: 'numeric', month: 'long', year: 'numeric',
                                        })
                                        : selectedDay ? formatSelectedDate(selectedDay) : ''}
                                </p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-accent rounded-xl transition-colors"
                            >
                                <X className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </div>

                        <div className="p-5 max-h-[70vh] overflow-y-auto">
                            {selectedSchedule ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <Clock className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-0.5">Время</p>
                                            <p className="font-medium text-card-foreground">
                                                {formatTime(selectedSchedule.startTime)}
                                                {selectedSchedule.endTime && ` — ${formatTime(selectedSchedule.endTime)}`}
                                            </p>
                                        </div>
                                    </div>

                                    {selectedSchedule.maxStudents !== undefined && (
                                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                                            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <Users className="w-5 h-5 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-muted-foreground mb-1">Места</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${selectedSchedule.registrations.length >= selectedSchedule.maxStudents
                                                                ? 'bg-destructive'
                                                                : 'bg-success'
                                                                }`}
                                                            style={{
                                                                width: `${Math.min(
                                                                    (selectedSchedule.registrations.length / selectedSchedule.maxStudents) * 100,
                                                                    100
                                                                )}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-medium text-card-foreground flex-shrink-0">
                                                        {selectedSchedule.registrations.length} / {selectedSchedule.maxStudents}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {selectedSchedule.comment && (
                                        <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-xl">
                                            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <MessageSquare className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-0.5">Комментарий</p>
                                                <p className="text-sm text-card-foreground">{selectedSchedule.comment}</p>
                                            </div>
                                        </div>
                                    )}

                                    {selectedSchedule.registrations.length > 0 && (
                                        <div>
                                            <p className="text-sm font-medium text-card-foreground mb-2">
                                                Записавшиеся студенты:
                                            </p>
                                            <div className="space-y-2">
                                                {selectedSchedule.registrations.map((reg) => (
                                                    <div
                                                        key={reg.id}
                                                        className="flex items-center gap-2.5 p-2.5 bg-muted/50 rounded-lg border border-border"
                                                    >
                                                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                            <span className="text-xs font-semibold text-primary">
                                                                {reg.studentName[0]}
                                                            </span>
                                                        </div>
                                                        <span className="text-sm text-card-foreground">{reg.studentName}</span>
                                                        {reg.orderNumber && (
                                                            <span className="ml-auto text-xs text-muted-foreground">
                                                                #{reg.orderNumber}
                                                            </span>
                                                        )}
                                                        <span className="text-xs text-muted-foreground">
                                                            {new Date(reg.registeredAt).toLocaleDateString('ru-RU')}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedSchedule.registrations.length === 0 && (
                                        <div className="text-center py-4 text-muted-foreground text-sm">
                                            Никто ещё не записался
                                        </div>
                                    )}

                                    <button
                                        onClick={() => handleDelete(selectedSchedule.id)}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-destructive/30 text-destructive rounded-xl hover:bg-destructive/5 transition-colors text-sm font-medium mt-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Удалить слот
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {formError && (
                                        <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-xl text-sm text-destructive">
                                            {formError}
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-card-foreground mb-1.5">
                                            Время начала <span className="text-destructive">*</span>
                                        </label>
                                        <input
                                            type="time"
                                            value={form.startTime}
                                            onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
                                            className="w-full px-3 py-2.5 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-card-foreground"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-card-foreground mb-1.5">
                                            Время окончания
                                            <span className="text-muted-foreground font-normal ml-1.5 text-xs">(необязательно)</span>
                                        </label>
                                        <input
                                            type="time"
                                            value={form.endTime}
                                            onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
                                            className="w-full px-3 py-2.5 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-card-foreground"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-card-foreground mb-1.5">
                                            Максимум студентов
                                            <span className="text-muted-foreground font-normal ml-1.5 text-xs">(необязательно)</span>
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="100"
                                            placeholder="Без ограничений"
                                            value={form.maxStudents}
                                            onChange={(e) => setForm((f) => ({ ...f, maxStudents: e.target.value }))}
                                            className="w-full px-3 py-2.5 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-card-foreground"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-card-foreground mb-1.5">
                                            Комментарий
                                            <span className="text-muted-foreground font-normal ml-1.5 text-xs">(необязательно)</span>
                                        </label>
                                        <textarea
                                            value={form.comment}
                                            onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
                                            placeholder="Например: аудитория 305, 3 этаж"
                                            rows={3}
                                            maxLength={300}
                                            className="w-full px-3 py-2.5 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-card-foreground resize-none text-sm"
                                        />
                                        <div className="text-right text-xs text-muted-foreground mt-1">
                                            {form.comment.length}/300
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-1">
                                        <button
                                            onClick={closeModal}
                                            className="flex-1 px-4 py-2.5 border border-border text-card-foreground rounded-xl hover:bg-accent transition-colors text-sm font-medium"
                                        >
                                            Отмена
                                        </button>
                                        <button
                                            onClick={handleCreate}
                                            disabled={!form.startTime || isSubmitting}
                                            className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary-hover transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <Check className="w-4 h-4" />
                                                    Создать
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
