import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/drake_libs/ui/dialog";
import { Button } from "@/components/drake_libs/ui/button";
import { Input } from "@/components/drake_libs/ui/input";
import { Label } from "@/components/drake_libs/ui/label";
import { Clock, Save, X } from "lucide-react";
import { useToast } from "@/components/hooks/use-toast";
import { RenderSuccessToast, RenderFailedToast } from "@/components/drake_libs/customs/custom-toast";
import { TimeSlot } from "@/models/timeslot/timeslot";

interface EditTimeSlotModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    timeSlot: TimeSlot;
}

export const EditTimeSlotModal: React.FC<EditTimeSlotModalProps> = ({ open, onOpenChange, timeSlot }) => {
    const { toast } = useToast();
    const [slotName, setSlotName] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (timeSlot) {
            setSlotName(timeSlot.slot_name);
            const start = new Date(timeSlot.start_time);
            const end = new Date(timeSlot.end_time);
            setStartTime(start.toTimeString().slice(0, 5));
            setEndTime(end.toTimeString().slice(0, 5));
        }
    }, [timeSlot]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!slotName || !startTime || !endTime) {
            toast(RenderFailedToast("Please fill in all fields"));
            return;
        }

        if (startTime >= endTime) {
            toast(RenderFailedToast("End time must be after start time"));
            return;
        }

        setLoading(true);

        try {
            // TODO: Add GraphQL mutation here
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast(RenderSuccessToast("Time slot updated successfully!"));
            onOpenChange(false);
        } catch (error) {
            toast(RenderFailedToast("Failed to update time slot"));
        } finally {
            setLoading(false);
        }
    };

    const calculateDuration = () => {
        if (startTime && endTime) {
            const start = new Date(`2000-01-01T${startTime}`);
            const end = new Date(`2000-01-01T${endTime}`);
            const diff = (end.getTime() - start.getTime()) / 1000 / 60;
            if (diff > 0) {
                return `${diff} minutes (${(diff / 60).toFixed(1)} hours)`;
            }
        }
        return "-";
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
                        <Clock className="w-6 h-6 text-blue-600" />
                        Edit Time Slot
                    </DialogTitle>
                    <DialogDescription>
                        Update the time slot information. Changes will affect all associated sessions.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-2"
                    >
                        <Label htmlFor="slot_name" className="text-sm font-semibold">
                            Slot Name *
                        </Label>
                        <Input
                            id="slot_name"
                            placeholder="e.g., Morning Session, Afternoon Class"
                            value={slotName}
                            onChange={(e) => setSlotName(e.target.value)}
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
                            <Label htmlFor="start_time" className="text-sm font-semibold flex items-center gap-2">
                                <Clock className="w-4 h-4 text-green-600" />
                                Start Time *
                            </Label>
                            <Input
                                id="start_time"
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="h-11"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-2"
                        >
                            <Label htmlFor="end_time" className="text-sm font-semibold flex items-center gap-2">
                                <Clock className="w-4 h-4 text-red-600" />
                                End Time *
                            </Label>
                            <Input
                                id="end_time"
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="h-11"
                            />
                        </motion.div>
                    </div>

                    {/* Duration Display */}
                    {startTime && endTime && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">Calculated Duration:</span>
                                <span className="text-sm font-bold text-blue-600">
                                    {calculateDuration()}
                                </span>
                            </div>
                        </motion.div>
                    )}
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
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white gap-2"
                    >
                        <Save className="w-4 h-4" />
                        {loading ? "Updating..." : "Update Time Slot"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
