import { UserRole } from "@/types/auth/UserRole";

export interface Credentials {
  password: string;
}

export interface Group {
  id: number;
  name: string;
}

export interface UserForCreate {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface StudentForCreate extends UserForCreate {
  groupId: number;
}

export interface GroupCreate {
  name: string;
  studentIds: number[];
}
