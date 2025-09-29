import { FC, useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { Input } from "../ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useGroups } from "@/hooks/useGroups";
import { Skeleton } from "../ui/skeleton";

export const GroupList = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 800);
  const {
    groups,
    selectedGroup,
    setSelectedGroup,
    isGroupsLoading,
    groupsError,
    reset,
  } = useGroups(debouncedSearch);

  const renderGroups = () => {
    if (groupsError)
      return <p className="text-center py-6">Ошибка: {groupsError.message}</p>;
    if (groups.length === 0)
      return <p className="text-center py-6">Ничего не найдено...</p>;

    return groups.map((g, i) => {
      if (i > 6) return null;
      if (isGroupsLoading) return <Skeleton key={i} className="h-20" />;

      return (
        <ListElem
          key={g.id}
          name={g.name}
          isSelected={selectedGroup?.id == g.id}
          setSelectedGroupId={() => setSelectedGroup(g)}
          studentsCount={g.studentsCount}
        />
      );
    });
  };

  useEffect(() => {
    return () => reset();
  }, []);

  return (
    <div className="lg:col-span-1">
      <div className="bg-background rounded-lg border-2">
        <div className="p-6 border-b">
          <h3 className="text-lg font-medium leading-6 text-foreground">
            Существующие группы
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Выберите группу для настройки.
          </p>
          <Input
            placeholder="Поиск..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-4"
          />
        </div>
        <ul className="divide-y divide-border">{renderGroups()}</ul>
      </div>
    </div>
  );
};

interface ListElemProps {
  isSelected: boolean;
  name: string;
  studentsCount: number;
  setSelectedGroupId: () => void;
}

const ListElem: FC<ListElemProps> = ({
  isSelected = false,
  name,
  studentsCount = 0,
  setSelectedGroupId,
}) => {
  return (
    <li
      onClick={setSelectedGroupId}
      className={`p-4 ${!isSelected && "hover:bg-muted"}  cursor-pointer flex justify-between items-center ${isSelected && "bg-accent border-l-4 border-l-primary"} select-none`}
    >
      <div>
        <p
          className={`font-medium ${isSelected ? "text-primary" : "text-foreground"}`}
        >
          {name}
        </p>
        <p className="text-sm text-muted-foreground">
          Студентов: {studentsCount}
        </p>
      </div>
      <ChevronRight />
    </li>
  );
};
