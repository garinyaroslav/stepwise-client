import { HistoryItem } from "./HistoryItem";
import { ItemStatus } from "./ItemStatus";

export interface ExplanatoryNoteItem {
    id: number;
    orderNumber: number;
    status: ItemStatus;
    fileName?: string;
    history: HistoryItem[];
};
