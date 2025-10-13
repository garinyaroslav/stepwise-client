import { useParams, useSearchParams } from "react-router";
import { ProjectType } from "@/types/ProjectType";
import { Skeleton } from "../ui/skeleton";
import { useAcademicProjects } from "@/hooks/useAcademicProjects";
import { ProjectSectionsList } from "./ProjectSectionList";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const ProjectDetailsForm = () => {
    const { projectId } = useParams<{ projectId?: string }>();
    const parsedProjectId = projectId ? Number(projectId) : null;
    const { academicProject, academicProjectLoading, academicProjectError } = useAcademicProjects(null, parsedProjectId);

    console.log(projectId, academicProject);

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
                                    <p className="mt-1 text-foreground">{academicProject?.title || "Не указано"}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground">Описание</label>
                                    <p className="mt-1 text-foreground">{academicProject?.description || "Не указано"}</p>
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
                                {/* <ProjectSectionsList */}
                                {/*     fields={academicProject?.academicProjectChapters.map((chapter, index) => ({ */}
                                {/*         id: String(chapter.index), */}
                                {/*         ...chapter, */}
                                {/*     })) || []} */}
                                {/* /> */}
                            </CardContent>
                        </Card>
                    </div>
                    <div className="lg:col-span-1 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Рецензент</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div>
                                    <label className="text-sm font-medium text-foreground">Преподаватель</label>
                                    <p className="mt-1 text-foreground">
                                        {academicProject
                                            ? `${academicProject.teacherName} ${academicProject.teacherLastName} ${academicProject.teacherMiddleName || ""}`.trim()
                                            : "Не указано"}
                                    </p>
                                    <p className="mt-1 text-muted-foreground">{academicProject?.teacherEmail || "Не указано"}</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Группа</CardTitle>
                            </CardHeader>
                            {/* <CardContent> */}
                            {/*     <div> */}
                            {/*         <label className="text-sm font-medium text-foreground">Группа</label> */}
                            {/*         <p className="mt-1 text-foreground"> */}
                            {/*             {academicProject?.groupId ? `Группа ${academicProject.groupId}` : "Не указано"} */}
                            {/*         </p> */}
                            {/*     </div> */}
                            {/* </CardContent> */}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};
