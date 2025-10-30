export interface UpdateTeacherInput {
  teacher_id: number;
  first_name: string;
  last_name: string;
  middle_name?: string;
  dob?: string;
  gender?: string;
  email: string;
  phone_number: string;
  address?: string;
  specialization?: string;
  salary?: number;
  notes?: string;
}

export type UpdateTeacherInputVariable = UpdateTeacherInput;
