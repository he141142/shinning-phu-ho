export interface CommonResponse {
  entity_id?: number;
  message: string;
  status: string;
}


export type APIResponse<T extends string> = Record<T, CommonResponse>;


export interface AddTeacherToJoinClass {
  AddTeacherToClass: CommonResponse;
}

export interface DeleteTeacher {
    DeleteTeacher: CommonResponse;
  }
  

  export interface AddTeacher {
    AddTeacher: CommonResponse;
  }
  


// export interface Entity {
//     Name: string;
// }

// export class CommonResp {
   
//     constructor(fieldName: string) {
//         this.fieldName = CommonResponse;
//     }
// }