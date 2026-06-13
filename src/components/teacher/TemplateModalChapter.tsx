import { FC } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { TemplateFormValues } from "@/schemes/templateFormSchema";

interface TemplateModalChapterProps {
    id?: string;
    index: number;
    form: UseFormReturn<TemplateFormValues>;
    onRemove: () => void;
    isDraggable: boolean;
    showRemove: boolean;
}

const StaticChapter: FC<Omit<TemplateModalChapterProps, "id" | "isDraggable">> = ({
    index,
    form,
    onRemove,
    showRemove,
}) => {
    return (
        <div className="flex items-start gap-2 p-4 bg-card border border-border rounded-lg">
            <div className="flex flex-col items-center gap-10">
                <span className="flex items-center justify-center w-6 h-6 bg-secondary text-secondary-foreground rounded-full text-sm font-medium flex-shrink-0">
                    {index + 1}
                </span>
            </div>

            <div className="flex-1 space-y-3">
                <FormField
                    control={form.control}
                    name={`chapters.${index}.title`}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Название раздела" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name={`chapters.${index}.description`}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea
                                    placeholder="Описание содержания раздела"
                                    rows={2}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted/60 border border-dashed border-border">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">
                        Дедлайн устанавливается при создании учебной работы
                    </p>
                </div>
            </div>

            {showRemove && (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onRemove}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0 mt-1"
                >
                    <Trash2 className="w-5 h-5" />
                </Button>
            )}
        </div>
    );
};

const SortableChapter: FC<Omit<TemplateModalChapterProps, "isDraggable">> = ({
    id,
    index,
    form,
    onRemove,
    showRemove,
}) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: id! });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-start gap-2 p-4 bg-card border border-border rounded-lg ${isDragging ? "z-50 shadow-lg" : ""}`}
        >
            <div className="flex flex-col items-center gap-10">
                <span className="flex items-center justify-center w-6 h-6 bg-secondary text-secondary-foreground rounded-full text-sm font-medium flex-shrink-0">
                    {index + 1}
                </span>
                <Button
                    size="icon"
                    variant="ghost"
                    type="button"
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing flex-shrink-0"
                >
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                </Button>
            </div>

            <div className="flex-1 space-y-3">
                <FormField
                    control={form.control}
                    name={`chapters.${index}.title`}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Название раздела" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name={`chapters.${index}.description`}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea
                                    placeholder="Описание содержания раздела"
                                    rows={2}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted/60 border border-dashed border-border">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">
                        Дедлайн устанавливается при создании учебной работы
                    </p>
                </div>
            </div>

            {showRemove && (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onRemove}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0 mt-1"
                >
                    <Trash2 className="w-5 h-5" />
                </Button>
            )}
        </div>
    );
};

export const TemplateModalChapter: FC<TemplateModalChapterProps> = (props) => {
    const { isDraggable, ...rest } = props;

    if (isDraggable) {
        return <SortableChapter {...(rest as any)} id={rest.id!} />;
    } else {
        return <StaticChapter {...rest} />;
    }
};
