import { Badge } from "@/components/drake_libs/ui/badge";
import { Label } from "@/components/drake_libs/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/drake_libs/ui/radio-group";
import { Skeleton } from "@/components/drake_libs/ui/skeleton";
import { Textarea } from "@/components/drake_libs/ui/textarea";
import { AttendanceRecord, AttendanceStatus } from "@/hooks/api/external/attendance_service";

export const AttendanceList: React.FC<{
  studentsLoading: boolean;
  attendanceData: AttendanceRecord[];
  attendanceRecords: Map<number, AttendanceRecord>;
  handleStatusChange: (studentId: number, status: AttendanceStatus) => void;
  // handleNotesChange: (studentId: number, notes: string) => void;
  getStatusBadgeVariant: (status: AttendanceStatus) => string;
}> = ({ studentsLoading, attendanceData, attendanceRecords , handleStatusChange, getStatusBadgeVariant }) => {
  return (
    <>
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
      ) : attendanceData.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No students enrolled in this class
        </div>
      ) : (
        <div className="space-y-4">
          {attendanceData.map((attendanceData) => {
            const record = attendanceRecords.get(attendanceData.student_id);
            if (!record) return null;

            return (
              <div
                key={attendanceData.student_id}
                className="flex flex-col md:flex-row md:items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {/* Student Name */}
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {attendanceData.student_name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ID: {attendanceData.student_id}
                  </p>
                </div>

                {/* Status Radio Group */}
                <div className="md:w-80">
                  <RadioGroup
                    value={record.attendance_status}
                    onValueChange={(value) =>
                      handleStatusChange(
                        attendanceData.student_id,
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
                      <div key={status} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={status}
                          id={`${attendanceData.student_id}-${status}`}
                        />
                        <Label
                          htmlFor={`${attendanceData.student_id}-${status}`}
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
                    value={"notes"}
                    onChange={(e) =>
                    //   handleNotesChange(attendanceData.student_id, e.target.value)
                        { }
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
    </>
  );
};
