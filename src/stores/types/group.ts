import { Group } from "@/api/reqTypes";

export interface GroupState {
  groups: Group[];
  error: string | null;
  isLoading: boolean;

  setGroups: (groups: Group[]) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}
