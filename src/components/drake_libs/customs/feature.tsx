
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/drake_libs/ui/card"
import { UserIcon, ActivityIcon, CalendarIcon, SchoolIcon, TimerIcon, FilesIcon, CodeIcon } from "../component/home-page"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ListTodo } from "lucide-react"


type FeatureModel = {
    title: string
    description: string
    icon: any
    active?: boolean
    link_to?: string
}

const FeatureContainer = () => {

    const [features, setFeatures] = useState<FeatureModel[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    // const router = useRouter();


    useEffect(() => {
        setLoading(true);
        setFeatures([
            {
                title: "Student Management",
                description: "Manage student information and records.",
                icon: <UserIcon className="w-12 h-12 text-blue-500" />,
                active: true,
                link_to: "/student_managements"
            },
            {
                title: "Class Management",
                description: "Organize and manage classes.",
                icon: <CodeIcon className="w-12 h-12 text-green-500" />,
                active: true,
                link_to: "/classes"
            },
            {
                title: "Grades",
                description: "Track and manage student grades.",
                icon: <SchoolIcon className="w-12 h-12 text-yellow-500" />
            },
            {
                title: "Calendars",
                description: "View and manage academic calendars.",
                icon: <CalendarIcon className="w-12 h-12 text-red-500" />,
                 active: true,
                link_to: "/calendar"
            },
            {
                title: "Time Slots",
                description: "Manage time slots for classes and exams.",
                icon: <TimerIcon className="w-12 h-12 text-purple-500" />
            },
            {
                title: "Assignments",
                description: "Track and manage student assignments.",
                icon: <ActivityIcon className="w-12 h-12 text-orange-500" />
            },
            {
                title: "Teachers",
                description: "Manage teacher information and schedules.",
                icon: <SchoolIcon className="w-12 h-12 text-pink-500" />,
                active: true,
                link_to: "/teachers?page=1&perPage=6"
            },
            {
                title: "Semesters",
                description: "Manage semester schedules and information.",
                icon: <SchoolIcon className="w-12 h-12 text-teal-500" />
            },
            {
                title: "Study Materials",
                description: "Access and manage study materials.",
                icon: <FilesIcon className="w-12 h-12 text-indigo-500" />
            },
            {
                title: "Request Management",
                description: "Access and manage study materials.",
                icon: <ListTodo className="w-12 h-12 text-indigo-500" />,
                active: true,
                link_to: "/requests"
            }
        ]);
        setLoading(false);
    }, []);

    let animateClass = `group transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300`;

    return (
        <>
            {loading ? <div>Loading...</div> : (
                <>
                    {features.map((feature, index) => (

                        <Link href={feature.link_to || ''} className="z-30">
                            <Card className={`relative cursor-pointer  ${feature.active ? animateClass : ''}`} key={index}>
                                {!feature.active && (
                                    <>
                                        <div className="overlay absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
                                        <div className="neon-text absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl">
                                            Available Soon
                                        </div>
                                    </>
                                )}                            <CardHeader>
                                    <CardTitle className="transition ease-in-out delay-50 duration-300 group-hover:text-white" >{feature.title}</CardTitle>
                                    <CardDescription className="transition ease-in-out delay-50 duration-300 group-hover:text-white">{feature.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="transition ease-in-out delay-50 duration-300 group-hover:text-white">
                                    {feature.icon}
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </>
            )}
        </>
    )
}

export default FeatureContainer