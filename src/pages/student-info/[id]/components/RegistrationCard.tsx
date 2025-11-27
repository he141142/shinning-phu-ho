import React, { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/drake_libs/ui/card";
import { CalendarIcon } from "@/components/drake_libs/component/home-page";
import { Button } from "@/components/drake_libs/ui/button";
import { Users, BookOpen, Calendar, Clock, GraduationCap } from "lucide-react";

export interface RegistrationCardInfoProps {
    data: RegistrationCardInfoData;
    onConfirm?: () => void;
    confirmed?: boolean;
}

export interface RegistrationCardInfoData {
    className: string;
    classDescription: string;
    currentEnrollment: number;
    grade: string;
    centerName: string;
    centerId: number;
    startDate: string;
    endDate: string;
    classId: number;
    studentId: number;
    semester?: string;
    maxEnrollment?: number;
    classStartDate?: string;
    classEndDate?: string;
}

export const RegistrationCardInfo: React.FC<RegistrationCardInfoProps> = React.memo(({
    data,
    onConfirm,
    confirmed = false
}) => {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    const handleViewDetails = () => {
        const url = `/class_detail/${data.classId}`;
        window.open(url, "_blank"); // 🟢 Open in new tab
    };

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
    }

    console.log("rendered");
    


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full flex"
        >
            <Card className="shadow-lg border border-gray-200 rounded-2xl  hover:shadow-xl transition-all duration-300 flex flex-col flex-1">
                <CardHeader className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white p-6 flex-shrink-0">
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold mb-2">{data.className}</CardTitle>
                            <CardDescription className="text-blue-50">{data.classDescription || "No description available"}</CardDescription>
                        </div>
                        <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                            <p className="text-xs font-semibold">ID: #{data.classId}</p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6 overflow-y-auto flex-1 min-h-0">
                    {/* Class Details Grid */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                            Class Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Enrollment */}
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <Users className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 font-medium">Enrollment</p>
                                    <p className="text-sm font-bold text-gray-900">
                                        {data.currentEnrollment} / {data.maxEnrollment || "∞"}
                                    </p>
                                </div>
                            </div>

                            {/* Semester */}
                            {data.semester && (
                                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                                        <BookOpen className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600 font-medium">Semester</p>
                                        <p className="text-sm font-bold text-gray-900">{data.semester}</p>
                                    </div>
                                </div>
                            )}

                            {/* Grade */}
                            <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                    <GraduationCap className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 font-medium">Grade</p>
                                    <p className="text-sm font-bold text-gray-900">{data.grade}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Class Schedule */}
                    {(data.classStartDate || data.classEndDate) && (
                        <div className="border-t pt-4">
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-green-600" />
                                Class Schedule
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {data.classStartDate && (
                                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                                            <Calendar className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600 font-medium">Class Starts</p>
                                            <p className="text-sm font-bold text-gray-900">{data.classStartDate}</p>
                                        </div>
                                    </div>
                                )}
                                {data.classEndDate && (
                                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                                        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                                            <Clock className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600 font-medium">Class Ends</p>
                                            <p className="text-sm font-bold text-gray-900">{data.classEndDate}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Center Information */}
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-lg mb-3">Center Information</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                <p className="text-sm text-gray-600">Center Name:</p>
                                <p className="font-semibold text-gray-900">{data.centerName}</p>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                <p className="text-sm text-gray-600">Center ID:</p>
                                <p className="font-semibold text-gray-900">#{data.centerId}</p>
                            </div>
                        </div>
                    </div>

                    {/* Student Enrollment Dates */}
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5 text-blue-600" />
                            Student Enrollment Period
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-lg border border-teal-200">
                                <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                                    <Calendar className="w-5 h-5 text-teal-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 font-medium">Enrollment Start</p>
                                    <p className="text-sm font-bold text-gray-900">{data.startDate || "-"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 font-medium">Enrollment End</p>
                                    <p className="text-sm font-bold text-gray-900">{data.endDate || "-"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 flex justify-between gap-3 flex-shrink-0">
                    <Button
                        variant="outline"
                        className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                        onClick={handleViewDetails}
                    >
                        View Full Details
                    </Button>
                    {!confirmed && (
                        <Button
                            variant="default"
                            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md"
                            onClick={onConfirm}
                        >
                            Confirm Enrollment
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </motion.div>
    );
});