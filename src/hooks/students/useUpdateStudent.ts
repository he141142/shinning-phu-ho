import { useGraphQLMutationWithUnwrap, gql } from '@/lib/graphql';
import { queryClient } from '@/lib/react-query';
import type { CommonResponse } from '@/models/common';
import type { UpdateStudentInput } from '@/models/students/UpdateStudent/UpdateStudent';

const UPDATE_STUDENT_MUTATION = gql`
  mutation UpdateStudent($input: UpdateStudentInput!) {
    UpdateStudent(input: $input) {
      entity_id
      status
      message
    }
  }
`;

/**
 * Hook to update an existing student
 *
 * @example
 * const { mutate, isPending, error } = useUpdateStudent({
 *   onSuccess: (data) => {
 *     toast({ title: 'Student updated successfully!' });
 *   }
 * });
 *
 * // Use it
 * mutate({
 *   student_id: 1,
 *   first_name: 'John',
 *   last_name: 'Doe',
 *   email: 'john@example.com',
 *   ...
 * });
 */
export function useUpdateStudent(options?: {
  onSuccess?: (data: CommonResponse) => void;
  onError?: (error: Error) => void;
}) {
  return useGraphQLMutationWithUnwrap<CommonResponse, { input: UpdateStudentInput }>(
    'UpdateStudent',
    UPDATE_STUDENT_MUTATION,
    {
      onSuccess: (data) => {
        // Invalidate students list and detail queries to refetch
        queryClient.invalidateQueries({ queryKey: ['students'] });
        queryClient.invalidateQueries({ queryKey: ['student'] });

        // Call custom onSuccess handler
        options?.onSuccess?.(data);
      },
      onError: options?.onError,
    }
  );
}
