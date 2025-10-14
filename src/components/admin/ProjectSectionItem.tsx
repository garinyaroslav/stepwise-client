import { FC } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ChevronDownIcon, Trash2 } from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { createAcademicProject } from "@/schemes/createAcademicProject";

interface ProjectSectionItemProps {
    id: string;
    index: number;
    form: UseFormReturn<z.infer<typeof createAcademicProject>>;
    onRemove: () => void;
}

export const ProjectSectionItem: FC<ProjectSectionItemProps> = ({
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
            className={`flex items-center gap-2 p-3 bg-muted rounded-md border-2 ${isDragging ? "z-50 shadow-lg" : ""
                }`}
        >
            <Button
                size="icon"
                variant="ghost"
                type="button"
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing"
            >
                <GripVertical color="#94a3b8" />
            </Button>

            <div className="flex flex-col flex-1 gap-4">
                <div className="flex gap-4">
                    <div className="flex flex-col flex-1">
                        <FormField
                            control={form.control}
                            name={`chapters.${index}.title`}
                            render={({ field }) => (
                                <FormItem>
                                    <Label className="px-1 mb-3">Название</Label>
                                    <FormControl>
                                        <Input placeholder="Введите название пункта" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <FormField
                            control={form.control}
                            name={`chapters.${index}.deadline`}
                            render={({ field }) => (
                                <FormItem>
                                    <Label className="px-1 mb-2.5">Крайний срок</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    className="w-48 justify-between font-normal"
                                                >
                                                    {field.value
                                                        ? new Date(field.value).toLocaleDateString()
                                                        : "Выберите дату"}
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
                </div>

                <FormField
                    control={form.control}
                    name={`chapters.${index}.description`}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea placeholder="Введите описание пункта" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <Button
                size="icon"
                variant="ghost"
                type="button"
                onClick={onRemove}
                className="hover:bg-destructive/10 hover:text-destructive"
            >
                <Trash2 color="#94a3b8" />
            </Button>
        </div>
    );
};
