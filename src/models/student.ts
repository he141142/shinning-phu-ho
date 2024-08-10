type StudentObject = {
    id: number;
    name: string;
    grade: string;
    behavior?: string;
    progress?: string;
    feedback?: string;
    status?: string;
    feedback_status?: string | undefined;
}


type FeedBackStatus = {
    id: number;
    status: string;
}

export type { StudentObject , FeedBackStatus };