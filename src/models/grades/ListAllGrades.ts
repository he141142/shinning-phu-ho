export interface Grade {
  grade_id: number;
  grade_name: string;
}

export interface ListAllGradesResponse {
  ListAllGrades: Grade[];
}