import { create } from "zustand";
import { GroupState } from "./types/group";

export const useGroupStore = create<GroupState>((set) => ({
  groups: [],
  error: null,
  isLoading: false,

  setGroups: (groups) => set({ groups }),
  setError: (error: string | null) => set({ error }),
  setLoading: (isLoading: boolean) => set({ isLoading }),
  reset: () => set({ groups: [], error: null, isLoading: false }),
}));
