import { Input } from "@/components/drake_libs/ui/input";
import { Label } from "@/components/drake_libs/ui/label";
import { Select, SelectContent, SelectGroup, SelectLabel, SelectTrigger, SelectValue, SelectItem } from "@/components/drake_libs/ui/select";
import { GradeInfo } from "@/models/class/class";
import { GetGradesInfo } from "@/models/mocks/get_list_classes";
import { useEffect, useMemo, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/drake_libs/ui/popover";
import { Button } from "@/components/drake_libs/ui/button";
import { CalendarIcon } from "@/components/drake_libs/component/home-page";
import { Calendar } from "@/components/drake_libs/ui/calendar";
import { cn } from "@/lib/utils";
import { ShiDateTimePicker } from "@/components/custom/custome.datetime-picker";
import { CustomDropDown, RenderItems, SelectItemMetadata } from "@/components/custom/custom.dropdown";
import { CustomInput } from "@/components/custom/custom.input";
import { CustomTextArea } from "@/components/custom/custom.text-area";
import { UseCreateClassHook } from "@/hooks/create.class.hook";
import { MyCustomButton } from "@/components/custom/custom.button";
import { OnSelect, OnSelectCb } from ".";





type SelectItemFn = (item: SelectItemMetadata) => void;

const ClassInfoPage = (props: {
    OnSelect: OnSelect | undefined;
}) => {

    const { GradeBySelectItem, setClassName, setGrades, classNameDispl } = UseCreateClassHook();

    const [loadClass, setIsLoadClass] = useState<boolean>(false);
    const [selectedGrade, setSelectedGrade] = useState<GradeInfo | null>(null);
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();

    const [popup, setPopup] = useState({
        open: false,
        type: "start",
        content: ""
    });


    // setPopup(pre => ({
    //     ...pre,
    //     content: "abc"
    // }))

    const [data, setData] = useState({})

    // setPopup(pre => ({
    //     ...pre,
    //     name: ""
    // }))

    // const classes = useMemo(() =>{
    //     if(active) {
    //         return "active"
    //     }
    //     return "hidden"
    // },[])


    useEffect(() => {

    }, []);


    // Handle changes in the custom input
    const handleClassNameChange = (value: string) => {
        setClassName(value);
    };

    const selectItemFn: SelectItemFn = (item: SelectItemMetadata) => {
        let grade = GradeBySelectItem.get(item.Key);
        if (grade) {
            setSelectedGrade(grade);
        }
    }

    const renderFn: RenderItems = () => {
        let placeHolder: GradeInfo[] = [];
        return new Promise<SelectItemMetadata[]>(
            resolve => {
                GetGradesInfo().then(grade => {
                    setGrades(grade);
                    let items = grade.map(g => {
                        return {
                            Display: g.Name,
                            Key: g.Id.toString(),
                            Name: g.Id.toString()
                        } as SelectItemMetadata;
                    })
                    resolve(items);
                    return items;
                })
                    .finally(() => placeHolder);

            });
    }

    return (
        <div>
            <form className="space-y-8">
                {/* Section: Basic Information */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">1</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <CustomInput
                                id="class-name"
                                name="class-name"
                                label="Class Name"
                                type="text"
                                OnChange={handleClassNameChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <CustomDropDown
                                Render={renderFn}
                                Id={"grade-tmp"}
                                PlaceHolder={"Select Grade"}
                                LabelMetadata={{ Display: "Grade", Key: "grade-tmp" }}
                                ElmProps={{ ClassName: "w-full", Id: "grade-tmp" }}
                                SelectItemFn={selectItemFn}
                            />
                        </div>
                    </div>
                </div>

                {/* Section: Schedule */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center">
                            <span className="text-cyan-600 font-semibold text-sm">2</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Schedule</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <ShiDateTimePicker Display="Start Date" OnSelect={setStartDate} />
                        </div>
                        <div className="space-y-2">
                            <ShiDateTimePicker Display="End Date" OnSelect={setEndDate} />
                        </div>
                    </div>
                </div>

                {/* Section: Description */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                            <span className="text-green-600 font-semibold text-sm">3</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Description</h3>
                    </div>
                    <div className="space-y-2">
                        <CustomTextArea
                            BasicElementProps={{
                                Id: "class-description",
                                ClassName: "border-2 border-gray-300 w-full h-[150px] p-3 rounded-lg focus:border-blue-500 focus:ring-blue-500 transition-colors",
                            }}
                            LabelMetadata={{
                                Display: "Class Description",
                                Key: "class-description",
                            }}
                            resize={false}
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                    <MyCustomButton DisplayText="Save & Continue" />
                </div>
            </form>
        </div>
    )
}

export default ClassInfoPage;