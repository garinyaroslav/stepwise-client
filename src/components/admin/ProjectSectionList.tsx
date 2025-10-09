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
import { ProjectSectionItem } from "./ProjectSectionItem";
import { z } from "zod";
import { createAcademicProject } from "@/schemes/createAcademicProject";

interface ProjectSectionsListProps {
    fields: UseFieldArrayReturn<
        z.infer<typeof createAcademicProject>,
        "chapters"
    >["fields"];
    form: UseFormReturn<z.infer<typeof createAcademicProject>>;
    onRemove: (index: number) => void;
    onMove: (fromIndex: number, toIndex: number) => void;
}

export const ProjectSectionsList: React.FC<ProjectSectionsListProps> = ({
    fields,
    form,
    onRemove,
    onMove,
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

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
        >
            <SortableContext items={fields} strategy={verticalListSortingStrategy}>
                <div className="space-y-3" id="sections-container">
                    {fields.map((field, index) => (
                        <ProjectSectionItem
                            key={field.id}
                            id={field.id}
                            index={index}
                            form={form}
                            onRemove={() => onRemove(index)}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
};
