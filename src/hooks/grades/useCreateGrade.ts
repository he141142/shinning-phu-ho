import { useGraphQLMutationWithUnwrap, gql } from '@/lib/graphql';
import { queryClient } from '@/lib/react-query';
import type { CreateGradeInput, CreateGradeResponse } from '@/models/grades/CreateGrade';

const CREATE_GRADE_MUTATION = gql`
  mutation CreateGrade($input: CreateGradeInput!) {
    CreateGrade(input: $input) {
      status
      message
      grade_id
    }
  }
`;

/**
 * Hook to create a new grade
 *
 * @example
 * const { mutate, isPending, error } = useCreateGrade({
 *   onSuccess: (data) => {
 *     toast({ title: 'Grade created successfully!' });
 *   }
 * });
 *
 * // Use it
 * mutate({ grade_name: 'Grade 10' });
 */
export function useCreateGrade(options?: {
  onSuccess?: (data: CreateGradeResponse['CreateGrade']) => void;
  onError?: (error: Error) => void;
}) {
  return useGraphQLMutationWithUnwrap<
    CreateGradeResponse['CreateGrade'],
    { input: CreateGradeInput }
  >(
    'CreateGrade',
    CREATE_GRADE_MUTATION,
    {
      onSuccess: (data) => {
        // Invalidate grades list to refetch
        queryClient.invalidateQueries({ queryKey: ['grades'] });
        // Invalidate students list as they depend on grades
        queryClient.invalidateQueries({ queryKey: ['students'] });

        // Call custom onSuccess handler
        options?.onSuccess?.(data);
      },
      onError: options?.onError,
    }
  );
}
