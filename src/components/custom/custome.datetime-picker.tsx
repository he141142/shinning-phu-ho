import { CalendarIcon } from "@/components/drake_libs/component/home-page";
import { Button } from "@/components/drake_libs/ui/button";
import { Calendar } from "@/components/drake_libs/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/drake_libs/ui/popover";
import { cn } from "@/lib/utils";
import React from "react";

import { format } from "date-fns"
import { Label } from "@/components/drake_libs/ui/label";

interface DateTimePickerData {
    Display: string;
    OnSelect?: (date: Date) => void;
}



export const ShiDateTimePicker: React.FC<DateTimePickerData> = React.memo(({Display,OnSelect}) => {
    const [date, setDate] = React.useState<Date>();

    const onSelect = (date: Date|undefined) => {
        setDate(date);
        if (OnSelect && date) {
            OnSelect(date);
        }
    }

    return (
        <div>
            <div className="it-key mb-2" >{Display}</div>
            <Popover>
                <PopoverTrigger id="it-key" asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon />
                        {date ? format(date, "PPP") : <span>Pick a {Display}</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={onSelect}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
});