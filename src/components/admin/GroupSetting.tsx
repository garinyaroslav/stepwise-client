import { useGroups } from "@/hooks/useGroups";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { UserWithProfile } from "@/types/UserWithProfile";
import { FC, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { CircleMinus, CirclePlus, FileDown } from "lucide-react";
import { useStudents } from "@/hooks/useStudents";
import { useDebounce } from "@/hooks/useDebounce";
import { exportGroupCredentials } from "@/api/endpoints";
import { toast } from "sonner";

export const GroupSetting = () => {
    const { selectedGroup, students, studentsError, isStudentsLoading } =
        useGroups();
    const [studentSearch, setStudentSearch] = useState("");
    const debouncedStudentSearch = useDebounce(studentSearch, 500);

    const {
        students: availableStudents,
        isStudentsLoading: isAvailableStudentsLoading,
        studentsError: availableStudentsError,
    } = useStudents(debouncedStudentSearch);

    const handleExport = async () => {
        try {
            const res = await exportGroupCredentials(selectedGroup!.id);

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `данные_для_входа_группа_${selectedGroup!.name}.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            toast.error("Error exporting group credentials")
            console.error("Error exporting group credentials:", error);
        }
    }

    const renderStudents = () => {
        if (studentsError)
            return (
                <p className="text-center py-6">
                    Произошла ошибка: {studentsError.message}
                </p>
            );
        if (isStudentsLoading)
            return [...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ));
        if (students.length === 0 || selectedGroup == null)
            return <p className="text-center py-6">В этой группе нет студентов...</p>;

        return students.map((s) => (
            <StudentItem key={s.id} student={s} groupId={selectedGroup.id} />
        ));
    };

    const renderAvailableStudents = () => {
        if (studentSearch.length === 0 || selectedGroup == null)
            return (
                <p className="text-center py-6">
                    Введите имя или email студента для поиска.
                </p>
            );
        if (availableStudentsError)
            return (
                <p className="text-center py-6">
                    Произошла ошибка: {availableStudentsError.message}
                </p>
            );
        if (isAvailableStudentsLoading)
            return [...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ));
        if (availableStudents.length === 0)
            return <p className="text-center py-6">Студент не найден...</p>;

        return availableStudents.map((s) => (
            <AvailableStudentItem key={s.id} student={s} groupId={selectedGroup.id} />
        ));
    };

    return (
        <div className="lg:col-span-2">
            <div className="bg-background rounded-lg border-2">
                <div className="flex justify-between items-center p-6 border-b border-border">
                    <div>
                        <h3 className="text-lg font-medium leading-6 text-foreground">
                            Настроить группу: {selectedGroup?.name || "Не выбрано"}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Добавляйте и удаляйте студентов из этой группы.
                        </p>
                    </div>
                    {selectedGroup !== null &&
                        <Button size={"icon"} onClick={handleExport}>
                            <FileDown />
                        </Button>
                    }
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
                            <Input
                                placeholder="Поиск студентов..."
                                value={studentSearch}
                                onChange={(e) => setStudentSearch(e.target.value)}
                            />
                        </div>
                        <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                            {renderAvailableStudents()}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface StudentItemProps {
    student: UserWithProfile;
    groupId: number;
}

const StudentItem: FC<StudentItemProps> = ({ student, groupId }) => {
    const { removeStudentFromGroup } = useGroups();
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
            <Button
                variant="ghost"
                onClick={() =>
                    removeStudentFromGroup({ studentId: student.id, groupId })
                }
            >
                <CircleMinus color="#ff6467" />
            </Button>
        </li>
    );
};

interface AvailableStudentItemProps {
    student: UserWithProfile;
    groupId: number;
}

const AvailableStudentItem: FC<AvailableStudentItemProps> = ({
    student,
    groupId,
}) => {
    const { addStudentToGroup } = useGroups();
    const name =
        student.firstName && student.lastName
            ? student.firstName + " " + student.lastName
            : student.username;

    return (
        <li className="flex items-center justify-between p-3 hover:bg-muted rounded-md">
            <div>
                <p className="font-medium text-foreground">{name}</p>
                <p className="text-sm text-muted-foreground">{student.email}</p>
            </div>
            <Button
                variant="ghost"
                onClick={() => addStudentToGroup({ studentId: student.id, groupId })}
            >
                <CirclePlus color="#4aa651" />
            </Button>
        </li>
    );
};
