import type { Semester } from "./entity";

export interface ListSemestersResponse {
  FilterSemesters: Semester[];
  ListAllSemesters: Semester[];
}
