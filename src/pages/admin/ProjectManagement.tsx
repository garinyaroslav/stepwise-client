import { useEffect, useState } from "react";
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

export const ProjectManagement = () => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const { groups, isGroupsLoading, groupsError, reset } =
    useGroups(debouncedSearch);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  useEffect(() => {
    return () => reset();
  }, []);

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
                Все проекты студентов
              </h2>
              <div className="w-full max-w-xs">
                <label className="sr-only">Фильтровать по группе</label>
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="lg"
                      role="combobox"
                      className="w-full justify-between"
                      disabled={isGroupsLoading}
                    >
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

                {/* <div className="relative"> */}
                {/*   <select */}
                {/*     className="w-full rounded-md border-slate-300 bg-white placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500 pl-10" */}
                {/*     id="group-filter" */}
                {/*   > */}
                {/*     <option>All Groups</option> */}
                {/*     <option>Computer Science - 2024</option> */}
                {/*     <option>Biology - 2024</option> */}
                {/*     <option>Mechanical Engineering - 2024</option> */}
                {/*     <option>Psychology - 2024</option> */}
                {/*   </select> */}
                {/*   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> */}
                {/*     <ListFilter /> */}
                {/*   </div> */}
                {/* </div> */}
              </div>
            </div>
            <div className="overflow-x-auto">
              {/* <table className="w-full text-sm text-left text-slate-500"> */}
              {/*   <thead className="text-xs text-slate-700 uppercase bg-slate-50"> */}
              {/*     <tr> */}
              {/*       <th className="px-4 py-3 font-medium" scope="col"> */}
              {/*         Assignment Title */}
              {/*       </th> */}
              {/*       <th className="px-4 py-3 font-medium" scope="col"> */}
              {/*         Reviewer */}
              {/*       </th> */}
              {/*       <th className="px-4 py-3 font-medium" scope="col"> */}
              {/*         Submissions */}
              {/*       </th> */}
              {/*       <th className="px-4 py-3 font-medium" scope="col"> */}
              {/*         Status */}
              {/*       </th> */}
              {/*       <th className="px-4 py-3" scope="col"> */}
              {/*         <span className="sr-only">Edit</span> */}
              {/*       </th> */}
              {/*     </tr> */}
              {/*   </thead> */}
              {/*   <tbody> */}
              {/*     <tr className="bg-white border-b border-slate-200"> */}
              {/*       <td className="p-0" colspan="5"> */}
              {/*         <a className="table-link" href="#"> */}
              {/*           <div className="grid grid-cols-5 items-center"> */}
              {/*             <div className="p-4 font-medium text-gray-900 whitespace-nowrap"> */}
              {/*               Bachelor's Thesis Explanatory Note 2024 */}
              {/*             </div> */}
              {/*             <div className="p-4">Dr. Richard Feynman</div> */}
              {/*             <div className="p-4">18 / 25</div> */}
              {/*             <div className="p-4"> */}
              {/*               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"> */}
              {/*                 Active */}
              {/*               </span> */}
              {/*             </div> */}
              {/*             <div className="p-4 text-right"> */}
              {/*               <span className="material-symbols-outlined text-slate-400"> */}
              {/*                 chevron_right */}
              {/*               </span> */}
              {/*             </div> */}
              {/*           </div> */}
              {/*         </a> */}
              {/*       </td> */}
              {/*     </tr> */}
              {/*     <tr className="bg-white border-b border-slate-200"> */}
              {/*       <td className="p-0" colspan="5"> */}
              {/*         <a className="table-link" href="#"> */}
              {/*           <div className="grid grid-cols-5 items-center"> */}
              {/*             <div className="p-4 font-medium text-gray-900 whitespace-nowrap"> */}
              {/*               Mid-term Project Proposal Note */}
              {/*             </div> */}
              {/*             <div className="p-4">Dr. Katherine Johnson</div> */}
              {/*             <div className="p-4">22 / 25</div> */}
              {/*             <div className="p-4"> */}
              {/*               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"> */}
              {/*                 Active */}
              {/*               </span> */}
              {/*             </div> */}
              {/*             <div className="p-4 text-right"> */}
              {/*               <span className="material-symbols-outlined text-slate-400"> */}
              {/*                 chevron_right */}
              {/*               </span> */}
              {/*             </div> */}
              {/*           </div> */}
              {/*         </a> */}
              {/*       </td> */}
              {/*     </tr> */}
              {/*     <tr className="bg-white border-b border-slate-200"> */}
              {/*       <td className="p-0" colspan="5"> */}
              {/*         <a className="table-link" href="#"> */}
              {/*           <div className="grid grid-cols-5 items-center"> */}
              {/*             <div className="p-4 font-medium text-gray-900 whitespace-nowrap"> */}
              {/*               Internship Report Explanatory Note */}
              {/*             </div> */}
              {/*             <div className="p-4">Dr. Richard Feynman</div> */}
              {/*             <div className="p-4">0 / 25</div> */}
              {/*             <div className="p-4"> */}
              {/*               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"> */}
              {/*                 Draft */}
              {/*               </span> */}
              {/*             </div> */}
              {/*             <div className="p-4 text-right"> */}
              {/*               <span className="material-symbols-outlined text-slate-400"> */}
              {/*                 chevron_right */}
              {/*               </span> */}
              {/*             </div> */}
              {/*           </div> */}
              {/*         </a> */}
              {/*       </td> */}
              {/*     </tr> */}
              {/*     <tr className="bg-white"> */}
              {/*       <td className="p-0" colspan="5"> */}
              {/*         <a className="table-link rounded-b-xl" href="#"> */}
              {/*           <div className="grid grid-cols-5 items-center"> */}
              {/*             <div className="p-4 font-medium text-gray-900 whitespace-nowrap"> */}
              {/*               Final Year Project - Phase 1 */}
              {/*             </div> */}
              {/*             <div className="p-4">Dr. Marie Curie</div> */}
              {/*             <div className="p-4">25 / 25</div> */}
              {/*             <div className="p-4"> */}
              {/*               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"> */}
              {/*                 Closed */}
              {/*               </span> */}
              {/*             </div> */}
              {/*             <div className="p-4 text-right"> */}
              {/*               <span className="material-symbols-outlined text-slate-400"> */}
              {/*                 chevron_right */}
              {/*               </span> */}
              {/*             </div> */}
              {/*           </div> */}
              {/*         </a> */}
              {/*       </td> */}
              {/*     </tr> */}
              {/*   </tbody> */}
              {/* </table> */}
            </div>
            <div className="mt-6 flex justify-between items-center">
              <p className="text-sm text-slate-500">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">4</span> of{" "}
                <span className="font-medium">4</span> results
              </p>
              <div
                aria-label="Pagination"
                className="inline-flex rounded-md shadow-sm -space-x-px"
              >
                <button
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50"
                  type="button"
                >
                  <span className="material-symbols-outlined text-lg">
                    chevron_left
                  </span>
                </button>
                <button
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50"
                  type="button"
                >
                  <span className="material-symbols-outlined text-lg">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
