import { useGraphQLMutationWithUnwrap, gql } from '@/lib/graphql';
import { queryClient } from '@/lib/react-query';

const UPDATE_SEMESTER_MUTATION = gql`
  mutation UpdateSemester($input: UpdateSemesterInput!) {
    UpdateSemester(input: $input) {
      status
      message
      entity_id
    }
  }
`;

export interface UpdateSemesterInput {
  semester_id: number;
  semester_name: string;
  start_date: string;
  end_date: string;
}

export interface UpdateSemesterResponse {
  UpdateSemester: {
    status: string;
    message: string;
    entity_id: number;
  };
}

/**
 * Hook to update an existing semester
 *
 * @example
 * const { mutate, isPending, error } = useUpdateSemester({
 *   onSuccess: (data) => {
 *     toast({ title: 'Semester updated successfully!' });
 *   }
 * });
 *
 * mutate({ input: { semester_id: 1, semester_name: 'Fall 2024', start_date: '2024-09-01', end_date: '2024-12-31' } });
 */
export function useUpdateSemester(options?: {
  onSuccess?: (data: UpdateSemesterResponse['UpdateSemester']) => void;
  onError?: (error: Error) => void;
}) {
  return useGraphQLMutationWithUnwrap<
    UpdateSemesterResponse['UpdateSemester'],
    { input: UpdateSemesterInput }
  >(
    'UpdateSemester',
    UPDATE_SEMESTER_MUTATION,
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
