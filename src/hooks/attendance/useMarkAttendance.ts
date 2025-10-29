import { useGraphQLMutationWithUnwrap, gql } from '@/lib/graphql';
import { queryClient } from '@/lib/react-query';
import type { MarkAttendanceRequest, MarkAttendanceResponse } from '@/models/attendance/Attendance';

const MARK_ATTENDANCE_MUTATION = gql`
  mutation MarkAttendance($input: MarkAttendanceInput!) {
    MarkAttendance(input: $input) {
      success
      message
      attendance_ids
    }
  }
`;

/**
 * Hook to mark attendance for a class session
 */
export function useMarkAttendance(options?: {
  onSuccess?: (data: MarkAttendanceResponse) => void;
  onError?: (error: Error) => void;
}) {
  return useGraphQLMutationWithUnwrap<MarkAttendanceResponse, { input: MarkAttendanceRequest }>(
    'MarkAttendance',
    MARK_ATTENDANCE_MUTATION,
    {
      onSuccess: (data) => {
        // Invalidate attendance queries
        queryClient.invalidateQueries({ queryKey: ['attendance'] });
        queryClient.invalidateQueries({ queryKey: ['class-attendance'] });

        options?.onSuccess?.(data);
      },
      onError: options?.onError,
    }
  );
}
