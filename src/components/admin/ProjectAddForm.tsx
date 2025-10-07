import z from "zod";
import { Save } from "lucide-react";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAcademicProject } from "@/schemes/createAcademicProject";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { ProjectSectionItem } from "./ProjectSectionItem";

export const ProjectAddForm = () => {
  const form = useForm<z.infer<typeof createAcademicProject>>({
    resolver: zodResolver(createAcademicProject),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof createAcademicProject>) => {
    try {
      console.log("Student created:", data);
      toast.success("Студент успешно создан.");
      form.reset();
    } catch (error) {
      console.error("Error creating student:", error);
      toast.success("Произошла ошибка при создании студента.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Cоздание новой пояснительной записки
          </h1>
          <p className="text-muted-foreground mt-1">
            Заполните поля, чтобы создать новое задание для пояснительной
            записки.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-background p-6 rounded-xl border-2">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Подробности проекта
                </h2>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Название</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Введите название проекта"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Описание</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Введите описание проекта"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="bg-background p-6 rounded-xl border-2">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Обязательные разделы
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Определите отдельные части пояснительной записки. Перетащите,
                  чтобы изменить порядок.
                </p>
                <div className="space-y-3" id="sections-container">
                  <ProjectSectionItem />
                </div>
                <Button type="button" variant="outline" className="mt-4">
                  + Добавить пункт
                </Button>
              </div>
            </div>
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-background p-6 rounded-xl border-2">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Рецензент
                </h2>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">
                    Назначить учителя
                  </label>

                  <select className="form-input mt-1" id="select-teacher">
                    <option>Select a reviewer</option>
                    <option>Dr. Katherine Johnson</option>
                    <option>Dr. Richard Feynman</option>
                    <option>Dr. Marie Curie</option>
                    <option>Dr. Albert Einstein</option>
                  </select>
                </div>
              </div>
              <div className="bg-background p-6 rounded-xl border-2">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Назначить группу
                </h2>
                <select className="form-input mt-1" id="select-teacher">
                  <option>Select a reviewer</option>
                  <option>Dr. Katherine Johnson</option>
                  <option>Dr. Richard Feynman</option>
                  <option>Dr. Marie Curie</option>
                  <option>Dr. Albert Einstein</option>
                </select>
              </div>
              <div className="pt-4 lg:sticky lg:top-8">
                <Button size="lg" className="w-full" type="submit">
                  <Save />
                  Сохранить
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
