import React from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
    restrictToVerticalAxis,
    restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";
import { TemplateModalChapter } from "./TemplateModalChapter";
import { TemplateFormValues } from "@/schemes/templateFormSchema";

interface TemplateChaptersListProps {
    fields: UseFieldArrayReturn<TemplateFormValues, "chapters">["fields"];
    form: UseFormReturn<TemplateFormValues>;
    onRemove: (index: number) => void;
    onMove: (fromIndex: number, toIndex: number) => void;
    isEdit: boolean;
}

export const TemplateChaptersList: React.FC<TemplateChaptersListProps> = ({
    fields,
    form,
    onRemove,
    onMove,
    isEdit,
}) => {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = fields.findIndex((item) => item.id === active.id);
            const newIndex = fields.findIndex((item) => item.id === over.id);
            onMove(oldIndex, newIndex);
        }
    };

    if (isEdit) {
        return (
            <div className="space-y-3">
                {fields.map((field, index) => (
                    <TemplateModalChapter
                        key={field.id}
                        index={index}
                        form={form}
                        onRemove={() => onRemove(index)}
                        isDraggable={false}
                        showRemove={false}
                    />
                ))}
            </div>
        );
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
        >
            <SortableContext items={fields} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                    {fields.map((field, index) => (
                        <TemplateModalChapter
                            key={field.id}
                            id={field.id}
                            index={index}
                            form={form}
                            onRemove={() => onRemove(index)}
                            isDraggable={true}
                            showRemove={true}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
};
