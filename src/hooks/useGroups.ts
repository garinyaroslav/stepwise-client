import { getGroups } from "@/api/endpoints";
import { Group } from "@/api/types";
import { useQuery } from "@tanstack/react-query";

export const useGroups = (search: string = "") => {
  const {
    data: groups = [],
    isLoading,
    error,
  } = useQuery<Group[], Error>({
    queryKey: ["groups", search],
    queryFn: () => getGroups(search),
    enabled: true,
  });

  return { groups, isLoading, error: error?.message || null };
};
