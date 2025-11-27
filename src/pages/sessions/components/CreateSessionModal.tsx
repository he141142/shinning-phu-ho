import React, { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/drake_libs/ui/dialog";
import { Button } from "@/components/drake_libs/ui/button";
import { Input } from "@/components/drake_libs/ui/input";
import { Label } from "@/components/drake_libs/ui/label";
import { Textarea } from "@/components/drake_libs/ui/textarea";
import { Calendar, Save, X, Clock, BookOpen, FileText, GraduationCap } from "lucide-react";
import { useToast } from "@/components/hooks/use-toast";
import { RenderSuccessToast, RenderFailedToast } from "@/components/drake_libs/customs/custom-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/drake_libs/ui/select";

interface CreateSessionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const CreateSessionModal: React.FC<CreateSessionModalProps> = ({ open, onOpenChange }) => {
    const { toast } = useToast();
    const [topic, setTopic] = useState("");
    const [date, setDate] = useState("");
    const [notes, setNotes] = useState("");
    const [classId, setClassId] = useState("");
    const [timeSlotId, setTimeSlotId] = useState("");
    const [loading, setLoading] = useState(false);

    // Mock data - replace with actual API call
    const classes = [
        { id: 1, name: "Web Development - React" },
        { id: 2, name: "Python Programming" },
        { id: 3, name: "Data Science Fundamentals" }
    ];

    const timeSlots = [
        { id: 1, name: "Morning Session (8:00 AM - 10:00 AM)" },
        { id: 2, name: "Afternoon Session (1:00 PM - 3:30 PM)" },
        { id: 3, name: "Evening Session (5:00 PM - 7:00 PM)" }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!topic || !date || !classId || !timeSlotId) {
            toast(RenderFailedToast("Please fill in all required fields"));
            return;
        }

        setLoading(true);

        try {
            // TODO: Add GraphQL mutation here
            await new Promise(resolve => setTimeout(resolve, 1000));

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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-purple-600" />
                        Create New Session
                    </DialogTitle>
                    <DialogDescription>
                        Schedule a new class session with topic, date, and time details.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    {/* Class Selection */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-2"
                    >
                        <Label htmlFor="class" className="text-sm font-semibold flex items-center gap-2">
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
                                        {cls.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </motion.div>

                    {/* Topic */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-2"
                    >
                        <Label htmlFor="topic" className="text-sm font-semibold flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-purple-600" />
                            Session Topic *
                        </Label>
                        <Input
                            id="topic"
                            placeholder="e.g., Introduction to React Hooks"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="h-11"
                        />
                    </motion.div>

                    {/* Date and Time Slot */}
                    <div className="grid grid-cols-2 gap-4">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-2"
                        >
                            <Label htmlFor="date" className="text-sm font-semibold flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-green-600" />
                                Session Date *
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
                            <Label htmlFor="timeslot" className="text-sm font-semibold flex items-center gap-2">
                                <Clock className="w-4 h-4 text-orange-600" />
                                Time Slot *
                            </Label>
                            <Select value={timeSlotId} onValueChange={setTimeSlotId}>
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Select time slot" />
                                </SelectTrigger>
                                <SelectContent>
                                    {timeSlots.map(slot => (
                                        <SelectItem key={slot.id} value={slot.id.toString()}>
                                            {slot.name}
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
                            Session Notes
                        </Label>
                        <Textarea
                            id="notes"
                            placeholder="Add any additional notes or details about this session..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="min-h-[100px] resize-none"
                        />
                        <p className="text-xs text-gray-500">Optional: Add topics to cover, assignments, or preparation notes</p>
                    </motion.div>

                    {/* Preview */}
                    {topic && date && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200"
                        >
                            <h4 className="text-sm font-semibold text-purple-900 mb-2">Session Preview</h4>
                            <div className="space-y-1 text-sm">
                                <p className="text-gray-700"><span className="font-medium">Topic:</span> {topic}</p>
                                <p className="text-gray-700"><span className="font-medium">Date:</span> {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                        </motion.div>
                    )}
                </form>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        className="gap-2"
                    >
                        <X className="w-4 h-4" />
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white gap-2"
                    >
                        <Save className="w-4 h-4" />
                        {loading ? "Creating..." : "Create Session"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
