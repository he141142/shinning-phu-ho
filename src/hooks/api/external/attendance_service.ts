import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../internal/client";
import { useFetchStates } from "../internal/use-api";
import { SuccessResponse } from "./session_service";
import { request } from "https";

export interface GetAttendancesBySessionQuery {
  session_id: number;
}

export type AttendanceStatus = "present" | "absent";

export interface AttendanceRecord {
  student_id: number;
  student_name: string;
  grade: string;
  attendance_status: AttendanceStatus;
}

export interface RecordAttendanceRequest {
  student_id: number;
  session_id: number;
}
export interface Attendance {
  attendance_id: number;
  class_id: number;
  semester_id: number;
  student_id: number;
  session_id: number;
  date?: string;
  notes?: string;
  status?: string;
}

export const attendanceService = {
  async GetAttendancesBySessionID(
    request: GetAttendancesBySessionQuery
  ): Promise<SuccessResponse<AttendanceRecord[] | null>> {
    try {
      let response = await apiClient.request<
        SuccessResponse<AttendanceRecord[]>
      >(`/api/v1/attendance/session?session_id=${request.session_id}`, "token", {
        method: "GET",
      });
      return {
        data: response.data,
        success: true,
        status_code: response.status_code,
      };
    } catch (error) {

      return {
        data: null,
        success: false,
      };
    }
  },

  async RecordAttendance(
    request: RecordAttendanceRequest
  ): Promise<Attendance | null> {
    try {
      let response = await apiClient.request<SuccessResponse<Attendance>>(
        `/api/v1/attendance`,
        "token",
        {
          method: "POST",
          body: JSON.stringify(request),
        }
      );

      return response.data;
    } catch (error) {
      return null;
    }
  },
};

export const UseGetAttendancesBySessionID = (
  request: GetAttendancesBySessionQuery
) => {
  const queryClient = useQueryClient();
  const queryKey = ["sessionService.attendances.session", request.session_id];
  const queryResult = useQuery({
    queryKey,
    queryFn: () => attendanceService.GetAttendancesBySessionID(request),
    staleTime: 5 * 60 * 1000, // ✅ Cache fresh for 5 minutes,
    enabled: request.session_id > 0,
  });

  return useFetchStates<SuccessResponse<AttendanceRecord[] | null>>({
    data: queryResult?.data,
    error: queryResult.error,
    loading: queryResult.isLoading,
    refetch: queryResult.refetch,
    cancel: () => {
      queryClient.cancelQueries({ queryKey });
      queryClient.removeQueries({ queryKey });
    },
  });
};
