export interface GroupResponse {
  id: number;
  name: string;
  students: { id: number }[];
}

export interface UserCreateResponse {
  id: number;
}
