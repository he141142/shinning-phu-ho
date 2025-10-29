import { useGraphQLQuery, gql } from '@/lib/graphql';
import type { GetAttendanceRequest, Attendance } from '@/models/attendance/Attendance';

const GET_ATTENDANCE_QUERY = gql`
  query GetAttendance($filters: AttendanceFilters!) {
    GetAttendance(filters: $filters) {
      attendance_id
      student_id
      class_id
      session_id
      date
      status
      notes
      recorded_by
      created_at
      updated_at
    }
  }
`;

export interface GetAttendanceResponse {
  GetAttendance: Attendance[];
}

/**
 * Hook to get attendance records
 */
export function useGetAttendance(filters: GetAttendanceRequest) {
  const { data, error, isLoading, refetch } = useGraphQLQuery<
    GetAttendanceResponse,
    { filters: GetAttendanceRequest }
  >(
    ['attendance', filters],
    GET_ATTENDANCE_QUERY,
    { filters },
    {
      enabled: Object.keys(filters).length > 0,
    }
  );

  return {
    attendance: data?.GetAttendance ?? [],
    error,
    isLoading,
    refetch,
  };
}
