import { GroupList } from "@/components/admin/GroupList";
import { GroupSetting } from "@/components/admin/GroupSetting";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Save, Users } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { groupNameScheme } from "@/schemes/groupNameScheme";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "sonner";
import { createGroup } from "@/api/endpoints";

export const GroupsManagement = () => {
  const form = useForm<z.infer<typeof groupNameScheme>>({
    resolver: zodResolver(groupNameScheme),
    defaultValues: {
      groupName: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof groupNameScheme>) => {
    try {
      console.log(data);
      await createGroup({
        name: data.groupName,
        studentIds: [],
      });

      toast.success("Группа успешно создана.");
      form.reset();
    } catch (error) {
      console.error("Error creating group:", error);
      toast.success("Произошла ошибка при создании группы.");
    }
  };

  return (
    <>
      <SidebarTrigger />
      <div className="relative flex size-full flex-col group/design-root">
        <main className="flex-1 p-4">
          <div className="max-w-7xl mx-auto">
            <header className="mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">
                    Управление группами
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    Настройте группы и назначьте студентов
                  </p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Создать новую группу</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader className="flex flex-col items-center text-center mb-4">
                          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent">
                            <Users color="#007eda" />
                          </div>
                          <DialogTitle className="text-2xl">
                            Добавить новую группу
                          </DialogTitle>
                          <DialogDescription>
                            Создайте новую группу, чтобы организовать учеников.
                          </DialogDescription>
                        </DialogHeader>
                        <FormField
                          control={form.control}
                          name="groupName"
                          render={({ field }) => (
                            <FormItem>
                              <Label>Навзвание группы</Label>
                              <FormControl>
                                <Input
                                  placeholder="например, ПИН-122"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <p className="text-sm text-muted-foreground"></p>
                        <DialogFooter className="flex flex-col gap-3 pt-4 sm:flex-row-reverse">
                          <Button size="lg" className="flex-1" type="submit">
                            <Save />
                            Сохранить
                          </Button>
                          <DialogClose asChild>
                            <Button
                              size="lg"
                              className="flex-1"
                              variant="secondary"
                            >
                              Отмена
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <GroupList />
              <GroupSetting />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};
