import { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    Users,
    Lock,
    CheckCircle,
    Award,
    MessageSquare,
    ChevronDown,
    ChevronUp,
    AlertTriangle,
    Trophy,
} from 'lucide-react';

type ProjectStatus = 'IN_PROGRESS' | 'APPROVED_FOR_DEFENSE' | 'DEFENDED';

type Registration = {
    id: number;
    studentName: string;
    registeredAt: string;
    orderNumber?: number;
};

type DefenseSchedule = {
    id: number;
    startTime: string;
    endTime?: string;
    maxStudents?: number;
    comment?: string;
    registrations: Registration[];
};

type MyRegistration = {
    id: number;
    scheduleId: number;
    registeredAt: string;
    orderNumber?: number;
};

type Props = {
    projectId: number;
    projectStatus: ProjectStatus;
    academicWorkId: number;
};

const mockSchedules: DefenseSchedule[] = [
    {
        id: 1,
        startTime: '2026-04-10T09:00:00',
        endTime: '2026-04-10T13:00:00',
        maxStudents: 3,
        comment: 'Кабинет 305, 3 этаж',
        registrations: [
            { id: 1, studentName: 'Козлов Алексей', registeredAt: '2026-03-25T10:00:00', orderNumber: 1 },
            { id: 2, studentName: 'Сидоров Сергей', registeredAt: '2026-03-25T11:00:00', orderNumber: 2 },
            { id: 3, studentName: 'Новикова Мария', registeredAt: '2026-03-26T09:00:00', orderNumber: 3 },
        ],
    },
    {
        id: 2,
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
        startTime: '2026-04-22T10:00:00',
        maxStudents: 5,
        registrations: [],
    },
];

// Current student is registered for schedule 2 as order #2
const mockMyRegistration: MyRegistration = {
    id: 10,
    scheduleId: 2,
    registeredAt: '2026-03-27T09:00:00',
    orderNumber: 2,
};

function formatTime(isoStr: string) {
    return new Date(isoStr).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function formatFullDate(isoStr: string) {
    return new Date(isoStr).toLocaleDateString('ru-RU', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

const MONTH_SHORT_RU: Record<number, string> = {
    0: 'янв', 1: 'фев', 2: 'мар', 3: 'апр', 4: 'май', 5: 'июн',
    6: 'июл', 7: 'авг', 8: 'сен', 9: 'окт', 10: 'ноя', 11: 'дек',
};

const WEEK_SHORT_RU: Record<number, string> = {
    0: 'вс', 1: 'пн', 2: 'вт', 3: 'ср', 4: 'чт', 5: 'пт', 6: 'сб',
};

export function StudentDefenseRegistration({ projectId, projectStatus, academicWorkId }: Props) {
    const [schedules, setSchedules] = useState<DefenseSchedule[]>([]);
    const [myRegistration, setMyRegistration] = useState<MyRegistration | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [registeringId, setRegisteringId] = useState<number | null>(null);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const now = new Date();

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            // GET /api/defense/schedule/work/{academicWorkId}
            // GET /api/defense/registration/work/{academicWorkId}
            await new Promise((r) => setTimeout(r, 400));
            setSchedules(mockSchedules);
            if (projectStatus === 'APPROVED_FOR_DEFENSE') {
                setMyRegistration(mockMyRegistration);
            }
            setIsLoading(false);
        };
        load();
    }, [academicWorkId, projectStatus]);

    const isMyCurrentRegistrationActive = (): boolean => {
        if (!myRegistration) return false;
        const schedule = schedules.find((s) => s.id === myRegistration.scheduleId);
        if (!schedule) return false;
        const cutoff = schedule.endTime ? new Date(schedule.endTime) : new Date(schedule.startTime);
        return now <= cutoff;
    };

    const canRegister = (
        schedule: DefenseSchedule
    ): { can: boolean; reason: string } => {
        if (projectStatus === 'DEFENDED') return { can: false, reason: 'Проект уже защищён' };
        if (projectStatus !== 'APPROVED_FOR_DEFENSE') return { can: false, reason: 'Требуется допуск к защите' };

        const scheduleStart = new Date(schedule.startTime);
        if (now > scheduleStart) return { can: false, reason: 'Дата уже прошла' };

        if (
            schedule.maxStudents !== undefined &&
            schedule.registrations.length >= schedule.maxStudents
        )
            return { can: false, reason: 'Нет свободных мест' };

        if (myRegistration) {
            if (myRegistration.scheduleId === schedule.id) return { can: false, reason: 'Вы уже записаны' };
            if (isMyCurrentRegistrationActive()) {
                return { can: false, reason: 'Дождитесь окончания текущей защиты' };
            }
        }

        return { can: true, reason: '' };
    };

    const handleRegister = async (scheduleId: number) => {
        setRegisteringId(scheduleId);
        // POST /api/defense/register/{scheduleId}
        await new Promise((r) => setTimeout(r, 700));

        const schedule = schedules.find((s) => s.id === scheduleId);
        if (!schedule) { setRegisteringId(null); return; }

        const newReg: Registration = {
            id: Date.now(),
            studentName: 'Петров Иван',
            registeredAt: new Date().toISOString(),
            orderNumber: schedule.registrations.length + 1,
        };

        setSchedules((prev) =>
            prev.map((s) =>
                s.id === scheduleId ? { ...s, registrations: [...s.registrations, newReg] } : s
            )
        );
        setMyRegistration({ id: Date.now(), scheduleId, registeredAt: new Date().toISOString(), orderNumber: newReg.orderNumber });
        setRegisteringId(null);
    };

    const myCurrentSchedule = myRegistration
        ? schedules.find((s) => s.id === myRegistration.scheduleId)
        : null;

    const isLocked = projectStatus === 'IN_PROGRESS';
    const isDefended = projectStatus === 'DEFENDED';

    return (
        <section className="mt-8">
            <div className="flex items-center gap-3 mb-4">
                <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isLocked ? 'bg-muted' : isDefended ? 'bg-success/10' : 'bg-primary/10'
                        }`}
                >
                    {isLocked ? (
                        <Lock className="w-5 h-5 text-muted-foreground" />
                    ) : isDefended ? (
                        <Trophy className="w-5 h-5 text-success" />
                    ) : (
                        <Calendar className="w-5 h-5 text-primary" />
                    )}
                </div>
                <div>
                    <h2 className="font-semibold text-card-foreground">Расписание защит</h2>
                    <p className="text-xs text-muted-foreground">
                        {isLocked
                            ? 'Доступно после получения допуска к защите'
                            : isDefended
                                ? 'Защита успешно завершена'
                                : 'Запись на защиту курсовой работы'}
                    </p>
                </div>
            </div>

            {isLocked && (
                <div className="mb-4 p-4 bg-muted border border-border rounded-xl flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-medium text-card-foreground mb-0.5">Раздел недоступен</p>
                        <p className="text-sm text-muted-foreground">
                            Для записи на защиту необходимо завершить все разделы работы и получить
                            допуск от преподавателя. Ниже показаны доступные даты защиты.
                        </p>
                    </div>
                </div>
            )}

            {isDefended && (
                <div className="bg-card border border-border rounded-xl p-8 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center mx-auto mb-4">
                        <Award className="w-8 h-8 text-success" />
                    </div>
                    <h3 className="font-semibold text-card-foreground mb-2">Работа успешно защищена!</h3>
                    <p className="text-muted-foreground text-sm">Поздравляем с успешной защитой курсовой работы</p>
                </div>
            )}

            {!isDefended && myCurrentSchedule && isMyCurrentRegistrationActive() && (
                <div className="mb-4 p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-card-foreground">Вы записаны на защиту</p>
                        <p className="text-sm text-muted-foreground mt-0.5 capitalize">
                            {formatFullDate(myCurrentSchedule.startTime)},{' '}
                            {formatTime(myCurrentSchedule.startTime)}
                            {myCurrentSchedule.endTime && ` — ${formatTime(myCurrentSchedule.endTime)}`}
                        </p>
                        {myCurrentSchedule.comment && (
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" />
                                {myCurrentSchedule.comment}
                            </p>
                        )}
                        {myRegistration?.orderNumber && (
                            <p className="text-xs text-primary mt-1.5 font-medium">
                                Ваш порядковый номер: #{myRegistration.orderNumber}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {!isDefended && (
                <div className="space-y-3">
                    {isLoading ? (
                        [1, 2, 3].map((i) => (
                            <div key={i} className="h-28 bg-card border border-border rounded-xl animate-pulse" />
                        ))
                    ) : schedules.length === 0 ? (
                        <div className="bg-card border border-border rounded-xl p-10 text-center">
                            <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
                            <p className="text-muted-foreground text-sm">
                                Преподаватель пока не добавил даты защиты
                            </p>
                        </div>
                    ) : (
                        schedules.map((schedule) => {
                            const d = new Date(schedule.startTime);
                            const isFull =
                                schedule.maxStudents !== undefined &&
                                schedule.registrations.length >= schedule.maxStudents;
                            const isPast = now > new Date(schedule.startTime);
                            const isMySlot = myRegistration?.scheduleId === schedule.id;
                            const { can, reason } = canRegister(schedule);
                            const isExpanded = expandedId === schedule.id;
                            const spotsLeft =
                                schedule.maxStudents !== undefined
                                    ? schedule.maxStudents - schedule.registrations.length
                                    : null;

                            return (
                                <div
                                    key={schedule.id}
                                    className={`bg-card border rounded-xl overflow-hidden transition-all ${isMySlot
                                        ? 'border-primary/40 shadow-sm'
                                        : isPast
                                            ? 'border-border opacity-60'
                                            : isFull && !isMySlot
                                                ? 'border-border opacity-80'
                                                : 'border-border'
                                        }`}
                                >
                                    <div className="p-4">
                                        <div className="flex items-start gap-4">
                                            <div
                                                className={`rounded-xl p-3 text-center min-w-[68px] flex-shrink-0 border ${isMySlot
                                                    ? 'bg-primary/10 border-primary/20'
                                                    : 'bg-muted border-border'
                                                    }`}
                                            >
                                                <div className="text-[11px] text-muted-foreground uppercase tracking-wide">
                                                    {MONTH_SHORT_RU[d.getMonth()]}
                                                </div>
                                                <div
                                                    className={`text-2xl font-bold leading-none my-1 ${isMySlot ? 'text-primary' : 'text-card-foreground'
                                                        }`}
                                                >
                                                    {d.getDate()}
                                                </div>
                                                <div className="text-[11px] text-muted-foreground">
                                                    {WEEK_SHORT_RU[d.getDay()]}
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap mb-2">
                                                    <div className="flex items-center gap-1.5 text-sm font-medium text-card-foreground">
                                                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                                        {formatTime(schedule.startTime)}
                                                        {schedule.endTime && (
                                                            <span className="text-muted-foreground">
                                                                {' '}— {formatTime(schedule.endTime)}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {isMySlot && (
                                                        <span className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-medium">
                                                            Вы записаны
                                                        </span>
                                                    )}
                                                    {isFull && !isMySlot && (
                                                        <span className="px-2 py-0.5 bg-destructive/10 text-destructive border border-destructive/20 rounded-full text-xs font-medium">
                                                            Заполнено
                                                        </span>
                                                    )}
                                                    {isPast && (
                                                        <span className="px-2 py-0.5 bg-muted text-muted-foreground border border-border rounded-full text-xs">
                                                            Прошло
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Spots progress bar */}
                                                {schedule.maxStudents !== undefined && (
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full transition-all ${isFull ? 'bg-destructive' : 'bg-success'
                                                                    }`}
                                                                style={{
                                                                    width: `${Math.min(
                                                                        (schedule.registrations.length / schedule.maxStudents) * 100,
                                                                        100
                                                                    )}%`,
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="text-xs text-muted-foreground flex-shrink-0 flex items-center gap-1">
                                                            <Users className="w-3 h-3" />
                                                            {schedule.registrations.length}/{schedule.maxStudents}
                                                            {spotsLeft !== null && spotsLeft > 0 && (
                                                                <span className="text-success">
                                                                    ({spotsLeft} своб.)
                                                                </span>
                                                            )}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Comment */}
                                                {schedule.comment && (
                                                    <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                                                        <MessageSquare className="w-3 h-3 flex-shrink-0 mt-0.5" />
                                                        {schedule.comment}
                                                    </div>
                                                )}
                                            </div>

                                            {!isPast && (
                                                <div className="flex-shrink-0">
                                                    <button
                                                        onClick={() => can && !isLocked && handleRegister(schedule.id)}
                                                        disabled={!can || isLocked || registeringId === schedule.id}
                                                        title={!can ? reason : isLocked ? 'Требуется допуск к защите' : 'Записаться'}
                                                        className={`
                              px-4 py-2 rounded-xl text-sm font-medium transition-all
                              flex items-center gap-2
                              ${isMySlot
                                                                ? 'bg-primary/10 text-primary border border-primary/20 cursor-default'
                                                                : can && !isLocked
                                                                    ? 'bg-primary text-primary-foreground hover:bg-primary-hover active:scale-95'
                                                                    : 'bg-muted text-muted-foreground border border-border cursor-not-allowed opacity-60'
                                                            }
                            `}
                                                    >
                                                        {registeringId === schedule.id ? (
                                                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                        ) : isMySlot ? (
                                                            <>
                                                                <CheckCircle className="w-4 h-4" />
                                                                Записан
                                                            </>
                                                        ) : (
                                                            'Записаться'
                                                        )}
                                                    </button>
                                                    {!can && !isMySlot && reason && (
                                                        <p className="text-[11px] text-muted-foreground mt-1 text-center max-w-[120px]">
                                                            {reason}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {schedule.registrations.length > 0 && (
                                            <button
                                                onClick={() => setExpandedId(isExpanded ? null : schedule.id)}
                                                className="mt-3 text-xs text-muted-foreground hover:text-card-foreground transition-colors flex items-center gap-1.5"
                                            >
                                                <Users className="w-3.5 h-3.5" />
                                                {isExpanded ? 'Скрыть список' : `Кто записан (${schedule.registrations.length})`}
                                                {isExpanded ? (
                                                    <ChevronUp className="w-3.5 h-3.5" />
                                                ) : (
                                                    <ChevronDown className="w-3.5 h-3.5" />
                                                )}
                                            </button>
                                        )}
                                    </div>

                                    {isExpanded && schedule.registrations.length > 0 && (
                                        <div className="border-t border-border bg-muted/20 px-4 py-3">
                                            <p className="text-xs text-muted-foreground mb-2 font-medium">
                                                Записавшиеся студенты:
                                            </p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {schedule.registrations.map((reg) => {
                                                    const isMe = isMySlot && reg.orderNumber === myRegistration?.orderNumber;
                                                    return (
                                                        <div
                                                            key={reg.id}
                                                            className={`flex items-center gap-2 p-2 rounded-lg ${isMe ? 'bg-primary/10 border border-primary/20' : 'bg-card border border-border'
                                                                }`}
                                                        >
                                                            <div
                                                                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${isMe ? 'bg-primary' : 'bg-primary/10'
                                                                    }`}
                                                            >
                                                                <span
                                                                    className={`text-xs font-semibold ${isMe ? 'text-primary-foreground' : 'text-primary'
                                                                        }`}
                                                                >
                                                                    {reg.studentName[0]}
                                                                </span>
                                                            </div>
                                                            <span className="text-sm text-card-foreground flex-1 truncate">
                                                                {reg.studentName}
                                                                {isMe && (
                                                                    <span className="text-primary text-xs ml-1">(вы)</span>
                                                                )}
                                                            </span>
                                                            {reg.orderNumber && (
                                                                <span className="text-xs text-muted-foreground flex-shrink-0">
                                                                    #{reg.orderNumber}
                                                                </span>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </section>
    );
}
