import z from "zod";
import { CheckIcon, ChevronsUpDownIcon, Save } from "lucide-react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAcademicProject } from "@/schemes/createAcademicProject";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { ProjectSectionItem } from "./ProjectSectionItem";
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

export const ProjectAddForm = () => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const { groups, isGroupsLoading, groupsError } = useGroups(debouncedSearch);
  const { teachers, isTeachersLoading, teachersError } =
    useTeachers(debouncedSearch);

  const form = useForm<z.infer<typeof createAcademicProject>>({
    resolver: zodResolver(createAcademicProject),
    defaultValues: {
      title: "",
      description: "",
      groupId: "",
      teacherId: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof createAcademicProject>) => {
    try {
      console.log("Student created:", data);
      toast.success("Студент успешно создан.");
      form.reset();
    } catch (error) {
      console.error("Error creating student:", error);
      toast.success("Произошла ошибка при создании студента.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="mx-auto">
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
                <div className="space-y-3" id="sections-container">
                  <ProjectSectionItem />
                </div>
                <Button type="button" variant="outline" className="mt-4">
                  + Добавить пункт
                </Button>
              </div>
            </div>
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-background p-6 rounded-xl border-2">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Рецензент
                </h2>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">
                    Назначить учителя
                  </label>

                  <FormField
                    control={form.control}
                    name="teacherId"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <Popover
                            open={popoverOpen}
                            onOpenChange={setPopoverOpen}
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
                                    ? "Загрузка преподавателей..."
                                    : field.value
                                      ? groups.find(
                                        (group) =>
                                          String(group.id) === field.value,
                                      )?.name
                                      : "Выберите преподавателя..."}
                                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-full p-0">
                              <Command>
                                <CommandInput
                                  value={search}
                                  onValueChange={setSearch}
                                  placeholder="Поиск преподавателя..."
                                />
                                <CommandList>
                                  {groupsError && (
                                    <CommandEmpty>
                                      Ошибка загрузки преподавателя:{" "}
                                      {groupsError.message}
                                    </CommandEmpty>
                                  )}
                                  {!groupsError &&
                                    groups.length === 0 &&
                                    !isGroupsLoading && (
                                      <CommandEmpty>
                                        Преподаватели не найдены.
                                      </CommandEmpty>
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
                                              form.setValue(
                                                "teacherId",
                                                String(group.id),
                                              );
                                              setPopoverOpen(false);
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
                          open={popoverOpen}
                          onOpenChange={setPopoverOpen}
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
                                    <CommandEmpty>
                                      Группы не найдены.
                                    </CommandEmpty>
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
                                            form.setValue(
                                              "groupId",
                                              String(group.id),
                                            );
                                            setPopoverOpen(false);
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
