import AppContainers from "@/components/app-containers";
import NavBar from "@/components/nav_bar";
import QuickAcess from "@/components/quick-access";
import "./quic-access.scss"
import { ReactElement, ReactNode } from "react";
import Link from "next/link"
import { Input } from "@/components/drake_libs/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/drake_libs/ui/avatar"
import { Separator } from "@/components/drake_libs/ui/separator"
import Image from "next/image";
// export default function Laylout({ children }: { children: ReactNode }) {
//     return (
//         <>
//             <NavBar />
//             <div className="line" style={
//                 {
//                     width: "100%",
//                     height: "4px"
//                 }
//             }>

//             </div>
//             <div className="flex flex-row gap-4 bg-[#0085FF]">
//                 <div className="basis-1/5 quick-access">
//                     <QuickAcess />
//                 </div>
//                 <div className="basis-1/2 grow h-[1800px]  ">
//                     {children}
//                 </div>
//             </div>

//             <h1>Home</h1>
//             <p>Welcome to the home page!</p>
//         </>
//     )
// }

export default function Laylout({ children }: { children: ReactNode }) {
    return (
        <>
            <div className="flex min-h-screen w-full flex-col bg-background">
                <header className="sticky top-0 z-1 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                    <Link href="#" className="flex items-center gap-2 font-semibold" prefetch={false}>
                    <Image src={"/images/bjk-letter-logo-design-on-black-background-bjk-creative-initials-letter-logo-concept-bjk-letter-design-vector.jpg"} width={50} height={50} alt="logo" />
                    <span className="sr-only">YouTube</span>
                    </Link>
                    <div className="relative ml-auto flex-1 md:grow-0">
                        <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search"
                            className="w-full rounded-full bg-background pl-8 md:w-[200px] lg:w-[336px]"
                        />
                    </div>
                    <Avatar className="w-8 h-8 border">
                        <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
                        <AvatarFallback>AC</AvatarFallback>
                    </Avatar>
                </header>
                <div className="flex flex-1 overflow-hidden">
                    <nav className="hidden h-full w-60 flex-col border-r bg-background p-4 sm:flex">
                        <div className="mb-6 flex items-center gap-2 font-semibold">
                        <Image src={"/images/bjk-letter-logo-design-on-black-background-bjk-creative-initials-letter-logo-concept-bjk-letter-design-vector.jpg"} width={50} height={50} alt="logo" />
                        <h1 className="text-2xl self-center text-black">Shining Phu Ho</h1>

                        </div>
                        <div className="flex flex-col gap-2">
                            <Link
                                href="/home"
                                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
                                prefetch={false}
                            >
                                <HomeIcon className="h-5 w-5" />
                                Home
                            </Link>
                            <Link
                                href="#"
                                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted bg-gray-50 text-gray-400"
                                prefetch={false}
                            >
                                <CompassIcon className="h-5 w-5" />
                                Explore
                            </Link>
                            <Link
                                href="#"
                                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted bg-gray-50 text-gray-400"
                                prefetch={false}
                            >
                                <ShoppingCartIcon className="h-5 w-5" />
                                Subscriptions
                            </Link>
                            <Separator className="my-2" />
                            <Link
                                href="/learning_materials"
                                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
                                prefetch={false}
                            >
                                <LibraryIcon className="h-5 w-5" />
                                Learning Materials
                            </Link>
                            <Link
                                href="/activities_log"
                                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
                                prefetch={false}
                            >
                                <CalendarIcon className="h-5 w-5" />
                                Activies Log
                            </Link>
                            <Link
                                href="#"
                                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted bg-gray-50 text-gray-400"
                                prefetch={false}
                            >
                                <ClockIcon className="h-5 w-5" />
                                Watch Later
                            </Link>
                            <Link
                                href="#"
                                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted bg-gray-50 text-gray-400"
                                prefetch={false}
                            >
                                <ThumbsUpIcon className="h-5 w-5" />
                                Liked Videos
                            </Link>
                        </div>
                    </nav>
                    <main className="flex-1 overflow-visible">
                        {children}
                    </main>
                </div>
            </div>
        </>
    )
}



function CalendarIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <rect width="18" height="18" x="3" y="4" rx="2" />
            <path d="M3 10h18" />
        </svg>
    )
}


function ClockIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    )
}


function CompassIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z" />
            <circle cx="12" cy="12" r="10" />
        </svg>
    )
}


function HomeIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
    )
}


function LibraryIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m16 6 4 14" />
            <path d="M12 6v14" />
            <path d="M8 8v12" />
            <path d="M4 4v16" />
        </svg>
    )
}


function ShoppingCartIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
    )
}


function ThumbsUpIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M7 10v12" />
            <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
        </svg>
    )
}


function YoutubeIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
            <path d="m10 15 5-3-5-3z" />
        </svg>
    )
}
