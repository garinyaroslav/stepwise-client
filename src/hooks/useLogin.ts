import { useMutation } from "@tanstack/react-query";
import axios from "../axios";
import { HttpStatusCode } from "axios";
import { useAuthStore } from "@/stores/authStore";

interface CustomError extends Error {
  message: string;
}

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
    onError: (error: any) => {
      console.error("Login error:", error);
      const customError: CustomError = new Error(
        error.response?.status === HttpStatusCode.Unauthorized
          ? "Неправильный логин или пароль"
          : "Ошибка входа. Попробуйте позже.",
      );
      throw customError;
    },
  });
};
