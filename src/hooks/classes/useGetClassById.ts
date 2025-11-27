import { useGraphQLQuery, gql } from "@/lib/graphql";
import type { GetClassByIdResponse } from "@/models/class/class.detail";

const GET_CLASS_BY_ID_QUERY = gql`
  query GetClassById($input: GetClassByIdInput!) {
    GetClassById(input: $input) {
      class_id
      class_name
      description
      start_date
      end_date
      students {
        id
        first_name
        last_name
        dob
        email
        phone
        address
        emergency_contact_name
        emergency_contact_phone
        grade {
          grade_id
          grade_name
        }
      }
      semester {
        end_date
        semester_id
        semester_name
        start_date
      }
      class_config {
        name
        description
        config_id
        is_enable
      }
      max_students
      current_enrollment
      room_id
      room {
        capacity
        center {
          center_id
        }
        room_id
        room_number
      }
      teacher {
        teacher_id
        first_name
        last_name
        middle_name
        dob
        gender
        phone_number
        email
        specialization
        hire_date
        profile_picture
      }
      grades {
        grade_id
        grade_name
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
export function useGetClassById(classId: number | undefined) {
  const isValidClassId = !!classId && !isNaN(classId) && classId > 0;

  console.log("useGetClassById - classId:", classId, "isValid:", isValidClassId);

  return useGraphQLQuery<{ GetClassById: GetClassByIdResponse }>(
    ["class", classId],
    GET_CLASS_BY_ID_QUERY,
    { input: { class_id: classId || 0 } },
    {
      enabled: isValidClassId,
      staleTime: 0,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );
}
