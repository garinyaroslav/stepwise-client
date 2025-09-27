import { FC, useState } from "react";
import { ChevronRight } from "lucide-react";
import { Input } from "../ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useGroups } from "@/hooks/useGroups";

export const GroupList = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const { groups, isLoading, error } = useGroups(debouncedSearch);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  const renderGroups = () => {
    if (isLoading) return <p>Ничего не найдено</p>;
    if (error) return <p>Ошибка: {error}</p>;
    if (groups.length === 0) return <p></p>;

    return groups.map((g) => (
      <ListElem
        key={g.id}
        name={g.name}
        isSelected={selectedGroupId == g.id}
        setSelectedGroupId={() => setSelectedGroupId(g.id)}
        numberOfStudents={0}
      />
    ));
  };

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
  numberOfStudents: number;
  setSelectedGroupId: () => void;
}

const ListElem: FC<ListElemProps> = ({
  isSelected = false,
  name,
  numberOfStudents = 0,
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
          Студентов: {numberOfStudents}
        </p>
      </div>
      <ChevronRight />
    </li>
  );
};
