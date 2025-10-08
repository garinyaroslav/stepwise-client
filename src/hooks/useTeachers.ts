import { getTeachers } from "@/api/endpoints";
import { UserWithProfile } from "@/types/UserWithProfile";
import { useQuery } from "@tanstack/react-query";

export const useTeachers = (search: string = "") => {
    const teachersQuery = useQuery<UserWithProfile[], Error>({
        queryKey: ["students", search],
        queryFn: async () => {
            try {
                const data = await getTeachers(search);
                return data;
            } catch (err) {
                throw err;
            }
        },
        enabled: !!search,
    });

    return {
        teachres: teachersQuery.data || [],
        isTeachresLoading: teachersQuery.isLoading,
        teachersError: teachersQuery.error,
    };
};
