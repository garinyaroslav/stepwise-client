import { useParams } from "react-router";
import { ProjectType } from "@/types/ProjectType";
import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { FileText } from "lucide-react";
import { useAcademicWorks } from "@/hooks/useAcademicProjects";

export const ProjectDetailsForm = () => {
    const { projectId } = useParams<{ projectId?: string }>();
    const parsedProjectId = projectId ? Number(projectId) : null;
    const { academicProject, academicProjectLoading, academicProjectError } = useAcademicWorks(null, parsedProjectId);

    if (academicProjectLoading) {
        return (
            <div className="flex min-h-screen">
                <div className="w-full px-16">
                    <div className="mb-8">
                        <Skeleton className="h-10 w-1/2" />
                        <Skeleton className="h-6 w-3/4 mt-2" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <Skeleton className="h-6 w-1/4" />
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-20 w-full" />
                                    <Skeleton className="h-10 w-1/3" />
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <Skeleton className="h-6 w-1/4" />
                                    <Skeleton className="h-4 w-3/4" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-12 w-full mb-2" />
                                    <Skeleton className="h-12 w-full mb-2" />
                                    <Skeleton className="h-12 w-full" />
                                </CardContent>
                            </Card>
                        </div>
                        <div className="lg:col-span-1 space-y-6">
                            <Card>
                                <CardHeader>
                                    <Skeleton className="h-6 w-1/4" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-10 w-full" />
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <Skeleton className="h-6 w-1/4" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-10 w-full" />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (academicProjectError) {
        return (
            <div className="flex min-h-screen">
                <div className="w-full px-16">
                    <div className="text-red-500">Ошибка загрузки проекта: {academicProjectError.message}</div>
                </div>
            </div>
        );
    }

    if (!academicProject && projectId) {
        return (
            <div className="flex min-h-screen">
                <div className="w-full px-16">
                    <div className="text-red-500">Проект не найден.</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            <div className="w-full px-16">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground">
                        Подробности пояснительной записки
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Просмотр деталей проекта
                    </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Подробности проекта</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-foreground">Название</label>
                                    <p className="mt-1 text-foreground text-lg font-medium">
                                        {academicProject?.title || "Не указано"}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground">Описание</label>
                                    <p className="mt-1 text-foreground whitespace-pre-wrap">
                                        {academicProject?.description || "Не указано"}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground">Тип проекта</label>
                                    <p className="mt-1 text-foreground">
                                        {academicProject?.type === ProjectType.coursework ? "Курсовая работа" : "Дипломная работа"}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Обязательные разделы</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Список разделов пояснительной записки
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {academicProject?.chapters && academicProject.chapters.length > 0 ? (
                                        academicProject.chapters
                                            .sort((a, b) => a.index - b.index)
                                            .map((chapter) => (
                                                <div
                                                    key={chapter.title}
                                                    className="p-4 bg-muted rounded-lg border"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded text-xs font-medium mt-0.5">
                                                            {chapter.index + 1}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold text-foreground">
                                                                {chapter.title || "Без названия"}
                                                            </h3>
                                                            {chapter.description && (
                                                                <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                                                                    {chapter.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                            <p>Разделы не добавлены</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Рецензент</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Преподаватель</label>
                                    <p className="text-foreground font-medium">
                                        {academicProject
                                            ? `${academicProject.teacherName || ''} ${academicProject.teacherLastName || ''} ${academicProject.teacherMiddleName || ''}`.trim()
                                            : "Не указано"}
                                    </p>
                                    {academicProject?.teacherEmail && (
                                        <p className="text-muted-foreground text-sm">
                                            {academicProject.teacherEmail}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Группа</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p className="text-foreground font-medium">
                                        {academicProject?.groupName ? academicProject.groupName : "Не указано"}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};
