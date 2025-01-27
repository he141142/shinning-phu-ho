import { Input } from "@/components/drake_libs/ui/input";
import { Label } from "@/components/drake_libs/ui/label";
import { Select, SelectContent, SelectGroup, SelectLabel, SelectTrigger, SelectValue, SelectItem } from "@/components/drake_libs/ui/select";
import { GradeInfo } from "@/models/class";
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
            <form >
                <div className="grid grid-cols-12 grid-flow-row gap-4 grid-rows-8">
                    <div className="col-span-4">
                        <CustomInput
                            id="class-name"
                            name="class-name"
                            label="Class Name"
                            type="text"
                            OnChange={handleClassNameChange}
                        />
                    </div>
                    <div className="col-span-4">
                        <CustomDropDown
                            Render={renderFn} Id={"grade-tmp"} PlaceHolder={"Select Grade"}
                            LabelMetadata={{ Display: "Grade", Key: "grade-tmp" }}
                            ElmProps={{ ClassName: "w-full", Id: "grade-tmp" }}
                            SelectItemFn={selectItemFn}
                        />
                    </div>
                    <div className="row-start-2 col-span-4">
                        <ShiDateTimePicker Display="Start Date" OnSelect={setStartDate} />
                    </div>
                    <div className="row-start-2 col-span-4">
                        <ShiDateTimePicker Display="End Date" OnSelect={setEndDate} />
                    </div>
                    <div className="row-start-3 row-span-4 col-start-1 col-span-4 pb-4">
                        <CustomTextArea BasicElementProps={{
                            Id: "class-description",
                            ClassName: "border-2 border-gray-300 w-full h-[150px] p-2",
                        }}
                            LabelMetadata={
                                {
                                    Display: "Class Description",
                                    Key: "class-description",
                                }
                            }


                            resize={false}

                        />
                    </div>
                    <div className="mt-3 row-start-5 col-start-1">
                        <MyCustomButton DisplayText="Next" />
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ClassInfoPage;