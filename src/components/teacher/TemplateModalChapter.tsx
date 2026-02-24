import { FC } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, ChevronDownIcon, Calendar as CalendarSvg } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { TemplateFormValues } from "@/schemes/templateFormSchema";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";

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
                        <FormItem className="flex items-center gap-2">
                            <CalendarSvg className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <Label className="text-muted-foreground font-normal">Срок сдачи:</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            className="w-48 justify-between font-normal"
                                        >
                                            {field.value ? new Date(field.value).toLocaleDateString() : "Выберите дату"}
                                            <ChevronDownIcon />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto overflow-hidden p-0"
                                    align="start"
                                >
                                    <Calendar
                                        mode="single"
                                        selected={
                                            field.value ? new Date(field.value) : undefined
                                        }
                                        captionLayout="dropdown"
                                        disabled={(date) => date < new Date()}
                                        onSelect={field.onChange}
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onRemove}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0 mt-1"
            >
                <Trash2 className="w-5 h-5" />
            </Button>
        </div >
    );
};
