export interface CreateGradeInput {
  grade_name: string;
}

export interface CreateGradeResponse {
  CreateGrade: {
    status: string;
    message: string;
    grade_id?: number;
  };
}
