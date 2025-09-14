import { QueryClient } from "@tanstack/react-query";
import { AxiosError, HttpStatusCode } from "axios";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === HttpStatusCode.Unauthorized)
          return false;

        if (failureCount < 3) return true;

        return false;
      },
    },
  },
});
