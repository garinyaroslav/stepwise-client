import { getMyTemplates } from "@/api/endpoints";
import { Pageiable } from "@/api/resTypes";
import { WorkTemplate } from "@/types/WorkTemplate";
import { useQuery } from "@tanstack/react-query";

export const useTemplates = (pageNumber: number, search: string) => {
    const templatesQuery = useQuery<Pageiable<WorkTemplate>, Error>({
        queryKey: ["templates", pageNumber, search],
        queryFn: () => getMyTemplates(pageNumber, search),
    });

    return {
        templates: templatesQuery.data?.data ?? [],
        totalPages: templatesQuery.data?.totalPages ?? 0,
        isTemplatesLoading: templatesQuery.isLoading,
        templatesError: templatesQuery.error,
        refetch: () => templatesQuery.refetch(),
    };
};
