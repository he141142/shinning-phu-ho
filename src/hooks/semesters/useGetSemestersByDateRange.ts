import { useGraphQLQueryWithVariables, gql } from '@/lib/graphql';
import type { ListSemestersResponse } from '@/models/semesters/ListSemesters';
import { useQuery } from '@tanstack/react-query';

const LIST_SEMESTERS_BY_DATE_QUERY = gql`
  query ListSemestersByDateRange($input: FilterSemesterInput!) {
    FilterSemesters(input: $input) {
      semester_id
      semester_name
      start_date
      end_date
    }
  }
`;


export interface UseGetSemestersByDateRangeVariables {
  from_date: string;
  to_date: string;
}

/**
 * Hook to fetch semesters that overlap with a given date range
 * Used for finding available semesters for a class based on start/end dates
 *
 * @example
 * const { data, isLoading, error } = useGetSemestersByDateRange({
 *   start_date: '2024-01-01',
 *   end_date: '2024-06-30',
 *   enabled: true
 * });
 */
export function useGetSemestersByDateRange(
  variables: UseGetSemestersByDateRangeVariables,
  options?: { enabled?: boolean }
) {
  const input = {
    from_date: variables.from_date,
    to_date: variables.to_date,
  };

  return useGraphQLQueryWithVariables<ListSemestersResponse>(
    ['semesters-by-date', variables.from_date, variables.to_date],
    LIST_SEMESTERS_BY_DATE_QUERY,
    { input },
    {
      staleTime: 5 * 60 * 1000,
      enabled: options?.enabled !== false && !!variables.from_date && !!variables.to_date,
    }
  );
}
