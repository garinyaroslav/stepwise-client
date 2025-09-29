import { getGroups, getStudentsByGroupId } from "@/api/endpoints";
import { Group } from "@/api/reqTypes";
import { useGroupStore } from "@/stores/groupStore";
import { UserWithProfile } from "@/types/UserWithProfile";
import { useQuery } from "@tanstack/react-query";

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

  return {
    groups,
    selectedGroup,
    setSelectedGroup,
    isGroupsLoading: groupsQuery.isLoading,
    groupsError: groupsQuery.error,
    students: studentsQuery.data || [],
    isStudentsLoading: studentsQuery.isLoading,
    studentsError: studentsQuery.error,
    reset,
  };
};
