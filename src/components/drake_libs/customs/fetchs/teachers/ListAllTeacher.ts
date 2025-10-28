import { UseFetch } from "@/components/hooks/fetch-data";
import { ListTeachers } from "@/models/teachers/ListTeachers";
import { HOST } from "@/static/env";

export const UseListAllTeacher = ( page: number,perPage: number) => {
    const { data, error, loading } = UseFetch<ListTeachers>(`${HOST}/query`, `
        query{
           ListTeachers(input:{
               limit: ${perPage},
               order_by:"name desc",
               page: ${page},
               where: {}
           }){
               data{
                   address
                   teacher_id
                   classes{
                       class_id
                       class_name
                       current_enrollment
                   }
                   address
                   email
                   first_name
                   last_name
                   user_account{
                       username
                       user_id
                   }
                   total_students
                   center{
                       center_id
                       center_name
                   }
               },
               total
           }
       }
   `, page);

    return {
        teachers: data?.ListTeachers.data,
        error,
        loading
    }
}