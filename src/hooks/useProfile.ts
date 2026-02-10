import { getMyProfile } from "@/api/endpoints";
import { UserWithProfile } from "@/types/UserWithProfile";
import { useQuery } from "@tanstack/react-query";

export const useProfile = () => {
    const profileQuery = useQuery<UserWithProfile, Error>({
        queryKey: ["profile"],
        queryFn: getMyProfile,
    });

    return {
        profile: profileQuery.data ?? null,
        isProfileLoading: profileQuery.isLoading,
        profileError: profileQuery.error,
    };
};
