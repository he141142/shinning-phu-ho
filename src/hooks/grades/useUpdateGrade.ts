import { useGraphQLMutationWithUnwrap, gql } from '@/lib/graphql';
import { queryClient } from '@/lib/react-query';
import type { UpdateGradeInput, UpdateGradeResponse } from '@/models/grades/UpdateGrade';

const UPDATE_GRADE_MUTATION = gql`
  mutation UpdateGrade($input: UpdateGradeInput!) {
    UpdateGrade(input: $input) {
      status
      message
    }
  }
`;

/**
 * Hook to update an existing grade
 *
 * @example
 * const { mutate, isPending, error } = useUpdateGrade({
 *   onSuccess: (data) => {
 *     toast({ title: 'Grade updated successfully!' });
 *   }
 * });
 *
 * // Use it
 * mutate({ grade_id: 1, grade_name: 'Grade 11' });
 */
export function useUpdateGrade(options?: {
  onSuccess?: (data: UpdateGradeResponse['UpdateGrade']) => void;
  onError?: (error: Error) => void;
}) {
  return useGraphQLMutationWithUnwrap<
    UpdateGradeResponse['UpdateGrade'],
    { input: UpdateGradeInput }
  >(
    'UpdateGrade',
    UPDATE_GRADE_MUTATION,
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
