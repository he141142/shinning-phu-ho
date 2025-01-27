type ClassInfo = {
  Id: number;
  Name: string;
  Description: string;
  Teacher: string;
  Status: string;
  Enrolled: number;
};

type GradeInfo = {
  Id: number;
  Name: string;
  Description?: string;
  Teacher?: string;
  Status?: string;
  Enrolled?: number;
};

export type { ClassInfo, GradeInfo };
