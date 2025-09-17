import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { loginScheme } from "@/schemes/loginScheme";
import type z from "zod";
import { useLogin } from "@/hooks/useLogin";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/stores/authStore";

const Login = () => {
  const mutation = useLogin();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const form = useForm<z.infer<typeof loginScheme>>({
    resolver: zodResolver(loginScheme),
    defaultValues: {
      username: "admin",
      password: "Qq@123456",
    },
  });

  if (isAuthenticated) {
    navigate("/dashboard");
    return null;
  }

  const onSubmit = (data: z.infer<typeof loginScheme>) =>
    mutation.mutate({ username: data.username, password: data.password });

  return (
    <div className="flex justify-center items-center flex-col size-full">
      <div className="m-auto flex w-full max-w-lg flex-col items-center px-6">
        <div className="mb-8 flex items-center gap-3">
          <img src="/primary-logo.svg" alt="Logo" className="w-10" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Этапник
          </h1>
        </div>
        <div className="w-full rounded-md border border-border bg-white p-8 shadow-sm">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">
              Войдите в свою учетную запись
            </h2>
            <p className="mt-2 text-sm text-secondary-foreground">
              Добро пожаловать! Пожалуйста, введите свои данные.
            </p>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-8 space-y-6"
            >
              <FormField
                control={form.control}
                name="username"
                rules={{ required: true }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя пользователя</FormLabel>
                    <FormControl>
                      <Input placeholder="ivanov" {...field} />
                    </FormControl>
                    <FormDescription>
                      Это имя, которое вы используете для входа в систему.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                rules={{ required: true }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Пароль</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {mutation.isError && (
                <div className="text-sm text-destructive">
                  {mutation.error.message}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center"></div>
                <Button variant="link" size="sm" className="p-0">
                  Забыли пароль?
                </Button>
              </div>
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full"
              >
                {mutation.isPending ? "Вход..." : "Войти"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
