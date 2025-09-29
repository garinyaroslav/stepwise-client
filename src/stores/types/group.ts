import { Group } from "@/api/reqTypes";

export interface GroupState {
  groups: Group[];
  selectedGroup: Group | null;

  setGroups: (groups: Group[]) => void;
  setSelectedGroup: (g: Group | null) => void;
  reset: () => void;
}
