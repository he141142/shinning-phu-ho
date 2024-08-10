import { AppModule } from "@/models/app-module"
import AppContainer from "./app_module"
import Link from 'next/link'

export default function AppContainers() {

    const Features: AppModule[] = [
        {
            ApiUrl: "https://localhost:5001/api/student",
            FunctionDescription: "Student Management",
            FunctionName: "Student Management",
            Icon: "/images/94c62511d312b8612aa0ab92318966f2.jpg"
        },
        {
            ApiUrl: "https://localhost:5001/api/class",
            FunctionDescription: "Class Management",
            FunctionName: "Assignment",
            Icon: "/images/5842026.png"
        },
    
        {
            ApiUrl: "https://localhost:5001/api/class",
            FunctionDescription: "Class Management",
            FunctionName: "Class Management",
            Icon: "/images/images (4).png"
        }
    ]


    return (
        <>
            <div className="p-[50px]">
                <div className="grid grid-cols-4 justify-items-center">
                    {
                        Features.map((feature, index) => {
                            return (
                                <div key={index} >
                                    <AppContainer {
                                        ...feature
                                    } />
                                </div>
                            )
                        })
                    }
                </div>
            </div>

        </>
    )
}
