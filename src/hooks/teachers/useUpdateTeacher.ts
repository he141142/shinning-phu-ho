import { useGraphQLMutationWithUnwrap, gql } from '@/lib/graphql';
import { queryClient } from '@/lib/react-query';
import type { CommonResponse } from '@/models/common';
import type { UpdateTeacherInput } from '@/models/teachers/UpdateTeacher/UpdateTeacher';

const UPDATE_TEACHER_MUTATION = gql`
  mutation UpdateTeacher($input: UpdateTeacherInput!) {
    UpdateTeacher(input: $input) {
      entity_id
      status
      message
    }
  }
`;

/**
 * Hook to update an existing teacher
 *
 * @example
 * const { mutate, isPending, error } = useUpdateTeacher({
 *   onSuccess: (data) => {
 *     toast({ title: 'Teacher updated successfully!' });
 *   }
 * });
 *
 * // Use it
 * mutate({
 *   input: {
 *     teacher_id: 1,
 *     first_name: 'John',
 *     last_name: 'Doe',
 *     email: 'john@example.com',
 *     phone_number: '123-456-7890',
 *     ...
 *   }
 * });
 */
export function useUpdateTeacher(options?: {
  onSuccess?: (data: CommonResponse) => void;
  onError?: (error: Error) => void;
}) {
  return useGraphQLMutationWithUnwrap<CommonResponse, { input: UpdateTeacherInput }>(
    'UpdateTeacher',
    UPDATE_TEACHER_MUTATION,
    {
      onSuccess: (data) => {
        // Invalidate teachers list and detail queries to refetch
        queryClient.invalidateQueries({ queryKey: ['teachers'] });
        queryClient.invalidateQueries({ queryKey: ['teacher'] });

        // Call custom onSuccess handler
        options?.onSuccess?.(data);
      },
      onError: options?.onError,
    }
  );
}
