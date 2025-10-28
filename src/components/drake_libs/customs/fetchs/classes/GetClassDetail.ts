import { UseFetch } from "@/components/hooks/fetch-data";
import { GetClassById } from "@/models/class/class.detail";
import { HOST } from "@/static/env";
import { useCallback, useState } from "react";

export const sykrosFetchData = <T>(endpoint: string, query: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fetchData = useCallback(async () => {
    const controller = new AbortController();
    const signal = controller.signal;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
        signal, // ✅ Attach signal to allow cancellation
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      setData(result.data);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }

    return () => controller.abort(); // ✅ Cleanup: cancel fetch request on unmount
  }, [endpoint, query]); // ✅ Memoize function

  return { data, loading, error, fetchData }; // ✅ Expose `refetch` function
};

export const GetClassDetail = (classID: number) => {
  const { data, error, loading } = UseFetch<GetClassById>(
    `${HOST}/query`,
    classID >0 ?
    `
        query{
          GetClassById(input:{
            class_id: ${classID}
          }){
            class_id
            class_name
            description
            students{
              id
              first_name
              last_name
              dob
              email
              phone
              address
              emergency_contact_name
              emergency_contact_phone
            }
            semester{
                end_date
                semester_id
                semester_name
                start_date
            }
            class_config{
              name
              description
              config_id
              is_enable
            }
            max_students
            current_enrollment
            room_id
            room{
                capacity
                center{
                    center_id
                }
                room_id
                room_number
            }
            teacher{
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
          }
        }
        `: null
  );

  return {
    classDetail: data?.GetClassById,
    error,
    loading,
  };
};


export const getClassDetailQuery = (class_id: number) => {
  return `
        query{
          GetClassById(input:{
            class_id: ${class_id}
          }){
            class_id
            class_name
            description
            students{
              id
              first_name
              last_name
              dob
              email
              phone
              address
              emergency_contact_name
              emergency_contact_phone
            }
            semester{
                end_date
                semester_id
                semester_name
                start_date
            }
            class_config{
              name
              description
              config_id
              is_enable
            }
            max_students
            current_enrollment
            room_id
            room{
                capacity
                center{
                    center_id
                }
                room_id
                room_number
            }
            teacher{
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
          }
        }
        `
}