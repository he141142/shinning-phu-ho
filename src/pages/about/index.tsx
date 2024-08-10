import AppContainers from "@/components/app-containers";
import NavBar from "@/components/nav_bar";
import QuickAcess from "@/components/quick-access";
import "./quic-access.scss"
import { ReactElement } from "react";

export default function About() {
    return (
        <div>
            <p>app ocntainer</p>
            <AppContainers />
        </div>
    )

}
About.getLayout = function getLayout(page: ReactElement) {
    return <>

        {page}
        <h1>00000000</h1>
    </>;
};