export interface UpdateClassInput {
  class_id: number;
  class_name?: string;
  description?: string;
  teacher_id?: number;
  semester_id?: number;
  grade_id?: number;
  start_date?: string;
  end_date?: string;
}

export interface UpdateClassResponse {
  UpdateClass: {
    status: string;
    message: string;
    class_id: number;
  };
}
