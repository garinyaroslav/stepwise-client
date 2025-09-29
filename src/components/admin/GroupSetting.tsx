import { useGroups } from "@/hooks/useGroups";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { UserWithProfile } from "@/types/UserWithProfile";
import { FC, useEffect } from "react";
import { Skeleton } from "../ui/skeleton";
import { CircleMinus } from "lucide-react";

export const GroupSetting = () => {
  const { selectedGroup, students, studentsError, isStudentsLoading, reset } =
    useGroups();

  const renderStudents = () => {
    if (students.length === 0)
      return <p className="text-center py-6">В этой группе нет студентов...</p>;
    if (studentsError)
      return (
        <p className="text-center py-6">
          Произошла ошибка: {studentsError.message}
        </p>
      );
    if (isStudentsLoading)
      return [...Array(3)].map(() => (
        <Skeleton className="h-12 w-full rounded-lg" />
      ));

    return students.map((s) => <StudentItem key={s.id} student={s} />);
  };

  useEffect(() => {
    return () => reset();
  }, []);

  return (
    <div className="lg:col-span-2">
      <div className="bg-background rounded-lg border-2">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-medium leading-6 text-foreground">
            Настроить группу: {selectedGroup?.name || "Не выбрано"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Добавляйте и удаляйте студентов из этой группы.
          </p>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <h4 className="text-md font-medium text-foreground mb-2">
              Студентов в этой группе ({selectedGroup?.studentsCount || null})
            </h4>
            <ul className="space-y-3">{renderStudents()}</ul>
          </div>
          <div>
            <h4 className="text-md font-medium text-foreground mb-2">
              Доступные студенты
            </h4>
            <div className="mb-4">
              <Input placeholder="Поиск студентов..." />
            </div>
            <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
              <li className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium text-gray-900">John Doe</p>
                  <p className="text-sm text-gray-500">S12345</p>
                </div>
                <button className="text-green-600 hover:text-green-800">
                  <span className="material-symbols-outlined">
                    add_circle_outline
                  </span>
                </button>
              </li>
              <li className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium text-gray-900">Peter Jones</p>
                  <p className="text-sm text-gray-500">S24680</p>
                </div>
                <button className="text-green-600 hover:text-green-800">
                  <span className="material-symbols-outlined">
                    add_circle_outline
                  </span>
                </button>
              </li>
              <li className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium text-gray-900">Maria Garcia</p>
                  <p className="text-sm text-gray-500">S13579</p>
                </div>
                <button className="text-green-600 hover:text-green-800">
                  <span className="material-symbols-outlined">
                    add_circle_outline
                  </span>
                </button>
              </li>
            </ul>
          </div>
          <div className="mt-6 flex justify-end">
            <Button>Сохранить изменения</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StudentItemProps {
  student: UserWithProfile;
}

const StudentItem: FC<StudentItemProps> = ({ student }) => {
  const name =
    student.firstName && student.lastName
      ? student.firstName + " " + student.lastName
      : student.username;

  return (
    <li className="flex items-center justify-between p-3 bg-muted rounded-md">
      <div>
        <p className="font-medium text-foreground">{name}</p>
        <p className="text-sm text-muted-foreground">{student.email}</p>
      </div>
      <Button variant="ghost">
        <CircleMinus color="#ff6467" />
      </Button>
    </li>
  );
};
