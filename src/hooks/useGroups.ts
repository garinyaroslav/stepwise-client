import { getGroups, getStudentsByGroupId } from "@/api/endpoints";
import { Group } from "@/api/reqTypes";
import { useGroupStore } from "@/stores/groupStore";
import { UserWithProfile } from "@/types/UserWithProfile";
import { useQuery } from "@tanstack/react-query";

export const useGroups = (search: string = "") => {
  const {
    groups,
    setGroups,
    selectedGroup,
    setSelectedGroup,
    error,
    setError,
    isLoading,
    setLoading,
    reset,
  } = useGroupStore();

  useQuery<Group[], Error>({
    queryKey: ["groups", search],
    queryFn: async () => {
      setLoading(true);
      try {
        const data = await getGroups(search);

        setGroups(data);
        setError(null);
        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Network error";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
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
      setLoading(true);
      try {
        const data = await getStudentsByGroupId(selectedGroup?.id);
        setError(null);
        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Network error";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    enabled: !!selectedGroup?.id, // Only run query if groupId is provided
  });

  return {
    groups,
    selectedGroup,
    setSelectedGroup,
    isLoading,
    error,
    reset,
    students: studentsQuery.data || [],
    isStudentsLoading: studentsQuery.isLoading,
    studentsError: studentsQuery.error,
  };
};
