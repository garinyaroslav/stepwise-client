import z from "zod";
import { CheckIcon, ChevronsUpDownIcon, Plus, Save } from "lucide-react";
import { Button } from "../ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAcademicProject } from "@/schemes/createAcademicProject";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";
import { useGroups } from "@/hooks/useGroups";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";
import { useTeachers } from "@/hooks/useTeachers";
import { ProjectSectionsList } from "./ProjectSectionList";
import { ProjectType } from "@/types/ProjectType";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useAcademicProjects } from "@/hooks/useAcademicProjects";
import { CreateAcademicProject } from "@/api/reqTypes";

export const ProjectAddForm = () => {
    const [groupsPopoverOpen, setGroupsPopoverOpen] = useState(false);
    const [teachersPopoverOpen, setTeachersPopoverOpen] = useState(false);
    const [groupSearch, setGroupSearch] = useState("");
    const [teachersSearch, setTeachersSearch] = useState("");
    const groupDebouncedSearch = useDebounce(groupSearch, 500);
    const teacherDebouncedSearch = useDebounce(teachersSearch, 500);
    const { groups, isGroupsLoading, groupsError } =
        useGroups(groupDebouncedSearch);
    const { teachers, isTeachresLoading, teachersError } = useTeachers(
        teacherDebouncedSearch,
    );
    const { createAcademicProject: createAcademicProjectM } = useAcademicProjects(null);

    const form = useForm<z.infer<typeof createAcademicProject>>({
        resolver: zodResolver(createAcademicProject),
        defaultValues: {
            title: "",
            description: "",
            groupId: "",
            teacherId: "",
            type: ProjectType.coursework,
            chapters: [
                {
                    index: 0,
                    title: "",
                    description: "",
                    deadline: new Date(),
                },
            ],
        },
    });

    const { fields, append, remove, move } = useFieldArray({
        control: form.control,
        name: "chapters",
    });

    const addSection = () => {
        append({
            index: fields.length,
            title: "",
            description: "",
            deadline: new Date(),
        });
    };

    const removeSection = (index: number) => {
        remove(index);
    };

    const moveSection = (fromIndex: number, toIndex: number) => {
        move(fromIndex, toIndex);
    };

    const onSubmit = async (data: z.infer<typeof createAcademicProject>) => {
        try {
            data.chapters = data.chapters.map((chapter, index) => {
                chapter.index = index;
                return chapter;
            })
            console.log(data);
            createAcademicProjectM(data as CreateAcademicProject);
            toast.success("Проект успешно создан.");
            form.reset();
        } catch (error) {
            console.error("Error creating project:", error);
            toast.error("Произошла ошибка при создании проекта.");
        }
    };

    return (
        <div className="flex min-h-screen">
            <div className="w-full px-16">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground">
                        Cоздание новой пояснительной записки
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Заполните поля, чтобы создать новое задание для пояснительной
                        записки.
                    </p>
                </div>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                    >
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-background p-6 rounded-xl border-2">
                                <h2 className="text-lg font-semibold text-foreground mb-4">
                                    Подробности проекта
                                </h2>
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Название</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Введите название проекта"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Описание</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Введите описание проекта"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Тип проекта</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Выберите тип проекта" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value={ProjectType.coursework}>Курсовая работа</SelectItem>
                                                        <SelectItem value={ProjectType.thesis}>Дипломная работа</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="bg-background p-6 rounded-xl border-2">
                                <h2 className="text-lg font-semibold text-foreground mb-4">
                                    Обязательные разделы
                                </h2>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Определите отдельные части пояснительной записки. Перетащите,
                                    чтобы изменить порядок.
                                </p>

                                <ProjectSectionsList
                                    fields={fields}
                                    form={form}
                                    onRemove={removeSection}
                                    onMove={moveSection}
                                />

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="mt-4"
                                    onClick={addSection}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Добавить пункт
                                </Button>
                                {form.formState.errors.chapters && (
                                    <p className="text-sm font-medium text-destructive mt-2">
                                        {form.formState.errors.chapters.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-background p-6 rounded-xl border-2">
                                <h2 className="text-lg font-semibold text-foreground mb-4">
                                    Рецензент
                                </h2>
                                <FormField
                                    control={form.control}
                                    name="teacherId"
                                    render={({ field }) => {
                                        return (
                                            <FormItem>
                                                <Popover
                                                    open={teachersPopoverOpen}
                                                    onOpenChange={setTeachersPopoverOpen}
                                                >
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                className="w-full justify-between"
                                                                disabled={isTeachresLoading}
                                                            >
                                                                {isTeachresLoading
                                                                    ? "Загрузка учителей..."
                                                                    : field.value
                                                                        ? teachers.find(
                                                                            (t) => String(t.id) === field.value,
                                                                        )?.username
                                                                        : "Выберите учителя..."}
                                                                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-full p-0">
                                                        <Command shouldFilter={false}>
                                                            <CommandInput
                                                                value={teachersSearch}
                                                                onValueChange={setTeachersSearch}
                                                                placeholder="Поиск учителя..."
                                                            />
                                                            <CommandList>
                                                                {teachersError && (
                                                                    <CommandEmpty>
                                                                        Ошибка загрузки учителей:{" "}
                                                                        {teachersError.message}
                                                                    </CommandEmpty>
                                                                )}
                                                                {!teachersError && teachers.length === 0 && (
                                                                    <CommandEmpty>
                                                                        Учителя не найдены.
                                                                    </CommandEmpty>
                                                                )}
                                                                {!teachersError &&
                                                                    teachers.length > 0 &&
                                                                    teacherDebouncedSearch.trim().length > 0 && (
                                                                        <CommandGroup>
                                                                            {teachers.map((t) => (
                                                                                <CommandItem
                                                                                    key={t.id}
                                                                                    value={String(t.id)}
                                                                                    onSelect={() => {
                                                                                        form.setValue(
                                                                                            "teacherId",
                                                                                            String(t.id),
                                                                                        );
                                                                                        setTeachersPopoverOpen(false);
                                                                                    }}
                                                                                >
                                                                                    <CheckIcon
                                                                                        className={cn(
                                                                                            "mr-2 h-4 w-4",
                                                                                            field.value === String(t.id)
                                                                                                ? "opacity-100"
                                                                                                : "opacity-0",
                                                                                        )}
                                                                                    />
                                                                                    {`@${t.username} (${t.firstName || ""} ${t.lastName || ""})`.trim()}
                                                                                </CommandItem>
                                                                            ))}
                                                                        </CommandGroup>
                                                                    )}
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }}
                                />
                            </div>

                            <div className="bg-background p-6 rounded-xl border-2">
                                <h2 className="text-lg font-semibold text-foreground mb-4">
                                    Назначить группу
                                </h2>
                                <FormField
                                    control={form.control}
                                    name="groupId"
                                    render={({ field }) => {
                                        return (
                                            <FormItem>
                                                <Popover
                                                    open={groupsPopoverOpen}
                                                    onOpenChange={setGroupsPopoverOpen}
                                                >
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                className="w-full justify-between"
                                                                disabled={isGroupsLoading}
                                                            >
                                                                {isGroupsLoading
                                                                    ? "Загрузка групп..."
                                                                    : field.value
                                                                        ? groups.find(
                                                                            (group) =>
                                                                                String(group.id) === field.value,
                                                                        )?.name
                                                                        : "Выберите группу..."}
                                                                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-full p-0">
                                                        <Command>
                                                            <CommandInput
                                                                value={groupSearch}
                                                                onValueChange={setGroupSearch}
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
                                                                        <CommandEmpty>
                                                                            Группы не найдены.
                                                                        </CommandEmpty>
                                                                    )}
                                                                {!groupsError &&
                                                                    groupDebouncedSearch.trim().length > 0 &&
                                                                    groups.length > 0 && (
                                                                        <CommandGroup>
                                                                            {groups.map((group) => (
                                                                                <CommandItem
                                                                                    key={group.id}
                                                                                    value={group.name}
                                                                                    onSelect={() => {
                                                                                        form.setValue(
                                                                                            "groupId",
                                                                                            String(group.id),
                                                                                        );
                                                                                        setGroupsPopoverOpen(false);
                                                                                    }}
                                                                                >
                                                                                    <CheckIcon
                                                                                        className={cn(
                                                                                            "mr-2 h-4 w-4",
                                                                                            field.value === String(group.id)
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
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }}
                                />
                            </div>
                            <div className="pt-4 lg:sticky lg:top-8">
                                <Button size="lg" className="w-full" type="submit">
                                    <Save />
                                    Сохранить
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};
