import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/atuhStore";
import axios from "../axios";
import { HttpStatusCode } from "axios";

const loginApi = async (credentials: {
  username: string;
  password: string;
}) => {
  const response = await axios.post("/api/auth/signin", credentials);
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
    onError: (error) => {
      console.error("Login error:", error);
    },
  });
};
