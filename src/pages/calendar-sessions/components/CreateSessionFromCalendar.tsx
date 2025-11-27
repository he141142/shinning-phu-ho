import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/drake_libs/ui/dialog";
import { Button } from "@/components/drake_libs/ui/button";
import { Input } from "@/components/drake_libs/ui/input";
import { Label } from "@/components/drake_libs/ui/label";
import { Textarea } from "@/components/drake_libs/ui/textarea";
import { Calendar, Save, X, Clock, BookOpen, FileText, GraduationCap, MapPin } from "lucide-react";
import { useToast } from "@/components/hooks/use-toast";
import { RenderSuccessToast, RenderFailedToast } from "@/components/drake_libs/customs/custom-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/drake_libs/ui/select";

interface CreateSessionFromCalendarProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialDate?: Date;
    initialTime?: string;
    onCreateSession: (session: any) => void;
}

export const CreateSessionFromCalendar: React.FC<CreateSessionFromCalendarProps> = ({
    open,
    onOpenChange,
    initialDate,
    initialTime,
    onCreateSession
}) => {
    const { toast } = useToast();
    const [topic, setTopic] = useState("");
    const [date, setDate] = useState("");
    const [notes, setNotes] = useState("");
    const [classId, setClassId] = useState("");
    const [timeSlotId, setTimeSlotId] = useState("");
    const [loading, setLoading] = useState(false);

    // Mock data
    const classes = [
        { id: 1, name: "Web Development - React", color: "blue" },
        { id: 2, name: "Python Programming", color: "purple" },
        { id: 3, name: "Data Science Fundamentals", color: "green" }
    ];

    const timeSlots = [
        { id: 1, name: "Morning Session", time: "8:00 AM - 10:00 AM" },
        { id: 2, name: "Afternoon Session", time: "1:00 PM - 3:30 PM" },
        { id: 3, name: "Evening Session", time: "5:00 PM - 7:00 PM" }
    ];

    useEffect(() => {
        if (initialDate) {
            const dateStr = initialDate.toISOString().split('T')[0];
            setDate(dateStr);
        }
    }, [initialDate, initialTime, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!topic || !date || !classId || !timeSlotId) {
            toast(RenderFailedToast("Please fill in all required fields"));
            return;
        }

        setLoading(true);

        try {
            // Find selected time slot details
            const selectedTimeSlot = timeSlots.find(slot => slot.id.toString() === timeSlotId);

            // Create the session object
            const newSession = {
                class_id: parseInt(classId),
                date: date,
                topic: topic,
                notes: notes,
                time_slot_id: parseInt(timeSlotId),
                time_slot: selectedTimeSlot ? {
                    id: selectedTimeSlot.id,
                    slot_name: selectedTimeSlot.name,
                    start_time: `${date}T${selectedTimeSlot.id === 1 ? '08:00:00' : selectedTimeSlot.id === 2 ? '13:00:00' : '17:00:00'}`,
                    end_time: `${date}T${selectedTimeSlot.id === 1 ? '10:00:00' : selectedTimeSlot.id === 2 ? '15:30:00' : '19:00:00'}`,
                    duration_mins: selectedTimeSlot.id === 1 ? 120 : selectedTimeSlot.id === 2 ? 150 : 120,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                } : undefined
            };

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // Call the handler to add session to state
            onCreateSession(newSession);

            toast(RenderSuccessToast("Session created successfully!"));
            handleClose();
        } catch (error) {
            toast(RenderFailedToast("Failed to create session"));
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setTopic("");
        setDate("");
        setNotes("");
        setClassId("");
        setTimeSlotId("");
        onOpenChange(false);
    };

    const selectedClass = classes.find(c => c.id.toString() === classId);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        Create Session
                    </DialogTitle>
                    <DialogDescription>
                        Schedule a new class session with topic and time details.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 py-4">
                    {/* Topic */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-2"
                    >
                        <Label htmlFor="topic" className="text-sm font-semibold">
                            Session Title *
                        </Label>
                        <Input
                            id="topic"
                            placeholder="e.g., Introduction to React Hooks"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="h-11"
                            autoFocus
                        />
                    </motion.div>

                    {/* Class Selection */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-2"
                    >
                        <Label className="text-sm font-semibold flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-blue-600" />
                            Class *
                        </Label>
                        <Select value={classId} onValueChange={setClassId}>
                            <SelectTrigger className="h-11">
                                <SelectValue placeholder="Select a class" />
                            </SelectTrigger>
                            <SelectContent>
                                {classes.map(cls => (
                                    <SelectItem key={cls.id} value={cls.id.toString()}>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full bg-${cls.color}-500`} />
                                            {cls.name}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </motion.div>

                    {/* Date and Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-2"
                        >
                            <Label htmlFor="date" className="text-sm font-semibold flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-green-600" />
                                Date *
                            </Label>
                            <Input
                                id="date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="h-11"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-2"
                        >
                            <Label className="text-sm font-semibold flex items-center gap-2">
                                <Clock className="w-4 h-4 text-orange-600" />
                                Time Slot *
                            </Label>
                            <Select value={timeSlotId} onValueChange={setTimeSlotId}>
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Select time" />
                                </SelectTrigger>
                                <SelectContent>
                                    {timeSlots.map(slot => (
                                        <SelectItem key={slot.id} value={slot.id.toString()}>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{slot.name}</span>
                                                <span className="text-xs text-gray-500">{slot.time}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </motion.div>
                    </div>

                    {/* Notes */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-2"
                    >
                        <Label htmlFor="notes" className="text-sm font-semibold flex items-center gap-2">
                            <FileText className="w-4 h-4 text-indigo-600" />
                            Description
                        </Label>
                        <Textarea
                            id="notes"
                            placeholder="Add session description, topics to cover, or preparation notes..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="min-h-[80px] resize-none"
                        />
                    </motion.div>

                    {/* Preview Card */}
                    {(topic || selectedClass || date) && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
                        >
                            <div className="flex items-start gap-3">
                                <div className={`w-1 h-16 rounded-full bg-${selectedClass?.color || 'blue'}-500`} />
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900">
                                        {topic || "Untitled Session"}
                                    </h4>
                                    {selectedClass && (
                                        <p className="text-sm text-gray-600 mt-1">{selectedClass.name}</p>
                                    )}
                                    {date && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(date).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </form>

                <DialogFooter className="gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                    >
                        <Save className="w-4 h-4" />
                        {loading ? "Creating..." : "Create Session"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
