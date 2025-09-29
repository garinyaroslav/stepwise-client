import { create } from "zustand";
import { GroupState } from "./types/group";
import { Group } from "@/api/reqTypes";

export const useGroupStore = create<GroupState>((set) => ({
  groups: [],
  selectedGroup: null,

  setGroups: (groups) => set({ groups }),
  setSelectedGroup: (g: Group | null) => set({ selectedGroup: g }),
  reset: () => set({ groups: [], selectedGroup: null }),
}));
