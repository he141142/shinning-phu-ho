
"use client"
import { UserInfo } from "@/models/user-info";
import { userInfo } from "os";
import { createContext, useEffect, useState } from "react";


const AuthContext = createContext<UserInfo | undefined>(undefined);

export function AuthProvider(props : {children: React.ReactNode}) {
    const [user,setUser] = useState<UserInfo | undefined>(undefined);
    const [refresh,setRefresh] = useState<boolean>(false);
    
    useEffect(()=> {
        let u :UserInfo=  {
            avatar: "/images/images (3).png",
            createdAt: "2021-10-12",
            email: "",
            id: "1",
            role: "admin",
            updatedAt: "2021-10-12",
            username: "phuho"
        }
        setUser(u);
    },[refresh])

    return (
        <>
            <AuthContext.Provider value={user}>
            {props.children}
            </AuthContext.Provider>
        </>
    )
} 

export default AuthContext;