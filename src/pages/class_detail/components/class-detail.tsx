"use client";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  GraduationCap,
  Users,
  UserPlus,
  UserRoundCog,
  ClipboardCheck,
  Edit,
  Save,
  X,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/drake_libs/ui/avatar";
import { Badge } from "@/components/drake_libs/ui/badge";
import { Button } from "@/components/drake_libs/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/drake_libs/ui/card";
import { Label } from "@/components/drake_libs/ui/label";
import { Switch } from "@/components/drake_libs/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/drake_libs/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/drake_libs/ui/table";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/drake_libs/ui/dialog";
import ModernEnrollStudentForm from "@/components/drake_libs/modern-enroll-student-form";
import { StudentTabListModel } from "@/models/class/class.detail";
import { TimeTable } from "@/models/class/class";
import {
  ErrorPage,
  LoadingPage,
} from "@/components/drake_libs/component/loading-page";
import { Input } from "@/components/drake_libs/ui/input";
import { TeacherSelectionModal } from "@/components/classes/TeacherSelectionModal";
import { useGetListSemesters } from "@/hooks/semesters";
import { useGetAllGrades } from "@/hooks/grades";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/drake_libs/ui/select";
import { useToast } from "@/components/hooks/use-toast";
import {
  RenderSuccessToast,
  RenderFailedToast,
} from "@/components/drake_libs/customs/custom-toast";
import { ShiDateTimePicker } from "@/components/custom/custome.datetime-picker";
import { useRouter } from "next/navigation";
import { SemesterTimeline, ClassSemesterData } from "./SemesterTimeline";
import { Semester } from "@/models/semesters/entity";
import { useGetClassById } from "@/hooks";
import { ClassSemester } from "@/hooks/classes/useGetClassSemesters";
import { SemesterSelect } from "./semester-select";
import { SemesterSelectorStatic } from "@/components/classes/SemesterSelectorStatic";
import { RenderStudentSkeletons } from "./render-skeletons";
import { useClassSchemaEdit } from "../types/edit-class";
import { useEditClassInfo } from "@/hooks/classes/mutations/useUpdateClassInfo";
import { UseFilterSemesters } from "@/hooks/semesters/useFilterSemester";
import { TransformerFunc } from "@/lib/transformer";
import { format } from "date-fns";

const SemesterToClassSemester: TransformerFunc<Semester, ClassSemester> = (
  dto
) => ({
  semester_id: dto.semester_id,
  semester_name: dto.semester_name,
  start_date: dto.start_date,
  end_date: dto.end_date,
  status: "",
});

export function ClassDetailComponent({ slug }: { slug: string }) {
  const [activeTab, setActiveTab] = useState("details");
  const [activeStudentTab, setActiveStudentTab] = useState("all");
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [config, setConfig] = useState<Record<string, boolean>>({});
  const router = useRouter();
  const { toast } = useToast();
  const [fakeLoading, setFakeLoading] = useState<boolean>(true);

  // Edit mode states
  const {
    register,
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useClassSchemaEdit();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [pendingStudentJoined, setPendingStudentJoined] = useState<number>(0);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  // Watch form values
  const editedClassName = watch("editedClassName");
  const editedTeacherId = watch("editedTeacherId");
  const editedSemesterId = watch("editedSemesterId");
  const editedGradeId = watch("editedGradeId");
  const editTeacher = watch("editTeacher");

  const setEditedSemesterId = (value: number) => {
    setValue("editedSemesterId", value);
  };

  // Semester management state - Mock data for now (replace with actual API calls)
  const [classPastSemesters, setClassPastSemesters] = useState<Semester[]>([]);
  const [classUpcomingSemesters, setClassUpcomingSemesters] = useState<
    Semester[]
  >([]);

  // Parse classId from slug with proper validation
  const classId = slug ? parseInt(slug, 10) : undefined;

  // Hooks for data
  const { mutate: updateClass, isPending: isUpdating } = useEditClassInfo();
  const { data: semestersData } = useGetListSemesters({ page: 1, limit: 100 });
  const { data: gradesData } = useGetAllGrades();
  const {
    data: classSemesters,
    isLoading: isSemestersLoading,
    error: isSemesterLoadingError,
  } = UseFilterSemesters({
    from_date: startDate ?? "",
    to_date: endDate ?? "",
  });
  const {
    data: classData,
    error,
    isLoading,
    refetch: refetchClassData,
  } = useGetClassById(classId);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFakeLoading(false);
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (classData) {
      let cfg: Record<string, boolean> = {};
      classData?.GetClassById?.class_config.forEach((config) => {
        cfg[config.config_id.toString()] = config.is_enable;
      });
      setConfig(cfg);
      if (!(classData && classData.GetClassById)) {
        return;
      }
      const { class_name, grades, teacher, semester } = classData.GetClassById;
      reset({
        editedClassName: class_name,
        editedGradeId: grades?.grade_id,
        editedSemesterId: semester?.semester_id,
        editedTeacherId: teacher ? teacher.teacher_id : null,
        editTeacher: teacher
          ? {
              teacher_id: teacher.teacher_id,
              teacher_name: `${teacher.first_name} ${teacher.last_name}`,
            }
          : null,
      });

      setStartDate(semester?.start_date || null);
      setEndDate(semester?.end_date || null);
    }
  }, [classData, reset]);

  // TODO: Fetch timetable data from the server
  const fetchTimeTable = (): TimeTable[] => {
    return [
      {
        day: "Monday",
        room: "Tech 101",
        time: "10:00 AM - 11:30 AM",
      },
      {
        day: "Wednesday",
        room: "Tech 101",
        time: "10:00 AM - 11:30 AM",
      },
      {
        day: "Friday",
        room: "Online",
        time: "3:30 PM",
      },
    ];
  };

  const OnStudentEnrolSubmit = async () => {
    setPendingStudentJoined((prev) => prev + 1);
    await new Promise((resolve) => setTimeout(resolve, 8000));
    await refetchClassData();
    setPendingStudentJoined((prev) => prev - 1);
  };

  const transformToStudentModel = (): StudentTabListModel => {
    let studentTabModel: StudentTabListModel = {
      all: [],
      active: [],
      in_active: [],
    };
    classData?.GetClassById?.students.forEach((student) => {
      studentTabModel.all.push({
        id: student.id,
        first_name: student.first_name,
        last_name: student.last_name,
        dob: student.dob,
        email: student.email,
        phone: student.phone,
        address: student.address,
        emergency_contact_name: student.emergency_contact_name,
        emergency_contact_phone: student.emergency_contact_phone,
        avatar: "/placeholder.svg?height=40&width=40",
      });
    });
    studentTabModel.active = studentTabModel.all.filter(
      (student) => student.id % 2 === 0
    );
    studentTabModel.in_active = studentTabModel.all.filter(
      (student) => student.id % 2 !== 0
    );
    return studentTabModel;
  };

  const handleConfigChange = (key: string) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      [key as keyof typeof config]: !prevConfig[key as keyof typeof config],
    }));
  };

  const renderCalendar = () => {
    router.push(`/classes/${classId}/calendar`);
  };

  const handleEnterEditMode = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  const handleSaveChanges = handleSubmit((formData) => {
    if (!classId) return;

    console.log("form data :", formData);

    const updates: any = {
      class_id: classId,
    };

    if (formData.editedClassName !== classData?.GetClassById?.class_name) {
      updates.class_name = formData.editedClassName;
    }
    if (
      formData.editedTeacherId !== classData?.GetClassById?.teacher?.teacher_id
    ) {
      updates.teacher_id = formData.editedTeacherId;
    }
    if (
      formData.editedSemesterId !==
      classData?.GetClassById?.semester?.semester_id
    ) {
      updates.semester_id = formData.editedSemesterId;
    }
    if (formData.editedGradeId !== classData?.GetClassById?.grades?.grade_id) {
      updates.grade_id = formData.editedGradeId;
    }

    // Only update if there are changes
    if (Object.keys(updates).length > 1) {
      updateClass(
        {
          input: {
            class_id: classId,
            class_name: editedClassName,
            current_semester_id: editedSemesterId ,
            grade_id: editedGradeId ,
            teacher_id: editedTeacherId ,
          },
        },
        {
          onSuccess: (response) => {
            toast({
              ...RenderSuccessToast(
                response.message || "Class updated successfully!"
              ),
            });
            setIsEditMode(false);
            // Refetch data
            refetchClassData();
          },
          onError: (error) => {
            toast({
              ...RenderFailedToast(error.message || "Failed to update class"),
            });
          },
        }
      );
    } else {
      setIsEditMode(false);
    }
  });

  // Semester management functions
  const getClassSemesters = (): ClassSemesterData => {
    return {
      past_semesters: classPastSemesters,
      current_semester: classData?.GetClassById?.semester || null,
      upcoming_semesters: classUpcomingSemesters,
    };
  };

  const handleEndCurrentSemester = async () => {
    // TODO: Implement actual API call to end current semester
    // For now, move current to past and first upcoming to current
    if (classData?.GetClassById?.semester) {
      setClassPastSemesters((prev) => [
        ...prev,
        classData.GetClassById.semester!,
      ]);
    }

    if (classUpcomingSemesters.length > 0) {
      const [next, ...rest] = classUpcomingSemesters;
      setClassUpcomingSemesters(rest);
      // In real implementation, update the class's current semester via API
      toast({
        ...RenderSuccessToast(
          "Semester ended successfully. Next semester is now active."
        ),
      });
      window.location.reload(); // Reload to fetch updated data
    }
  };

  const handleAddUpcomingSemester = async (semesterId: number) => {
    // TODO: Implement actual API call to add upcoming semester
    const semester = semestersData?.FilterSemesters?.find(
      (s) => s.semester_id === semesterId
    );
    if (semester) {
      setClassUpcomingSemesters((prev) => [...prev, semester]);
      toast({
        ...RenderSuccessToast(
          `${semester.semester_name} added to upcoming semesters.`
        ),
      });
    }
  };

  const handleRemoveUpcomingSemester = async (semesterId: number) => {
    // TODO: Implement actual API call to remove upcoming semester
    setClassUpcomingSemesters((prev) =>
      prev.filter((s) => s.semester_id !== semesterId)
    );
    toast({
      ...RenderSuccessToast("Semester removed from upcoming schedule."),
    });
  };

  if (isLoading) return <LoadingPage />;
  if (error) return <ErrorPage message="failed to render" />;

  if (!classData) {
    return <div>No data found</div>;
  }

  const dataLoaded = transformToStudentModel();

  const getSelectedSemester: () => ClassSemester | undefined = () => {
    const _selectedSemester: Semester | undefined =
      classSemesters?.FilterSemesters.findLast(
        (semester) => semester.semester_id === editedSemesterId
      );

    if (!_selectedSemester) {
      return undefined;
    }
    return SemesterToClassSemester(_selectedSemester!);
  };
  const selectedSemester: ClassSemester | undefined = getSelectedSemester();
  const selectedSemesterData = {
    selectedSemester: selectedSemester,
    startDateDisplay: selectedSemester?.start_date,
    endDateDisplay: selectedSemester?.end_date,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-6">
        {/* Header Card */}
        <Card className="shadow-xl border-gray-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    {isEditMode ? (
                      <Input
                        type="text"
                        // value={editedClassName}
                        {...register("editedClassName")}
                        // onChange={(e) => setEditedClassName(e.target.value)}
                        className="text-2xl font-bold max-w-md border-2 focus:border-blue-500"
                        placeholder="Class name"
                      />
                    ) : (
                      <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        {classData?.GetClassById?.class_name}
                      </CardTitle>
                    )}
                    <CardDescription className="text-base mt-1">
                      Class ID: #{classData?.GetClassById?.class_id}
                    </CardDescription>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isEditMode ? (
                  <>
                    <Button
                      onClick={handleCancelEdit}
                      variant="outline"
                      disabled={isUpdating}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveChanges}
                      disabled={isUpdating}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md"
                    >
                      {isUpdating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={handleEnterEditMode}
                      variant="outline"
                      className="hover:bg-blue-50 hover:border-blue-300"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Mode
                    </Button>
                    <Button
                      onClick={renderCalendar}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-md hover:shadow-lg transition-all"
                    >
                      <CalendarDays className="w-4 h-4 mr-2" />
                      View Calendar
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Class Details */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <Label className="text-lg font-semibold text-gray-900 mb-3 block">
                    Description
                  </Label>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {classData?.GetClassById?.description ||
                      "No description available"}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Total Enrollment
                      </p>
                      <p className="text-xl font-bold text-blue-600">
                        {classData?.GetClassById?.current_enrollment}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <GraduationCap className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-medium">
                        Current Semester
                      </p>
                      {isEditMode ? (
                        <SemesterSelect
                          editedSemesterId={editedSemesterId ?? null}
                          isLoading={
                            !!isSemesterLoadingError ||
                            isSemestersLoading ||
                            !classSemesters ||
                            fakeLoading
                          }
                          semesters={
                            classSemesters?.FilterSemesters?.map((o) =>
                              SemesterToClassSemester(o)
                            ) ?? []
                          }
                          setEditedSemesterId={(id) => {
                            setValue("editedSemesterId", id as number);
                          }}
                        />
                      ) : (
                        <p className="text-lg font-semibold text-gray-900">
                          {classData?.GetClassById?.semester?.semester_name ||
                            "N/A"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-100">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <CalendarDays className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-medium">
                        Start Date
                      </p>
                      {isEditMode ? (
                        <ShiDateTimePicker
                          Display={selectedSemesterData.startDateDisplay ?? ""}
                          OnSelect={(d) => {
                            setStartDate(d ? format(d, "yyyy-MM-dd") : null);
                          }}
                          canEdit={true}
                          showTime={false}
                          value={
                            selectedSemester?.start_date
                              ? new Date(selectedSemester.start_date)
                              : undefined
                          }
                        />
                      ) : (
                        <p className="text-lg font-semibold text-gray-900">
                          {classData?.GetClassById?.start_date
                            ? new Date(
                                classData.GetClassById.start_date
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg border border-orange-100">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                      <CalendarDays className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-medium">
                        End Date
                      </p>
                      {isEditMode ? (
                        <ShiDateTimePicker
                          Display={selectedSemesterData.endDateDisplay ?? ""}
                          OnSelect={(d) => {
                            setEndDate(d ? format(d, "yyyy-MM-dd") : null);
                          }}
                          canEdit={true}
                          showTime={false}
                          value={
                            selectedSemester?.end_date
                              ? new Date(selectedSemester.end_date)
                              : undefined
                          }
                        />
                      ) : (
                        <p className="text-lg font-semibold text-gray-900">
                          {classData?.GetClassById?.end_date
                            ? new Date(
                                classData.GetClassById.end_date
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Semester Selector - appears in edit mode when dates are set */}
                {isEditMode && (
                  <SemesterSelectorStatic
                    loaded={!isSemestersLoading}
                    semesters={
                      classSemesters?.FilterSemesters?.map((o) =>
                        SemesterToClassSemester(o)
                      ) ?? []
                    }
                    selectedSemesterId={selectedSemester?.semester_id ?? -1}
                    errorLoaded={!!isSemesterLoadingError}
                    setEditedSemesterId={setEditedSemesterId}
                  />
                )}
              </div>

              {/* Right Column - Teacher Info */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-lg font-semibold text-gray-900">
                      Teacher (Host)
                    </Label>
                    {isEditMode && (
                      <Button
                        onClick={() => setIsTeacherModalOpen(true)}
                        size="sm"
                        variant="outline"
                        className="hover:bg-blue-50 hover:border-blue-300"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Change
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                      <AvatarImage
                        src={classData?.GetClassById?.teacher?.profile_picture}
                        alt={`${classData?.GetClassById?.teacher?.first_name} ${classData?.GetClassById?.teacher?.last_name}`}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-2xl font-bold">
                        {editTeacher ? editTeacher.teacher_name : "Not Set"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p
                        className={
                          editTeacher
                            ? `text-xl font-bold text-gray-900`
                            : `text-xl font-bold text-gray-300`
                        }
                      >
                        {editTeacher ? editTeacher.teacher_name : "Not Set"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {classData?.GetClassById?.teacher?.specialization ||
                          "Teacher"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Grade Badge - Add editable grade */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                  <Label className="text-lg font-semibold text-gray-900 mb-4 block">
                    Grade
                  </Label>
                  {isEditMode ? (
                    <Select
                      value={editedGradeId?.toString() || ""}
                      onValueChange={(value) => {
                        setValue("editedGradeId", parseInt(value));
                      }}
                    >
                      <SelectTrigger className="w-full border-2 focus:border-blue-500">
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {gradesData?.ListAllGrades?.map((grade) => (
                          <SelectItem
                            key={grade.grade_id}
                            value={grade.grade_id.toString()}
                          >
                            {grade.grade_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant="secondary" className="text-lg px-6 py-2">
                      {classData?.GetClassById?.grades.grade_name || "N/A"}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="bg-white border border-gray-200 shadow-sm p-1 rounded-lg">
            <TabsTrigger
              value="details"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
            >
              Class Details
            </TabsTrigger>
            <TabsTrigger
              value="students"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
            >
              Students
            </TabsTrigger>
            <TabsTrigger
              value="config"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
            >
              Configuration
            </TabsTrigger>
            <TabsTrigger
              value="semesters"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
            >
              Semesters
            </TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-lg border-gray-200">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Class Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <Label className="font-semibold text-gray-900">
                        Description
                      </Label>
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                        {classData?.GetClassById?.description ||
                          "No description available"}
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Users className="h-5 w-5 text-blue-600" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium">
                            Total Enrollment
                          </p>
                          <p className="text-lg font-bold text-blue-600">
                            {classData?.GetClassById?.current_enrollment}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                        <GraduationCap className="h-5 w-5 text-purple-600" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium">
                            Current Semester
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {classData?.GetClassById?.semester?.semester_name ||
                              "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <CalendarDays className="h-5 w-5 text-green-600" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium">
                            Start Date
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {classData?.GetClassById?.semester?.start_date ||
                              "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                        <UserRoundCog className="h-5 w-5 text-orange-600" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium">
                            Max Enrollment
                          </p>
                          <p className="text-lg font-bold text-orange-600">
                            {classData?.GetClassById?.max_students}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-lg border-gray-200">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Upcoming Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-200">
                        <TableHead className="font-semibold text-gray-900">
                          Day
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900">
                          Time
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900">
                          Room
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fetchTimeTable().map((session, index) => (
                        <TableRow
                          key={index}
                          className="hover:bg-blue-50 transition-colors"
                        >
                          <TableCell className="font-medium">
                            {session.day}
                          </TableCell>
                          <TableCell>{session.time}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                              {session.room}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                router.push(
                                  `/attendance/${classId}/${index + 1}`
                                )
                              }
                              className="gap-2 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-all"
                            >
                              <ClipboardCheck className="w-4 h-4" />
                              Attendance
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="students">
            <Card className="shadow-lg border-gray-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      Student List
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-1">
                      Manage enrolled students in this class
                    </CardDescription>
                  </div>
                  <Dialog
                    open={isEnrollModalOpen}
                    onOpenChange={setIsEnrollModalOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-md">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Enroll Student
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogTitle className="sr-only">
                        Enroll Student
                      </DialogTitle>
                      <DialogDescription className="sr-only">
                        Complete the enrollment process by selecting a student
                        and providing enrollment information
                      </DialogDescription>
                      <ModernEnrollStudentForm
                        onClose={() => setIsEnrollModalOpen(false)}
                        classId={classId || 0}
                        onConfirmSubmit={OnStudentEnrolSubmit}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs
                  value={activeStudentTab}
                  onValueChange={setActiveStudentTab}
                >
                  <TabsList className="mb-6 bg-gray-100 p-1">
                    <TabsTrigger
                      value="all"
                      className="data-[state=active]:bg-white data-[state=active]:shadow"
                    >
                      All Students
                    </TabsTrigger>
                    <TabsTrigger
                      value="active"
                      className="data-[state=active]:bg-white data-[state=active]:shadow"
                    >
                      Active
                    </TabsTrigger>
                    <TabsTrigger
                      value="inactive"
                      className="data-[state=active]:bg-white data-[state=active]:shadow"
                    >
                      Inactive
                    </TabsTrigger>
                  </TabsList>
                  {(
                    Object.keys(dataLoaded) as Array<keyof typeof dataLoaded>
                  ).map((category) => (
                    <TabsContent key={category} value={category}>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {dataLoaded[category].map((student) => (
                          <div
                            key={student.id}
                            className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all"
                          >
                            <Avatar className="w-12 h-12 border-2 border-white shadow">
                              <AvatarImage
                                src={student.avatar}
                                alt={`${student?.first_name} ${student?.last_name}`}
                              />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-bold">
                                {student?.first_name?.[0]}
                                {student?.last_name?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 truncate">
                                {student?.first_name} {student?.last_name}
                              </p>
                              <p className="text-xs text-gray-500">
                                ID: {student.id}
                              </p>
                            </div>
                          </div>
                        ))}
                        {pendingStudentJoined > 0 &&
                          RenderStudentSkeletons(pendingStudentJoined)}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="config">
            <Card className="shadow-lg border-gray-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Class Configuration
                </CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  Manage settings and preferences for this class
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {classData?.GetClassById?.class_config.map((cfg) => (
                    <div
                      key={cfg.config_id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all"
                    >
                      <div className="space-y-1 flex-1">
                        <Label
                          htmlFor={`config-${cfg.config_id}`}
                          className="text-base font-semibold text-gray-900"
                        >
                          {cfg.name}
                        </Label>
                        <p className="text-sm text-gray-600">
                          {cfg.description}
                        </p>
                      </div>
                      <Switch
                        id={`config-${cfg.config_id}`}
                        checked={config[cfg.config_id.toString()]}
                        onCheckedChange={() =>
                          handleConfigChange(cfg.config_id.toString())
                        }
                        className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-600 data-[state=checked]:to-cyan-600"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
                  <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-md px-8">
                    Save Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="semesters">
            <SemesterTimeline
              classId={classId || 0}
              classSemesters={getClassSemesters()}
              availableSemesters={semestersData?.FilterSemesters || []}
              onEndCurrentSemester={handleEndCurrentSemester}
              onAddUpcomingSemester={handleAddUpcomingSemester}
              onRemoveUpcomingSemester={handleRemoveUpcomingSemester}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>

        {/* Teacher Selection Modal */}
        <TeacherSelectionModal
          open={isTeacherModalOpen}
          onClose={() => setIsTeacherModalOpen(false)}
          onSelect={(teacher) => {
            setValue("editedTeacherId", teacher.teacher_id);
            setValue("editTeacher", {
              teacher_name: `${teacher.first_name} ${teacher.last_name}`,
              teacher_id: teacher.teacher_id,
            });
            setIsTeacherModalOpen(false);
          }}
          currentTeacherId={editedTeacherId ?? undefined}
        />
      </div>
    </div>
  );
}
