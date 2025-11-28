import { useGraphQLQueryWithVariables } from "@/lib/graphql";
import { Semester } from "@/models/semesters/entity";
import { gql } from "graphql-request";

const query = gql`
  query FilterSemesters($input: FilterSemesterInput!) {
    FilterSemesters(input: $input) {
      semester_id
      semester_name
      start_date
      end_date
    }
  }
`;

export interface FilterSemesterInput {
  from_date: string;
  to_date: string;
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
export function UseFilterSemesters(variables: FilterSemesterInput) {
  const input = {
    ...variables,
  };

  return useGraphQLQueryWithVariables<FilterSemesters>(
    "UseFilterSemesters",
    query,
    { input },
    {
      staleTime: 5 * 60 * 1000,
      enabled: variables.from_date !== "" && variables.to_date !== "",
    }
  );
}


export interface FilterSemesters {
  FilterSemesters: Semester[];
}
