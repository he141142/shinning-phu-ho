import { GradeInfo } from "@/models/class/class";
import { useMemo, useState } from "react";

import { Button } from "@/components/drake_libs/ui/button";
import { ShiDateTimePicker } from "@/components/custom/custome.datetime-picker";
import {
  CustomDropDown,
  SelectItemMetadata,
} from "@/components/custom/custom.dropdown";
import { CustomInput } from "@/components/custom/custom.input";
import { CustomTextArea } from "@/components/custom/custom.text-area";
import { CreateClassConfirmModal } from "@/components/classes/CreateClassConfirmModal";
import { useRouter } from "next/navigation";
import type { CreateClassInput } from "@/models/class/CreateClass";
import { SemesterSelector } from "@/components/classes/SemesterSelector";
import { CLASS_SETUP_DEFAULT } from "@/static/default_vars";
import { useGetGrades } from "./use_get_grades";
import { format } from "date-fns";

type SelectItemFn = (item: SelectItemMetadata) => void;
export interface ClassDataPreviewProp {
  class_data_input: CreateClassInput;
  grade_info: GradeInfo;
}
export interface TabInfo {
    Name: string;
    Id: string;
}

export type OnSelect = (tabName: string) => void;
export type OnSelectCb = () => OnSelect;


const ClassInfoPage = (props: { OnSelect: OnSelect | undefined }) => {
  const router = useRouter();

  const [Grades, setGrades] = useState<GradeInfo[]>([]);
  const [className, setClassName] = useState<string>("");

  const renderFn = useGetGrades({ setGrades });

  const GradeBySelectItem = useMemo(() => {
    const map = new Map<string, GradeInfo>();
    for (let grade of Grades) {
      map.set(grade.Id.toString(), grade);
    }
    return map;
  }, [Grades]);

  let classNameDispl = className;

  const [selectedGrade, setSelectedGrade] = useState<GradeInfo | null>(null);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [description, setDescription] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedSemesterId, setSelectedSemesterId] = useState<number | null>(
    null
  );

  // Handle changes in the custom input
  const handleClassNameChange = (value: string) => {
    setClassName(value);
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
  };

  const selectItemFn: SelectItemFn = (item: SelectItemMetadata) => {
    let grade = GradeBySelectItem.get(item.Key);
    console.log(
      `key: ${JSON.stringify(item)}, grade: ${JSON.stringify(grade)}`
    );

    if (grade) {
      setSelectedGrade(grade);
    }
  };

  const handleSaveClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    router.push("/classes");
  };

  const getClassData = (): ClassDataPreviewProp => {
    return {
      class_data_input: {
        class_name: classNameDispl,
        description: description || "no description",
        grade_id: selectedGrade?.Id || undefined,
        start_date: format(startDate || new Date(), "yyyy-MM-dd") || undefined,
        end_date: format(endDate || new Date(), "yyyy-MM-dd") || undefined,
        current_semester: selectedSemesterId || undefined,
        center_id: CLASS_SETUP_DEFAULT.center_id,
        max_students: CLASS_SETUP_DEFAULT.max_students,
      },
      grade_info: selectedGrade || { Id: 0, Name: "N/A" },
    };
  };

  return (
    <div>
      <form className="space-y-8">
        {/* Section: Basic Information */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">1</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Basic Information
            </h3>
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

          {/* Semester Selector with lazy loading */}
          <SemesterSelector
            startDate={startDate}
            endDate={endDate}
            selectedSemesterId={selectedSemesterId}
            onSelectSemester={setSelectedSemesterId}
          />
          {/* <SemesterSelectorStatic loaded={classSemes} /> */}
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
                ClassName:
                  "border-2 border-gray-300 w-full h-[150px] p-3 rounded-lg focus:border-blue-500 focus:ring-blue-500 transition-colors",
              }}
              LabelMetadata={{
                Display: "Class Description",
                Key: "class-description",
              }}
              resize={false}
              OnChange={handleDescriptionChange}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <Button
            type="button"
            onClick={handleSaveClick}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md hover:shadow-lg transition-all px-8"
          >
            Save & Continue
          </Button>
        </div>
      </form>

      <CreateClassConfirmModal
        open={isModalOpen}
        onClose={handleModalClose}
        classData={getClassData()}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default ClassInfoPage;
