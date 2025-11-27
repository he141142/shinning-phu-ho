import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/drake_libs/ui/dialog";
import { Button } from "@/components/drake_libs/ui/button";
import { Input } from "@/components/drake_libs/ui/input";
import { Label } from "@/components/drake_libs/ui/label";
import { Textarea } from "@/components/drake_libs/ui/textarea";
import { Calendar, Save, X, Clock, BookOpen, FileText } from "lucide-react";
import { useToast } from "@/components/hooks/use-toast";
import { RenderSuccessToast, RenderFailedToast } from "@/components/drake_libs/customs/custom-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/drake_libs/ui/select";
import { Session } from "@/models/session/session";

interface EditSessionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    session: Session;
}

export const EditSessionModal: React.FC<EditSessionModalProps> = ({ open, onOpenChange, session }) => {
    const { toast } = useToast();
    const [topic, setTopic] = useState("");
    const [date, setDate] = useState("");
    const [notes, setNotes] = useState("");
    const [timeSlotId, setTimeSlotId] = useState("");
    const [loading, setLoading] = useState(false);

    const timeSlots = [
        { id: 1, name: "Morning Session (8:00 AM - 10:00 AM)" },
        { id: 2, name: "Afternoon Session (1:00 PM - 3:30 PM)" },
        { id: 3, name: "Evening Session (5:00 PM - 7:00 PM)" }
    ];

    useEffect(() => {
        if (session) {
            setTopic(session.topic);
            setDate(session.date);
            setNotes(session.notes || "");
            setTimeSlotId(session.time_slot_id.toString());
        }
    }, [session]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!topic || !date || !timeSlotId) {
            toast(RenderFailedToast("Please fill in all required fields"));
            return;
        }

        setLoading(true);

        try {
            // TODO: Add GraphQL mutation here
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast(RenderSuccessToast("Session updated successfully!"));
            onOpenChange(false);
        } catch (error) {
            toast(RenderFailedToast("Failed to update session"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-purple-600" />
                        Edit Session
                    </DialogTitle>
                    <DialogDescription>
                        Update session information. Changes will be reflected immediately.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
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

                    <div className="grid grid-cols-2 gap-4">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
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
                            transition={{ delay: 0.3 }}
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

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
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
                    </motion.div>
                </form>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
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
                        {loading ? "Updating..." : "Update Session"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
