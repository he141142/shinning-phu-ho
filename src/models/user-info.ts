type UserInfo =  {
    id: string;
    username: string;
    email: string;
    avatar: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}


type UserDisplay = {
    username: string;
    email: string;
    avatar: string;
}

export type { UserInfo,UserDisplay };