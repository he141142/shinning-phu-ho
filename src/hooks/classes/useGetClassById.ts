import { useGraphQLQuery, gql } from '@/lib/graphql';
import type { GetClassByIdResponse } from '@/models/class/class.detail';

const GET_CLASS_BY_ID_QUERY = gql`
  query GetClassById($class_id: Int!) {
    GetClassById(class_id: $class_id) {
      class_id
      class_name
      description
      start_date
      end_date
      status
      students {
        id
        first_name
        last_name
        email
        phone
        grade {
          grade_id
          grade_name
        }
      }
      semester {
        semester_id
        semester_name
        start_date
        end_date
      }
      class_config {
        max_students
        min_students
      }
      room {
        room_id
        room_name
        capacity
        center {
          center_id
          center_name
          address
        }
      }
      teacher {
        teacher_id
        name
        email
        phone
      }
    }
  }
`;

/**
 * Hook to fetch detailed information for a single class
 *
 * @example
 * const { data, isLoading, error } = useGetClassById(456);
 */
export function useGetClassById(classId: number) {
  return useGraphQLQuery<GetClassByIdResponse>(
    ['class', classId],
    GET_CLASS_BY_ID_QUERY,
    { class_id: classId },
    {
      enabled: !!classId && classId > 0,
      staleTime: 5 * 60 * 1000,
    }
  );
}
