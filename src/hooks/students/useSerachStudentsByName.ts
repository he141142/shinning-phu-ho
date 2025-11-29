import {
  gql,
  useGraphQLMutationWithUnwrap,
  useGraphQLQueryWithVariables,
} from "@/lib/graphql";
import { GetStudentDetail } from "@/models/students/GetStudentDetail/GetStudentDetail";

const query = gql`
  query GetStudentsFilterByName($name: String!, $page: Int!, $per_page: Int!, $extensions:Map) {
    GetStudentsFilterByName(search: $name, page: $page, per_page: $per_page, extensions: $extensions) {
      total
      data {
        id
        first_name
        last_name
        dob
        email
        grade {
          grade_id
          grade_name
        },
        extend_class_info{
          class_id
          semesters_joined{
            semester_id
            semester_name
            start_date
            end_date
          }
        }
      }
      total_pages
      total_items
      page
    }
  }
`;

export interface GetStudentsFilterByName {
  total: number;
  data: GetStudentDetail[];
  total_pages: number;
  total_items: number;
  page: number;
}

export interface SearchStudentFilterVar {
  name: string;
  page: number;
  per_page: number;
  extensions: Record<string, any> | null;
  
}

export function useSerachStudentsByName(input: SearchStudentFilterVar) {

  return useGraphQLQueryWithVariables<{GetStudentsFilterByName: GetStudentsFilterByName}>(
    "GetStudentsFilterByName",
    query,
    {
      ...input,
    },
    {
      enabled: input.page > 0 && input.per_page > 0,
    }
  );
}
