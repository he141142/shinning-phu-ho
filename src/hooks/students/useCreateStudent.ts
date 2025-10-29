import { useGraphQLMutationWithUnwrap, gql } from '@/lib/graphql';
import { queryClient } from '@/lib/react-query';
import type { CommonResponse } from '@/models/common';
import type { CreateStudentInput } from '@/models/students/CreateStudent/CreateStudent';

const CREATE_STUDENT_MUTATION = gql`
  mutation CreateStudent($input: CreateStudentInput!) {
    CreateStudent(input: $input) {
      entity_id
      status
      message
    }
  }
`;

/**
 * Hook to create a new student
 *
 * @example
 * const { mutate, isPending, error } = useCreateStudent({
 *   onSuccess: (data) => {
 *     toast({ title: 'Student created successfully!' });
 *   }
 * });
 *
 * // Use it
 * mutate({
 *   first_name: 'John',
 *   last_name: 'Doe',
 *   email: 'john@example.com',
 *   ...
 * });
 */
export function useCreateStudent(options?: {
  onSuccess?: (data: CommonResponse) => void;
  onError?: (error: Error) => void;
}) {
  return useGraphQLMutationWithUnwrap<CommonResponse, { input: CreateStudentInput }>(
    'CreateStudent',
    CREATE_STUDENT_MUTATION,
    {
      onSuccess: (data) => {
        // Invalidate students list to refetch
        queryClient.invalidateQueries({ queryKey: ['students'] });

        // Call custom onSuccess handler
        options?.onSuccess?.(data);
      },
      onError: options?.onError,
    }
  );
}
