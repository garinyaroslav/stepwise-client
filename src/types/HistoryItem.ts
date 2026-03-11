import { ItemStatus } from "./ItemStatus";
import { UserWithProfile } from "./UserWithProfile";

export interface HistoryItem {
    id: number;
    fileName: string;
    uploadedAt: string;
    teacherComment?: string;
    previousStatus: ItemStatus;
    newStatus: ItemStatus;
    changedAt: Date;
    changedBy: UserWithProfile;
};
