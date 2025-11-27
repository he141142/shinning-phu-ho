import { useGraphQLMutationWithUnwrap, gql } from '@/lib/graphql';
import { queryClient } from '@/lib/react-query';

const CREATE_SEMESTER_MUTATION = gql`
  mutation CreateSemester($input: CreateSemesterInput!) {
    CreateSemester(input: $input) {
      status
      message
      entity_id
    }
  }
`;

export interface CreateSemesterInput {
  semester_name: string;
  start_date: string;
  end_date: string;
}

export interface CreateSemesterResponse {
  CreateSemester: {
    status: string;
    message: string;
    entity_id: number;
  };
}

/**
 * Hook to create a new semester
 *
 * @example
 * const { mutate, isPending, error } = useCreateSemester({
 *   onSuccess: (data) => {
 *     toast({ title: 'Semester created successfully!' });
 *   }
 * });
 *
 * mutate({ input: { semester_name: 'Fall 2024', start_date: '2024-09-01', end_date: '2024-12-31' } });
 */
export function useCreateSemester(options?: {
  onSuccess?: (data: CreateSemesterResponse['CreateSemester']) => void;
  onError?: (error: Error) => void;
}) {
  return useGraphQLMutationWithUnwrap<
    CreateSemesterResponse['CreateSemester'],
    { input: CreateSemesterInput }
  >(
    'CreateSemester',
    CREATE_SEMESTER_MUTATION,
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
