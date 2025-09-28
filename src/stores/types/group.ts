import { Group } from "@/api/reqTypes";

export interface GroupState {
  groups: Group[];
  selectedGroup: Group | null;
  error: string | null;
  isLoading: boolean;

  setGroups: (groups: Group[]) => void;
  setSelectedGroup: (g: Group | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}
