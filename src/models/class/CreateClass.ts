export interface CreateClassInput {
  class_name: string;
  description?: string;
  grade_id?: number;
  start_date?: string;
  end_date?: string;
  current_semester?: number;
  max_students: number;
  center_id: number;
}

export interface CreateClassResponse {
  CreateClass: {
    status: string;
    message: string;
    class_id: number;
  };
}
