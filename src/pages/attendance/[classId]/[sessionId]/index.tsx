"use client"
import { useState, useMemo, useEffect } from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/drake_libs/ui/card";
import { Button } from "@/components/drake_libs/ui/button";
import { Label } from "@/components/drake_libs/ui/label";
import { Textarea } from "@/components/drake_libs/ui/textarea";
import { Badge } from "@/components/drake_libs/ui/badge";
import { Skeleton } from "@/components/drake_libs/ui/skeleton";
import { useToast } from "@/components/hooks/use-toast";
import {
  Calendar as CalendarIcon,
  Save,
  CheckCircle2,
  ArrowLeft,
  Users,
  Clock,
} from "lucide-react";
import { useGetClassStudents, useMarkAttendance } from "@/hooks/attendance";
import type {
  AttendanceStatus,
  AttendanceRecord,
} from "@/models/attendance/Attendance";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/drake_libs/ui/radio-group";
import { Calendar } from "@/components/drake_libs/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/drake_libs/ui/popover";
import { cn } from "@/lib/utils";
import { useRouter, useParams } from "next/navigation";
import { LoadingPage } from "@/components/drake_libs/component/loading-page";

export default function TeacherAttendancePage() {
  const router = useRouter();
  const params = useParams();

  if (!params || !params["classId"] || !params["sessionId"]) {
    return <LoadingPage />;
  }

  const { classId, sessionId } = params;
  const { toast } = useToast();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState<
    Map<number, AttendanceRecord>
  >(new Map());

  // Get enrolled students
  const { students, isLoading: studentsLoading } = useGetClassStudents(
    Number(classId)
  );

  // Mark attendance mutation
  const { mutate: markAttendance, isPending: isSaving } = useMarkAttendance({
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data.message || "Attendance saved successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save attendance",
        variant: "destructive",
      });
    },
  });

  // Initialize attendance records when students load
  useMemo(() => {
    if (students.length > 0 && attendanceRecords.size === 0) {
      const initialRecords = new Map<number, AttendanceRecord>();
      students.forEach((student) => {
        initialRecords.set(student.student_id, {
          student_id: student.student_id,
          student_name: `${student.student_first_name} ${student.student_last_name}`,
          status: "present",
          notes: "",
        });
      });
      setAttendanceRecords(initialRecords);
    }
  }, [students, attendanceRecords.size]);

  const handleStatusChange = (studentId: number, status: AttendanceStatus) => {
    setAttendanceRecords((prev) => {
      const newRecords = new Map(prev);
      const record = newRecords.get(studentId);
      if (record) {
        newRecords.set(studentId, { ...record, status });
      }
      return newRecords;
    });
  };

  const handleNotesChange = (studentId: number, notes: string) => {
    setAttendanceRecords((prev) => {
      const newRecords = new Map(prev);
      const record = newRecords.get(studentId);
      if (record) {
        newRecords.set(studentId, { ...record, notes });
      }
      return newRecords;
    });
  };

  const handleMarkAllPresent = () => {
    setAttendanceRecords((prev) => {
      const newRecords = new Map(prev);
      newRecords.forEach((record, studentId) => {
        newRecords.set(studentId, { ...record, status: "present" });
      });
      return newRecords;
    });
    toast({
      title: "Marked All Present",
      description: `All ${students.length} students marked as present`,
    });
  };

  const handleSaveAttendance = () => {
    const records = Array.from(attendanceRecords.values()).map((record) => ({
      student_id: record.student_id,
      status: record.status,
      notes: record.notes || undefined,
    }));

    markAttendance({
      input: {
        class_id: Number(classId),
        session_id: Number(sessionId),
        date: format(selectedDate, "yyyy-MM-dd"),
        records,
      },
    });
  };

  const getStatusBadgeVariant = (status: AttendanceStatus) => {
    switch (status) {
      case "present":
        return "default";
      case "absent":
        return "destructive";
      case "late":
        return "secondary";
      case "excused":
        return "outline";
    }
  };

  const attendanceSummary = useMemo(() => {
    const summary = {
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
    };

    attendanceRecords.forEach((record) => {
      summary[record.status]++;
    });

    return summary;
  }, [attendanceRecords]);

  if (!classId || !sessionId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 hover:bg-white dark:hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Card className="bg-white dark:bg-gray-900 shadow-xl border-2 border-gray-200 dark:border-gray-700">
            <div className="relative h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-t-xl">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative h-full flex items-center justify-between px-8">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">
                    Class Attendance
                  </h1>
                  <p className="text-white/90">
                    Session #{sessionId} • Class #{classId}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[240px] justify-start text-left font-normal bg-white/10 border-white/30 text-white hover:bg-white/20",
                          !selectedDate && "text-white/70"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? (
                          format(selectedDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mb-1">
                    <Users className="w-4 h-4" />
                    <span>Total</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {students.length}
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                  <p className="text-green-600 dark:text-green-400 text-sm mb-1">
                    Present
                  </p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {attendanceSummary.present}
                  </p>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
                  <p className="text-red-600 dark:text-red-400 text-sm mb-1">
                    Absent
                  </p>
                  <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                    {attendanceSummary.absent}
                  </p>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                  <p className="text-amber-600 dark:text-amber-400 text-sm mb-1">
                    Late
                  </p>
                  <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                    {attendanceSummary.late}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                    Excused
                  </p>
                  <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                    {attendanceSummary.excused}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 flex gap-3">
          <Button
            onClick={handleMarkAllPresent}
            variant="outline"
            className="bg-white dark:bg-gray-900 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-300 dark:hover:border-green-700"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Mark All Present
          </Button>

          <Button
            onClick={handleSaveAttendance}
            disabled={isSaving || students.length === 0}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 ml-auto"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Attendance"}
          </Button>
        </div>

        {/* Students Table */}
        <Card className="bg-white dark:bg-gray-900 shadow-xl">
          <CardHeader>
            <CardTitle>Student Attendance</CardTitle>
            <CardDescription>
              Mark attendance for each enrolled student
            </CardDescription>
          </CardHeader>
          <CardContent>
            {studentsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-12 flex-1" />
                    <Skeleton className="h-12 w-48" />
                    <Skeleton className="h-12 w-64" />
                  </div>
                ))}
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                No students enrolled in this class
              </div>
            ) : (
              <div className="space-y-4">
                {students.map((student) => {
                  const record = attendanceRecords.get(student.student_id);
                  if (!record) return null;

                  return (
                    <div
                      key={student.student_id}
                      className="flex flex-col md:flex-row md:items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      {/* Student Name */}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {student.student_first_name}{" "}
                          {student.student_last_name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {student.student_id}
                        </p>
                      </div>

                      {/* Status Radio Group */}
                      <div className="md:w-80">
                        <RadioGroup
                          value={record.status}
                          onValueChange={(value) =>
                            handleStatusChange(
                              student.student_id,
                              value as AttendanceStatus
                            )
                          }
                          className="flex gap-2"
                        >
                          {(
                            [
                              "present",
                              "absent",
                              "late",
                              "excused",
                            ] as AttendanceStatus[]
                          ).map((status) => (
                            <div
                              key={status}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem
                                value={status}
                                id={`${student.student_id}-${status}`}
                              />
                              <Label
                                htmlFor={`${student.student_id}-${status}`}
                                className="cursor-pointer capitalize"
                              >
                                <Badge
                                  variant={getStatusBadgeVariant(status)}
                                  className="text-xs"
                                >
                                  {status}
                                </Badge>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>

                      {/* Notes */}
                      <div className="md:w-64">
                        <Textarea
                          placeholder="Add notes (optional)"
                          value={record.notes}
                          onChange={(e) =>
                            handleNotesChange(
                              student.student_id,
                              e.target.value
                            )
                          }
                          className="resize-none h-10"
                          rows={1}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
