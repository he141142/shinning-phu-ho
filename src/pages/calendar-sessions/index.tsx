import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/drake_libs/ui/button";
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Calendar as CalendarIcon,
    Clock,
    Grid3x3,
    List,
    Search,
    Settings,
    Download,
    Filter,
    MoreVertical
} from "lucide-react";
import { Input } from "@/components/drake_libs/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/drake_libs/ui/tabs";
import { WeekView } from "./components/WeekView";
import { MonthView } from "./components/MonthView";
import { DayView } from "./components/DayView";
import { CreateSessionFromCalendar } from "./components/CreateSessionFromCalendar";
import { SessionDetailSidebar } from "./components/SessionDetailSidebar";
import { Session } from "@/models/session/session";
import { Badge } from "@/components/drake_libs/ui/badge";

export default function CalendarSessionsPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<"day" | "week" | "month">("week");
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);
    const [createSessionOpen, setCreateSessionOpen] = useState(false);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ date: Date; time: string } | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Generate dates for current week
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    // Initial mock sessions data with current dates
    const initialSessions: Session[] = [
        {
            id: 1,
            class_id: 1,
            date: formatDate(today),
            topic: "Introduction to React Hooks",
            notes: "Cover useState, useEffect, and custom hooks",
            time_slot_id: 1,
            time_slot: {
                id: 1,
                slot_name: "Morning Session",
                start_time: `${formatDate(today)}T08:00:00`,
                end_time: `${formatDate(today)}T10:00:00`,
                duration_mins: 120,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            id: 2,
            class_id: 1,
            date: formatDate(tomorrow),
            topic: "Advanced State Management",
            notes: "Redux, Context API, and Zustand",
            time_slot_id: 2,
            time_slot: {
                id: 2,
                slot_name: "Afternoon Session",
                start_time: `${formatDate(tomorrow)}T13:00:00`,
                end_time: `${formatDate(tomorrow)}T15:30:00`,
                duration_mins: 150,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            id: 3,
            class_id: 2,
            date: formatDate(today),
            topic: "Python Fundamentals",
            notes: "Variables, loops, and functions",
            time_slot_id: 3,
            time_slot: {
                id: 3,
                slot_name: "Evening Session",
                start_time: `${formatDate(today)}T17:00:00`,
                end_time: `${formatDate(today)}T19:00:00`,
                duration_mins: 120,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
    ];

    // State for sessions
    const [sessions, setSessions] = useState<Session[]>(initialSessions);

    // Add new session handler
    const handleCreateSession = (newSession: Omit<Session, 'id' | 'created_at' | 'updated_at'>) => {
        const session: Session = {
            ...newSession,
            id: sessions.length + 1, // Generate new ID
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        setSessions([...sessions, session]);
    };

    // Update session handler
    const handleUpdateSession = (updatedSession: Session) => {
        setSessions(sessions.map(s =>
            s.id === updatedSession.id
                ? { ...updatedSession, updated_at: new Date().toISOString() }
                : s
        ));
        setSelectedSession(updatedSession);
    };

    // Delete session handler
    const handleDeleteSession = (sessionId: number) => {
        setSessions(sessions.filter(s => s.id !== sessionId));
        setSidebarOpen(false);
        setSelectedSession(null);
    };

    const navigatePrevious = () => {
        const newDate = new Date(currentDate);
        if (viewMode === "day") {
            newDate.setDate(newDate.getDate() - 1);
        } else if (viewMode === "week") {
            newDate.setDate(newDate.getDate() - 7);
        } else {
            newDate.setMonth(newDate.getMonth() - 1);
        }
        setCurrentDate(newDate);
    };

    const navigateNext = () => {
        const newDate = new Date(currentDate);
        if (viewMode === "day") {
            newDate.setDate(newDate.getDate() + 1);
        } else if (viewMode === "week") {
            newDate.setDate(newDate.getDate() + 7);
        } else {
            newDate.setMonth(newDate.getMonth() + 1);
        }
        setCurrentDate(newDate);
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const handleTimeSlotClick = (date: Date, time: string) => {
        setSelectedTimeSlot({ date, time });
        setCreateSessionOpen(true);
    };

    const handleSessionClick = (session: Session) => {
        setSelectedSession(session);
        setSidebarOpen(true);
    };

    const getDateRangeText = () => {
        if (viewMode === "day") {
            return currentDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } else if (viewMode === "week") {
            const startOfWeek = new Date(currentDate);
            startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
        } else {
            return currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <div className="border-b bg-white sticky top-0 z-40">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between mb-4">
                        {/* Left Section */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                    <CalendarIcon className="w-6 h-6 text-white" />
                                </div>
                                <h1 className="text-2xl font-semibold text-gray-900">Calendar</h1>
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Search sessions..."
                                    className="pl-9 w-64 h-9 border-gray-300"
                                />
                            </div>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Filter className="w-4 h-4" />
                                Filter
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Download className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Settings className="w-4 h-4" />
                            </Button>
                            <Button
                                onClick={() => setCreateSessionOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                                size="sm"
                            >
                                <Plus className="w-4 h-4" />
                                Create
                            </Button>
                        </div>
                    </div>

                    {/* Controls Bar */}
                    <div className="flex items-center justify-between">
                        {/* Navigation Controls */}
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={goToToday}
                                variant="outline"
                                size="sm"
                                className="font-medium"
                            >
                                Today
                            </Button>
                            <div className="flex items-center gap-1">
                                <Button
                                    onClick={navigatePrevious}
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </Button>
                                <Button
                                    onClick={navigateNext}
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </Button>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 min-w-[300px]">
                                {getDateRangeText()}
                            </h2>
                        </div>

                        {/* View Mode Tabs */}
                        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="w-auto">
                            <TabsList className="bg-gray-100">
                                <TabsTrigger value="day" className="gap-2">
                                    <Clock className="w-4 h-4" />
                                    Day
                                </TabsTrigger>
                                <TabsTrigger value="week" className="gap-2">
                                    <Grid3x3 className="w-4 h-4" />
                                    Week
                                </TabsTrigger>
                                <TabsTrigger value="month" className="gap-2">
                                    <CalendarIcon className="w-4 h-4" />
                                    Month
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </div>

                {/* Mini Stats Bar */}
                <div className="px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-b">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Badge className="bg-blue-100 text-blue-700 border-none">
                                {sessions.length} Total Sessions
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span className="text-sm text-gray-600">Upcoming</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <span className="text-sm text-gray-600">In Progress</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gray-400" />
                            <span className="text-sm text-gray-600">Completed</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Calendar View */}
            <div className="flex-1 overflow-hidden">
                <motion.div
                    key={viewMode}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                >
                    {viewMode === "day" && (
                        <DayView
                            currentDate={currentDate}
                            sessions={sessions}
                            onTimeSlotClick={handleTimeSlotClick}
                            onSessionClick={handleSessionClick}
                        />
                    )}
                    {viewMode === "week" && (
                        <WeekView
                            currentDate={currentDate}
                            sessions={sessions}
                            onTimeSlotClick={handleTimeSlotClick}
                            onSessionClick={handleSessionClick}
                        />
                    )}
                    {viewMode === "month" && (
                        <MonthView
                            currentDate={currentDate}
                            sessions={sessions}
                            onSessionClick={handleSessionClick}
                        />
                    )}
                </motion.div>
            </div>

            {/* Create Session Modal */}
            <CreateSessionFromCalendar
                open={createSessionOpen}
                onOpenChange={setCreateSessionOpen}
                initialDate={selectedTimeSlot?.date}
                initialTime={selectedTimeSlot?.time}
                onCreateSession={handleCreateSession}
            />

            {/* Session Detail Sidebar */}
            <SessionDetailSidebar
                open={sidebarOpen}
                onOpenChange={setSidebarOpen}
                session={selectedSession}
                onUpdateSession={handleUpdateSession}
                onDeleteSession={handleDeleteSession}
            />
        </div>
    );
}
