import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/drake_libs/ui/tabs";
import TabContainerContent from "./container_content";
import ClassInfoPage from "./basic.class.info";
import { useState } from "react";

interface TabInfo {
    Name: string;
    Id: string;
}

export type OnSelect = (tabName: string) => void;
export type OnSelectCb = () => OnSelect;


export default function CreateClassPage() {
    let tabs: Map<string, TabInfo> = new Map<string, TabInfo>();
    tabs.set("class-info", { Name: "Class Info", Id: "class-info" });
    tabs.set("teacher", { Name: "Class Description", Id: "class-description" });
    // tabs.set("class-schedule", { Name: "Class Schedule", Id: "class-schedule" });

    const [activeTab, setActiveTab] = useState<Map<string, boolean>>(new Map<string, boolean>([
        ["class-info", true],
        ["teacher", false],
    ]));


    const setActiveTabAgg = (tabName: string) => {
        let newActiveTab = new Map<string, boolean>();
        activeTab.forEach((value, key) => {
            if (key === tabName) {
                newActiveTab.set(key, true);
            }
        });
        setActiveTab(newActiveTab);
    };

    const onSelectByTab: Map<string, OnSelect> = new Map<string, OnSelect>();
    tabs.forEach((value, key) => {
        onSelectByTab.set(key, () => {
            setActiveTabAgg(key);
        });
    });

    const onSelect: OnSelect = (tabName: string) => {
        setActiveTabAgg(tabName);
    };

    const OnSelectCB: OnSelectCb = () => (tabName: string) => {
        setActiveTabAgg(tabName);
    };

    const classInfoPage = <ClassInfoPage OnSelect={onSelectByTab.get("class-info")}></ClassInfoPage>

    const TabDefaultClass = "text-[15px] rounded-none bg-gray-500 text-white data-[state=active]:text-[35px] data-[state=active]:bg-pink-700 data-[state=active]:text-white data-[state=active]:shadow-sm";

    return <>
        <div className="class-header">
            <h1 className="font-bold text-[40px]">Add Class</h1>
            <div className="bg-black w-full h-[1px]"></div>
        </div>
        <div className="p-4 pt-16">
            <Tabs defaultValue="class-info" className="w-[100%] p-8">
                <TabsList className="p-3 flex flex-row h-[100px] justify-start items-end gap-0.5 rounded-none">
                    <TabsTrigger disabled={activeTab.get("class-info")} value="class-info" className={TabDefaultClass}>Class Info</TabsTrigger>
                    <TabsTrigger disabled={activeTab.get("teacher")} value="teacher" className={TabDefaultClass} >Add teacher</TabsTrigger>
                </TabsList>
                <TabsContent value="class-info">
                    <TabContainerContent content={classInfoPage} />
                </TabsContent>
                <TabsContent value="teacher">
                    Change your password here.
                </TabsContent>
            </Tabs>
        </div>

    </>
}