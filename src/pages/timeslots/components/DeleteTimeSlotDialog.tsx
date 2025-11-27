import React, { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/drake_libs/ui/alert-dialog";
import { useToast } from "@/components/hooks/use-toast";
import { RenderSuccessToast, RenderFailedToast } from "@/components/drake_libs/customs/custom-toast";
import { TimeSlot } from "@/models/timeslot/timeslot";
import { AlertTriangle } from "lucide-react";

interface DeleteTimeSlotDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    timeSlot: TimeSlot;
}

export const DeleteTimeSlotDialog: React.FC<DeleteTimeSlotDialogProps> = ({
    open,
    onOpenChange,
    timeSlot
}) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);

        try {
            // TODO: Add GraphQL mutation here
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast(RenderSuccessToast("Time slot deleted successfully!"));
            onOpenChange(false);
        } catch (error) {
            toast(RenderFailedToast("Failed to delete time slot"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <AlertDialogTitle className="text-xl">Delete Time Slot</AlertDialogTitle>
                            <AlertDialogDescription className="mt-1">
                                Are you sure you want to delete "{timeSlot.slot_name}"?
                            </AlertDialogDescription>
                        </div>
                    </div>
                </AlertDialogHeader>
                <div className="py-4">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">
                            <strong>Warning:</strong> This action cannot be undone. All sessions associated with this time slot will have their time slot reference removed.
                        </p>
                    </div>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
