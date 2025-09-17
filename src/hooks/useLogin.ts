import { useMutation } from "@tanstack/react-query";
import axios from "../axios";
import { AxiosError, HttpStatusCode } from "axios";
import { useAuthStore } from "@/stores/authStore";

const loginApi = async (credentials: {
  username: string;
  password: string;
}) => {
  const response = await axios.post("/auth/signin", credentials);
  if (response.status !== HttpStatusCode.Ok) throw new Error("Login failed");
  return response.data;
};

export const useLogin = () => {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: loginApi,
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
