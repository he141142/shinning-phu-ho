import { useGraphQLMutationWithUnwrap, gql } from '@/lib/graphql';
import { queryClient } from '@/lib/react-query';

const DELETE_SEMESTER_MUTATION = gql`
  mutation DeleteSemester($input: DeleteSemesterInput!) {
    DeleteSemester(input: $input) {
      status
      message
    }
  }
`;

export interface DeleteSemesterInput {
  semester_id: number;
}

export interface DeleteSemesterResponse {
  DeleteSemester: {
    status: string;
    message: string;
  };
}

/**
 * Hook to delete a semester
 *
 * @example
 * const { mutate, isPending, error } = useDeleteSemester({
 *   onSuccess: (data) => {
 *     toast({ title: 'Semester deleted successfully!' });
 *   }
 * });
 *
 * mutate({ input: { semester_id: 1 } });
 */
export function useDeleteSemester(options?: {
  onSuccess?: (data: DeleteSemesterResponse['DeleteSemester']) => void;
  onError?: (error: Error) => void;
}) {
  return useGraphQLMutationWithUnwrap<
    DeleteSemesterResponse['DeleteSemester'],
    { input: DeleteSemesterInput }
  >(
    'DeleteSemester',
    DELETE_SEMESTER_MUTATION,
    {
      onSuccess: (data) => {
        // Invalidate semesters list to refetch
        queryClient.invalidateQueries({ queryKey: ['semesters'] });

        // Call custom onSuccess handler
        options?.onSuccess?.(data);
      },
      onError: options?.onError,
    }
  );
}
