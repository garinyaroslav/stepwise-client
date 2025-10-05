import { useState } from "react";
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
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

export const ProjectManagement = () => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const { groups, isGroupsLoading, groupsError } = useGroups(debouncedSearch);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const renderTableData = () => {
    return (
      <TableRow key={0}>
        <TableCell className="font-medium">123</TableCell>
        <TableCell>123</TableCell>
        <TableCell>123</TableCell>
        <TableCell>123</TableCell>
      </TableRow>
    );
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
            <Button>+ Новый проект</Button>
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
                  {/* {selectedGroupId != null ? ( */}
                  <TableBody>{renderTableData()}</TableBody>
                  {/* ) : ( */}
                  {/* <Empty> */}
                  {/*   <EmptyHeader> */}
                  {/*     <EmptyMedia variant="icon">123</EmptyMedia> */}
                  {/*     <EmptyTitle>Проектов пока нет</EmptyTitle> */}
                  {/*     <EmptyDescription> */}
                  {/*       Для этой группы ещё не создали ни одного проекта. */}
                  {/*       Начните с создания первого проекта. */}
                  {/*     </EmptyDescription> */}
                  {/*   </EmptyHeader> */}
                  {/*   <EmptyContent> */}
                  {/*     <Button>Создать проект</Button> */}
                  {/*   </EmptyContent> */}
                  {/* </Empty> */}
                  {/* )} */}
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
