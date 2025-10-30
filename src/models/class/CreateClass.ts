export interface CreateClassInput {
  class_name: string;
  description?: string;
  grade_id?: number;
  start_date?: string;
  end_date?: string;
  semester_id?: number;
}

export interface CreateClassResponse {
  CreateClass: {
    status: string;
    message: string;
    class_id: number;
  };
}
