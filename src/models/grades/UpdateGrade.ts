export interface UpdateGradeInput {
  grade_id: number;
  grade_name: string;
}

export interface UpdateGradeResponse {
  UpdateGrade: {
    status: string;
    message: string;
  };
}
