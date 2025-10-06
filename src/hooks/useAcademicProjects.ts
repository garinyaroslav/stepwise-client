import { getAcademicProjectsByGroupId } from "@/api/endpoints";
import { AcademicProject } from "@/types/AcademicProject";
import { useQuery } from "@tanstack/react-query";

export const useAcademicProjects = (groupId: number | null) => {
  const academicProjectsQuery = useQuery<AcademicProject[], Error>({
    queryKey: ["students", groupId],
    queryFn: async () => {
      if (groupId === null) return [];

      try {
        const data = await getAcademicProjectsByGroupId(groupId);
        return data;
      } catch (err) {
        throw err;
      }
    },
    enabled: !!groupId,
  });

  return {
    academicProjects: academicProjectsQuery.data || [],
    academicProjectsLoading: academicProjectsQuery.isLoading,
    academicProjectsError: academicProjectsQuery.error,
  };
};
