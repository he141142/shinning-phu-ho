
import React, { useState } from "react";
import { Button } from "@/components/drake_libs/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/drake_libs/ui/dialog";
import { Input } from "@/components/drake_libs/ui/input";
import { Label } from "@/components/drake_libs/ui/label";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/drake_libs/ui/form";
import { Tabs, TabsContent } from "@/components/drake_libs/ui/tabs";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/drake_libs/ui/card";
import { ClassesComboBox } from "./SelectClass";
import { useFetchClasses } from "@/components/hooks/useFetchClass";
import { LoadingPage } from "@/components/drake_libs/component/loading-page";
import { ClassInfo } from "@/models/class/class";
import { NeonPopoverCalendarComponent } from "@/components/drake_libs/customs/neon-popover-calendar";
import moment from "moment";
import { RenderFailedToast, RenderSuccessToast } from "@/components/drake_libs/customs/custom-toast";
import { useToast } from "@/components/hooks/use-toast";
import { RegistrationCardInfo, RegistrationCardInfoData } from "./RegistrationCard";
import { useGraphQLMutation } from "@/components/hooks/useMutation";
import { motion } from "framer-motion";
import { Loader2, Calendar as CalendarIcon, Users, BookOpen, GraduationCap, Clock, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { delay } from "@/lib/utils";

export const JoinClassModal = ({ open, onOpenChange, registrationInfo }: {
    open: boolean, onOpenChange: () => void,
    registrationInfo: RegistrationCardInfoData
}): React.ReactNode => {
    const router = useRouter();
    const { classes, loading, error } = useFetchClasses();
    const [selectedClass, setSelectedClass] = React.useState<ClassInfo | null>(null);
    const form = useForm(
        {

            defaultValues: {
                student_id: 1,
                class_id: 1,
            },
        }
    );
    form.setValue("student_id", registrationInfo.studentId);
    form.setValue("class_id", registrationInfo.classId);
    const { toast } = useToast();
    const { executeMutation, loading: respLoad } = useGraphQLMutation();
    const [isWaiting, setIsWaiting] = useState(false);

    const handleClick = async () => {
        setIsWaiting(true);
        await delay(1000);
        await form.handleSubmit(() => {
            handleJoinClass();
        })();

        await delay(1000);
        router.refresh();
    };

    const [date, setDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [activeTab, setActiveTab] = useState("class-selection")
    const [completedSteps, setCompletedSteps] = useState({
        "select-class": false,
        "registration": false,
        "confirm-info": false
    });

    const JOIN_STUDENT_MUTATION = `
        mutation JoinStudent($student_id: Int!, $class_id: Int!) {
            JoinStudentToClass(input: { student_id: $student_id, class_id: $class_id }) {
                status
                message
            }
        }
    `;

    const handleJoinClass = async () => {
        const response = await executeMutation<{
            JoinStudentToClass: { status: string; message: string };
        }>(JOIN_STUDENT_MUTATION, {
            student_id: registrationInfo.studentId,
            class_id: registrationInfo.classId,
        });

        if (response && response.JoinStudentToClass.status === "success") {
            toast({ ...RenderSuccessToast("Student successfully joined the class!") });
            onOpenChange(); // Close modal on success
        } else {
            toast({ ...RenderFailedToast(response?.JoinStudentToClass.message || "Failed to join the class.") });
        }

    };

    const onSelectClass = (classInfo: ClassInfo) => {
        handleClassSelect();
        setSelectedClass(classInfo);
    };
    const isDisabled = (tabValue: string) => {
        if (tabValue === "class-selection") return false;
        if (tabValue === "registration") return !completedSteps["select-class"];
        if (tabValue === "confirm-info") return !completedSteps["registration"];
        return false;
    }
    const handleClassSelect = () => {
        setCompletedSteps(prev => ({ ...prev, "select-class": true }));
    };

    const areAllStepsCompleted = () => {
        return Object.values(completedSteps).every((step) => step === true);
    };

    const disableSaveForm = () => {
        return !areAllStepsCompleted() || respLoad || isWaiting;
    }

    const handleRegistration = (e: React.FormEvent) => {
        e.preventDefault();
        setCompletedSteps(prev => ({ ...prev, "registration": true }));
        setActiveTab("confirm-info");
    };
    const handleConfirm = () => {
        setCompletedSteps(prev => ({ ...prev, "confirm-info": true }));
    };
    const nextStepClassSelect: string = "disabled:opacity-50";
    const onSubmitRegistration = (e: React.FormEvent) => {
        e.preventDefault();
        if (date && endDate) {
            console.log("Start Date: ", date);
            console.log("End Date: ", endDate);
        };

        if (!date || !endDate) {
            toast({ ...RenderFailedToast("Please fill in start date and end date") });
            return;
        }

        if (moment(endDate).isBefore(date)) {
            toast({ ...RenderFailedToast("Please endate should after start date") });
            return;
        };

        handleRegistration(e);
    };


    const handleActiveTab = (tab: string) => {
        if (isDisabled(tab)) return;
        setActiveTab(tab);
    };

    registrationInfo.classDescription = selectedClass?.Description || "";
    registrationInfo.className = selectedClass?.Name || "";
    registrationInfo.currentEnrollment = selectedClass?.Enrolled || 0;
    registrationInfo.endDate = endDate?.toLocaleDateString() || "";
    registrationInfo.startDate = date?.toLocaleDateString() || "";
    registrationInfo.classId = selectedClass?.Id || 0;
    registrationInfo.semester = selectedClass?.Semester?.name || "-";
    registrationInfo.maxEnrollment = selectedClass?.MaxStudents || 0;
    registrationInfo.classStartDate = selectedClass?.StartDate ? new Date(selectedClass.StartDate).toLocaleDateString() : "-";
    registrationInfo.classEndDate = selectedClass?.EndDate ? new Date(selectedClass.EndDate).toLocaleDateString() : "-";


    return (
        <Dialog onOpenChange={onOpenChange} open={open}>
            <DialogTrigger asChild>
                <Button variant="outline">Edit Profile</Button>
            </DialogTrigger>

            <Form {...form}>
                <form id="submit-form" onSubmit={(e) => {
                    e.preventDefault();
                }} className="space-y-8">

                    <DialogContent className="sm:max-w-[1000px] max-h-[800px] flex flex-col overflow-hidden gap-0 p-0">
                        <DialogHeader className="flex-shrink-0 p-6 pb-0">
                            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Enroll Student in Class
                            </DialogTitle>
                            <DialogDescription className="text-base">
                                Select a class, set enrollment dates, and confirm the registration. Complete all steps to finalize enrollment.
                            </DialogDescription>
                        </DialogHeader>
                        <Tabs value={activeTab} className="w-full flex-1 flex flex-col overflow-scroll px-6 pt-6" onValueChange={handleActiveTab}>
                            {/* Progress Indicator */}
                            <div className="mb-6 flex-shrink-0">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-sm font-semibold text-gray-700">Enrollment Progress</p>
                                    <p className="text-sm font-bold text-blue-600">
                                        {Math.round((Object.values(completedSteps).filter(Boolean).length / 3) * 100)}%
                                    </p>
                                </div>
                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600"
                                        initial={{ width: "0%" }}
                                        animate={{
                                            width: `${(Object.values(completedSteps).filter(Boolean).length / 3) * 100}%`
                                        }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                    />
                                </div>
                            </div>

                            {/* Modern Stepper Progress */}
                            <div className="mb-8 flex-shrink-0">
                                <div className="flex items-center justify-between relative">
                                    {/* Progress Line */}
                                    <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                                            initial={{ width: "0%" }}
                                            animate={{
                                                width: activeTab === "class-selection" ? "0%" :
                                                       activeTab === "registration" ? "50%" : "100%"
                                            }}
                                            transition={{ duration: 0.5, ease: "easeInOut" }}
                                        />
                                    </div>

                                    {/* Step 1: Class Selection */}
                                    <div className="flex flex-col items-center flex-1 relative z-10">
                                        <div className="relative">
                                            {activeTab === "class-selection" && !completedSteps["select-class"] && (
                                                <motion.div
                                                    className="absolute inset-0 rounded-full bg-blue-400"
                                                    animate={{
                                                        scale: [1, 1.5, 1],
                                                        opacity: [0.5, 0, 0.5],
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        ease: "easeInOut"
                                                    }}
                                                />
                                            )}
                                            <motion.button
                                                onClick={() => handleActiveTab("class-selection")}
                                                disabled={isDisabled("class-selection")}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 relative ${
                                                    completedSteps["select-class"]
                                                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                                                        : activeTab === "class-selection"
                                                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg scale-110"
                                                        : "bg-gray-200 text-gray-500"
                                                } disabled:cursor-not-allowed hover:scale-105`}
                                                whileHover={{ scale: isDisabled("class-selection") ? 1 : 1.1 }}
                                                whileTap={{ scale: isDisabled("class-selection") ? 1 : 0.95 }}
                                            >
                                            {completedSteps["select-class"] ? (
                                                <Check className="w-5 h-5" />
                                            ) : (
                                                "1"
                                            )}
                                            </motion.button>
                                        </div>
                                        <div className="mt-2 text-center">
                                            <p className={`text-xs font-semibold transition-colors ${
                                                activeTab === "class-selection" ? "text-blue-600" : "text-gray-600"
                                            }`}>
                                                Class Selection
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">Choose a class</p>
                                        </div>
                                    </div>

                                    {/* Step 2: Registration Info */}
                                    <div className="flex flex-col items-center flex-1 relative z-10">
                                        <div className="relative">
                                            {activeTab === "registration" && !completedSteps["registration"] && (
                                                <motion.div
                                                    className="absolute inset-0 rounded-full bg-blue-400"
                                                    animate={{
                                                        scale: [1, 1.5, 1],
                                                        opacity: [0.5, 0, 0.5],
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        ease: "easeInOut"
                                                    }}
                                                />
                                            )}
                                            <motion.button
                                                onClick={() => handleActiveTab("registration")}
                                                disabled={isDisabled("registration")}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 relative ${
                                                    completedSteps["registration"]
                                                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                                                        : activeTab === "registration"
                                                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg scale-110"
                                                        : isDisabled("registration")
                                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                        : "bg-gray-200 text-gray-500"
                                                } disabled:cursor-not-allowed hover:scale-105`}
                                                whileHover={{ scale: isDisabled("registration") ? 1 : 1.1 }}
                                                whileTap={{ scale: isDisabled("registration") ? 1 : 0.95 }}
                                            >
                                            {completedSteps["registration"] ? (
                                                <Check className="w-5 h-5" />
                                            ) : (
                                                "2"
                                            )}
                                            </motion.button>
                                        </div>
                                        <div className="mt-2 text-center">
                                            <p className={`text-xs font-semibold transition-colors ${
                                                activeTab === "registration" ? "text-blue-600" : "text-gray-600"
                                            }`}>
                                                Registration Info
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">Set dates</p>
                                        </div>
                                    </div>

                                    {/* Step 3: Confirm */}
                                    <div className="flex flex-col items-center flex-1 relative z-10 ">
                                        <div className="relative">
                                            {activeTab === "confirm-info" && !completedSteps["confirm-info"] && (
                                                <motion.div
                                                    className="absolute inset-0 rounded-full bg-blue-400"
                                                    animate={{
                                                        scale: [1, 1.5, 1],
                                                        opacity: [0.5, 0, 0.5],
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        ease: "easeInOut"
                                                    }}
                                                />
                                            )}
                                            <motion.button
                                                onClick={() => handleActiveTab("confirm-info")}
                                                disabled={isDisabled("confirm-info")}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 relative ${
                                                    completedSteps["confirm-info"]
                                                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                                                        : activeTab === "confirm-info"
                                                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg scale-110"
                                                        : isDisabled("confirm-info")
                                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                        : "bg-gray-200 text-gray-500"
                                                } disabled:cursor-not-allowed hover:scale-105`}
                                                whileHover={{ scale: isDisabled("confirm-info") ? 1 : 1.1 }}
                                                whileTap={{ scale: isDisabled("confirm-info") ? 1 : 0.95 }}
                                            >
                                            {completedSteps["confirm-info"] ? (
                                                <Check className="w-5 h-5" />
                                            ) : (
                                                "3"
                                            )}
                                            </motion.button>
                                        </div>
                                        <div className="mt-2 text-center">
                                            <p className={`text-xs font-semibold transition-colors ${
                                                activeTab === "confirm-info" ? "text-blue-600" : "text-gray-600"
                                            }`}>
                                                Confirm
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">Review & submit</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <TabsContent value="class-selection" className="flex flex-col gap-4">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex flex-col gap-4"
                                >
                                <div className="flex gap-4">
                                    <Card className="w-[300px] p-4">
                                        <CardHeader className="p-0 pb-4">
                                            <CardTitle className="text-lg">Select a Class</CardTitle>
                                            <CardDescription>Choose a class from the list</CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            {loading ? <LoadingPage /> : (<ClassesComboBox classes={classes} onselectClass={onSelectClass} selectedClass={selectedClass} />)}
                                        </CardContent>
                                    </Card>

                                    <Card className="flex-1 p-6">
                                        {selectedClass ? (
                                            <div className="space-y-6">
                                                {/* Class Header */}
                                                <div className="border-b pb-4">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedClass.Name}</h3>
                                                            <p className="text-sm text-gray-600">{selectedClass.Description || "No description available"}</p>
                                                        </div>
                                                        <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                                            {selectedClass.Status}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Class Details Grid */}
                                                <div className="grid grid-cols-2 gap-4">
                                                    {/* Enrollment */}
                                                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                                            <Users className="w-5 h-5 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-600 font-medium">Total Enrollment</p>
                                                            <p className="text-lg font-bold text-gray-900">
                                                                {selectedClass.Enrolled} / {selectedClass.MaxStudents || "∞"}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Semester */}
                                                    {selectedClass.Semester && (
                                                        <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                                                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                                                <BookOpen className="w-5 h-5 text-purple-600" />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-600 font-medium">Semester</p>
                                                                <p className="text-lg font-bold text-gray-900">{selectedClass.Semester.name}</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Start Date */}
                                                    {selectedClass.StartDate && (
                                                        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                                                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                                                <CalendarIcon className="w-5 h-5 text-green-600" />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-600 font-medium">Start Date</p>
                                                                <p className="text-sm font-bold text-gray-900">
                                                                    {new Date(selectedClass.StartDate).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* End Date */}
                                                    {selectedClass.EndDate && (
                                                        <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                                                            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                                                                <Clock className="w-5 h-5 text-orange-600" />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-600 font-medium">End Date</p>
                                                                <p className="text-sm font-bold text-gray-900">
                                                                    {new Date(selectedClass.EndDate).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Class ID Badge */}
                                                <div className="pt-4 border-t">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-gray-500">Class ID:</span>
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-mono">
                                                            #{selectedClass.Id}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-center py-12">
                                                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                                    <BookOpen className="w-8 h-8 text-gray-400" />
                                                </div>
                                                <p className="text-gray-500 font-medium">No class selected</p>
                                                <p className="text-sm text-gray-400 mt-1">Choose a class to view details</p>
                                            </div>
                                        )}
                                    </Card>
                                </div>

                                <CardFooter className="px-0 flex justify-between items-center">
                                    <div className="text-sm text-gray-600">
                                        Step 1 of 3
                                    </div>
                                    <Button
                                        className="disabled:opacity-50 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all"
                                        disabled={selectedClass === null}
                                        onClick={() => {
                                            setActiveTab("registration");
                                        }}
                                    >
                                        Continue to Registration
                                        <motion.span
                                            className="ml-2"
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                        >
                                            →
                                        </motion.span>
                                    </Button>
                                </CardFooter>
                                </motion.div>
                            </TabsContent>
                            <TabsContent value="registration">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Registration Information</CardTitle>
                                        <CardDescription>
                                            Review selected class details and set enrollment dates
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Selected Class Info Summary */}
                                        {selectedClass && (
                                            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                                                        <BookOpen className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900">{selectedClass.Name}</h4>
                                                        <p className="text-xs text-gray-600">Class ID: #{selectedClass.Id}</p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-blue-200">
                                                    <div className="flex items-center gap-2">
                                                        <Users className="w-4 h-4 text-blue-600" />
                                                        <div>
                                                            <p className="text-xs text-gray-600">Enrollment</p>
                                                            <p className="text-sm font-semibold">{selectedClass.Enrolled}/{selectedClass.MaxStudents || "∞"}</p>
                                                        </div>
                                                    </div>
                                                    {selectedClass.Semester && (
                                                        <div className="flex items-center gap-2">
                                                            <GraduationCap className="w-4 h-4 text-purple-600" />
                                                            <div>
                                                                <p className="text-xs text-gray-600">Semester</p>
                                                                <p className="text-sm font-semibold">{selectedClass.Semester.name}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {selectedClass.StartDate && (
                                                        <div className="flex items-center gap-2">
                                                            <CalendarIcon className="w-4 h-4 text-green-600" />
                                                            <div>
                                                                <p className="text-xs text-gray-600">Class Starts</p>
                                                                <p className="text-sm font-semibold">{new Date(selectedClass.StartDate).toLocaleDateString()}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {selectedClass.EndDate && (
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-4 h-4 text-orange-600" />
                                                            <div>
                                                                <p className="text-xs text-gray-600">Class Ends</p>
                                                                <p className="text-sm font-semibold">{new Date(selectedClass.EndDate).toLocaleDateString()}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Enrollment Date Selection */}
                                        <form id="registration-from" onSubmit={onSubmitRegistration} className="space-y-6">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="startDate" className="text-sm font-semibold flex items-center gap-2">
                                                        <CalendarIcon className="w-4 h-4 text-green-600" />
                                                        Enrollment Start Date
                                                    </Label>
                                                    <NeonPopoverCalendarComponent date={date} setDate={setDate} />
                                                    <p className="text-xs text-gray-500">When the student will begin attending</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="endDate" className="text-sm font-semibold flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-orange-600" />
                                                        Enrollment End Date
                                                    </Label>
                                                    <NeonPopoverCalendarComponent date={endDate} setDate={setEndDate} />
                                                    <p className="text-xs text-gray-500">When the enrollment will conclude</p>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="text-sm text-gray-600">
                                                    Step 2 of 3
                                                </div>
                                                <Button
                                                    form="registration-from"
                                                    type="submit"
                                                    className="disabled:opacity-50 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all"
                                                >
                                                    Continue to Confirmation
                                                    <motion.span
                                                        className="ml-2"
                                                        animate={{ x: [0, 5, 0] }}
                                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                                    >
                                                        →
                                                    </motion.span>
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                                </motion.div>
                            </TabsContent>
                            <TabsContent value="confirm-info" className="flex-1  flex flex-col mt-0">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex-1 flex"
                                >
                                <RegistrationCardInfo
                                    data={registrationInfo}
                                    onConfirm={handleConfirm}
                                    confirmed={completedSteps["confirm-info"]}
                                />
                                </motion.div>
                            </TabsContent>
                        </Tabs>
                        <DialogFooter className="flex-shrink-0 p-6 pt-0">

                            <motion.div
                                initial={{ opacity: 1 }}
                                animate={{ opacity: isWaiting ? 0.8 : 1 }} // Fade effect
                                transition={{ duration: 0.3 }}
                            >
                                <Button
                                    form="submit-form"
                                    type="submit"
                                    onClick={handleClick}
                                    disabled={isWaiting}
                                    className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 disabled:opacity-40"
                                >
                                    {disableSaveForm() ? (
                                        <>
                                            {/* 🌀 Spinning icon with custom speed */}
                                            <Loader2 className="animate-spin w-5 h-5 motion-reduce:animate-[spin_1s_linear_infinite]" />
                                            Processing...
                                        </>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </Button>
                            </motion.div>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Form>


        </Dialog>
    )
};