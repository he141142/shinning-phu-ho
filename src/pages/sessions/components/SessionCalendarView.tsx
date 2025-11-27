import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/drake_libs/ui/card";
import { Button } from "@/components/drake_libs/ui/button";
import { ChevronLeft, ChevronRight, Clock, Edit2, Trash2 } from "lucide-react";
import { Session } from "@/models/session/session";
import { Badge } from "@/components/drake_libs/ui/badge";

interface SessionCalendarViewProps {
    sessions: Session[];
    currentMonth: Date;
    onMonthChange: (date: Date) => void;
    onEditSession: (session: Session) => void;
    onDeleteSession: (session: Session) => void;
}

export const SessionCalendarView: React.FC<SessionCalendarViewProps> = ({
    sessions,
    currentMonth,
    onMonthChange,
    onEditSession,
    onDeleteSession
}) => {
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const previousMonth = () => {
        const newDate = new Date(currentMonth);
        newDate.setMonth(newDate.getMonth() - 1);
        onMonthChange(newDate);
    };

    const nextMonth = () => {
        const newDate = new Date(currentMonth);
        newDate.setMonth(newDate.getMonth() + 1);
        onMonthChange(newDate);
    };

    const getSessionsForDate = (day: number) => {
        const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return sessions.filter(session => session.date === dateStr);
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const renderCalendarDays = () => {
        const days = [];

        // Empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(
                <div key={`empty-${i}`} className="min-h-[120px] bg-gray-50 rounded-lg" />
            );
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const sessionsForDay = getSessionsForDate(day);
            const isToday = new Date().toDateString() === new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString();

            days.push(
                <motion.div
                    key={day}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: day * 0.01 }}
                    className={`min-h-[120px] p-2 rounded-lg border-2 ${
                        isToday
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 bg-white hover:border-purple-300'
                    } transition-all duration-200`}
                >
                    <div className={`text-sm font-semibold mb-2 ${
                        isToday ? 'text-purple-700' : 'text-gray-700'
                    }`}>
                        {day}
                        {isToday && (
                            <Badge className="ml-2 text-[10px] bg-purple-600 border-none">Today</Badge>
                        )}
                    </div>
                    <div className="space-y-1">
                        {sessionsForDay.map((session) => (
                            <div
                                key={session.id}
                                className="group relative p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded text-white text-xs hover:shadow-lg transition-all duration-200 cursor-pointer"
                            >
                                <div className="font-semibold line-clamp-1 mb-1">
                                    {session.topic}
                                </div>
                                {session.time_slot && (
                                    <div className="flex items-center gap-1 text-[10px] opacity-90">
                                        <Clock className="w-3 h-3" />
                                        {formatTime(session.time_slot.start_time)}
                                    </div>
                                )}

                                {/* Hover Actions */}
                                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded flex items-center justify-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 px-2 text-white hover:bg-white/20"
                                        onClick={() => onEditSession(session)}
                                    >
                                        <Edit2 className="w-3 h-3" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 px-2 text-white hover:bg-red-500/50"
                                        onClick={() => onDeleteSession(session)}
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            );
        }

        return days;
    };

    return (
        <Card className="border-none shadow-lg">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </CardTitle>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={previousMonth}
                            className="h-9 w-9 p-0"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={nextMonth}
                            className="h-9 w-9 p-0"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                    {dayNames.map((day) => (
                        <div
                            key={day}
                            className="text-center font-semibold text-sm text-gray-600 py-2"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                    {renderCalendarDays()}
                </div>

                {/* Legend */}
                <div className="mt-6 pt-4 border-t flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-gradient-to-r from-purple-500 to-pink-500" />
                        <span className="text-gray-600">Scheduled Session</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded border-2 border-purple-500 bg-purple-50" />
                        <span className="text-gray-600">Today</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
