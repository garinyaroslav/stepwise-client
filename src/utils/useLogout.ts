import { queryClient } from "@/queryClient";
import { useAuthStore } from "@/stores/authStore";

export const useLogout = () => {
    const { logout } = useAuthStore();

    return {
        logout: () => {
            logout();
            queryClient.clear();
            window.location.href = "/login";
        }
    }
}
