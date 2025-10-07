import { useState } from "react";
import { GripVertical, ChevronDownIcon, Trash2 } from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";

export const ProjectSectionItem = () => {
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  return (
    <div className="flex items-center gap-2 p-3 bg-muted rounded-md border-2">
      <Button size="icon" variant="ghost" type="button">
        <GripVertical color="#94a3b8" />
      </Button>
      <div className="flex flex-col flex-1 gap-4">
        <div className="flex gap-4">
          <div className="flex flex-col flex-1">
            <Label className="px-1 mb-3">Название</Label>
            <Input placeholder="Введите название пункта" />
          </div>
          <div className="flex flex-col gap-3">
            <Label className="px-1">Крайний срок</Label>
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-48 justify-between font-normal"
                >
                  {date ? date.toLocaleDateString() : "Select date"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={date}
                  captionLayout="dropdown"
                  disabled={(date) => date < new Date()}
                  onSelect={(date) => {
                    setDate(date);
                    setDatePickerOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <Textarea placeholder="Введите описание пункта" />
      </div>
      <Button size="icon" variant="ghost" type="button">
        <Trash2 color="#94a3b8" />
      </Button>
    </div>
  );
};
