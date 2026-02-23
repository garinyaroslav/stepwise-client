import { FC } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Calendar, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { TemplateFormValues } from "@/schemes/templateFormSchema";

interface TemplateModalChapterProps {
    id: string;
    index: number;
    form: UseFormReturn<TemplateFormValues>;
    onRemove: () => void;
}

export const TemplateModalChapter: FC<TemplateModalChapterProps> = ({
    id,
    index,
    form,
    onRemove,
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

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
            {/* Drag handle */}
            <Button
                size="icon"
                variant="ghost"
                type="button"
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing mt-1 flex-shrink-0"
            >
                <GripVertical className="w-4 h-4 text-muted-foreground" />
            </Button>

            {/* Index badge */}
            <span className="flex items-center justify-center w-6 h-6 bg-secondary text-secondary-foreground rounded-full text-sm font-medium flex-shrink-0 mt-2">
                {index + 1}
            </span>

            {/* Fields */}
            <div className="flex-1 space-y-3">
                <FormField
                    control={form.control}
                    name={`workTemplateChapters.${index}.title`}
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
                    name={`workTemplateChapters.${index}.description`}
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

                <FormField
                    control={form.control}
                    name={`workTemplateChapters.${index}.deadline`}
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <Label className="text-muted-foreground font-normal">Срок сдачи:</Label>
                                <FormControl>
                                    <Input type="date" className="w-auto" {...field} />
                                </FormControl>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {/* Remove button */}
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onRemove}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0 mt-1"
            >
                <Trash2 className="w-5 h-5" />
            </Button>
        </div>
    );
};
