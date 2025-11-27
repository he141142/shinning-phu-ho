import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Session } from "@/models/session/session";
import { cn } from "@/lib/utils";

interface WeekViewProps {
    currentDate: Date;
    sessions: Session[];
    onTimeSlotClick: (date: Date, time: string) => void;
    onSessionClick: (session: Session) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({
    currentDate,
    sessions,
    onTimeSlotClick,
    onSessionClick
}) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Scroll to 8 AM on mount
    useEffect(() => {
        if (scrollContainerRef.current) {
            const eightAM = 8 * 60; // 8 hours * 60 pixels per hour
            scrollContainerRef.current.scrollTop = eightAM - 100;
        }
    }, []);

    // Get week days
    const getWeekDays = () => {
        const days = [];
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            days.push(day);
        }
        return days;
    };

    const weekDays = getWeekDays();

    // Generate time slots (24 hours)
    const timeSlots = Array.from({ length: 24 }, (_, i) => {
        const hour = i;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return {
            hour,
            label: `${displayHour} ${ampm}`,
            time: `${String(hour).padStart(2, '0')}:00`
        };
    });

    // Get sessions for a specific day
    const getSessionsForDay = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        return sessions.filter(session => session.date === dateStr);
    };

    // Calculate session position and height
    const getSessionStyle = (session: Session) => {
        if (!session.time_slot) return { top: 0, height: 0 };

        const startTime = new Date(session.time_slot.start_time);
        const endTime = new Date(session.time_slot.end_time);

        const startMinutes = startTime.getHours() * 60 + startTime.getMinutes();
        const endMinutes = endTime.getHours() * 60 + endTime.getMinutes();
        const duration = endMinutes - startMinutes;

        return {
            top: startMinutes,
            height: duration
        };
    };

    // Get color for session based on class_id
    const getSessionColor = (classId: number) => {
        const colors = [
            { bg: 'bg-blue-500', border: 'border-blue-600', text: 'text-blue-50' },
            { bg: 'bg-purple-500', border: 'border-purple-600', text: 'text-purple-50' },
            { bg: 'bg-green-500', border: 'border-green-600', text: 'text-green-50' },
            { bg: 'bg-orange-500', border: 'border-orange-600', text: 'text-orange-50' },
            { bg: 'bg-pink-500', border: 'border-pink-600', text: 'text-pink-50' }
        ];
        return colors[(classId - 1) % colors.length];
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Week Header */}
            <div className="flex border-b bg-white sticky top-0 z-30">
                {/* Time column header */}
                <div className="w-20 flex-shrink-0 border-r bg-gray-50" />

                {/* Day headers */}
                <div className="flex-1 grid grid-cols-7">
                    {weekDays.map((day, index) => {
                        const today = isToday(day);
                        return (
                            <div
                                key={index}
                                className={cn(
                                    "border-r last:border-r-0 py-3 text-center",
                                    today ? "bg-blue-50" : "bg-white"
                                )}
                            >
                                <div className={cn(
                                    "text-xs font-medium uppercase",
                                    today ? "text-blue-600" : "text-gray-500"
                                )}>
                                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                                </div>
                                <div className={cn(
                                    "mt-1 w-10 h-10 mx-auto rounded-full flex items-center justify-center text-sm font-semibold",
                                    today
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-900"
                                )}>
                                    {day.getDate()}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Calendar Grid */}
            <div
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto overflow-x-hidden"
            >
                <div className="flex relative">
                    {/* Time labels */}
                    <div className="w-20 flex-shrink-0 border-r bg-gray-50">
                        {timeSlots.map((slot, index) => (
                            <div
                                key={index}
                                className="h-[60px] border-b text-xs text-gray-500 pr-2 text-right pt-1"
                            >
                                {index > 0 && slot.label}
                            </div>
                        ))}
                    </div>

                    {/* Days grid */}
                    <div className="flex-1 grid grid-cols-7 relative">
                        {weekDays.map((day, dayIndex) => {
                            const daySessions = getSessionsForDay(day);
                            const today = isToday(day);

                            return (
                                <div
                                    key={dayIndex}
                                    className={cn(
                                        "border-r last:border-r-0 relative",
                                        today ? "bg-blue-50/30" : "bg-white"
                                    )}
                                >
                                    {/* Time slot grid */}
                                    {timeSlots.map((slot, slotIndex) => (
                                        <div
                                            key={slotIndex}
                                            className="h-[60px] border-b hover:bg-blue-50 cursor-pointer transition-colors group"
                                            onClick={() => onTimeSlotClick(day, slot.time)}
                                        >
                                            <div className="opacity-0 group-hover:opacity-100 text-xs text-blue-600 p-1 transition-opacity">
                                                + Add
                                            </div>
                                        </div>
                                    ))}

                                    {/* Current time indicator */}
                                    {today && (() => {
                                        const now = new Date();
                                        const currentMinutes = now.getHours() * 60 + now.getMinutes();
                                        return (
                                            <div
                                                className="absolute left-0 right-0 z-20 pointer-events-none"
                                                style={{ top: `${currentMinutes}px` }}
                                            >
                                                <div className="relative">
                                                    <div className="absolute -left-1 w-3 h-3 bg-red-500 rounded-full" />
                                                    <div className="h-0.5 bg-red-500" />
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    {/* Session events */}
                                    {daySessions.map((session) => {
                                        const style = getSessionStyle(session);
                                        const colors = getSessionColor(session.class_id);

                                        return (
                                            <motion.div
                                                key={session.id}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className={cn(
                                                    "absolute left-1 right-1 rounded-lg border-l-4 shadow-md cursor-pointer z-10 overflow-hidden",
                                                    colors.bg,
                                                    colors.border,
                                                    "hover:shadow-lg transition-shadow"
                                                )}
                                                style={{
                                                    top: `${style.top}px`,
                                                    height: `${style.height}px`,
                                                    minHeight: '40px'
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onSessionClick(session);
                                                }}
                                            >
                                                <div className={cn("p-2 h-full", colors.text)}>
                                                    <div className="font-semibold text-sm line-clamp-1">
                                                        {session.topic}
                                                    </div>
                                                    {session.time_slot && (
                                                        <div className="text-xs opacity-90 mt-0.5">
                                                            {formatTime(session.time_slot.start_time)}
                                                        </div>
                                                    )}
                                                    {style.height > 60 && session.notes && (
                                                        <div className="text-xs opacity-80 mt-1 line-clamp-2">
                                                            {session.notes}
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            );
                        })}

                        {/* All-day line separator */}
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-200" />
                    </div>
                </div>
            </div>
        </div>
    );
};
