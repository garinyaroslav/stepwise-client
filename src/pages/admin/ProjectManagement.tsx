import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useDebounce } from "@/hooks/useDebounce";
import { useGroups } from "@/hooks/useGroups";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronsUpDownIcon, ListFilter } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Empty,
    EmptyHeader,
    EmptyTitle,
    EmptyDescription,
} from "@/components/ui/empty";
import { useAcademicProjects } from "@/hooks/useAcademicProjects";
import { ProjectType } from "@/types/ProjectType";
import { useNavigate, useSearchParams } from "react-router";

export const ProjectManagement = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const { groups, isGroupsLoading, groupsError } = useGroups(debouncedSearch);

    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(
        searchParams.get("groupId")
    );

    const { academicProjects, academicProjectsLoading, academicProjectsError } =
        useAcademicProjects(selectedGroupId ? Number(selectedGroupId) : null, null);

    useEffect(() => {
        if (selectedGroupId) {
            setSearchParams({ groupId: selectedGroupId });
        } else {
            setSearchParams({});
        }
    }, [selectedGroupId, setSearchParams]);

    const renderTableData = () => {
        if (academicProjectsError)
            return (
                <TableRow>
                    <TableCell>
                        Произошла ошибка: {academicProjectsError.message}
                    </TableCell>
                </TableRow>
            );
        if (academicProjectsLoading)
            return (
                <TableRow>
                    <TableCell>Загрузка...</TableCell>
                </TableRow>
            );

        return academicProjects.map((p) => {
            const type =
                p.type === ProjectType.thesis ? "Дипломная работа" : "Курсовая работа";

            const teacherName = !p.teacherName && !p.teacherLastName ? p.teacherEmail : `${p.teacherName ?? ""} ${p.teacherLastName ?? ""}`;

            return (
                <TableRow
                    onClick={() => navigate(`${p.id}`)}
                    key={p.id}
                    className="cursor-pointer"
                >
                    <TableCell className="font-medium">{p.title}</TableCell>
                    <TableCell>{type}</TableCell>
                    <TableCell>{teacherName}</TableCell>
                    <TableCell>{p.teacherEmail}</TableCell>
                </TableRow>
            );
        });
    };

    return (
        <>
            <SidebarTrigger />
            <main className="p-4">
                <div className="mx-auto p-10">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">
                                Проекты студентов
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Просмотр и управление заданиями для студенческих групп.
                            </p>
                        </div>
                        <Button onClick={() => navigate("add")}>+ Новый проект</Button>
                    </div>
                    <div className="bg-background p-6 rounded-xl border-2">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-foreground">
                                Все проекты по группам
                            </h2>
                            <div className="w-full max-w-xs">
                                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            role="combobox"
                                            className="w-full justify-between"
                                            disabled={isGroupsLoading}
                                        >
                                            <ListFilter />
                                            {isGroupsLoading
                                                ? "Загрузка групп..."
                                                : selectedGroupId
                                                    ? groups.find(
                                                        (group) => String(group.id) === selectedGroupId,
                                                    )?.name
                                                    : "Выберите группу..."}
                                            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-full p-0">
                                        <Command>
                                            <CommandInput
                                                value={search}
                                                onValueChange={setSearch}
                                                placeholder="Поиск группы..."
                                            />
                                            <CommandList>
                                                {groupsError && (
                                                    <CommandEmpty>
                                                        Ошибка загрузки групп: {groupsError.message}
                                                    </CommandEmpty>
                                                )}
                                                {!groupsError &&
                                                    groups.length === 0 &&
                                                    !isGroupsLoading && (
                                                        <CommandEmpty>Группы не найдены.</CommandEmpty>
                                                    )}
                                                {!groupsError &&
                                                    debouncedSearch.trim().length > 0 &&
                                                    groups.length > 0 && (
                                                        <CommandGroup>
                                                            {groups.map((group) => (
                                                                <CommandItem
                                                                    key={group.id}
                                                                    value={group.name}
                                                                    onSelect={() => {
                                                                        setSelectedGroupId(String(group.id));
                                                                        setPopoverOpen(false);
                                                                    }}
                                                                >
                                                                    <CheckIcon
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            selectedGroupId === String(group.id)
                                                                                ? "opacity-100"
                                                                                : "opacity-0",
                                                                        )}
                                                                    />
                                                                    {group.name}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    )}
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            {selectedGroupId !== null ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Название</TableHead>
                                            <TableHead>Тип</TableHead>
                                            <TableHead>Проверяющий</TableHead>
                                            <TableHead>Email проверяющего</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>{renderTableData()}</TableBody>
                                </Table>
                            ) : (
                                <Empty>
                                    <EmptyHeader>
                                        <EmptyTitle>Группа не выбрана</EmptyTitle>
                                        <EmptyDescription>
                                            Пожалуйста, выберите группу, чтобы увидеть её проекты.
                                        </EmptyDescription>
                                    </EmptyHeader>
                                </Empty>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};
