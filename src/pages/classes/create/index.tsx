"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/drake_libs/ui/tabs";
import ClassInfoPage, { OnSelect } from "./basic.class.info";
import { useState, useMemo } from "react";
import { Button } from "@/components/drake_libs/ui/button";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";


export default function CreateClassPage() {
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<Map<string, boolean>>(new Map<string, boolean>([
        ["class-info", true],
        ["teacher", false],
    ]));

    const setActiveTabAgg = useMemo(() => (tabName: string) => {
        let newActiveTab = new Map<string, boolean>();
        activeTab.forEach((value, key) => {
            if (key === tabName) {
                newActiveTab.set(key, true);
            }
        });
        setActiveTab(newActiveTab);
    }, [activeTab]);

    const onSelectClassInfo = useMemo<OnSelect | undefined>(() =>
        () => setActiveTabAgg("class-info")
    , [setActiveTabAgg]);

    const backToClassPage = () => {
        router.push("/classes");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={backToClassPage}
                        className="mb-4 hover:bg-white hover:shadow-md transition-all"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Classes
                    </Button>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                <GraduationCap className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                    Add New Class
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Fill in the information below to create a new class
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Tabs */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
                    <Tabs defaultValue="class-info" className="w-full">
                        <TabsList className="w-full justify-start rounded-t-2xl bg-gray-50 border-b p-2 gap-2">
                            <TabsTrigger
                                // disabled={activeTab.get("class-info")}
                                value="class-info"
                                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
                            >
                                Class Info
                            </TabsTrigger>
                            <TabsTrigger
                                // disabled={activeTab.get("teacher")}
                                value="teacher"
                                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
                            >
                                Add Teacher
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="class-info" className="p-8">
                            <ClassInfoPage OnSelect={onSelectClassInfo} />
                        </TabsContent>
                        <TabsContent value="teacher" className="p-8">
                            <div className="text-center py-12 text-gray-500">
                                Teacher assignment coming soon...
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}