import { ExplanatoryNoteItem } from "./ExplanatoryNoteItem";
import { UserWithProfile } from "./UserWithProfile";

export interface ProjectDetails {
    id: number;
    title: string;
    description: string;
    owner: UserWithProfile;
    items: ExplanatoryNoteItem[];
    isApprovedForDefense: boolean;
}
