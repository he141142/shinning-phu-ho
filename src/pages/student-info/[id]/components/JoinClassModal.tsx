
import React, { useState } from "react";
import { Button } from "@/components/drake_libs/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/drake_libs/ui/dialog";
import { Input } from "@/components/drake_libs/ui/input";
import { Label } from "@/components/drake_libs/ui/label";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/drake_libs/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
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
import { Loader2 } from "lucide-react";
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
    const [validRegistration, setValidRegistration] = useState(false);

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


    return (
        <Dialog onOpenChange={onOpenChange} open={open}>
            <DialogTrigger asChild>
                <Button variant="outline">Edit Profile</Button>
            </DialogTrigger>

            <Form {...form}>
                <form id="submit-form" onSubmit={(e) => {
                    e.preventDefault();
                }} className="space-y-8">

                    <DialogContent className="sm:max-w-[1000px]">
                        <DialogHeader>
                            <DialogTitle>Join Student To Class</DialogTitle>
                            <DialogDescription>
                                Join Student To Class. Click save when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <Tabs value={activeTab} className="w-full" onValueChange={handleActiveTab}>
                            <TabsList className="grid w-full grid-cols-3 disabled:opacity-50">
                                <TabsTrigger value="class-selection" disabled={isDisabled("select-class")}
                                    className="data-[state=inactive]:opacity-50 data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:after:scale-x-0 data-[state=active]:text-blue-400
                            data-[state=active]:hover:text-primary data-[state=active]:hover:font-semibold hover:after:scale-x-0 data-[state=active]:hover:text-blue-400
                            data-[state=inactive]:animate-bounce"
                                >Class Selection</TabsTrigger>
                                <TabsTrigger value="registration" disabled={isDisabled("registration")}
                                    className="data-[state=inactive]:opacity-50 data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:after:scale-x-0 data-[state=active]:text-blue-400
                            data-[state=active]:hover:text-primary data-[state=active]:hover:font-semibold hover:after:scale-x-0 data-[state=active]:hover:text-blue-400
                            data-[state=inactive]:animate-bounce data-disabled:opacity-0
                            "

                                >Registration Info</TabsTrigger>
                                <TabsTrigger value="confirm-info" disabled={isDisabled("confirm-info")}
                                    className="data-[state=inactive]:opacity-50 data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:after:scale-x-0 data-[state=active]:text-blue-400
                            data-[state=active]:hover:text-primary data-[state=active]:hover:font-semibold hover:after:scale-x-0 data-[state=active]:hover:text-blue-400
                            data-[state=inactive]:animate-bounce data-[disabled]:opacity-50 data-[disabled]:animate-none    
                            "
                                >Confirm Information</TabsTrigger>
                            </TabsList>
                            <TabsContent value="class-selection" className="flex justify-center">
                                <Card className="w-[80%] p-4 flex">
                                    <Card className="h-full">
                                        {loading ? <LoadingPage /> : (<ClassesComboBox classes={classes} onselectClass={onSelectClass} selectedClass={selectedClass} />)}
                                    </Card>
                                    <Card className="grow p-4">
                                        <div>You selected class: {selectedClass ? `${selectedClass.Name} With ID: ${selectedClass.Id}` : "-"}</div>
                                    </Card>
                                </Card>
                                <CardFooter>
                                    <Button className="disabled:opacity-50" disabled={selectedClass === null} onClick={() => {
                                        setActiveTab("registration");
                                    }}>Next Step</Button>
                                </CardFooter>

                            </TabsContent>
                            <TabsContent value="registration">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Password</CardTitle>
                                        <CardDescription>
                                            Change your password here. After saving, you'll be logged out.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <form id="registration-from" onSubmit={onSubmitRegistration} className="space-y-8">
                                            <div className="space-y-2">
                                                <Label htmlFor="dateOfBirth">Start Date</Label>
                                                <NeonPopoverCalendarComponent date={date} setDate={setDate} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="dateOfBirth">End Date</Label>
                                                <NeonPopoverCalendarComponent date={endDate} setDate={setEndDate} />
                                            </div>
                                            <Button form="registration-from" type="submit" className="disabled:opacity-50" >Next Step</Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="confirm-info">
                                <RegistrationCardInfo
                                    data={registrationInfo}
                                    onConfirm={handleConfirm}
                                    confirmed={completedSteps["confirm-info"]}
                                />
                            </TabsContent>
                        </Tabs>
                        <DialogFooter>

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