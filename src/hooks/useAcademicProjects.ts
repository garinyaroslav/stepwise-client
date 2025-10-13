import { createAcademicProject, getAcademicProjectById, getAcademicProjectsByGroupId } from "@/api/endpoints";
import { CreateAcademicProject } from "@/api/reqTypes";
import { queryClient } from "@/queryClient";
import { AcademicProject } from "@/types/AcademicProject";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAcademicProjects = (groupId: number | null, projectId: number | null) => {
    const academicProjectsQuery = useQuery<AcademicProject[], Error>({
        queryKey: ["academicProjects", groupId],
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

    const academicProjectQuery = useQuery<AcademicProject | null, Error>({
        queryKey: ["academicProject", projectId],
        queryFn: async () => {
            if (projectId === null) return null;

            try {
                const data = await getAcademicProjectById(projectId);
                return data;
            } catch (err) {
                throw err;
            }
        },
        enabled: !!projectId,
    });

    const createAcademicProjectMutation = useMutation({
        mutationFn: (p: CreateAcademicProject) => createAcademicProject(p),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["academicProjects", variables.groupId],
            });
        },
        onError: (error) => {
            console.error("Error while createing academicProject", error);
        },
    });

    return {
        academicProjects: academicProjectsQuery.data || [],
        academicProjectsLoading: academicProjectsQuery.isLoading,
        academicProjectsError: academicProjectsQuery.error,
        academicProject: academicProjectQuery.data,
        academicProjectLoading: academicProjectQuery.isLoading,
        academicProjectError: academicProjectQuery.error,
        createAcademicProject: createAcademicProjectMutation.mutate,
    };
};
