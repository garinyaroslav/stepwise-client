export interface UserWithProfile {
  id: number;
  username: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  phoneNumber?: string;
  address?: string;
}
