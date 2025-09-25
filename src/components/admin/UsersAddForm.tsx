import { useState } from "react";
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
import { passwordRegex, studentRegister } from "@/schemes/studentRegister";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useGroups } from "@/hooks/useGroups";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";
import { PasswordInput } from "../ui/password-input";
import { generatePassword } from "@/utils/generatePassword";
import { createStudent } from "@/api/endpoints";
import { UserRole } from "@/types/auth/UserRole";

export const UsersAddForm = () => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const { groups, isLoading, error } = useGroups(debouncedSearch);

  const form = useForm<z.infer<typeof studentRegister>>({
    resolver: zodResolver(studentRegister),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      groupId: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof studentRegister>) => {
    try {
      await createStudent({
        username: data.username,
        email: data.email,
        password: data.password,
        role: UserRole.STUDENT,
        groupId: Number(data.groupId),
      });

      console.log("Student created:", data);
      toast.success("Студент успешно создан.");
      form.reset();
    } catch (error) {
      console.error("Error creating student:", error);
      toast.success("Произошла ошибка при создании студента.");
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
    <div className="bg-white p-8 rounded-lg shadow-sm">
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
                    placeholder="Введите имя пользователя студента"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Это имя, которое студент будет использовать для входа в
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
                    placeholder="Введите электронную почту студента"
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
                      placeholder="Введите пароль, который будет использовать студент при входе в систему"
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
          <FormField
            control={form.control}
            name="groupId"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Группа студента</FormLabel>
                  <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between"
                          disabled={isLoading}
                        >
                          {isLoading
                            ? "Загрузка групп..."
                            : field.value
                              ? groups.find(
                                (group) => String(group.id) === field.value,
                              )?.name
                              : "Выберите группу..."}
                          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-full p-0">
                      <Command>
                        <CommandInput
                          value={search}
                          onValueChange={setSearch}
                          placeholder="Поиск группы..."
                        />
                        <CommandList>
                          {error && (
                            <CommandEmpty>
                              Ошибка загрузки групп: {error}
                            </CommandEmpty>
                          )}
                          {!error && groups.length === 0 && !isLoading && (
                            <CommandEmpty>Группы не найдены.</CommandEmpty>
                          )}
                          {!error &&
                            debouncedSearch.trim().length > 0 &&
                            groups.length > 0 && (
                              <CommandGroup>
                                {groups.map((group) => (
                                  <CommandItem
                                    key={group.id}
                                    value={group.name}
                                    onSelect={() => {
                                      form.setValue(
                                        "groupId",
                                        String(group.id),
                                      );
                                      setPopoverOpen(false);
                                    }}
                                  >
                                    <CheckIcon
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === String(group.id)
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                    {group.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            )}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isLoading}>
              Создать студента
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
