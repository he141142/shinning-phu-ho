import { CalendarIcon } from "@/components/drake_libs/component/home-page";
import { Button } from "@/components/drake_libs/ui/button";
import { Calendar } from "@/components/drake_libs/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/drake_libs/ui/popover";
import { cn } from "@/lib/utils";
import React from "react";

import { format } from "date-fns"
import { Clock, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DateTimePickerData {
    Display: string;
    OnSelect?: (date: Date) => void;
    defaultValue?: Date;
    showTime?: boolean;
    placeholder?: string;
    className?: string;
    canEdit?: boolean;
    value?: Date;
}

export const ShiDateTimePicker: React.FC<DateTimePickerData> = React.memo(({
    Display,
    OnSelect,
    defaultValue,
    showTime = false,
    placeholder,
    className,
    canEdit = true,
    value
}) => {
    const [date, setDate] = React.useState<Date | undefined>(value || defaultValue);
    const [open, setOpen] = React.useState(false);

    // Update internal date when value prop changes
    React.useEffect(() => {
        console.log("firt render");
        
        if (value !== undefined) {
            setDate(value);
        }

        () => {
            console.log("unmounteddd");
            
        }
    }, [value]);
    const [hours, setHours] = React.useState<number>(defaultValue?.getHours() || 12);
    const [minutes, setMinutes] = React.useState<number>(defaultValue?.getMinutes() || 0);
    const [period, setPeriod] = React.useState<'AM' | 'PM'>(
        defaultValue ? (defaultValue.getHours() >= 12 ? 'PM' : 'AM') : 'AM'
    );

    const onSelectDate = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            const newDate = new Date(selectedDate);
            if (showTime) {
                const hour24 = period === 'PM' && hours !== 12 ? hours + 12 : (period === 'AM' && hours === 12 ? 0 : hours);
                newDate.setHours(hour24, minutes);
            }
            setDate(newDate);
            if (OnSelect) {
                OnSelect(newDate);
            }
        }
    };

    const handleTimeChange = (type: 'hour' | 'minute' | 'period', value: number | string) => {
        let newDate = date || new Date();

        if (type === 'hour') {
            setHours(value as number);
            const hour24 = period === 'PM' && value !== 12 ? (value as number) + 12 : (period === 'AM' && value === 12 ? 0 : value as number);
            newDate.setHours(hour24);
        } else if (type === 'minute') {
            setMinutes(value as number);
            newDate.setMinutes(value as number);
        } else if (type === 'period') {
            setPeriod(value as 'AM' | 'PM');
            const currentHour24 = newDate.getHours();
            if (value === 'PM' && currentHour24 < 12) {
                newDate.setHours(currentHour24 + 12);
            } else if (value === 'AM' && currentHour24 >= 12) {
                newDate.setHours(currentHour24 - 12);
            }
        }

        setDate(newDate);
        if (OnSelect) {
            OnSelect(newDate);
        }
    };

    const clearDate = (e: React.MouseEvent) => {
        e.stopPropagation();
        setDate(undefined);
        setHours(12);
        setMinutes(0);
        setPeriod('AM');
    };

    const formatDateTime = (date: Date) => {
        if (showTime) {
            return format(date, "PPP 'at' h:mm a");
        }
        return format(date, "PPP");
    };

    return (
        <div className={cn("space-y-2", className)}>
            <motion.div
                className="font-medium text-sm bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {Display}
            </motion.div>
            <Popover open={open} onOpenChange={canEdit ? setOpen : undefined}>
                <PopoverTrigger asChild disabled={!canEdit}>
                     <Button
                            variant={"outline"}
                            disabled={!canEdit}
                            className={cn(
                                "w-full sm:w-[320px] justify-between text-left font-normal group",
                                canEdit && "hover:border-purple-400 hover:shadow-lg hover:shadow-purple-100 dark:hover:shadow-purple-900/20",
                                "transition-all duration-300 ease-in-out",
                                "bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800",
                                !date && "text-muted-foreground",
                                !canEdit && "cursor-not-allowed opacity-70"
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <motion.div
                                    animate={{ rotate: open ? 360 : 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <CalendarIcon className={cn(
                                        "h-4 w-4 transition-colors duration-300",
                                        date ? "text-purple-600" : "text-gray-400"
                                    )} />
                                </motion.div>
                                <span className={cn(
                                    "truncate",
                                    date && "bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-semibold"
                                )}>
                                    {date ? formatDateTime(date) : <span>{placeholder || `Pick a ${Display}`}</span>}
                                </span>
                            </div>
                            {date && canEdit && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                >
                                    <X
                                        className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                                        onClick={clearDate}
                                    />
                                </motion.div>
                            )}
                        </Button>
                    {/* <motion.div whileHover={canEdit ? { scale: 1.02 } : {}} whileTap={canEdit ? { scale: 0.98 } : {}}>
                        <Button
                            variant={"outline"}
                            disabled={!canEdit}
                            className={cn(
                                "w-full sm:w-[320px] justify-between text-left font-normal group",
                                canEdit && "hover:border-purple-400 hover:shadow-lg hover:shadow-purple-100 dark:hover:shadow-purple-900/20",
                                "transition-all duration-300 ease-in-out",
                                "bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800",
                                !date && "text-muted-foreground",
                                !canEdit && "cursor-not-allowed opacity-70"
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <motion.div
                                    animate={{ rotate: open ? 360 : 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <CalendarIcon className={cn(
                                        "h-4 w-4 transition-colors duration-300",
                                        date ? "text-purple-600" : "text-gray-400"
                                    )} />
                                </motion.div>
                                <span className={cn(
                                    "truncate",
                                    date && "bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-semibold"
                                )}>
                                    {date ? formatDateTime(date) : <span>{placeholder || `Pick a ${Display}`}</span>}
                                </span>
                            </div>
                            {date && canEdit && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                >
                                    <X
                                        className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                                        onClick={clearDate}
                                    />
                                </motion.div>
                            )}
                        </Button>
                    </motion.div> */}
                </PopoverTrigger>
                <PopoverContent
                    className={cn(
                        "w-auto p-0 shadow-2xl border-purple-200 dark:border-purple-800",
                        "bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30",
                        "dark:from-gray-900 dark:via-purple-900/10 dark:to-blue-900/10"
                    )}
                    align="start"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="p-3">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={canEdit ? onSelectDate : undefined}
                                    initialFocus
                                    className="rounded-lg"
                                    canEdit={canEdit}
                                />
                            </div>

                            
                            {!canEdit && (
                                <div className="p-4 text-center text-sm text-gray-500 border-t border-gray-200">
                                    <p>View-only mode. Editing is disabled.</p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </PopoverContent>
            </Popover>
        </div>
    )
});