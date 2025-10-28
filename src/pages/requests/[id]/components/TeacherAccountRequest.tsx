import { Button } from "@/components/drake_libs/ui/button"
import { Card, CardContent } from "@/components/drake_libs/ui/card"

import { motion } from "framer-motion"
import { teacherAccountRequest } from "../models/model"
import TeacherTeaching from "./TeacherAnimate"

export const TeacherAccountRequest = ({
    requestData,
    requestType,
}: {
    requestData: teacherAccountRequest
    requestType: string
}) => {
    return (
        <>
            <Card>
                <CardContent className="p-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <h2 className="text-2xl font-semibold mb-4">{requestType}</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="font-semibold">First Name:</p>
                                <p>{requestData.first_name}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Last Name:</p>
                                <p>{requestData.last_name}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Middle Name:</p>
                                <p>{requestData.middle_name}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Email:</p>
                                <p>{requestData.email}</p>
                            </div>
                            <div>
                                <p className="font-semibold">User Type:</p>
                                <motion.div
                                    className="inline-block px-3 py-1 rounded-full text-white"
                                    style={{
                                        backgroundColor:
                                            requestData.user_type === "teacher"
                                                ? "#4CAF50"
                                                : requestData.user_type === "staff"
                                                    ? "#2196F3"
                                                    : "#FFC107",
                                    }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    {requestData.user_type}
                                </motion.div>
                            </div>
                            <div>
                                <p className="font-semibold">Status:</p>
                                <motion.span
                                    className={`inline-block px-2 py-1 rounded-full text-xs text-white ${requestData.status === "pending"
                                        ? "bg-yellow-500"
                                        : requestData.status === "approved"
                                            ? "bg-green-500"
                                            : "bg-red-500"
                                        }`}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {requestData.status}
                                </motion.span>
                            </div>
                        </div>
                    </motion.div>
                </CardContent>
            </Card>
            <div className="grid grid-cols-3 gap-4 mt-6">
                {/* <motion.div
                    className="absolute top-2 right-2 w-8 h-8 bg-gray-800 rounded-full"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                        ✦
                    </div>
                </motion.div> */}
                <Card>
                    <TeacherTeaching />
                </Card>
                <motion.div className="col-span-1" 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} 
                    whileTap={{ scale: 0.9 }}
                >
                    <Card >
                        <CardContent className="p-6">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                                <h2 className="text-2xl font-semibold mb-4">Account Info</h2>
                                <div className="flex flex-col gap-4">
                                    <div className="flex justify-start gap-2">
                                        <p className="font-semibold w-50">User Name:</p>
                                        <p>Hien Thu</p>
                                    </div>
                                    <div className="flex justify-start gap-2">
                                        <p className="font-semibold ">Email:</p>
                                        <p>drk@gmail.com</p>
                                    </div>
                                    <div className="flex justify-start gap-2">
                                        <p className="font-semibold ">Center:</p>
                                        <p>Shinning phu Ho</p>
                                    </div>


                                    <div className="flex gap-3">
                                        <p className="font-semibold">Status:</p>
                                        <motion.span
                                            className={`inline-block px-2 py-1 rounded-full text-xs text-white ${requestData.status === "pending"
                                                ? "bg-red-500"
                                                : requestData.status === "approved"
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                                }`}
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            Inactivate
                                        </motion.span>
                                    </div>
                                </div>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div className="col-span-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} 
                    whileTap={{ scale: 0.9 }}
                >
                    <Card >
                        <CardContent className="p-6">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                                <h2 className="text-2xl font-semibold mb-4">Account Info</h2>
                                <div className="flex flex-col gap-4">
                                    <div className="flex justify-start gap-2">
                                        <p className="font-semibold w-50">User Name:</p>
                                        <p>Hien Thu</p>
                                    </div>
                                    <div className="flex justify-start gap-2">
                                        <p className="font-semibold ">Email:</p>
                                        <p>drk@gmail.com</p>
                                    </div>
                                    <div className="flex justify-start gap-2">
                                        <p className="font-semibold ">Center:</p>
                                        <p>Shinning phu Ho</p>
                                    </div>


                                    <div className="flex gap-3">
                                        <p className="font-semibold">Status:</p>
                                        <motion.span
                                            className={`inline-block px-2 py-1 rounded-full text-xs text-white ${requestData.status === "pending"
                                                ? "bg-red-500"
                                                : requestData.status === "approved"
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                                }`}
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            Inactivate
                                        </motion.span>
                                    </div>
                                </div>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>


            </div>
            <div className="mt-6 flex justify-end space-x-4">
                <Button variant="destructive">Reject</Button>
                <Button>Approve</Button>
            </div>
        </>
    )
}
