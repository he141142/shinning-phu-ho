"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/drake_libs/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/drake_libs/ui/card";
import { Input } from "@/components/drake_libs/ui/input";

import { Tabs, TabsContent } from "@/components/drake_libs/ui/tabs";
import { Badge } from "@/components/drake_libs/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/drake_libs/ui/avatar";
import {
  Search,
  Check,
  User,
  Mail,
  Phone,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/components/hooks/use-toast";
import {
  RenderSuccessToast,
  RenderFailedToast,
} from "@/components/drake_libs/customs/custom-toast";
import { useSerachStudentsByName } from "@/hooks/students/useSerachStudentsByName";
import { useDebounce } from "@/hooks/useDebounce";
import { SemesterSelect } from "./semester-select";
import { UseSemesterSelect } from "./hooks/useSemesterSelect";
import { useJoinStudentToClass } from "@/hooks/classes/useJoinStudentToClass";
import { StudentClassInfo } from "@/models/students/GetStudentDetail/GetStudentDetail";

// Mock student data - Replace with actual API call
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

interface ModernEnrollStudentFormProps {
  onClose: () => void;
  classId: number;
  onConfirmSubmit: () => Promise<void>;
}

export default function ModernEnrollStudentForm({
  onClose,
  classId,
  onConfirmSubmit,
}: ModernEnrollStudentFormProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("select-student");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    enrollmentDates,
    selectedSemester,
    selectedSemesterId,
    selectedStudent,
    setEnrollmentDates,
    setSelectedSemester,
    setSelectedSemesterId,
    setSelectedStudent,
  } = UseSemesterSelect();

  const [completedSteps, setCompletedSteps] = useState({
    "select-student": false,
    "enrollment-info": false,
    confirm: false,
  });
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Debounce search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { mutateAsync: joinsStudentToClass } = useJoinStudentToClass();

  const {
    data: studentData,
    isError: isSearchStudentError,
    isPending,
    isFetching,
    refetch: refetchStudentData,
  } = useSerachStudentsByName({
    name: debouncedSearchQuery,
    page: currentPage,
    per_page: 10,
    extensions: {
      "fetch.class.semesters": classId,
    },
  });

  // buil hash map for quick lookup student semester data:
  // student -> class -> semester
  let studentSemesterMapByClass: Map<
    number,
    Map<number, StudentClassInfo>
  > = new Map();
  studentSemesterMapByClass =
    studentData?.GetStudentsFilterByName?.data?.reduce((map, student) => {
      let etx_classess = student.extend_class_info;
      if (!etx_classess) return map;

      let student_id = student.id;
      if (!map.has(student_id)) {
        map.set(student_id, new Map());
      }

      etx_classess.forEach((etx_class) => {
        map.get(student_id)!.set(etx_class.class_id, etx_class);
      });
      return map;
    }, studentSemesterMapByClass) ?? new Map();
  console.log("studentSemesterMapByClass", studentSemesterMapByClass);

  // Reset pagination when debounced search query changes
  useEffect(() => {
    setCurrentPage(1);
    setAllStudents([]);
    setHasMore(true);
  }, [debouncedSearchQuery]);

  // Update students list when data arrives
  useEffect(() => {
    if (studentData?.GetStudentsFilterByName.data) {
      if (currentPage === 1) {
        setAllStudents(studentData.GetStudentsFilterByName.data);
      } else {
        setAllStudents((prev) => [
          ...prev,
          ...studentData.GetStudentsFilterByName.data,
        ]);
      }
      setHasMore(
        currentPage < (studentData.GetStudentsFilterByName.total_pages || 1)
      );
    }
  }, [studentData, currentPage]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    // Only set up observer if we have the target element
    if (!observerTarget.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          console.log("Intersection detected, loading more...", {
            currentPage,
            hasMore,
          });
          setCurrentPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    observer.observe(currentTarget);

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isFetching, allStudents.length]); // Added allStudents.length to re-observe when list updates

  console.log("studentData", studentData);
  console.log("Pagination state:", {
    currentPage,
    hasMore,
    isFetching,
    studentsCount: allStudents.length,
  });

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    setCompletedSteps((prev) => ({ ...prev, "select-student": true }));
    setActiveTab("enrollment-info");
  };

  const handleEnrollmentInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!enrollmentDates.startDate || !enrollmentDates.endDate) {
      toast({ ...RenderFailedToast("Please fill in all enrollment dates") });
      return;
    }

    if (!selectedSemesterId) {
      toast({ ...RenderFailedToast("Please select a semester") });
      return;
    }

    if (
      new Date(enrollmentDates.endDate) < new Date(enrollmentDates.startDate)
    ) {
      toast({ ...RenderFailedToast("End date must be after start date") });
      return;
    }

    setCompletedSteps((prev) => ({ ...prev, "enrollment-info": true }));
    setActiveTab("confirm");
  };

  const handleConfirm = async () => {
    if (!selectedStudent) return;

    setIsEnrolling(true);
    setCompletedSteps((prev) => ({ ...prev, confirm: true }));

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await joinsStudentToClass(
        {
          input: {
            class_id: classId,
            student_id: selectedStudent.id,
            semester_id: selectedSemesterId,
          },
        },
        {
          onSuccess: () => {
            toast({
              ...RenderSuccessToast(
                `${selectedStudent.first_name} ${selectedStudent.last_name} successfully enrolled!`
              ),
            });

            onConfirmSubmit();
            setIsEnrolling(false);
            onClose();
            refetchStudentData();
          },
          onError: (err) => {
            toast({
              ...RenderFailedToast(`Failed to enroll student: ${err.message}`),
            });
            setIsEnrolling(false);
          },
        }
      );
    } catch (error) {
      toast({ ...RenderFailedToast("Failed to enroll student") });
      setIsEnrolling(false);
    }
  };

  const isTabDisabled = (tabValue: string) => {
    if (tabValue === "select-student") return false;
    if (tabValue === "enrollment-info")
      return !completedSteps["select-student"];
    if (tabValue === "confirm") return !completedSteps["enrollment-info"];
    return false;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const calculateAge = (dob: string) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const progress =
    (Object.values(completedSteps).filter(Boolean).length / 3) * 100;

  // Skeleton Loading Component
  const StudentCardSkeleton = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4 rounded-xl border-2 border-gray-200 bg-white"
    >
      <div className="flex items-center gap-4">
        {/* Avatar Skeleton */}
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="flex-1 space-y-3">
          {/* Name and Badge Skeleton */}
          <div className="flex items-center gap-2">
            <div className="relative h-6 w-40 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                  delay: 0.1,
                }}
              />
            </div>
            <div className="relative h-5 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                  delay: 0.2,
                }}
              />
            </div>
          </div>

          {/* Info Grid Skeleton */}
          <div className="grid grid-cols-2 gap-2">
            <div className="relative h-4 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                  delay: 0.3,
                }}
              />
            </div>
            <div className="relative h-4 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                  delay: 0.4,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Loading More Indicator
  const LoadingMoreIndicator = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center justify-center gap-3 py-6"
    >
      <motion.div
        className="w-2 h-2 bg-blue-500 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: "easeInOut",
          delay: 0,
        }}
      />
      <motion.div
        className="w-2 h-2 bg-indigo-500 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: "easeInOut",
          delay: 0.2,
        }}
      />
      <motion.div
        className="w-2 h-2 bg-purple-500 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: "easeInOut",
          delay: 0.4,
        }}
      />
      <span className="ml-2 text-sm font-medium text-gray-600">
        Loading more students...
      </span>
    </motion.div>
  );

  return (
    <Card className="w-full border-0 shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white pb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
            >
              <Sparkles className="w-7 h-7 text-white" />
            </motion.div>
            <div>
              <CardTitle className="text-3xl font-bold">
                Enroll Student
              </CardTitle>
              <CardDescription className="text-blue-100 mt-1">
                Complete the enrollment process in 3 simple steps
              </CardDescription>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-right"
          >
            <p className="text-sm text-blue-100">Progress</p>
            <p className="text-2xl font-bold">{Math.round(progress)}%</p>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 w-full h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Modern Stepper */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                  initial={{ width: "0%" }}
                  animate={{
                    width:
                      activeTab === "select-student"
                        ? "0%"
                        : activeTab === "enrollment-info"
                        ? "50%"
                        : "100%",
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              {/* Step 1 */}
              <div className="flex flex-col items-center flex-1 relative z-10">
                <motion.button
                  onClick={() =>
                    !isTabDisabled("select-student") &&
                    setActiveTab("select-student")
                  }
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    completedSteps["select-student"]
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                      : activeTab === "select-student"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg scale-110"
                      : "bg-gray-200 text-gray-500"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {completedSteps["select-student"] ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    "1"
                  )}
                </motion.button>
                <p
                  className={`text-xs font-semibold mt-2 ${
                    activeTab === "select-student"
                      ? "text-blue-600"
                      : "text-gray-600"
                  }`}
                >
                  Select Student
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center flex-1 relative z-10">
                <motion.button
                  onClick={() =>
                    !isTabDisabled("enrollment-info") &&
                    setActiveTab("enrollment-info")
                  }
                  disabled={isTabDisabled("enrollment-info")}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    completedSteps["enrollment-info"]
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                      : activeTab === "enrollment-info"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg scale-110"
                      : "bg-gray-200 text-gray-400"
                  } disabled:cursor-not-allowed`}
                  whileHover={{
                    scale: isTabDisabled("enrollment-info") ? 1 : 1.1,
                  }}
                  whileTap={{
                    scale: isTabDisabled("enrollment-info") ? 1 : 0.95,
                  }}
                >
                  {completedSteps["enrollment-info"] ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    "2"
                  )}
                </motion.button>
                <p
                  className={`text-xs font-semibold mt-2 ${
                    activeTab === "enrollment-info"
                      ? "text-blue-600"
                      : "text-gray-600"
                  }`}
                >
                  Enrollment Info
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center flex-1 relative z-10">
                <motion.button
                  onClick={() =>
                    !isTabDisabled("confirm") && setActiveTab("confirm")
                  }
                  disabled={isTabDisabled("confirm")}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    completedSteps["confirm"]
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                      : activeTab === "confirm"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg scale-110"
                      : "bg-gray-200 text-gray-400"
                  } disabled:cursor-not-allowed`}
                  whileHover={{ scale: isTabDisabled("confirm") ? 1 : 1.1 }}
                  whileTap={{ scale: isTabDisabled("confirm") ? 1 : 0.95 }}
                >
                  {completedSteps["confirm"] ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    "3"
                  )}
                </motion.button>
                <p
                  className={`text-xs font-semibold mt-2 ${
                    activeTab === "confirm" ? "text-blue-600" : "text-gray-600"
                  }`}
                >
                  Confirm
                </p>
              </div>
            </div>
          </div>

          {/* Tab Contents */}
          <TabsContent value="select-student" className="mt-6">
            <AnimatePresence mode="wait">
              {activeTab === "select-student" && (
                <motion.div
                  key="select-student-content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search students by name, email, or grade..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12 text-base border-2 focus:border-blue-500"
                    />
                  </div>

                  {/* Student List with Infinite Scroll */}
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scroll-smooth">
                    {/* Initial Loading State - Show Skeletons */}
                    {isPending && currentPage === 1 && (
                      <>
                        {[...Array(5)].map((_, index) => (
                          <motion.div
                            key={`skeleton-initial-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <StudentCardSkeleton />
                          </motion.div>
                        ))}
                      </>
                    )}

                    {/* Student Cards */}
                    {!isPending || currentPage > 1 ? (
                      allStudents.length > 0 ? (
                        <>
                          {allStudents.map((student, index) => (
                            <motion.div
                              key={student.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                delay: currentPage === 1 ? index * 0.05 : 0,
                                type: "spring",
                                stiffness: 100,
                                damping: 15,
                              }}
                              onClick={() => handleStudentSelect(student)}
                              className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                                selectedStudent?.id === student.id
                                  ? "border-blue-500 bg-blue-50 shadow-lg"
                                  : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                              }`}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center gap-4">
                                <Avatar className="w-16 h-16 border-2 border-white shadow-md">
                                  <AvatarImage
                                    src={student.avatar}
                                    alt={`${student.first_name} ${student.last_name}`}
                                  />
                                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-lg font-bold">
                                    {student.first_name[0]}
                                    {student.last_name[0]}
                                  </AvatarFallback>
                                </Avatar>

                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-lg text-gray-900">
                                      {student.first_name} {student.last_name}
                                    </h4>
                                    {student.grade && (
                                      <Badge
                                        variant="secondary"
                                        className="bg-indigo-100 text-indigo-700"
                                      >
                                        {student.grade.grade_name}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                      <Mail className="w-4 h-4" />
                                      <span className="truncate">
                                        {student.email}
                                      </span>
                                    </div>
                                    {student.dob && (
                                      <div className="flex items-center gap-1">
                                        <User className="w-4 h-4" />
                                        <span>
                                          {calculateAge(student.dob)} years old
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {selectedStudent?.id === student.id && (
                                  <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{
                                      type: "spring",
                                      stiffness: 200,
                                    }}
                                    className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center"
                                  >
                                    <Check className="w-5 h-5 text-white" />
                                  </motion.div>
                                )}
                              </div>
                            </motion.div>
                          ))}

                          {/* Loading More Indicator */}
                          {isFetching && currentPage > 1 && (
                            <LoadingMoreIndicator />
                          )}

                          {/* Intersection Observer Target */}
                          {hasMore && !isFetching && (
                            <div ref={observerTarget} className="h-4" />
                          )}

                          {/* End of List Message */}
                          {!hasMore && allStudents.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-center py-4"
                            >
                              <p className="text-sm text-gray-500">
                                You've reached the end of the list
                              </p>
                            </motion.div>
                          )}
                        </>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 }}
                          className="text-center py-12"
                        >
                          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 font-medium">
                            {searchQuery
                              ? `No students found matching "${searchQuery}"`
                              : "Start typing to search for students"}
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            Try searching by name, email, or grade
                          </p>
                        </motion.div>
                      )
                    ) : null}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="enrollment-info">
            <AnimatePresence mode="wait">
              {activeTab === "enrollment-info" && (
                <motion.form
                  key="enrollment-info-content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleEnrollmentInfoSubmit}
                  className="space-y-6"
                >
                  {/* Selected Student Summary */}
                  {selectedStudent && (
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12 border-2 border-white">
                          <AvatarImage src={selectedStudent.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                            {selectedStudent.first_name[0]}
                            {selectedStudent.last_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-gray-900">
                            {selectedStudent.first_name}{" "}
                            {selectedStudent.last_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {selectedStudent.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Semester Selection */}
                  <SemesterSelect
                    classId={classId}
                    enrollmentDates={enrollmentDates}
                    selectedSemesterId={selectedSemesterId}
                    setEnrolmentDate={setEnrollmentDates}
                    setSelectedSemesterId={setSelectedSemesterId}
                    setSelectedSemester={setSelectedSemester}
                    extendFeature={{
                      not_joined_semesters_id:
                        studentSemesterMapByClass
                          .get(selectedStudent?.id ?? -1)
                          ?.get(classId!)
                          ?.semesters_joined.map((s) => s.semester_id)
                          .reduce((map, semesterId) => {
                            map.set(semesterId, true);
                            return map;
                          }, new Map<number, boolean>()) ??
                        new Map<number, boolean>(),
                    }}
                  />

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg font-semibold shadow-lg"
                  >
                    Continue to Confirmation
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="ml-2"
                    >
                      →
                    </motion.span>
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="confirm">
            <AnimatePresence mode="wait">
              {activeTab === "confirm" && (
                <motion.div
                  key="confirm-content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 mx-auto flex items-center justify-center mb-4"
                    >
                      <CheckCircle2 className="w-10 h-10 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Review Enrollment
                    </h3>
                    <p className="text-gray-600 mt-2">
                      Please verify the information before confirming
                    </p>
                  </div>

                  {/* Student Info Card */}
                  {selectedStudent && (
                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <User className="w-5 h-5 text-blue-600" />
                          Student Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-16 h-16 border-2 border-white shadow">
                            <AvatarImage src={selectedStudent.avatar} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-lg font-bold">
                              {selectedStudent.first_name[0]}
                              {selectedStudent.last_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-lg">
                              {selectedStudent.first_name}{" "}
                              {selectedStudent.last_name}
                            </p>
                            <Badge variant="secondary">
                              {selectedStudent.grade.grade_name}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <span>{selectedStudent.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span>{selectedStudent.phone}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Enrollment Info Card */}
                  <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-purple-600" />
                        Enrollment Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-white rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Semester</p>
                          <p className="font-semibold">
                            {selectedSemester?.semester_name}
                          </p>
                        </div>
                        <div className="p-3 bg-white rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">
                            Semester Period
                          </p>
                          <p className="font-semibold text-sm">
                            {selectedSemester &&
                              formatDate(selectedSemester.start_date)}
                          </p>
                        </div>
                        <div className="p-3 bg-white rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">
                            Enrollment Start
                          </p>
                          <p className="font-semibold text-sm">
                            {enrollmentDates.startDate &&
                              formatDate(enrollmentDates.startDate)}
                          </p>
                        </div>
                        <div className="p-3 bg-white rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">
                            Enrollment End
                          </p>
                          <p className="font-semibold text-sm">
                            {enrollmentDates.endDate &&
                              formatDate(enrollmentDates.endDate)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Button
                    onClick={handleConfirm}
                    disabled={isEnrolling}
                    className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg font-bold shadow-xl"
                  >
                    {isEnrolling ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                        Enrolling Student...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Confirm Enrollment
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-6">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isEnrolling}
          className="px-6"
        >
          Cancel
        </Button>
        {activeTab !== "select-student" && activeTab !== "confirm" && (
          <Button
            variant="outline"
            onClick={() => {
              if (activeTab === "enrollment-info")
                setActiveTab("select-student");
            }}
            disabled={isEnrolling}
            className="px-6"
          >
            ← Back
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
