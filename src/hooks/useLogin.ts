import { useMutation } from "@tanstack/react-query";
import { AxiosError, HttpStatusCode } from "axios";
import { useAuthStore } from "@/stores/authStore";
import { loginReq } from "@/api/endpoints";

export const useLogin = () => {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: loginReq,
    onSuccess: (data) => {
      login(data);
      // queryClient.invalidateQueries({ queryKey: ['user'] }); // if has query for user
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        error.response?.status === HttpStatusCode.Unauthorized
          ? "Неправильный логин или пароль"
          : "Ошибка входа. Попробуйте позже.";
      error.message = errorMessage;
      throw error;
    },
  });
};
