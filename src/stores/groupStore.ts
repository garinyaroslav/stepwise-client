import { create } from "zustand";
import { GroupState } from "./types/group";
import { Group } from "@/api/reqTypes";

export const useGroupStore = create<GroupState>((set) => ({
  groups: [],
  selectedGroup: null,
  error: null,
  isLoading: false,

  setGroups: (groups) => set({ groups }),
  setSelectedGroup: (g: Group | null) => set({ selectedGroup: g }),
  setError: (error: string | null) => set({ error }),
  setLoading: (isLoading: boolean) => set({ isLoading }),
  reset: () =>
    set({ groups: [], error: null, isLoading: false, selectedGroup: null }),
}));
