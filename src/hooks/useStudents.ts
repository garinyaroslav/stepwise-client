import { getStudents } from "@/api/endpoints";
import { UserWithProfile } from "@/types/UserWithProfile";
import { useQuery } from "@tanstack/react-query";

export const useStudents = (search: string = "") => {
    const studentsQuery = useQuery<UserWithProfile[], Error>({
        queryKey: ["students", search],
        queryFn: async () => {
            try {
                const data = await getStudents(search);
                return data;
            } catch (err) {
                throw err;
            }
        },
        enabled: !!search,
    });

    return {
        students: studentsQuery.data || [],
        isStudentsLoading: studentsQuery.isLoading,
        studentsError: studentsQuery.error,
    };
};
