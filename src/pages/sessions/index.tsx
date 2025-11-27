import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/drake_libs/ui/card";
import { Button } from "@/components/drake_libs/ui/button";
import {
    Calendar,
    Plus,
    Edit2,
    Trash2,
    Clock,
    BookOpen,
    FileText,
    Search,
    Filter,
    Grid,
    List,
    ChevronLeft,
    ChevronRight,
    Download,
    Users,
    TrendingUp
} from "lucide-react";
import { Session } from "@/models/session/session";
import { Badge } from "@/components/drake_libs/ui/badge";
import { Input } from "@/components/drake_libs/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/drake_libs/ui/tabs";
import { CreateSessionModal } from "./components/CreateSessionModal";
import { EditSessionModal } from "./components/EditSessionModal";
import { DeleteSessionDialog } from "./components/DeleteSessionDialog";
import { SessionCalendarView } from "./components/SessionCalendarView";

export default function SessionsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list" | "calendar">("grid");
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Mock data - replace with actual API call
    const sessions: Session[] = [
        {
            id: 1,
            class_id: 1,
            date: "2024-01-15",
            topic: "Introduction to React Hooks",
            notes: "Cover useState, useEffect, and custom hooks",
            time_slot_id: 1,
            time_slot: {
                id: 1,
                slot_name: "Morning Session",
                start_time: "2024-01-01T08:00:00",
                end_time: "2024-01-01T10:00:00",
                duration_mins: 120,
                created_at: "2024-01-01T00:00:00",
                updated_at: "2024-01-01T00:00:00"
            },
            created_at: "2024-01-01T00:00:00",
            updated_at: "2024-01-01T00:00:00"
        },
        {
            id: 2,
            class_id: 1,
            date: "2024-01-16",
            topic: "Advanced State Management",
            notes: "Redux, Context API, and Zustand comparison",
            time_slot_id: 2,
            time_slot: {
                id: 2,
                slot_name: "Afternoon Session",
                start_time: "2024-01-01T13:00:00",
                end_time: "2024-01-01T15:30:00",
                duration_mins: 150,
                created_at: "2024-01-01T00:00:00",
                updated_at: "2024-01-01T00:00:00"
            },
            created_at: "2024-01-01T00:00:00",
            updated_at: "2024-01-01T00:00:00"
        }
    ];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const handleEdit = (session: Session) => {
        setSelectedSession(session);
        setEditModalOpen(true);
    };

    const handleDelete = (session: Session) => {
        setSelectedSession(session);
        setDeleteDialogOpen(true);
    };

    const filteredSessions = sessions.filter(session =>
        session.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.notes.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getTopicColor = (index: number) => {
        const colors = [
            "from-blue-500 to-cyan-500",
            "from-purple-500 to-pink-500",
            "from-orange-500 to-red-500",
            "from-green-500 to-emerald-500",
            "from-indigo-500 to-blue-500"
        ];
        return colors[index % colors.length];
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                                Session Management
                            </h1>
                            <p className="text-gray-600 mt-2">Organize and track your class sessions</p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" className="gap-2">
                                <Download className="w-4 h-4" />
                                Export Sessions
                            </Button>
                            <Button
                                onClick={() => setCreateModalOpen(true)}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white gap-2 shadow-lg"
                            >
                                <Plus className="w-4 h-4" />
                                Create Session
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-6"
                >
                    <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-blue-100 font-medium">Total Sessions</p>
                                    <p className="text-3xl font-bold mt-1">{sessions.length}</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                    <Calendar className="w-6 h-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-purple-100 font-medium">This Month</p>
                                    <p className="text-3xl font-bold mt-1">12</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-500 to-red-500 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-orange-100 font-medium">Upcoming</p>
                                    <p className="text-3xl font-bold mt-1">8</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                    <Clock className="w-6 h-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-green-100 font-medium">Completed</p>
                                    <p className="text-3xl font-bold mt-1">24</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Controls */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex gap-4 items-center"
                >
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            placeholder="Search sessions by topic or notes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-12 border-gray-200 focus:border-purple-500 transition-colors"
                        />
                    </div>
                    <Button variant="outline" className="h-12 gap-2">
                        <Filter className="w-4 h-4" />
                        Filters
                    </Button>
                    <div className="flex gap-2 border rounded-lg p-1 bg-white">
                        <Button
                            variant={viewMode === "grid" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("grid")}
                            className="h-9"
                        >
                            <Grid className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={viewMode === "list" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("list")}
                            className="h-9"
                        >
                            <List className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={viewMode === "calendar" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("calendar")}
                            className="h-9"
                        >
                            <Calendar className="w-4 h-4" />
                        </Button>
                    </div>
                </motion.div>

                {/* Sessions View */}
                <AnimatePresence mode="wait">
                    {viewMode === "calendar" ? (
                        <motion.div
                            key="calendar"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                        >
                            <SessionCalendarView
                                sessions={filteredSessions}
                                currentMonth={currentMonth}
                                onMonthChange={setCurrentMonth}
                                onEditSession={handleEdit}
                                onDeleteSession={handleDelete}
                            />
                        </motion.div>
                    ) : viewMode === "grid" ? (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {filteredSessions.map((session, index) => (
                                <motion.div
                                    key={session.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <Card className="border-none shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                                        <div className={`h-2 bg-gradient-to-r ${getTopicColor(index)}`} />
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1">
                                                    <Badge className="mb-2 bg-purple-100 text-purple-700 border-none">
                                                        Session #{session.id}
                                                    </Badge>
                                                    <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                                                        {session.topic}
                                                    </CardTitle>
                                                    <CardDescription className="mt-1 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {formatDate(session.date)}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {/* Time Slot Info */}
                                            {session.time_slot && (
                                                <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Clock className="w-4 h-4 text-purple-600" />
                                                        <span className="text-xs font-semibold text-purple-900">
                                                            {session.time_slot.slot_name}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs text-gray-700">
                                                        <span>{formatTime(session.time_slot.start_time)}</span>
                                                        <span>→</span>
                                                        <span>{formatTime(session.time_slot.end_time)}</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Notes */}
                                            {session.notes && (
                                                <div className="flex gap-2">
                                                    <FileText className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                                                    <p className="text-sm text-gray-600 line-clamp-2">{session.notes}</p>
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div className="flex gap-2 pt-2">
                                                <Button
                                                    onClick={() => handleEdit(session)}
                                                    variant="outline"
                                                    className="flex-1 gap-2 border-purple-200 text-purple-600 hover:bg-purple-50"
                                                    size="sm"
                                                >
                                                    <Edit2 className="w-3 h-3" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    onClick={() => handleDelete(session)}
                                                    variant="outline"
                                                    className="flex-1 gap-2 border-red-200 text-red-600 hover:bg-red-50"
                                                    size="sm"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4"
                        >
                            {filteredSessions.map((session, index) => (
                                <motion.div
                                    key={session.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-6 flex-1">
                                                    <div className={`w-1 h-16 rounded-full bg-gradient-to-b ${getTopicColor(index)}`} />
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <Badge className="bg-purple-100 text-purple-700 border-none">
                                                                #{session.id}
                                                            </Badge>
                                                            <h3 className="font-bold text-lg text-gray-900">{session.topic}</h3>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                                            <div className="flex items-center gap-1">
                                                                <Calendar className="w-4 h-4" />
                                                                {formatDate(session.date)}
                                                            </div>
                                                            {session.time_slot && (
                                                                <div className="flex items-center gap-1">
                                                                    <Clock className="w-4 h-4" />
                                                                    {session.time_slot.slot_name}
                                                                </div>
                                                            )}
                                                        </div>
                                                        {session.notes && (
                                                            <p className="text-sm text-gray-600 mt-2 line-clamp-1">{session.notes}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        onClick={() => handleEdit(session)}
                                                        variant="outline"
                                                        size="sm"
                                                        className="gap-2"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleDelete(session)}
                                                        variant="outline"
                                                        size="sm"
                                                        className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Empty State */}
                {filteredSessions.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No sessions found</h3>
                        <p className="text-gray-600 mb-6">Create your first session to get started</p>
                        <Button
                            onClick={() => setCreateModalOpen(true)}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Create Session
                        </Button>
                    </motion.div>
                )}
            </div>

            {/* Modals */}
            <CreateSessionModal
                open={createModalOpen}
                onOpenChange={setCreateModalOpen}
            />
            {selectedSession && (
                <>
                    <EditSessionModal
                        open={editModalOpen}
                        onOpenChange={setEditModalOpen}
                        session={selectedSession}
                    />
                    <DeleteSessionDialog
                        open={deleteDialogOpen}
                        onOpenChange={setDeleteDialogOpen}
                        session={selectedSession}
                    />
                </>
            )}
        </div>
    );
}
