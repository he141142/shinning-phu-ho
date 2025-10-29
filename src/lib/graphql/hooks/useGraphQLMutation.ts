import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { graphqlRequest } from '../client';

/**
 * Generic hook for GraphQL mutations using React Query
 *
 * @example
 * const { mutate, isPending } = useGraphQLMutation<CreateStudentResponse, CreateStudentInput>(
 *   CREATE_STUDENT_MUTATION,
 *   {
 *     onSuccess: (data) => {
 *       toast({ title: 'Student created!' });
 *     },
 *     onError: (error) => {
 *       toast({ title: 'Error', description: error.message });
 *     }
 *   }
 * );
 *
 * // Use it
 * mutate({ first_name: 'John', last_name: 'Doe', ... });
 */
export function useGraphQLMutation<
  TData = any,
  TVariables = Record<string, any>,
  TContext = unknown
>(
  mutation: string,
  options?: Omit<UseMutationOptions<TData, Error, TVariables, TContext>, 'mutationFn'>
): UseMutationResult<TData, Error, TVariables, TContext> {
  return useMutation<TData, Error, TVariables, TContext>({
    mutationFn: async (variables: TVariables) => {
      const data = await graphqlRequest<TData, TVariables>(mutation, variables);
      return data;
    },
    ...options,
  });
}

/**
 * Hook for GraphQL mutations with response unwrapping
 * Automatically unwraps the mutation response to get the actual data
 *
 * @example
 * const { mutate } = useGraphQLMutationWithUnwrap<CommonResponse, CreateStudentInput>(
 *   'CreateStudent',
 *   CREATE_STUDENT_MUTATION
 * );
 */
export function useGraphQLMutationWithUnwrap<
  TData = any,
  TVariables = Record<string, any>,
  TContext = unknown
>(
  operationName: string,
  mutation: string,
  options?: Omit<UseMutationOptions<TData, Error, TVariables, TContext>, 'mutationFn'>
): UseMutationResult<TData, Error, TVariables, TContext> {
  return useMutation<TData, Error, TVariables, TContext>({
    mutationFn: async (variables: TVariables) => {
      const response = await graphqlRequest<Record<string, TData>, TVariables>(
        mutation,
        variables
      );

      // Unwrap the response - get the actual data from the operation name
      if (response && operationName in response) {
        return response[operationName];
      }

      return response as unknown as TData;
    },
    ...options,
  });
}
