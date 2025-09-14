import type { User } from "@/types/auth/User";

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (userData: { user: User; token: string }) => void;
    logout: () => void;
}
