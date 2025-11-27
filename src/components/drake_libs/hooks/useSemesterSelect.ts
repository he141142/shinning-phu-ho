import { ClassSemester } from "@/hooks/classes/useGetClassSemesters";
import { useState } from "react";
interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
  grade: {
    grade_id: number;
    grade_name: string;
  };
  avatar?: string;
}
export const UseSemesterSelect = () => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedSemesterId, setSelectedSemesterId] = useState<number>(-1);
  const [enrollmentDates, setEnrollmentDates] = useState({
    startDate: "",
    endDate: "",
  });

  const [selectedSemester, setSelectedSemester] =
    useState<ClassSemester | null | undefined>(null);

  return {
    selectedStudent,
    setSelectedStudent,
    selectedSemesterId,
    setSelectedSemesterId,
    enrollmentDates,
    setEnrollmentDates,
    selectedSemester,
    setSelectedSemester,
  };
};
