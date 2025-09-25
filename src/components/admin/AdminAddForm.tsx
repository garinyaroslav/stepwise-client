import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { passwordRegex, userRegister } from "@/schemes/userRegister";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { PasswordInput } from "../ui/password-input";
import { generatePassword } from "@/utils/generatePassword";
import { UserRole } from "@/types/auth/UserRole";
import { createUser } from "@/api/endpoints";

export const AdminAddForm = () => {
  const form = useForm<z.infer<typeof userRegister>>({
    resolver: zodResolver(userRegister),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof userRegister>) => {
    try {
      await createUser({
        username: data.username,
        email: data.email,
        password: data.password,
        role: UserRole.ADMIN,
      });

      console.log("Student created:", data);
      toast.success("Администратор успешно создан.");
      form.reset();
    } catch (error) {
      console.error("Error creating student:", error);
      toast.success("Произошла ошибка при создании администратора.");
    }
  };

  const handleGenerate = () => {
    const newPassword = generatePassword(passwordRegex);
    if (newPassword) {
      form.setValue("password", newPassword);
    } else {
      console.error("Не удалось сгенерировать подходящий пароль");
      toast.error("Не удалось сгенерировать подходящий пароль");
    }
  };

  return (
    <div className="bg-background border-2 p-8 rounded-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Имя пользователя</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Введите имя пользователя администратора"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Это имя, которое администратор будет использовать для входа в
                  систему.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Электронная почта</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Введите электронную почту администратора"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Пароль</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <PasswordInput
                      placeholder="Введите пароль, который будет использовать администратор для входа в систему"
                      {...field}
                    />
                    <Button type="button" onClick={handleGenerate}>
                      Сгенерировать
                    </Button>
                  </div>
                </FormControl>
                <FormMessage className="whitespace-pre-line" />
              </FormItem>
            )}
          />
          <div className="flex justify-end pt-4">
            <Button type="submit">Зарегистрировать</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
