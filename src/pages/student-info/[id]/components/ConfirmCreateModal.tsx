"use client";

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/drake_libs/ui/dialog";
import { Button } from "@/components/drake_libs/ui/button";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle } from "lucide-react";

export interface ConfirmJoinClassModalProps {
    class_id: number;
    student_id: number;

    onOpenChange: (open: boolean) => void;
    open: boolean;

    onClose: () => void;
    onSave: () => void;
}

export const ConfirmJoinClassModal: React.FC<ConfirmJoinClassModalProps> = ({
    onOpenChange,
    open,
    onClose,
    onSave
}) => {
    return (
        <Dialog onOpenChange={onOpenChange} open={open}>
            <DialogTrigger asChild>
                <Button variant="outline">Edit Profile</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[450px] p-6 relative overflow-hidden">
                {/* Animated Background Effect */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.8 }} 
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 opacity-10 rounded-lg"
                />

                <DialogHeader className="relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: 0.1, duration: 0.3 }}
                        className="flex items-center gap-2 text-gray-700"
                    >
                        <AlertTriangle className="w-6 h-6 text-yellow-500" />
                        <DialogTitle className="text-xl font-semibold">Confirm Enrollment</DialogTitle>
                    </motion.div>

                    <motion.p 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: 0.2, duration: 0.3 }}
                        className="text-gray-500 mt-2"
                    >
                        Are you sure you want to enroll this student in the class? Click save to confirm.
                    </motion.p>
                </DialogHeader>

                <DialogFooter className="flex justify-end mt-4 relative z-10">
                    <motion.button 
                        onClick={onClose} 
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Cancel
                    </motion.button>

                    <motion.button 
                        onClick={onSave} 
                        className="ml-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <CheckCircle className="w-5 h-5" />
                        Save
                    </motion.button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
