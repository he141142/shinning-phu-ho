import { Class } from "../class/class";
import { Pagination } from "../pagination";
import { Center } from "../students/GetStudentDetail/GetStudentDetail";

export interface Teacher {
    address: string;    
    teacher_id: number;
    first_name : string;
    last_name : string;
    middle_name? : string;
    dob? : string;
    gender? : string;
    phone_number: string;
    email: string;
    specialization: string;
    hire_date: string;
    salary: number;
    profile_picture?: string;
    notes?: string;
    classes: ClassEntity[];
    user_account?: UserAccount;
    center?: CenterEntity;
    total_students: number;
}

export interface UserAccount {
    username: string;
    user_id: number;
}

type CenterEntity = Pick<Center, "center_id" | "center_name">;
type ClassEntity = Pick<Class, "class_id" | "class_name" | "current_enrollment">;

export interface ListTeachers{
    ListTeachers: Pagination<Teacher>;
}



export interface GetTeacherDetail {
    GetTeacherDetail: Teacher;
}
