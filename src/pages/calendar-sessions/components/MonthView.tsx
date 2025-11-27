import React from "react";
import { motion } from "framer-motion";
import { Session } from "@/models/session/session";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface MonthViewProps {
    currentDate: Date;
    sessions: Session[];
    onSessionClick: (session: Session) => void;
}

export const MonthView: React.FC<MonthViewProps> = ({
    currentDate,
    sessions,
    onSessionClick
}) => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const daysInPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const getSessionsForDate = (day: number, month: number, year: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return sessions.filter(session => session.date === dateStr);
    };

    const getSessionColor = (classId: number) => {
        const colors = [
            'bg-blue-500',
            'bg-purple-500',
            'bg-green-500',
            'bg-orange-500',
            'bg-pink-500'
        ];
        return colors[(classId - 1) % colors.length];
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const isToday = (day: number) => {
        const today = new Date();
        return day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear();
    };

    const renderCalendarDays = () => {
        const days = [];

        // Previous month days
        const prevMonthDays = firstDayOfMonth;
        for (let i = prevMonthDays - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            days.push(
                <div
                    key={`prev-${day}`}
                    className="min-h-[120px] p-2 bg-gray-50 border-r border-b"
                >
                    <div className="text-sm text-gray-400 font-medium">{day}</div>
                </div>
            );
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const today = isToday(day);
            const daySessions = getSessionsForDate(day, currentDate.getMonth(), currentDate.getFullYear());

            days.push(
                <motion.div
                    key={day}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: day * 0.005 }}
                    className={cn(
                        "min-h-[120px] p-2 border-r border-b transition-colors",
                        today ? "bg-blue-50" : "bg-white hover:bg-gray-50"
                    )}
                >
                    <div className={cn(
                        "text-sm font-semibold mb-2",
                        today
                            ? "w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center"
                            : "text-gray-700"
                    )}>
                        {day}
                    </div>

                    {/* Session list */}
                    <div className="space-y-1">
                        {daySessions.slice(0, 3).map((session, index) => (
                            <motion.div
                                key={session.id}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => onSessionClick(session)}
                                className={cn(
                                    "text-xs p-1.5 rounded cursor-pointer text-white truncate transition-all hover:shadow-md",
                                    getSessionColor(session.class_id)
                                )}
                            >
                                <div className="font-medium truncate flex items-center gap-1">
                                    {session.time_slot && (
                                        <Clock className="w-3 h-3 flex-shrink-0" />
                                    )}
                                    {session.time_slot && formatTime(session.time_slot.start_time)}
                                </div>
                                <div className="truncate opacity-90">{session.topic}</div>
                            </motion.div>
                        ))}

                        {/* Show more indicator */}
                        {daySessions.length > 3 && (
                            <div className="text-xs text-gray-500 font-medium px-1.5 py-1">
                                +{daySessions.length - 3} more
                            </div>
                        )}
                    </div>
                </motion.div>
            );
        }

        // Next month days to fill the grid
        const totalCells = days.length;
        const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);

        for (let i = 1; i <= remainingCells; i++) {
            days.push(
                <div
                    key={`next-${i}`}
                    className="min-h-[120px] p-2 bg-gray-50 border-r border-b"
                >
                    <div className="text-sm text-gray-400 font-medium">{i}</div>
                </div>
            );
        }

        return days;
    };

    return (
        <div className="h-full flex flex-col bg-white overflow-auto">
            {/* Day headers */}
            <div className="grid grid-cols-7 border-b sticky top-0 bg-white z-20">
                {dayNames.map((day) => (
                    <div
                        key={day}
                        className="p-3 text-center font-semibold text-sm text-gray-700 border-r last:border-r-0 bg-gray-50"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 flex-1">
                {renderCalendarDays()}
            </div>
        </div>
    );
};
