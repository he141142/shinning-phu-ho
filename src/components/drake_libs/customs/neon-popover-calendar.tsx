import { CalendarIcon } from "../component/home-page";
import { Button } from "../ui/button";
import { Calendar } from "@/components/drake_libs/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import React, { useCallback, useState } from "react";
import { format, set } from "date-fns"

export interface NeonPopoverCalendarProps {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
}

export const NeonPopoverCalendarComponent: React.FC<NeonPopoverCalendarProps> = React.memo(({ date, setDate }) => {
    {
        return (
            <>
                <Popover>
                    <PopoverTrigger asChild className="bg-white">
                        <Button
                            variant={"outline"}
                            className={`justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : "Pick a date"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-black ">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            className="hide-selected-month text-red aiii"
                            captionLayout="dropdown"
                            fromYear={2010}
                            toYear={2030}
                            styles={{
                                caption_dropdowns: {
                                    color: "red",
                                    backgroundColor: "black",
                                    boxShadow: "0 0 10px rgba(255, 0, 0, 0.8), 0 0 20px rgba(255, 0, 0, 0.6)",
                                },
                                caption: {
                                    color: "red",
                                    backgroundColor: "black",
                                    boxShadow: "0 0 10px rgba(255, 0, 0, 0.8), 0 0 20px rgba(255, 0, 0, 0.6)",
                                },
                                button_reset: {
                                    textShadow: `0 0 5px #fff, 
                                                                             0 0 10px #fff, 
                                                                             0 0 20px #ff0099, 
                                                                             0 0 40px #ff0099, 
                                                                             0 0 80px #ff0099`,
                                    color: "#fff"
                                },
                                button: {
                                    textShadow: `0 0 5px #fff, 
                                                                             0 0 10px #fff, 
                                                                             0 0 20px #ff0099, 
                                                                             0 0 40px #ff0099, 
                                                                             0 0 80px #ff0099`,
                                    color: "#fff"
                                },
                                tbody: {
                                    color: "red",
                                    boxShadow: "0 0 10px rgba(255, 0, 0, 0.8), 0 0 20px rgba(255, 0, 0, 0.6)",

                                },
                                dropdown_month: {
                                    flex: "1 1 0",
                                    width: "auto",
                                    minWidth: "0",
                                    maxWidth: "100%",
                                    padding: "0.5rem",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "0.375rem",
                                    backgroundColor: "black",
                                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                                    color: "white",
                                    fontSize: "0.875rem",
                                    lineHeight: "1.25rem",
                                    appearance: "none",
                                    display: "block",
                                    textShadow: `0 0 5px #fff, 
                                                                             0 0 10px #fff, 
                                                                             0 0 20px #ff0099, 
                                                                             0 0 40px #ff0099, 
                                                                             0 0 80px #ff0099`,
                                },
                                dropdown: {
                                    accentColor: "red",
                                    color: "white",
                                    backgroundColor: "black",
                                    textShadow: `0 0 5px #fff, 
                                                                0 0 10px #fff, 
                                                                0 0 20px #ff0099, 
                                                                0 0 40px #ff0099, 
                                                                0 0 80px #ff0099`,
                                },
                                dropdown_year: {
                                    flex: "1 1 0",
                                    width: "auto",
                                    minWidth: "0",
                                    maxWidth: "100%",
                                    padding: "0.5rem",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "0.375rem",
                                    backgroundColor: "black", boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                                    color: "white",
                                    fontSize: "0.875rem",
                                    lineHeight: "1.25rem",
                                    appearance: "none",
                                    display: "block",
                                    textShadow: `0 0 5px #fff, 
                                                                             0 0 10px #fff, 
                                                                             0 0 20px #ff0099, 
                                                                             0 0 40px #ff0099, 
                                                                             0 0 80px #ff0099`,
                                },
                            }}
                        />
                    </PopoverContent>
                </Popover></>
        )
    }
}) 
