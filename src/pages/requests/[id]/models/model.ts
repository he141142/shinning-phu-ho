export interface RequestBase {
  type: string;
  status: string;
}

export interface InfoBase {
  first_name: string;
  last_name: string;
  middle_name: string;
  email: string;
  user_type: string;
}

export interface teacherAccountRequest extends RequestBase, InfoBase {}

export interface studentAccountRequest extends RequestBase, InfoBase {}
