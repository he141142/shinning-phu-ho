import { useGraphQLQuery, gql } from '@/lib/graphql';
import type { GetClassByIdResponse } from '@/models/class/class.detail';

const GET_CLASS_BY_ID_QUERY = gql`
  query GetClassById($class_id: GetClassByIdInput!) {
    GetClassById(input: $class_id) {
      class_id
      class_name
      description
      start_date
      end_date
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
        name
        description
        is_enable
      }
      room {
        room_id
        room_number
        capacity
        center {
          center_id
          center_name
          address
        }
      }
      teacher {
        teacher_id
        first_name
        last_name
        email
        phone_number
      }
    }
  }
`;

/**
 * Hook to fetch detailed information for a single class
 * Note: Grade data is mocked at class level until backend supports it
 *
 * @example
 * const { data, isLoading, error } = useGetClassById(456);
 */
export function useGetClassById(classId: number) {
  const result = useGraphQLQuery<{ GetClassById: GetClassByIdResponse }>(
    ['class', classId],
    GET_CLASS_BY_ID_QUERY,
    { class_id: { class_id: classId } },
    {
      enabled: !!classId && classId > 0,
      staleTime: 5 * 60 * 1000,
    }
  );

  // Mock grade data injection - will be replaced when backend supports grade on class level
  if (result.data?.GetClassById) {
    return {
      ...result,
      data: {
        GetClassById: {
          ...result.data.GetClassById,
          grade: "Grade 10", // Mock grade name
          grade_id: 10 // Mock grade ID
        }
      }
    };
  }

  return result;
}
