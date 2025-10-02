import {
  addStudentToGroup,
  getGroups,
  getStudentsByGroupId,
  removeStudentFromGroup,
} from "@/api/endpoints";
import { Group } from "@/api/reqTypes";
import { queryClient } from "@/queryClient";
import { useGroupStore } from "@/stores/groupStore";
import { UserWithProfile } from "@/types/UserWithProfile";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGroups = (search: string = "") => {
  const { groups, setGroups, selectedGroup, setSelectedGroup, reset } =
    useGroupStore();

  const groupsQuery = useQuery<Group[], Error>({
    queryKey: ["groups", search],
    queryFn: async () => {
      try {
        const data = await getGroups(search);

        setGroups(data);
        return data;
      } catch (err) {
        throw err;
      }
    },
    enabled: true,
  });

  const studentsQuery = useQuery<UserWithProfile[], Error>({
    queryKey: ["students", selectedGroup?.id],
    queryFn: async () => {
      if (!selectedGroup?.id) {
        return [];
      }
      try {
        const data = await getStudentsByGroupId(selectedGroup?.id);
        return data;
      } catch (err) {
        throw err;
      }
    },
    enabled: !!selectedGroup?.id,
  });

  const addStudentMutation = useMutation({
    mutationFn: ({
      studentId,
      groupId,
    }: {
      studentId: number;
      groupId: number;
    }) => addStudentToGroup(studentId, groupId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["students", variables.groupId],
      });
      toast.success(`Студент добавлен в группу`);
    },
    onError: (error) => {
      console.error("Failed to add student to group:", error);
      toast.error("Не удалось добавить студента в группу.");
    },
  });

  const removeStudentMutation = useMutation({
    mutationFn: ({
      studentId,
      groupId,
    }: {
      studentId: number;
      groupId: number;
    }) => removeStudentFromGroup(studentId, groupId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["students", variables.groupId],
      });
      toast.success(`Студент удалён из группы`);
    },
    onError: (error) => {
      console.error("Failed to remove student from group:", error);
      toast.error("Не удалось удалить студента из группы.");
    },
  });

  return {
    groups,
    selectedGroup,
    setSelectedGroup,
    isGroupsLoading: groupsQuery.isLoading,
    groupsError: groupsQuery.error,
    students: studentsQuery.data || [],
    isStudentsLoading: studentsQuery.isLoading,
    studentsError: studentsQuery.error,
    addStudentToGroup: addStudentMutation.mutate,
    removeStudentFromGroup: removeStudentMutation.mutate,
    reset,
  };
};
