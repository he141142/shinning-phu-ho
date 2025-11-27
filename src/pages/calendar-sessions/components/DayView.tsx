import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Session } from "@/models/session/session";
import { cn } from "@/lib/utils";

interface DayViewProps {
    currentDate: Date;
    sessions: Session[];
    onTimeSlotClick: (date: Date, time: string) => void;
    onSessionClick: (session: Session) => void;
}

export const DayView: React.FC<DayViewProps> = ({
    currentDate,
    sessions,
    onTimeSlotClick,
    onSessionClick
}) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollContainerRef.current) {
            const eightAM = 8 * 80; // 8 hours * 80 pixels per hour (larger for day view)
            scrollContainerRef.current.scrollTop = eightAM - 100;
        }
    }, []);

    const timeSlots = Array.from({ length: 24 }, (_, i) => {
        const hour = i;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return {
            hour,
            label: `${displayHour}:00 ${ampm}`,
            time: `${String(hour).padStart(2, '0')}:00`
        };
    });

    const getSessionsForDay = () => {
        const dateStr = currentDate.toISOString().split('T')[0];
        return sessions.filter(session => session.date === dateStr);
    };

    const getSessionStyle = (session: Session) => {
        if (!session.time_slot) return { top: 0, height: 0 };

        const startTime = new Date(session.time_slot.start_time);
        const endTime = new Date(session.time_slot.end_time);

        const startMinutes = startTime.getHours() * 60 + startTime.getMinutes();
        const endMinutes = endTime.getHours() * 60 + endTime.getMinutes();
        const duration = endMinutes - startMinutes;

        // Larger scale for day view
        return {
            top: (startMinutes / 60) * 80,
            height: (duration / 60) * 80
        };
    };

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

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const daySessions = getSessionsForDay();
    const isToday = currentDate.toDateString() === new Date().toDateString();

    return (
        <div className="h-full flex bg-white">
            {/* Time column */}
            <div className="w-24 flex-shrink-0 border-r bg-gray-50">
                <div className="h-16 border-b" /> {/* Header spacer */}
                {timeSlots.map((slot, index) => (
                    <div
                        key={index}
                        className="h-20 border-b text-sm text-gray-600 pr-3 text-right pt-1 font-medium"
                    >
                        {slot.label}
                    </div>
                ))}
            </div>

            {/* Day column */}
            <div
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto overflow-x-hidden"
            >
                {/* Header */}
                <div className={cn(
                    "h-16 border-b sticky top-0 z-20 flex items-center justify-center",
                    isToday ? "bg-blue-50" : "bg-white"
                )}>
                    <div className="text-center">
                        <div className={cn(
                            "text-sm font-medium uppercase mb-1",
                            isToday ? "text-blue-600" : "text-gray-500"
                        )}>
                            {currentDate.toLocaleDateString('en-US', { weekday: 'long' })}
                        </div>
                        <div className={cn(
                            "w-12 h-12 mx-auto rounded-full flex items-center justify-center text-lg font-semibold",
                            isToday ? "bg-blue-600 text-white" : "text-gray-900"
                        )}>
                            {currentDate.getDate()}
                        </div>
                    </div>
                </div>

                {/* Time grid */}
                <div className="relative">
                    {timeSlots.map((slot, index) => (
                        <div
                            key={index}
                            className="h-20 border-b hover:bg-blue-50 cursor-pointer transition-colors group relative"
                            onClick={() => onTimeSlotClick(currentDate, slot.time)}
                        >
                            {/* 30-minute line */}
                            <div className="absolute top-10 left-0 right-0 border-t border-dashed border-gray-200" />

                            <div className="opacity-0 group-hover:opacity-100 text-sm text-blue-600 p-2 font-medium transition-opacity">
                                + Create session
                            </div>
                        </div>
                    ))}

                    {/* Current time indicator */}
                    {isToday && (() => {
                        const now = new Date();
                        const currentMinutes = now.getHours() * 60 + now.getMinutes();
                        const topPosition = (currentMinutes / 60) * 80;
                        return (
                            <div
                                className="absolute left-0 right-0 z-30 pointer-events-none"
                                style={{ top: `${topPosition}px` }}
                            >
                                <div className="relative">
                                    <div className="absolute -left-1 w-3 h-3 bg-red-500 rounded-full shadow-lg" />
                                    <div className="h-0.5 bg-red-500 shadow-md" />
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
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={cn(
                                    "absolute left-2 right-2 rounded-lg border-l-4 shadow-lg cursor-pointer z-20 overflow-hidden",
                                    colors.bg,
                                    colors.border,
                                    "hover:shadow-xl hover:scale-[1.02] transition-all"
                                )}
                                style={{
                                    top: `${style.top}px`,
                                    height: `${style.height}px`,
                                    minHeight: '60px'
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSessionClick(session);
                                }}
                            >
                                <div className={cn("p-4 h-full", colors.text)}>
                                    <div className="font-bold text-lg mb-1">
                                        {session.topic}
                                    </div>
                                    {session.time_slot && (
                                        <div className="text-sm opacity-90 font-medium mb-2">
                                            {formatTime(session.time_slot.start_time)} - {formatTime(session.time_slot.end_time)}
                                        </div>
                                    )}
                                    {session.notes && (
                                        <div className="text-sm opacity-80 line-clamp-3">
                                            {session.notes}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
