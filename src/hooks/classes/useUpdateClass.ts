import { useGraphQLMutationWithUnwrap, gql } from '@/lib/graphql';
import { queryClient } from '@/lib/react-query';
import type { UpdateClassInput, UpdateClassResponse } from '@/models/class/UpdateClass';

const UPDATE_CLASS_MUTATION = gql`
  mutation UpdateClass($input: UpdateClassInput!) {
    UpdateClass(input: $input) {
      status
      message
      class_id
    }
  }
`;

/**
 * Hook to update a class
 *
 * @example
 * const { mutate, isPending, error } = useUpdateClass({
 *   onSuccess: (data) => {
 *     toast({ title: 'Class updated successfully!' });
 *   }
 * });
 *
 * // Use it
 * mutate({ input: { class_id: 1, class_name: 'Updated Name' } });
 */
export function useUpdateClass(options?: {
  onSuccess?: (data: UpdateClassResponse['UpdateClass']) => void;
  onError?: (error: Error) => void;
}) {
  return useGraphQLMutationWithUnwrap<
    UpdateClassResponse['UpdateClass'],
    { input: UpdateClassInput }
  >(
    'UpdateClass',
    UPDATE_CLASS_MUTATION,
    {
      onSuccess: (data) => {
        // Invalidate classes list to refetch
        queryClient.invalidateQueries({ queryKey: ['classes'] });
        // Invalidate specific class detail
        queryClient.invalidateQueries({ queryKey: ['class', data.class_id] });

        // Call custom onSuccess handler
        options?.onSuccess?.(data);
      },
      onError: options?.onError,
    }
  );
}
