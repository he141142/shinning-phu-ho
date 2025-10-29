import { useGraphQLMutationWithUnwrap, gql } from '@/lib/graphql';
import { queryClient } from '@/lib/react-query';
import type { CommonResponse } from '@/models/common';

const JOIN_STUDENT_TO_CLASS_MUTATION = gql`
  mutation JoinStudentToClass($student_id: Int!, $class_id: Int!) {
    JoinStudentToClass(input: { student_id: $student_id, class_id: $class_id }) {
      status
      message
    }
  }
`;

export interface JoinStudentToClassVariables {
  student_id: number;
  class_id: number;
}

/**
 * Hook to join a student to a class
 *
 * @example
 * const { mutate, isPending } = useJoinStudentToClass({
 *   onSuccess: () => {
 *     toast({ title: 'Student joined class successfully!' });
 *   }
 * });
 *
 * mutate({ student_id: 123, class_id: 456 });
 */
export function useJoinStudentToClass(options?: {
  onSuccess?: (data: CommonResponse) => void;
  onError?: (error: Error) => void;
}) {
  return useGraphQLMutationWithUnwrap<CommonResponse, JoinStudentToClassVariables>(
    'JoinStudentToClass',
    JOIN_STUDENT_TO_CLASS_MUTATION,
    {
      onSuccess: (data, variables) => {
        // Invalidate related queries to refetch
        queryClient.invalidateQueries({ queryKey: ['students'] });
        queryClient.invalidateQueries({ queryKey: ['student', variables.student_id] });
        queryClient.invalidateQueries({ queryKey: ['class', variables.class_id] });
        queryClient.invalidateQueries({ queryKey: ['classes'] });

        options?.onSuccess?.(data);
      },
      onError: options?.onError,
    }
  );
}
