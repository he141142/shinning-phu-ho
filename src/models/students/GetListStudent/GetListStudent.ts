import { GetClassByIdResponse } from "@/models/class/class.detail";
import { Pagination } from "@/models/pagination";

export function GetListStudentQuery(): string {
  return `query getListStudent($input:GetListStudentInput!){
                GetListStudent(input: $input){
                    total
                    data{
                      id
                      first_name
                      last_name
                      dob
                      email
                      address
                    }
                }
        }
`;
}

export type ClassEntity = Pick<GetClassByIdResponse, "class_id" | "class_name">;

export type GetListStudentQueryVariable = {
  input: {
    page: number; // Page number for pagination
    limit: number; // Limit of items per page
    order_by: string; // Sorting order (e.g., "class desc")
    where: Record<string, any>; // Filter conditions
  };
};

export interface StudentEntity {
  id: number;
  first_name: string;
  last_name: string;
  dob: string;
  email: string | null;
  address: string;
  classes: ClassEntity[] | null;
  subject: Subject ;
  grade: Grade | null;
}

export interface Subject {
  id: number;
  name: string;
}

export interface Grade {
  grade_id: number;
  grade_name: string;
}

export interface GetListStudentResponse {
  GetListStudent: Pagination<StudentEntity>;
}
