import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/drake_libs/ui/button";
import { X, Edit2, Trash2, Clock, Calendar, FileText, Users, MapPin, ExternalLink } from "lucide-react";
import { Session } from "@/models/session/session";
import { Badge } from "@/components/drake_libs/ui/badge";
import { Separator } from "@/components/drake_libs/ui/separator";

interface SessionDetailSidebarProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    session: Session | null;
    onUpdateSession?: (session: Session) => void;
    onDeleteSession?: (sessionId: number) => void;
}

export const SessionDetailSidebar: React.FC<SessionDetailSidebarProps> = ({
    open,
    onOpenChange,
    session,
    onUpdateSession,
    onDeleteSession
}) => {
    if (!session) return null;

    const getSessionColor = (classId: number) => {
        const colors = [
            { bg: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
            { bg: 'bg-purple-500', light: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
            { bg: 'bg-green-500', light: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
            { bg: 'bg-orange-500', light: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
            { bg: 'bg-pink-500', light: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' }
        ];
        return colors[(classId - 1) % colors.length];
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const colors = getSessionColor(session.class_id);

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => onOpenChange(false)}
                        className="fixed inset-0 bg-black/20 z-40"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 h-full w-[480px] bg-white shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className={`p-6 ${colors.light} border-b ${colors.border}`}>
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-1 h-16 rounded-full ${colors.bg}`} />
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onOpenChange(false)}
                                    className="h-8 w-8 p-0"
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {session.topic}
                            </h2>
                            <Badge className={`${colors.bg} text-white border-none`}>
                                Session #{session.id}
                            </Badge>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Date & Time */}
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className={`w-10 h-10 rounded-lg ${colors.light} flex items-center justify-center flex-shrink-0`}>
                                        <Calendar className={`w-5 h-5 ${colors.text}`} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm text-gray-500 mb-1">Date</div>
                                        <div className="font-semibold text-gray-900">
                                            {formatDate(session.date)}
                                        </div>
                                    </div>
                                </div>

                                {session.time_slot && (
                                    <div className="flex items-start gap-3">
                                        <div className={`w-10 h-10 rounded-lg ${colors.light} flex items-center justify-center flex-shrink-0`}>
                                            <Clock className={`w-5 h-5 ${colors.text}`} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm text-gray-500 mb-1">Time</div>
                                            <div className="font-semibold text-gray-900">
                                                {formatTime(session.time_slot.start_time)} - {formatTime(session.time_slot.end_time)}
                                            </div>
                                            <div className="text-sm text-gray-600 mt-1">
                                                {session.time_slot.slot_name} ({session.time_slot.duration_mins} minutes)
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Separator />

                            {/* Class Information */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    Class Information
                                </h3>
                                <div className={`p-4 rounded-lg ${colors.light} border ${colors.border}`}>
                                    <div className="font-medium text-gray-900">Class ID: #{session.class_id}</div>
                                    <Button
                                        variant="link"
                                        className="p-0 h-auto font-normal text-blue-600 mt-2"
                                    >
                                        View class details
                                        <ExternalLink className="w-3 h-3 ml-1" />
                                    </Button>
                                </div>
                            </div>

                            {/* Notes */}
                            {session.notes && (
                                <>
                                    <Separator />
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <FileText className="w-4 h-4" />
                                            Description
                                        </h3>
                                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                                                {session.notes}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Metadata */}
                            <Separator />
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Created</span>
                                    <span className="text-gray-900 font-medium">
                                        {new Date(session.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Last Updated</span>
                                    <span className="text-gray-900 font-medium">
                                        {new Date(session.updated_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <Separator />
                            <div className="space-y-2">
                                <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
                                <Button variant="outline" className="w-full justify-start gap-2">
                                    <Users className="w-4 h-4" />
                                    View Attendance
                                </Button>
                                <Button variant="outline" className="w-full justify-start gap-2">
                                    <FileText className="w-4 h-4" />
                                    Add Materials
                                </Button>
                                <Button variant="outline" className="w-full justify-start gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Add Location
                                </Button>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 border-t bg-gray-50 space-y-2">
                            <Button
                                className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => {
                                    // TODO: Open edit modal
                                    console.log("Edit session", session.id);
                                }}
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit Session
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full gap-2 text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => {
                                    if (onDeleteSession && confirm("Are you sure you want to delete this session?")) {
                                        onDeleteSession(session.id);
                                    }
                                }}
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete Session
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
