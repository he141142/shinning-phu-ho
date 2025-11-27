import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/drake_libs/ui/card";
import { Button } from "@/components/drake_libs/ui/button";
import {
    Clock,
    Plus,
    Edit2,
    Trash2,
    Calendar,
    Timer,
    ChevronRight,
    Search,
    Filter,
    Download,
    Upload,
    MoreVertical
} from "lucide-react";
import { TimeSlot } from "@/models/timeslot/timeslot";
import { Badge } from "@/components/drake_libs/ui/badge";
import { Input } from "@/components/drake_libs/ui/input";
import { CreateTimeSlotModal } from "./components/CreateTimeSlotModal";
import { EditTimeSlotModal } from "./components/EditTimeSlotModal";
import { DeleteTimeSlotDialog } from "./components/DeleteTimeSlotDialog";

export default function TimeSlotsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);

    // Mock data - replace with actual API call
    const timeSlots: TimeSlot[] = [
        {
            id: 1,
            slot_name: "Morning Session",
            start_time: "2024-01-01T08:00:00",
            end_time: "2024-01-01T10:00:00",
            duration_mins: 120,
            created_at: "2024-01-01T00:00:00",
            updated_at: "2024-01-01T00:00:00"
        },
        {
            id: 2,
            slot_name: "Afternoon Session",
            start_time: "2024-01-01T13:00:00",
            end_time: "2024-01-01T15:30:00",
            duration_mins: 150,
            created_at: "2024-01-01T00:00:00",
            updated_at: "2024-01-01T00:00:00"
        },
        {
            id: 3,
            slot_name: "Evening Session",
            start_time: "2024-01-01T17:00:00",
            end_time: "2024-01-01T19:00:00",
            duration_mins: 120,
            created_at: "2024-01-01T00:00:00",
            updated_at: "2024-01-01T00:00:00"
        }
    ];

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const getTimeColor = (slotName: string) => {
        if (slotName.toLowerCase().includes("morning")) return "bg-gradient-to-r from-orange-400 to-pink-400";
        if (slotName.toLowerCase().includes("afternoon")) return "bg-gradient-to-r from-blue-400 to-cyan-400";
        if (slotName.toLowerCase().includes("evening")) return "bg-gradient-to-r from-purple-400 to-indigo-400";
        return "bg-gradient-to-r from-gray-400 to-slate-400";
    };

    const handleEdit = (timeSlot: TimeSlot) => {
        setSelectedTimeSlot(timeSlot);
        setEditModalOpen(true);
    };

    const handleDelete = (timeSlot: TimeSlot) => {
        setSelectedTimeSlot(timeSlot);
        setDeleteDialogOpen(true);
    };

    const filteredTimeSlots = timeSlots.filter(slot =>
        slot.slot_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Time Slot Management
                            </h1>
                            <p className="text-gray-600 mt-2">Manage your class time slots efficiently</p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" className="gap-2">
                                <Upload className="w-4 h-4" />
                                Import
                            </Button>
                            <Button variant="outline" className="gap-2">
                                <Download className="w-4 h-4" />
                                Export
                            </Button>
                            <Button
                                onClick={() => setCreateModalOpen(true)}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white gap-2 shadow-lg"
                            >
                                <Plus className="w-4 h-4" />
                                Create Time Slot
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
                    <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Total Slots</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{timeSlots.length}</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Morning Slots</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">
                                        {timeSlots.filter(s => s.slot_name.toLowerCase().includes("morning")).length}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Afternoon Slots</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">
                                        {timeSlots.filter(s => s.slot_name.toLowerCase().includes("afternoon")).length}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center">
                                    <Timer className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Evening Slots</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">
                                        {timeSlots.filter(s => s.slot_name.toLowerCase().includes("evening")).length}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Search and Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex gap-4"
                >
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            placeholder="Search time slots..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-12 border-gray-200 focus:border-blue-500 transition-colors"
                        />
                    </div>
                    <Button variant="outline" className="h-12 gap-2">
                        <Filter className="w-4 h-4" />
                        Filters
                    </Button>
                </motion.div>

                {/* Time Slots Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    <AnimatePresence>
                        {filteredTimeSlots.map((slot, index) => (
                            <motion.div
                                key={slot.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <Card className="border-none shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                                    <div className={`h-2 ${getTimeColor(slot.slot_name)}`} />
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                    {slot.slot_name}
                                                </CardTitle>
                                                <CardDescription className="mt-1">
                                                    ID: #{slot.id}
                                                </CardDescription>
                                            </div>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Time Display */}
                                        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Clock className="w-4 h-4 text-blue-600" />
                                                    <span className="text-xs text-gray-600 font-medium">Start Time</span>
                                                </div>
                                                <p className="text-lg font-bold text-gray-900">
                                                    {formatTime(slot.start_time)}
                                                </p>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-400" />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Clock className="w-4 h-4 text-indigo-600" />
                                                    <span className="text-xs text-gray-600 font-medium">End Time</span>
                                                </div>
                                                <p className="text-lg font-bold text-gray-900">
                                                    {formatTime(slot.end_time)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Duration Badge */}
                                        <div className="flex items-center justify-between">
                                            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none">
                                                <Timer className="w-3 h-3 mr-1" />
                                                {slot.duration_mins} minutes
                                            </Badge>
                                            <div className="text-xs text-gray-500">
                                                {(slot.duration_mins / 60).toFixed(1)} hours
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2 pt-2">
                                            <Button
                                                onClick={() => handleEdit(slot)}
                                                variant="outline"
                                                className="flex-1 gap-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                Edit
                                            </Button>
                                            <Button
                                                onClick={() => handleDelete(slot)}
                                                variant="outline"
                                                className="flex-1 gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Empty State */}
                {filteredTimeSlots.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No time slots found</h3>
                        <p className="text-gray-600 mb-6">Create your first time slot to get started</p>
                        <Button
                            onClick={() => setCreateModalOpen(true)}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Create Time Slot
                        </Button>
                    </motion.div>
                )}
            </div>

            {/* Modals */}
            <CreateTimeSlotModal
                open={createModalOpen}
                onOpenChange={setCreateModalOpen}
            />
            {selectedTimeSlot && (
                <>
                    <EditTimeSlotModal
                        open={editModalOpen}
                        onOpenChange={setEditModalOpen}
                        timeSlot={selectedTimeSlot}
                    />
                    <DeleteTimeSlotDialog
                        open={deleteDialogOpen}
                        onOpenChange={setDeleteDialogOpen}
                        timeSlot={selectedTimeSlot}
                    />
                </>
            )}
        </div>
    );
}
