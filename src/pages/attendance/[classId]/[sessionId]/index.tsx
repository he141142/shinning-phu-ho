"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/drake_libs/ui/card";
import { Button } from "@/components/drake_libs/ui/button";

import { useToast } from "@/components/hooks/use-toast";
import {
  Calendar as CalendarIcon,
  Save,
  CheckCircle2,
  ArrowLeft,
  Users,
} from "lucide-react";

import { Calendar } from "@/components/drake_libs/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/drake_libs/ui/popover";
import { cn } from "@/lib/utils";
import { useRouter, useParams } from "next/navigation";
import { LoadingPage } from "@/components/drake_libs/component/loading-page";
import {
  Attendance,
  AttendanceRecord,
  attendanceService,
  AttendanceStatus,
  UseGetAttendancesBySessionID,
} from "@/hooks/api/external/attendance_service";
import { AttendanceList } from "./components/attendance-list";

export default function TeacherAttendancePage() {
  const router = useRouter();
  const params = useParams();
  const session_id = Number((params && params["sessionId"]) || -1);
  const { toast } = useToast();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState<
    Map<number, AttendanceRecord>
  >(new Map());


  
const handleStatusChange = useCallback(
    (studentId: number, attendance_status: AttendanceStatus) => {
      setAttendanceRecords((prev) => {
        const newRecords = new Map(prev);
        const record = newRecords.get(studentId);
        if (record) {
          newRecords.set(studentId, { ...record, attendance_status });
        }
        return newRecords;
      });
    },
    []
  );

  const attendanceSummary = useMemo(() => {
    const summary = {
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
    };

    attendanceRecords.forEach((record) => {
      summary[record.attendance_status]++;
    });

    return summary;
  }, [attendanceRecords]);

  const {
    data: attendanceData,
    error: attendanceError,
    loading: attendanceLoading,
  } = UseGetAttendancesBySessionID({ session_id: session_id });
  
  if (
    !params ||
    !params["classId"] ||
    !params["sessionId"] ||
    attendanceLoading ||
    !attendanceData ||
    attendanceError
  ) {
    return <LoadingPage />;
  }

  const isSaving  = false;

  const { classId, sessionId } = params;

  // Mark attendance mutation -> replace with RUST api call
  const markAttendance = async (
    student_id: number,
    session_id: number
  ): Promise<Attendance | null> => {
    return await attendanceService.RecordAttendance({
      student_id,
      session_id,
    });
  };

  
  const handleMarkAllPresent = () => {
    setAttendanceRecords((prev) => {
      const newRecords = new Map(prev);
      newRecords.forEach((record, studentId) => {
        newRecords.set(studentId, { ...record, attendance_status: "present" });
      });
      return newRecords;
    });
    toast({
      title: "Marked All Present",
      description: `All ${attendanceData?.data?.length} students marked as present`,
    });
  };

  const handleSaveAttendance = async () => {
    const records = Array.from(attendanceRecords.values());

    // Map to an array of promises
    const promises = records.map((record) =>
      markAttendance(record.student_id, session_id)
    );

    // Wait for all promises to resolve
    const results = await Promise.all(promises);

    console.log("All attendance marked:", results);
  };

  const getStatusBadgeVariant = (status: AttendanceStatus) => {
    switch (status) {
      case "present":
        return "default";
      case "absent":
        return "destructive";
      // case "late":
      //   return "secondary";
      // case "excused":
      //   return "outline";
    }
  };

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
                    {attendanceData?.data?.length || 0}
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
            disabled={isSaving || (attendanceData?.data?.length || 0) === 0}
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
            <AttendanceList
              studentsLoading={attendanceLoading}
              attendanceData={attendanceData.data || []}
              attendanceRecords={attendanceRecords}
              handleStatusChange={handleStatusChange}
              getStatusBadgeVariant={getStatusBadgeVariant}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
