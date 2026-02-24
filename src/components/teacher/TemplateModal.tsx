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
import { WorkTemplate } from '@/pages/student/TemplatesManagement';
import { TemplateChaptersList } from './TemplateChaptersList';

type TemplateModalProps = {
    template: WorkTemplate | null;
    onClose: () => void;
    onSave: (template: WorkTemplate) => void;
};

export function TemplateModal({ template, onClose, onSave }: TemplateModalProps) {
    const form = useForm<TemplateFormValues>({
        resolver: zodResolver(templateFormSchema),
        defaultValues: {
            templateTitle: template?.templateTitle ?? '',
            templateDescription: template?.templateDescription ?? '',
            workTitle: template?.workTitle ?? '',
            workDescription: template?.workDescription ?? '',
            type: template?.type ?? '',
            workTemplateChapters: template?.workTemplateChapters.map((ch) => ({
                title: ch.title,
                description: ch.description,
                deadline: ch.deadline,
            })) ?? [{ title: '', description: '', deadline: '' }],
        },
    });

    const { fields, append, remove, move } = useFieldArray({
        control: form.control,
        name: 'workTemplateChapters',
    });

    const handleAddChapter = () => {
        append({ title: '', description: '', deadline: '' });
    };

    const onSubmit = (data: TemplateFormValues) => {
        const chapters = data.workTemplateChapters.map((ch, i) => ({
            id: template?.workTemplateChapters[i]?.id ?? `ch${Date.now()}_${i}`,
            ...ch,
        }));

        onSave({
            id: template?.id ?? Date.now().toString(),
            createdAt: template?.createdAt ?? new Date().toISOString(),
            ...data,
            workTemplateChapters: chapters,
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center overflow-y-auto z-50 p-4">
            {/* <div className="bg-card text-card-foreground rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"> */}
            <div className="bg-card text-card-foreground rounded-lg max-w-3xl w-full flex flex-col">

                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-xl font-semibold">
                        {template ? 'Редактировать шаблон' : 'Создать новый шаблон'}
                    </h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <Form {...form}>
                    {/* <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 overflow-y-auto flex flex-col"> */}
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col">
                        <div className="p-6 space-y-6 flex-1">
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
                                                    <Textarea
                                                        placeholder="Краткое описание назначения шаблона"
                                                        rows={3}
                                                        {...field}
                                                    />
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
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Выберите тип" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="Курсовая работа">Курсовая работа</SelectItem>
                                                            <SelectItem value="Дипломная работа">Дипломная работа</SelectItem>
                                                            <SelectItem value="Научная работа">Научная работа</SelectItem>
                                                            <SelectItem value="Лабораторная работа">Лабораторная работа</SelectItem>
                                                            <SelectItem value="Диссертация">Диссертация</SelectItem>
                                                            <SelectItem value="Проектная работа">Проектная работа</SelectItem>
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
                                                    <Textarea
                                                        placeholder="Описание академической работы"
                                                        rows={2}
                                                        {...field}
                                                    />
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

                                {form.formState.errors.workTemplateChapters && (
                                    <p className="text-sm font-medium text-destructive mt-2">
                                        {form.formState.errors.workTemplateChapters.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-muted">
                            <Button type="button" variant="outline" onClick={onClose}>
                                Отмена
                            </Button>
                            <Button type="submit">
                                {template ? 'Сохранить изменения' : 'Создать шаблон'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
