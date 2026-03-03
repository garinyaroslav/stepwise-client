import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { templateFormSchema, TemplateFormValues } from '@/schemes/templateFormSchema';
import { TemplateChaptersList } from './TemplateChaptersList';
import { useNavigate, useParams } from 'react-router';
import { useEffect } from 'react';
import { createTemplate, getTemplate, updateTemplate } from '@/api/endpoints';
import { toast } from 'sonner';
import { ProjectType } from '@/types/ProjectType';
import { useAuthStore } from '@/stores/authStore';
import { queryClient } from '@/queryClient';

export function TemplateModal() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { id } = useParams<{ id: string }>();
    const isEdit = !!id && id !== 'new';

    const form = useForm<TemplateFormValues>({
        resolver: zodResolver(templateFormSchema),
        defaultValues: {
            templateTitle: '',
            templateDescription: '',
            workTitle: '',
            workDescription: '',
            type: ProjectType.coursework,
            chapters: [{ index: 0, title: '', description: '' }],
        },
    });

    useEffect(() => {
        if (!isEdit) return;
        (async () => {
            const template = await getTemplate(Number(id));
            form.reset({
                templateTitle: template.title,
                templateDescription: template.description,
                workTitle: template.workTitle,
                workDescription: template.workDescription,
                type: template.type,
                chapters: template.chapters.map((ch) => ({
                    index: ch.index,
                    title: ch.title,
                    description: ch.description ?? '',
                })),
            });
        })();
    }, [id, isEdit]);

    const { fields, append, remove, move } = useFieldArray({
        control: form.control,
        name: 'chapters',
    });

    const handleAddChapter = () => append({ index: fields.length, title: '', description: '' });

    const closeModal = () => navigate(-1);

    const onSubmit = async (data: TemplateFormValues) => {
        if (!user) {
            toast.error('Пользователь не найден. Пожалуйста, войдите в систему и попробуйте снова.');
            return;
        }
        try {
            const resBody = { id, title: data.templateTitle, description: data.templateDescription, teacherId: Number(user.id), ...data };

            if (isEdit) {
                await updateTemplate(resBody);
            } else {
                await createTemplate(resBody);
            }

            toast.success(`Шаблон ${isEdit ? 'обновлён' : 'создан'} успешно!`);

            await queryClient.invalidateQueries({ queryKey: ['templates'] });
            await queryClient.invalidateQueries({ queryKey: ['template', Number(id)] });

            closeModal();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Произошла ошибка. Попробуйте снова.');
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 z-50 overflow-y-auto"
            onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
            <div className="min-h-full flex items-start justify-center p-4 py-8">
                <div className="bg-card text-card-foreground rounded-lg w-full max-w-3xl flex flex-col">

                    <div className="flex items-center justify-between p-6 border-b border-border">
                        <h2 className="text-xl font-semibold">
                            {isEdit ? 'Редактировать шаблон' : 'Создать новый шаблон'}
                        </h2>
                        <Button variant="ghost" size="icon" onClick={closeModal}>
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
                            <div className="p-6 space-y-6">
                                <div>
                                    <h3 className="font-semibold mb-4">Информация о шаблоне</h3>
                                    <div className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="templateTitle"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Название шаблона *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Например: Шаблон курсовой работы" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="templateDescription"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Описание шаблона *</FormLabel>
                                                    <FormControl>
                                                        <Textarea placeholder="Краткое описание назначения шаблона" rows={3} {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="workTitle"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Название работы *</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Курсовая работа" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="type"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Тип работы *</FormLabel>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Выберите тип" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="COURSEWORK">Курсовая работа</SelectItem>
                                                                <SelectItem value="THESIS">Дипломная работа</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="workDescription"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Описание работы *</FormLabel>
                                                    <FormControl>
                                                        <Textarea placeholder="Описание академической работы" rows={2} {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold">Разделы пояснительной записки</h3>
                                        <Button type="button" size="sm" onClick={handleAddChapter}>
                                            <Plus className="w-4 h-4" />
                                            Добавить раздел
                                        </Button>
                                    </div>

                                    {fields.length === 0 ? (
                                        <div className="p-8 text-center text-muted-foreground border-2 border-dashed border-border rounded-lg">
                                            Нет разделов. Добавьте первый раздел.
                                        </div>
                                    ) : (
                                        <TemplateChaptersList
                                            fields={fields}
                                            form={form}
                                            onRemove={remove}
                                            onMove={move}
                                        />
                                    )}

                                    {form.formState.errors.chapters && (
                                        <p className="text-sm font-medium text-destructive mt-2">
                                            {form.formState.errors.chapters.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-muted rounded-b-lg">
                                <Button type="button" variant="outline" onClick={closeModal}>
                                    Отмена
                                </Button>
                                <Button type="submit" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting
                                        ? 'Сохранение...'
                                        : isEdit ? 'Сохранить изменения' : 'Создать шаблон'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
