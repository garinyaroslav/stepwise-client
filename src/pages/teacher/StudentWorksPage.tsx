import { useState, useEffect } from 'react';
import { Users, FileText, CheckCircle, Search, ChevronRight, GraduationCap, BookOpen, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Group } from '@/api/reqTypes';
import { AcademicWork } from '@/types/AcademicWork';
import { getGroups, getAcademicWorksByGroupId } from '@/api/endpoints';
import { useNavigate } from 'react-router';

export function StudentWorksPage() {
    const navigate = useNavigate();
    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
    const [works, setWorks] = useState<AcademicWork[]>([]);
    const [selectedWorkId, setSelectedWorkId] = useState<number | null>(null);
    const [isLoadingGroups, setIsLoadingGroups] = useState(false);
    const [isLoadingWorks, setIsLoadingWorks] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const selectedGroup = groups.find((g) => g.id === selectedGroupId);
    const selectedWork = works.find((w) => w.id === selectedWorkId);

    useEffect(() => {
        setIsLoadingGroups(true);
        getGroups()
            .then(setGroups)
            .catch(() => setError('Не удалось загрузить группы'))
            .finally(() => setIsLoadingGroups(false));
    }, []);

    useEffect(() => {
        if (!selectedGroupId) return;
        setIsLoadingWorks(true);
        setWorks([]);
        setSelectedWorkId(null);
        getAcademicWorksByGroupId(selectedGroupId)
            .then(setWorks)
            .catch(() => setError('Не удалось загрузить работы группы'))
            .finally(() => setIsLoadingWorks(false));
    }, [selectedGroupId]);

    const handleGoToTable = () => {
        if (selectedGroupId && selectedWorkId) {
            navigate(`/teacher/dashboard/works/${selectedWorkId}`);
        }
    };

    const filteredGroups = groups.filter((g) =>
        g.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-card-foreground mb-1">Работы студентов</h1>
                    <p className="text-muted-foreground text-sm">Выберите группу и академическую работу для просмотра прогресса</p>
                </div>
                {selectedGroupId && selectedWorkId && (
                    <Button onClick={handleGoToTable}>
                        Открыть таблицу <ChevronRight className="w-4 h-4" />
                    </Button>
                )}
            </div>

            {error && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            {(selectedGroupId || selectedWorkId) && (
                <div className="flex items-center gap-2 text-sm">
                    {selectedGroup && (
                        <>
                            <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/20 rounded-full hover:bg-primary/10">
                                {selectedGroup.name}
                            </Badge>
                            {selectedWork && (
                                <>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                    <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/20 rounded-full hover:bg-primary/10">
                                        {selectedWork.title}
                                    </Badge>
                                </>
                            )}
                        </>
                    )}
                </div>
            )}

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
                    <Input
                        placeholder="Поиск группы..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                {isLoadingGroups ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {filteredGroups.map((group) => (
                            <button
                                key={group.id}
                                onClick={() => setSelectedGroupId(group.id)}
                                className={`p-4 border-2 rounded-xl transition-all text-left relative overflow-hidden ${selectedGroupId === group.id
                                    ? 'border-primary bg-primary/5 shadow-sm'
                                    : 'border-border hover:border-primary/50 hover:bg-accent'
                                    }`}
                            >
                                {selectedGroupId === group.id && (
                                    <div className="absolute top-2 right-2">
                                        <div className="w-2 h-2 rounded-full bg-primary" />
                                    </div>
                                )}
                                <GraduationCap className={`w-6 h-6 mb-2 ${selectedGroupId === group.id ? 'text-primary' : 'text-muted-foreground'}`} />
                                <div className="font-semibold text-card-foreground">{group.name}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">{group.studentsCount} студ.</div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

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
                    {isLoadingWorks ? (
                        <div className="space-y-3">
                            {[1, 2].map((i) => <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />)}
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
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${selectedWorkId === work.id ? 'bg-primary/10' : 'bg-muted'}`}>
                                                <FileText className={`w-4 h-4 ${selectedWorkId === work.id ? 'text-primary' : 'text-muted-foreground'}`} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-card-foreground">{work.title}</h3>
                                                <p className="text-sm text-muted-foreground mt-0.5">{work.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0 flex items-center gap-2">
                                            <Badge variant="secondary">{work.countOfChapters} разд.</Badge>
                                            {selectedWorkId === work.id && <CheckCircle className="w-5 h-5 text-primary" />}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {selectedGroupId && selectedWorkId && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <div>
                            <p className="font-medium text-card-foreground">Всё готово к просмотру</p>
                            <p className="text-sm text-muted-foreground">Откройте таблицу прогресса для группы {selectedGroup?.name}</p>
                        </div>
                    </div>
                    <Button onClick={handleGoToTable}>
                        Открыть таблицу <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            )}

            {!selectedGroupId && (
                <div className="bg-card border border-border rounded-xl p-14 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground mb-2">Выберите группу</h3>
                    <p className="text-muted-foreground text-sm max-w-sm mx-auto">Выберите группу студентов выше, чтобы продолжить</p>
                </div>
            )}
        </div>
    );
}
