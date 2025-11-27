"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Clock, CheckCircle2, AlertCircle, Plus, XCircle, ArrowRight, Play, Pause } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/drake_libs/ui/card"
import { Button } from "@/components/drake_libs/ui/button"
import { Badge } from "@/components/drake_libs/ui/badge"
import { Semester } from "@/models/semesters/entity"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/drake_libs/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/drake_libs/ui/select"
import { Alert, AlertDescription } from "@/components/drake_libs/ui/alert"

export interface ClassSemesterData {
    past_semesters: Semester[]
    current_semester: Semester | null
    upcoming_semesters: Semester[]
}

interface SemesterTimelineProps {
    classId: number
    classSemesters: ClassSemesterData
    availableSemesters: Semester[]
    onEndCurrentSemester: () => Promise<void>
    onAddUpcomingSemester: (semesterId: number) => Promise<void>
    onRemoveUpcomingSemester: (semesterId: number) => Promise<void>
    isLoading?: boolean
}

export function SemesterTimeline({
    classId,
    classSemesters,
    availableSemesters,
    onEndCurrentSemester,
    onAddUpcomingSemester,
    onRemoveUpcomingSemester,
    isLoading = false
}: SemesterTimelineProps) {
    const [isEndSemesterDialogOpen, setIsEndSemesterDialogOpen] = useState(false)
    const [isAddSemesterDialogOpen, setIsAddSemesterDialogOpen] = useState(false)
    const [selectedSemesterId, setSelectedSemesterId] = useState<string>("")
    const [isProcessing, setIsProcessing] = useState(false)

    const handleEndSemester = async () => {
        if (!classSemesters.upcoming_semesters.length) {
            // Show warning - no upcoming semester
            return
        }
        setIsProcessing(true)
        try {
            await onEndCurrentSemester()
            setIsEndSemesterDialogOpen(false)
        } catch (error) {
            console.error("Failed to end semester:", error)
        } finally {
            setIsProcessing(false)
        }
    }

    const handleAddSemester = async () => {
        if (!selectedSemesterId) return
        setIsProcessing(true)
        try {
            await onAddUpcomingSemester(parseInt(selectedSemesterId))
            setIsAddSemesterDialogOpen(false)
            setSelectedSemesterId("")
        } catch (error) {
            console.error("Failed to add semester:", error)
        } finally {
            setIsProcessing(false)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        })
    }

    // Filter out semesters that are already added
    const upcomingSemesterIds = classSemesters.upcoming_semesters.map(s => s.semester_id)
    const currentSemesterId = classSemesters.current_semester?.semester_id
    const pastSemesterIds = classSemesters.past_semesters.map(s => s.semester_id)
    const availableToAdd = availableSemesters.filter(
        s => !upcomingSemesterIds.includes(s.semester_id) &&
             s.semester_id !== currentSemesterId &&
             !pastSemesterIds.includes(s.semester_id)
    )

    return (
        <Card className="shadow-lg border-gray-200">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Calendar className="w-6 h-6 text-indigo-600" />
                            Semester Timeline
                        </CardTitle>
                        <CardDescription className="text-gray-600 mt-1">
                            Manage past, current, and upcoming semesters for this class
                        </CardDescription>
                    </div>
                    <Button
                        onClick={() => setIsAddSemesterDialogOpen(true)}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md"
                        disabled={isLoading}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Upcoming Semester
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-8">
                    {/* Timeline Visualization */}
                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-300 via-blue-500 to-purple-300"></div>

                        <div className="space-y-6">
                            {/* Past Semesters */}
                            {classSemesters.past_semesters.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Past Semesters</h3>
                                    {classSemesters.past_semesters.map((semester, index) => (
                                        <motion.div
                                            key={semester.semester_id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="relative pl-20"
                                        >
                                            {/* Timeline Dot */}
                                            <div className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full bg-gray-400 border-4 border-white shadow-md flex items-center justify-center">
                                                <CheckCircle2 className="w-3 h-3 text-white" />
                                            </div>

                                            <Card className="bg-gray-50 border-gray-300 hover:shadow-md transition-all">
                                                <CardContent className="p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900">{semester.semester_name}</h4>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                {formatDate(semester.start_date)} - {formatDate(semester.end_date)}
                                                            </p>
                                                        </div>
                                                        <Badge variant="secondary" className="bg-gray-200 text-gray-700">
                                                            Completed
                                                        </Badge>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {/* Current Semester */}
                            {classSemesters.current_semester ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative pl-20"
                                >
                                    {/* Timeline Dot - Active */}
                                    <div className="absolute left-6 top-1/2 transform -translate-y-1/2">
                                        <motion.div
                                            className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 border-4 border-white shadow-lg"
                                            animate={{
                                                scale: [1, 1.2, 1],
                                                boxShadow: [
                                                    "0 0 0 0 rgba(59, 130, 246, 0.7)",
                                                    "0 0 0 10px rgba(59, 130, 246, 0)",
                                                    "0 0 0 0 rgba(59, 130, 246, 0)"
                                                ]
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        />
                                    </div>

                                    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 shadow-lg">
                                        <CardContent className="p-6">
                                            <div className="space-y-4">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                                                                <Play className="w-3 h-3 mr-1" />
                                                                Active
                                                            </Badge>
                                                            <h3 className="text-xl font-bold text-gray-900">
                                                                {classSemesters.current_semester.semester_name}
                                                            </h3>
                                                        </div>
                                                        <p className="text-sm text-gray-600 flex items-center gap-2">
                                                            <Calendar className="w-4 h-4" />
                                                            {formatDate(classSemesters.current_semester.start_date)} - {formatDate(classSemesters.current_semester.end_date)}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        onClick={() => setIsEndSemesterDialogOpen(true)}
                                                        variant="outline"
                                                        className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                                                        disabled={isLoading}
                                                    >
                                                        <Pause className="w-4 h-4 mr-2" />
                                                        End Semester
                                                    </Button>
                                                </div>

                                                {/* Progress indicator */}
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-xs text-gray-600">
                                                        <span>Progress</span>
                                                        <span>
                                                            {Math.round(
                                                                ((new Date().getTime() - new Date(classSemesters.current_semester.start_date).getTime()) /
                                                                (new Date(classSemesters.current_semester.end_date).getTime() - new Date(classSemesters.current_semester.start_date).getTime())) * 100
                                                            )}%
                                                        </span>
                                                    </div>
                                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <motion.div
                                                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                                                            initial={{ width: "0%" }}
                                                            animate={{
                                                                width: `${Math.min(100, Math.round(
                                                                    ((new Date().getTime() - new Date(classSemesters.current_semester.start_date).getTime()) /
                                                                    (new Date(classSemesters.current_semester.end_date).getTime() - new Date(classSemesters.current_semester.start_date).getTime())) * 100
                                                                ))}%`
                                                            }}
                                                            transition={{ duration: 1, ease: "easeOut" }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ) : (
                                <div className="relative pl-20">
                                    <Alert className="border-amber-300 bg-amber-50">
                                        <AlertCircle className="h-4 w-4 text-amber-600" />
                                        <AlertDescription className="text-amber-800">
                                            No active semester. Please add and activate a semester to continue.
                                        </AlertDescription>
                                    </Alert>
                                </div>
                            )}

                            {/* Upcoming Semesters */}
                            {classSemesters.upcoming_semesters.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-purple-600" />
                                        Upcoming Semesters
                                    </h3>
                                    {classSemesters.upcoming_semesters.map((semester, index) => (
                                        <motion.div
                                            key={semester.semester_id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="relative pl-20"
                                        >
                                            {/* Timeline Dot */}
                                            <div className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full bg-purple-400 border-4 border-white shadow-md"></div>

                                            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 hover:shadow-md transition-all">
                                                <CardContent className="p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h4 className="font-semibold text-gray-900">{semester.semester_name}</h4>
                                                                {index === 0 && (
                                                                    <Badge variant="outline" className="border-purple-400 text-purple-700 text-xs">
                                                                        Next
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-gray-600">
                                                                {formatDate(semester.start_date)} - {formatDate(semester.end_date)}
                                                            </p>
                                                        </div>
                                                        <Button
                                                            onClick={() => onRemoveUpcomingSemester(semester.semester_id)}
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {/* Empty state for upcoming */}
                            {classSemesters.upcoming_semesters.length === 0 && classSemesters.current_semester && (
                                <div className="relative pl-20">
                                    <Alert className="border-purple-300 bg-purple-50">
                                        <AlertCircle className="h-4 w-4 text-purple-600" />
                                        <AlertDescription className="text-purple-800">
                                            No upcoming semesters scheduled. Add a semester to ensure continuity.
                                        </AlertDescription>
                                    </Alert>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>

            {/* End Semester Dialog */}
            <Dialog open={isEndSemesterDialogOpen} onOpenChange={setIsEndSemesterDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-amber-600" />
                            End Current Semester
                        </DialogTitle>
                        <DialogDescription className="text-base">
                            {classSemesters.upcoming_semesters.length > 0 ? (
                                <>
                                    Are you sure you want to end the current semester?
                                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <p className="text-sm font-semibold text-blue-900 mb-2">
                                            Next semester will automatically begin:
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <ArrowRight className="w-4 h-4 text-blue-600" />
                                            <span className="font-semibold text-blue-800">
                                                {classSemesters.upcoming_semesters[0]?.semester_name}
                                            </span>
                                        </div>
                                        <p className="text-xs text-blue-700 mt-1">
                                            {formatDate(classSemesters.upcoming_semesters[0]?.start_date)} - {formatDate(classSemesters.upcoming_semesters[0]?.end_date)}
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <Alert className="border-red-300 bg-red-50 mt-4">
                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                    <AlertDescription className="text-red-800">
                                        <strong>Warning:</strong> No upcoming semester available. Ending the current semester will leave this class without an active semester.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsEndSemesterDialogOpen(false)}
                            disabled={isProcessing}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleEndSemester}
                            disabled={isProcessing || classSemesters.upcoming_semesters.length === 0}
                            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                        >
                            {isProcessing ? "Processing..." : "End Semester"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Semester Dialog */}
            <Dialog open={isAddSemesterDialogOpen} onOpenChange={setIsAddSemesterDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Add Upcoming Semester</DialogTitle>
                        <DialogDescription>
                            Select a semester to add to this class's schedule
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Select value={selectedSemesterId} onValueChange={setSelectedSemesterId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a semester" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableToAdd.length > 0 ? (
                                    availableToAdd.map((semester) => (
                                        <SelectItem key={semester.semester_id} value={semester.semester_id.toString()}>
                                            <div className="flex flex-col">
                                                <span className="font-semibold">{semester.semester_name}</span>
                                                <span className="text-xs text-gray-500">
                                                    {formatDate(semester.start_date)} - {formatDate(semester.end_date)}
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))
                                ) : (
                                    <div className="p-4 text-sm text-gray-500 text-center">
                                        No available semesters to add
                                    </div>
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsAddSemesterDialogOpen(false)
                                setSelectedSemesterId("")
                            }}
                            disabled={isProcessing}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddSemester}
                            disabled={!selectedSemesterId || isProcessing}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                        >
                            {isProcessing ? "Adding..." : "Add Semester"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    )
}
