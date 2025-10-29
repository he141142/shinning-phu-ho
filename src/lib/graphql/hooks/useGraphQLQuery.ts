import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { graphqlRequest } from '../client';

/**
 * Generic hook for GraphQL queries using React Query
 *
 * @example
 * const { data, isLoading, error } = useGraphQLQuery<StudentListResponse>(
 *   ['students', page],
 *   GET_STUDENTS_QUERY,
 *   { page, limit: 10 }
 * );
 */
export function useGraphQLQuery<TData = any, TVariables = Record<string, any>>(
  queryKey: unknown[],
  query: string,
  variables?: TVariables,
  options?: Omit<UseQueryOptions<TData, Error>, 'queryKey' | 'queryFn'>
): UseQueryResult<TData, Error> {
  return useQuery<TData, Error>({
    queryKey,
    queryFn: async () => {
      const data = await graphqlRequest<TData, TVariables>(query, variables);
      return data;
    },
    ...options,
  });
}

/**
 * Hook for GraphQL queries with automatic refetching on variable changes
 * Variables are included in the query key automatically
 *
 * @example
 * const { data } = useGraphQLQueryWithVariables<StudentListResponse>(
 *   'students',
 *   GET_STUDENTS_QUERY,
 *   { page: 1, limit: 10 }
 * );
 */
export function useGraphQLQueryWithVariables<TData = any, TVariables = Record<string, any>>(
  baseKey: string | string[],
  query: string,
  variables?: TVariables,
  options?: Omit<UseQueryOptions<TData, Error>, 'queryKey' | 'queryFn'>
): UseQueryResult<TData, Error> {
  const queryKey = Array.isArray(baseKey)
    ? [...baseKey, variables]
    : [baseKey, variables];

  return useQuery<TData, Error>({
    queryKey,
    queryFn: async () => {
      const data = await graphqlRequest<TData, TVariables>(query, variables);
      return data;
    },
    ...options,
  });
}
