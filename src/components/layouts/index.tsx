import AppContainers from "@/components/app-containers";
import NavBar from "@/components/nav_bar";
import QuickAcess from "@/components/quick-access";
import "./quic-access.scss"
import { ReactElement, ReactNode } from "react";

export default function Laylout({ children }: { children: ReactNode }) {
    return (
        <>
            <NavBar />
            <div className="line" style={
                {
                    width: "100%",
                    height: "4px"
                }
            }>

            </div>
            <div className="flex flex-row gap-4 bg-[#0085FF]">
                <div className="basis-1/5 quick-access">
                    <QuickAcess />
                </div>
                <div className="basis-1/2 grow h-[1800px]  ">
                    {children}
                </div>
            </div>

            <h1>Home</h1>
            <p>Welcome to the home page!</p>
        </>
    )
}