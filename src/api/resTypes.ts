export interface GroupResponse {
    id: number;
    name: string;
    students: { id: number }[];
}

export interface StudentCreateResponse {
    id: number;
}
