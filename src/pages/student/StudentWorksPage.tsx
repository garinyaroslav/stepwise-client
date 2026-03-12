import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import {
    FileText,
    Calendar,
    User,
    Clock,
    ChevronRight,
    BookOpen,
    GraduationCap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

import { getWorkTypeNameByType } from '@/utils/getWorkTypeNameByType'
import { ProjectType } from '@/types/ProjectType'
import { AcademicWork } from '@/types/AcademicWork'
import { getStudentAcademicWorks } from '@/api/endpoints'

const workTypeColors: Record<ProjectType, string> = {
    COURSEWORK: 'bg-chart-1/10 text-chart-1 border-chart-1/20',
    THESIS: 'bg-chart-2/10 text-chart-2 border-chart-2/20',
}

const workTypeIcons: Record<
    ProjectType,
    React.ComponentType<{ className?: string }>
> = {
    COURSEWORK: BookOpen,
    THESIS: GraduationCap,
}

export function StudentWorksPage() {
    const navigate = useNavigate()
    const [works, setWorks] = useState<AcademicWork[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        getStudentAcademicWorks()
            .then(setWorks)
            .catch(console.error)
            .finally(() => setIsLoading(false))
    }, [])

    if (isLoading) {
        return (
            <div className="bg-background">
                <div className="mb-8">
                    <div className="h-8 bg-muted rounded w-40 mb-2 animate-pulse" />
                    <div className="h-4 bg-muted rounded w-64 animate-pulse" />
                </div>

                <StatsBarSkeleton />

                <div className="grid grid-cols-1 gap-4">
                    {[1, 2, 3].map((i) => (
                        <WorkCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        )
    }

    if (works.length === 0) {
        return (
            <div className="bg-background">
                <h1 className="text-2xl font-semibold mb-6 text-card-foreground">
                    Мои работы
                </h1>

                <div className="bg-card border border-border rounded-lg p-12 text-center">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />

                    <h3 className="text-lg font-semibold mb-2 text-card-foreground">
                        Нет доступных работ
                    </h3>

                    <p className="text-muted-foreground">
                        У вас пока нет назначенных академических работ
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-semibold mb-1 text-card-foreground">
                    Мои работы
                </h1>

                <p className="text-sm text-muted-foreground">
                    Здесь отображаются все ваши проекты и их текущий статус
                </p>
            </div>

            <StatsBar works={works} />

            <div className="grid grid-cols-1 gap-4">
                {works.map((work) => {
                    const WorkIcon = workTypeIcons[work.type] ?? FileText

                    return (
                        <Button
                            key={work.id}
                            variant="ghost"
                            onClick={() => navigate(`${work.id}`)}
                            className="bg-card border border-border rounded-lg p-6 hover:border-primary hover:shadow-md transition-all text-left group h-auto justify-start"
                        >
                            <div className="flex items-start justify-between gap-4 w-full">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <WorkIcon className="w-5 h-5 text-primary" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h2 className="font-semibold text-lg mb-1 text-card-foreground group-hover:text-primary transition-colors">
                                                {work.title}
                                            </h2>

                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {work.description || 'Описание не предоставлено'}
                                            </p>
                                        </div>

                                        <span
                                            className={`px-3 py-1 text-xs font-medium rounded-full border flex-shrink-0 ${workTypeColors[work.type]}`}
                                        >
                                            {getWorkTypeNameByType(work.type)}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
                                        <div className="flex items-center gap-1.5 bg-muted rounded-full px-3 py-1.5">
                                            <User className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />

                                            <span className="text-sm text-muted-foreground">
                                                {work.teacherLastName} {work.teacherName?.[0]}.
                                                {work.teacherMiddleName?.[0]}.
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1.5 bg-muted rounded-full px-3 py-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />

                                            <span className="text-sm text-muted-foreground">
                                                {work.groupName}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1.5 bg-primary/10 rounded-full px-3 py-1.5">
                                            <Clock className="w-3.5 h-3.5 text-primary flex-shrink-0" />

                                            <span className="text-sm text-primary font-medium">
                                                {work.countOfChapters}{' '}
                                                {work.countOfChapters === 1
                                                    ? 'раздел'
                                                    : work.countOfChapters < 5
                                                        ? 'раздела'
                                                        : 'разделов'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-2" />
                            </div>
                        </Button>
                    )
                })}
            </div>
        </div>
    )
}

function WorkCardSkeleton() {
    return (
        <div className="bg-card border border-border rounded-lg p-6 animate-pulse">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 bg-muted rounded-lg flex-shrink-0" />
                        <div className="flex-1 min-w-0 pt-1">
                            <div className="h-5 bg-muted rounded w-3/5 mb-2" />
                            <div className="h-3.5 bg-muted rounded w-full mb-1.5" />
                            <div className="h-3.5 bg-muted rounded w-4/5" />
                        </div>
                        <div className="h-6 bg-muted rounded-full w-24 flex-shrink-0" />
                    </div>
                    <div className="mt-4 pt-4 border-t border-border">
                        <div className="grid grid-cols-3 gap-4">
                            {[1, 2, 3].map((j) => (
                                <div key={j} className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-muted rounded flex-shrink-0" />
                                    <div className="flex-1">
                                        <div className="h-2.5 bg-muted rounded w-2/3 mb-1.5" />
                                        <div className="h-3.5 bg-muted rounded w-4/5" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="w-5 h-5 bg-muted rounded mt-2 flex-shrink-0" />
            </div>
        </div>
    );
}

function StatsBar({ works }: { works: AcademicWork[] }) {
    const courseworks = works.filter((w) => w.type === 'COURSEWORK').length;
    const theses = works.filter((w) => w.type === 'THESIS').length;

    return (
        <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-card border border-border rounded-lg px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-card-foreground leading-none mb-1">
                            {works.length}
                        </div>
                        <div className="text-xs text-muted-foreground">Всего работ</div>
                    </div>
                </div>
            </div>

            <div className="bg-card border border-border rounded-lg px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-chart-1/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-4 h-4 text-chart-1" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-card-foreground leading-none mb-1">
                            {courseworks}
                        </div>
                        <div className="text-xs text-muted-foreground">Курсовых</div>
                    </div>
                </div>
            </div>

            <div className="bg-card border border-border rounded-lg px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-chart-2/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-4 h-4 text-chart-2" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-card-foreground leading-none mb-1">
                            {theses}
                        </div>
                        <div className="text-xs text-muted-foreground">Дипломных</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatsBarSkeleton() {
    return (
        <div className="grid grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card border border-border rounded-lg px-5 py-4 animate-pulse">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-muted rounded-lg flex-shrink-0" />
                        <div>
                            <div className="h-7 bg-muted rounded w-8 mb-1.5" />
                            <div className="h-3 bg-muted rounded w-16" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
