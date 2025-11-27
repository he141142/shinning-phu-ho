import { Label } from "@/components/drake_libs/ui/label";
import { BookOpen, Calendar, Clock, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/drake_libs/ui/select";
import { Input } from "@/components/drake_libs/ui/input";
import {
  ClassSemester,
  useGetClassSemesters,
} from "@/hooks/classes/useGetClassSemesters";
import React, { useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export interface SemesterSelectProps {
  selectedSemesterId: number;
  setSelectedSemesterId: React.Dispatch<React.SetStateAction<number>>;
  setEnrolmentDate: React.Dispatch<
    React.SetStateAction<{
      startDate: string;
      endDate: string;
    }>
  >;
  enrollmentDates: {
    startDate: string;
    endDate: string;
  };
  classId: number;
  setSelectedSemester: React.Dispatch<
    React.SetStateAction<ClassSemester | null | undefined>
  >;
}

export const SemesterSelect: React.FC<SemesterSelectProps> = ({
  selectedSemesterId,
  setSelectedSemesterId,
  setEnrolmentDate,
  enrollmentDates,
  classId,
  setSelectedSemester,
}) => {
  const { data: classSemesters, isPending: isClassSemPending } =
    useGetClassSemesters(classId);

  useEffect(() => {
    const sem: ClassSemester | undefined =
      classSemesters?.GetClassSemesters.find(
        (sem) => sem.semester_id === selectedSemesterId
      );
    setSelectedSemester(sem);
    if (!sem) {
      return;
    }

    setEnrolmentDate({
      endDate: sem.end_date,
      startDate: sem.start_date,
    });
  }, [selectedSemesterId]);

  //   const SelectedSemester: ClassSemester =
  const isLoading =
    isClassSemPending ||
    !classSemesters ||
    !classSemesters.GetClassSemesters ||
    classSemesters.GetClassSemesters.length === 0;

  return (
    <>
      {isLoading ? (
        <>
          <motion.div
            key="loading"
            className="flex items-center w-full justify-center gap-2 text-gray-500"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            >
              <Loader2 className="w-4 h-4 text-purple-500" />
            </motion.div>
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              Loading semesters...
            </motion.span>
          </motion.div>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <Label className="text-base font-semibold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              Select Semester
            </Label>
            <Select
              value={`${selectedSemesterId}`}
              onValueChange={(semesterID: string) => {
                setSelectedSemesterId(parseInt(semesterID));
              }}
            >
              <SelectTrigger className="h-12 border-2 focus:border-purple-500">
                <SelectValue placeholder="Choose a semester" />
              </SelectTrigger>
              <SelectContent>
                {classSemesters?.GetClassSemesters.map((semester) => (
                  <SelectItem
                    key={semester.semester_id}
                    value={semester.semester_id.toString()}
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold">
                        {semester.semester_name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(semester.start_date)} -{" "}
                        {formatDate(semester.end_date)}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-base font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                Start Date
              </Label>
              <Input
                type="date"
                value={enrollmentDates.startDate}
                onChange={(e) =>
                  setEnrolmentDate({
                    ...enrollmentDates,
                    startDate: e.target.value,
                  })
                }
                className="h-12 border-2 focus:border-green-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-base font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-600" />
                End Date
              </Label>
              <Input
                type="date"
                value={enrollmentDates.endDate}
                onChange={(e) =>
                  setEnrolmentDate({
                    ...enrollmentDates,
                    endDate: e.target.value,
                  })
                }
                className="h-12 border-2 focus:border-orange-500"
                required
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};
