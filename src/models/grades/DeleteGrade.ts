export interface DeleteGradeInput {
  grade_id: number;
}

export interface DeleteGradeResponse {
  DeleteGrade: {
    status: string;
    message: string;
  };
}
