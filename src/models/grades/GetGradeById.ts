import { Grade } from './ListAllGrades';

export interface GetGradeByIdInput {
  grade_id: number;
}

export interface GetGradeByIdResponse {
  GetGradeById: Grade;
}
