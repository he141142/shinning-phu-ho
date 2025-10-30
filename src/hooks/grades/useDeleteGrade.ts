import { useGraphQLMutationWithUnwrap, gql } from '@/lib/graphql';
import { queryClient } from '@/lib/react-query';
import type { DeleteGradeInput, DeleteGradeResponse } from '@/models/grades/DeleteGrade';

const DELETE_GRADE_MUTATION = gql`
  mutation DeleteGrade($grade_id: Int!) {
    DeleteGrade(grade_id: $grade_id) {
      status
      message
    }
  }
`;

/**
 * Hook to delete a grade
 *
 * @example
 * const { mutate, isPending, error } = useDeleteGrade({
 *   onSuccess: (data) => {
 *     toast({ title: 'Grade deleted successfully!' });
 *   }
 * });
 *
 * // Use it
 * mutate({ grade_id: 1 });
 */
export function useDeleteGrade(options?: {
  onSuccess?: (data: DeleteGradeResponse['DeleteGrade']) => void;
  onError?: (error: Error) => void;
}) {
  return useGraphQLMutationWithUnwrap<
    DeleteGradeResponse['DeleteGrade'],
    DeleteGradeInput
  >(
    'DeleteGrade',
    DELETE_GRADE_MUTATION,
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
