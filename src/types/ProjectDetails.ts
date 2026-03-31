import { ExplanatoryNoteItem } from "./ExplanatoryNoteItem";
import { ProjectStatus } from "./ProjectStatus";
import { UserWithProfile } from "./UserWithProfile";

export interface ProjectDetails {
    id: number;
    title: string;
    description: string;
    owner: UserWithProfile;
    items: ExplanatoryNoteItem[];
    status: ProjectStatus;
    approvedForDefenseAt: Date;
    defendedAt: Date;
}
