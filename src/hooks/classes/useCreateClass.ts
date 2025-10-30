import { useGraphQLMutationWithUnwrap, gql } from '@/lib/graphql';
import { queryClient } from '@/lib/react-query';
import type { CreateClassInput, CreateClassResponse } from '@/models/class/CreateClass';

const CREATE_CLASS_MUTATION = gql`
  mutation CreateClass($input: CreateClassInput!) {
    CreateClass(input: $input) {
      status
      message
      class_id
    }
  }
`;

/**
 * Hook to create a new class
 *
 * @example
 * const { mutate, isPending, error } = useCreateClass({
 *   onSuccess: (data) => {
 *     toast({ title: 'Class created successfully!' });
 *   }
 * });
 *
 * // Use it
 * mutate({ input: { class_name: 'Math 101', grade_id: 1 } });
 */
export function useCreateClass(options?: {
  onSuccess?: (data: CreateClassResponse['CreateClass']) => void;
  onError?: (error: Error) => void;
}) {
  return useGraphQLMutationWithUnwrap<
    CreateClassResponse['CreateClass'],
    { input: CreateClassInput }
  >(
    'CreateClass',
    CREATE_CLASS_MUTATION,
    {
      onSuccess: (data) => {
        // Invalidate classes list to refetch
        queryClient.invalidateQueries({ queryKey: ['classes'] });

        // Call custom onSuccess handler
        options?.onSuccess?.(data);
      },
      onError: options?.onError,
    }
  );
}
