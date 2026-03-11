import { createAcademicWork, getAcademicWorkById, getAcademicWorksByGroupId } from "@/api/endpoints";
import { CreateAcademicWork } from "@/api/reqTypes";
import { queryClient } from "@/queryClient";
import { AcademicWork } from "@/types/AcademicWork";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAcademicWorks = (groupId: number | null, projectId: number | null) => {
    const academicProjectsQuery = useQuery<AcademicWork[], Error>({
        queryKey: ["academicProjects", groupId],
        queryFn: async () => {
            if (groupId === null) return [];

            try {
                const data = await getAcademicWorksByGroupId(groupId);
                return data;
            } catch (err) {
                throw err;
            }
        },
        enabled: !!groupId,
    });

    const academicProjectQuery = useQuery<AcademicWork | null, Error>({
        queryKey: ["academicProject", projectId],
        queryFn: async () => {
            if (projectId === null) return null;

            try {
                const data = await getAcademicWorkById(projectId);
                return data;
            } catch (err) {
                throw err;
            }
        },
        enabled: !!projectId,
    });

    const createAcademicWorkMutation = useMutation({
        mutationFn: (p: CreateAcademicWork) => createAcademicWork(p),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["academicProjects", variables.groupId],
            });
        },
        onError: (error) => {
            console.error("Error while creating academicProject", error);
        },
    });


    return {
        academicProjects: academicProjectsQuery.data || [],
        academicProjectsLoading: academicProjectsQuery.isLoading,
        academicProjectsError: academicProjectsQuery.error,
        academicProject: academicProjectQuery.data,
        academicProjectLoading: academicProjectQuery.isLoading,
        academicProjectError: academicProjectQuery.error,
        createAcademicWork: createAcademicWorkMutation,
        isCreatingProject: createAcademicWorkMutation.isPending,
        createAcademicWorkError: createAcademicWorkMutation.error,
    };
};
