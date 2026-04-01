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
import { Button } from '@/components/ui/button';
import { ProjectStatus } from '@/types/ProjectStatus';
import { getDefenseSchedulesByWork, getMyDefenseRegistration, registerForDefense } from '@/api/endpoints';
import { toast } from 'sonner';
import { DefenseSchedule, MyDefenseRegistration } from '@/types/Defence';

type Props = {
    projectStatus: ProjectStatus;
    academicWorkId: number;
};

function formatTime(isoStr: string) {
    return new Date(isoStr).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function formatFullDate(isoStr: string) {
    return new Date(isoStr).toLocaleDateString('ru-RU', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
}

const MONTH_SHORT_RU: Record<number, string> = {
    0: 'янв', 1: 'фев', 2: 'мар', 3: 'апр', 4: 'май', 5: 'июн',
    6: 'июл', 7: 'авг', 8: 'сен', 9: 'окт', 10: 'ноя', 11: 'дек',
};
const WEEK_SHORT_RU: Record<number, string> = {
    0: 'вс', 1: 'пн', 2: 'вт', 3: 'ср', 4: 'чт', 5: 'пт', 6: 'сб',
};

export function StudentDefenseRegistration({ projectStatus, academicWorkId }: Props) {
    const [schedules, setSchedules] = useState<DefenseSchedule[]>([]);
    const [myRegistration, setMyRegistration] = useState<MyDefenseRegistration | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [registeringId, setRegisteringId] = useState<number | null>(null);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const now = new Date();

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            try {
                const [schedulesData, registrationData] = await Promise.all([
                    getDefenseSchedulesByWork(academicWorkId),
                    projectStatus === ProjectStatus.APPROVED_FOR_DEFENSE || projectStatus === ProjectStatus.DEFENDED
                        ? getMyDefenseRegistration(academicWorkId)
                        : Promise.resolve(null),
                ]);
                setSchedules(schedulesData);
                setMyRegistration(registrationData);
            } catch {
                toast.error('Не удалось загрузить расписание защит');
            } finally {
                setIsLoading(false);
            }
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

    const canRegister = (schedule: DefenseSchedule): { can: boolean; reason: string } => {
        if (projectStatus === ProjectStatus.DEFENDED)
            return { can: false, reason: 'Проект уже защищён' };
        if (projectStatus !== ProjectStatus.APPROVED_FOR_DEFENSE)
            return { can: false, reason: 'Требуется допуск к защите' };
        if (now > new Date(schedule.startTime))
            return { can: false, reason: 'Дата уже прошла' };
        if (schedule.full)
            return { can: false, reason: 'Нет свободных мест' };
        if (myRegistration) {
            if (myRegistration.scheduleId === schedule.id)
                return { can: false, reason: 'Вы уже записаны' };
            if (isMyCurrentRegistrationActive())
                return { can: false, reason: 'Дождитесь окончания текущей защиты' };
        }
        return { can: true, reason: '' };
    };

    const handleRegister = async (scheduleId: number) => {
        setRegisteringId(scheduleId);
        try {
            const registration = await registerForDefense(scheduleId);
            setMyRegistration(registration);
            setSchedules((prev) =>
                prev.map((s) =>
                    s.id === scheduleId
                        ? { ...s, registeredCount: s.registeredCount + 1, full: s.maxStudents != null && s.registeredCount + 1 >= s.maxStudents }
                        : s
                )
            );
            toast.success('Вы записаны на защиту');
        } catch (e) {
            toast.error(e instanceof Error ? e.message : 'Не удалось записаться на защиту');
        } finally {
            setRegisteringId(null);
        }
    };

    const myCurrentSchedule = myRegistration
        ? schedules.find((s) => s.id === myRegistration.scheduleId)
        : null;

    const isLocked = projectStatus === ProjectStatus.IN_PROGRESS;
    const isDefended = projectStatus === ProjectStatus.DEFENDED;

    return (
        <section className="mt-8">
            <div className="flex items-center gap-3 mb-4">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0
                    ${isLocked ? 'bg-muted' : isDefended ? 'bg-success/10' : 'bg-primary/10'}`}>
                    {isLocked
                        ? <Lock className="w-5 h-5 text-muted-foreground" />
                        : isDefended
                            ? <Trophy className="w-5 h-5 text-success" />
                            : <Calendar className="w-5 h-5 text-primary" />}
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
                            const isPast = now > new Date(schedule.startTime);
                            const isMySlot = myRegistration?.scheduleId === schedule.id;
                            const { can, reason } = canRegister(schedule);
                            const isExpanded = expandedId === schedule.id;
                            const spotsLeft = schedule.maxStudents != null
                                ? schedule.maxStudents - schedule.registeredCount
                                : null;

                            return (
                                <div
                                    key={schedule.id}
                                    className={`bg-card border rounded-xl overflow-hidden transition-all
                                        ${isMySlot ? 'border-primary/40 shadow-sm'
                                            : isPast ? 'border-border opacity-60'
                                                : schedule.full && !isMySlot ? 'border-border opacity-80'
                                                    : 'border-border'}`}
                                >
                                    <div className="p-4">
                                        <div className="flex items-start gap-4">
                                            <div className={`rounded-xl p-3 text-center min-w-[68px] flex-shrink-0 border
                                                ${isMySlot ? 'bg-primary/10 border-primary/20' : 'bg-muted border-border'}`}>
                                                <div className="text-[11px] text-muted-foreground uppercase tracking-wide">
                                                    {MONTH_SHORT_RU[d.getMonth()]}
                                                </div>
                                                <div className={`text-2xl font-bold leading-none my-1 ${isMySlot ? 'text-primary' : 'text-card-foreground'}`}>
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
                                                    {schedule.full && !isMySlot && (
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

                                                {schedule.maxStudents !== undefined && (
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full transition-all ${schedule.full ? 'bg-destructive' : 'bg-success'}`}
                                                                style={{ width: `${Math.min((schedule.registeredCount / schedule.maxStudents) * 100, 100)}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs text-muted-foreground flex-shrink-0 flex items-center gap-1">
                                                            <Users className="w-3 h-3" />
                                                            {schedule.registeredCount}/{schedule.maxStudents}
                                                            {spotsLeft !== null && spotsLeft > 0 && (
                                                                <span className="text-success">({spotsLeft} своб.)</span>
                                                            )}
                                                        </span>
                                                    </div>
                                                )}

                                                {schedule.comment && (
                                                    <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                                                        <MessageSquare className="w-3 h-3 flex-shrink-0 mt-0.5" />
                                                        {schedule.comment}
                                                    </div>
                                                )}
                                            </div>

                                            {!isPast && (
                                                <div className="flex-shrink-0">
                                                    <Button
                                                        size="sm"
                                                        variant={isMySlot ? 'outline' : can && !isLocked ? 'default' : 'outline'}
                                                        onClick={() => can && !isLocked && handleRegister(schedule.id)}
                                                        disabled={!can || isLocked || registeringId === schedule.id}
                                                        title={!can ? reason : isLocked ? 'Требуется допуск к защите' : 'Записаться'}
                                                        className={isMySlot
                                                            ? 'border-primary/20 text-primary bg-primary/10 hover:bg-primary/10 cursor-default'
                                                            : ''}
                                                    >
                                                        {registeringId === schedule.id ? (
                                                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                        ) : isMySlot ? (
                                                            <><CheckCircle className="w-4 h-4 mr-1.5" />Записан</>
                                                        ) : (
                                                            'Записаться'
                                                        )}
                                                    </Button>
                                                    {!can && !isMySlot && reason && (
                                                        <p className="text-[11px] text-muted-foreground mt-1 text-center max-w-[120px]">
                                                            {reason}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {schedule.registeredCount > 0 && (
                                            <button
                                                onClick={() => setExpandedId(isExpanded ? null : schedule.id)}
                                                className="mt-3 text-xs text-muted-foreground hover:text-card-foreground transition-colors flex items-center gap-1.5"
                                            >
                                                <Users className="w-3.5 h-3.5" />
                                                {isExpanded ? 'Скрыть список' : `Кто записан (${schedule.registeredCount})`}
                                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                            </button>
                                        )}
                                    </div>

                                    {isExpanded && (
                                        <div className="border-t border-border bg-muted/20 px-4 py-3">
                                            <p className="text-xs text-muted-foreground">
                                                Записано студентов: {schedule.registeredCount}
                                                {isMySlot && myRegistration?.orderNumber && (
                                                    <span className="ml-2 text-primary font-medium">
                                                        (ваш номер: #{myRegistration.orderNumber})
                                                    </span>
                                                )}
                                            </p>
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
