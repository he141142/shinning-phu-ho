import { GetClassByIdResponse } from "@/models/class/class.detail";

export interface Center {
  center_id: number;
  center_name: string;
  address: string;
  phone_number: string;
  email: string;
  is_active: boolean;
  website: string;
}

export interface GetStudentDetail {
  id: number;
  first_name: string;
  last_name: string;
  dob: string;
  email: string;
  phone: string;
  address: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  classes: Exclude<
    GetClassByIdResponse,
    | "students"
    | "room"
    | "class_config"
    | "teacher"
    | "grade"
    | "current_semester"
    | "start_date"
  >[];
  center: Center;
}

export interface GetStudentDetailResponse {
  GetStudentDetail: GetStudentDetail;
}
