
type RequestResponseByCategory = {
    total: number;
    category: string;
    data: RequestEntity[];
}

type RequestEntity = {
    title : string;
    description: string;
    status: string;
    request_id: string;
    request_type: string;
}

type RequestResponse = {
    requests: RequestResponseByCategory[];
}

export type RequestType = "TeacherRegistrationRequest" | "StaffRegistrationRequest";