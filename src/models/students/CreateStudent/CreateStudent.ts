export interface CreateStudentInput {
    first_name: string;
    last_name: string;
    dob: string;
    email: string;
    phone: string;
    address: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
    grade: string;
    gender: string;
}

export type CreateStudentInputVariable = CreateStudentInput;