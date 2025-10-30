import { useGraphQLQueryWithVariables, gql } from '@/lib/graphql';
import type { ListSemestersResponse } from '@/models/semesters/ListSemesters';

const LIST_SEMESTERS_QUERY = gql`
   query ListSemesters {
    ListAllSemesters{
     	semester_id
      semester_name
      start_date
      end_date
    }
  }
`;

export interface UseGetListSemestersVariables {
  page: number;
  limit: number;
  order_by?: string;
}

/**
 * Hook to fetch paginated list of semesters
 * If the API doesn't exist, this will use mock data
 *
 * @example
 * const { data, isLoading, error } = useGetListSemesters({
 *   page: 1,
 *   limit: 100
 * });
 */
export function useGetListSemesters(variables: UseGetListSemestersVariables) {
  const input = {
    page: variables.page,
    limit: variables.limit,
    order_by: variables.order_by || 'semester_name asc',
  };

  return useGraphQLQueryWithVariables<ListSemestersResponse>(
    'semesters',
    LIST_SEMESTERS_QUERY,
    { input },
    {
      staleTime: 5 * 60 * 1000,
      enabled: variables.page > 0 && variables.limit > 0,
    }
  );
}
