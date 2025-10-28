import React, { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/drake_libs/ui/card";
import { CalendarIcon } from "@/components/drake_libs/component/home-page";
import { Button } from "@/components/drake_libs/ui/button";

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
            className="w-full max-w-lg mx-auto"
        >
            <Card className="shadow-lg border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6">
                    <CardTitle className="text-2xl font-bold">{data.className}</CardTitle>
                    <CardDescription>{data.classDescription}</CardDescription>
                </CardHeader>
                
                <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between">
                        <p className="text-gray-600">Current Enrollment:</p>
                        <p className="font-semibold">{data.currentEnrollment} Students</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-gray-600">Grade:</p>
                        <p className="font-semibold">{data.grade}</p>
                    </div>
                    
                    <div className="mt-4 border-t pt-4">
                        <h3 className="font-semibold text-lg">Center Information</h3>
                        <div className="flex justify-between">
                            <p className="text-gray-600">Center Name:</p>
                            <p className="font-semibold">{data.centerName}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="text-gray-600">Center ID:</p>
                            <p className="font-semibold">{data.centerId}</p>
                        </div>
                    </div>

                    <div className="mt-4 border-t pt-4">
                        <h3 className="font-semibold text-lg">Registration Info</h3>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="w-5 h-5 text-gray-500" />
                                <p className="text-gray-600">Start Date:</p>
                            </div>
                            <p className="font-semibold">{data.startDate}</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="w-5 h-5 text-gray-500" />
                                <p className="text-gray-600">End Date:</p>
                            </div>
                            <p className="font-semibold">{data.endDate}</p>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="p-6 bg-gray-50 flex justify-end">
                    <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleViewDetails}>
                        View Details
                    </Button>
                    {!confirmed?<Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onConfirm}>
                        Confirm Information
                    </Button>:null}
                </CardFooter>
            </Card>
        </motion.div>
    );
});