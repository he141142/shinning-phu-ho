
import "./quic-access.scss"
import { ReactElement, ReactNode, useEffect, useState } from "react";
import Link from "next/link"
import { Input } from "@/components/drake_libs/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/drake_libs/ui/avatar"
import { Separator } from "@/components/drake_libs/ui/separator"
import Image from "next/image";
import { Toaster } from "../drake_libs/ui/toaster";
import { Search, Bell, Menu, Sun, Moon } from "lucide-react";
import { useRouter } from "next/router";
import { useTheme } from "@/contexts/ThemeContext";
import ThemeDebug from "@/components/ThemeDebug";


export default function Laylout({ children }: { children: ReactNode }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Check if current route is active
    const isActiveRoute = (path: string) => {
        return router.pathname === path || router.pathname.startsWith(path);
    };

    return (
        <>
            <div className="flex min-h-screen w-full flex-col bg-background dark:bg-gray-900">
                {/* Modern Sticky Navbar */}
                <header className={`sticky top-0 z-50 transition-all duration-300 ${
                    isScrolled
                        ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-700'
                        : 'bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800'
                }`}>
                    <div className="container mx-auto px-4">
                        <div className="flex h-16 items-center justify-between gap-4">
                            {/* Logo Section */}
                            <div className="flex items-center gap-4">
                                <button
                                    className="sm:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                >
                                    <Menu className="h-5 w-5 dark:text-gray-300" />
                                </button>
                                <Link href="/home" className="flex items-center gap-3 group" prefetch={false}>
                                    <div className="relative">
                                        <Image
                                            src={"/images/bjk-letter-logo-design-on-black-background-bjk-creative-initials-letter-logo-concept-bjk-letter-design-vector.jpg"}
                                            width={40}
                                            height={40}
                                            alt="logo"
                                            className="rounded-lg transition-transform duration-300 group-hover:scale-110"
                                        />
                                    </div>
                                    <span className="hidden md:block text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                                        Shining Phu Ho
                                    </span>
                                </Link>
                            </div>

                            {/* Search Bar */}
                            <div className="flex-1 max-w-2xl mx-4">
                                <div className="relative group">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-indigo-500 transition-colors" />
                                    <Input
                                        type="search"
                                        placeholder="Search students, classes, materials..."
                                        className="w-full rounded-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 pl-10 pr-4 py-2 focus:bg-white dark:focus:bg-gray-700 focus:border-indigo-300 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all dark:text-gray-200 dark:placeholder-gray-500"
                                    />
                                </div>
                            </div>

                            {/* Right Actions */}
                            <div className="flex items-center gap-3">
                                {/* Notifications */}
                                <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
                                    <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                </button>

                                {/* User Avatar */}
                                <div className="relative group cursor-pointer">
                                    <Avatar className="w-9 h-9 border-2 border-gray-200 group-hover:border-indigo-400 transition-all ring-2 ring-transparent group-hover:ring-indigo-100">
                                        <AvatarImage src="/placeholder-user.jpg" alt="User" />
                                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-semibold">AC</AvatarFallback>
                                    </Avatar>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress bar on scroll */}
                    {isScrolled && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                    )}
                </header>
                <div className="flex flex-1">
                    {/* Modern Sticky Sidebar Navigation */}
                    <aside className={`hidden sm:flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl transition-all duration-300 ${
                        isSidebarCollapsed ? 'w-20' : 'w-72'
                    } sticky top-16 h-[calc(100vh-4rem)] overflow-hidden shadow-xl dark:shadow-gray-900/50`}>

                        {/* Sidebar Container with Scroll */}
                        <div className="flex flex-col h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500">

                            {/* Sidebar Header */}
                            <div className={`p-6 pb-4 border-b border-gray-200 dark:border-gray-700 ${isSidebarCollapsed ? 'px-4' : ''}`}>
                                {!isSidebarCollapsed ? (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <Image
                                                    src={"/images/bjk-letter-logo-design-on-black-background-bjk-creative-initials-letter-logo-concept-bjk-letter-design-vector.jpg"}
                                                    width={45}
                                                    height={45}
                                                    alt="logo"
                                                    className="rounded-xl shadow-md"
                                                />
                                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
                                            </div>
                                            <div>
                                                <h1 className="text-base font-bold text-gray-900 dark:text-white">Shining Phu Ho</h1>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Education Platform</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                                            </svg>
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                                        className="w-full flex justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/* Navigation Links */}
                            <nav className={`flex-1 p-4 ${isSidebarCollapsed ? 'px-2' : ''}`}>
                                <div className="flex flex-col gap-1">
                                    {/* Main Navigation */}
                                    <Link
                                        href="/home"
                                        className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all relative overflow-hidden ${
                                            isActiveRoute('/home')
                                                ? 'bg-indigo-50 text-indigo-600 shadow-md'
                                                : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                                        } ${isSidebarCollapsed ? 'justify-center px-2' : ''}`}
                                        prefetch={false}
                                    >
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 transition-transform rounded-r-full ${
                                            isActiveRoute('/home') ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100'
                                        }`}></div>
                                        <HomeIcon className={`h-5 w-5 transition-colors ${
                                            isActiveRoute('/home') ? 'text-indigo-600' : 'text-gray-600 group-hover:text-indigo-600'
                                        }`} />
                                        {!isSidebarCollapsed && <span>Home</span>}
                                    </Link>

                                    <Link
                                        href="/materials"
                                        className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all relative overflow-hidden ${
                                            isActiveRoute('/materials')
                                                ? 'bg-purple-50 text-purple-600 shadow-md'
                                                : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                                        } ${isSidebarCollapsed ? 'justify-center px-2' : ''}`}
                                        prefetch={false}
                                    >
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 bg-purple-600 transition-transform rounded-r-full ${
                                            isActiveRoute('/materials') ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100'
                                        }`}></div>
                                        <CompassIcon className={`h-5 w-5 transition-colors ${
                                            isActiveRoute('/materials') ? 'text-purple-600' : 'text-gray-600 group-hover:text-purple-600'
                                        }`} />
                                        {!isSidebarCollapsed && <span>Explore</span>}
                                    </Link>

                                    <div className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all cursor-not-allowed opacity-50 ${
                                        isSidebarCollapsed ? 'justify-center px-2' : ''
                                    }`}>
                                        <ShoppingCartIcon className="h-5 w-5 text-gray-400" />
                                        {!isSidebarCollapsed && (
                                            <>
                                                <span className="text-gray-400">Subscriptions</span>
                                                <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">Soon</span>
                                            </>
                                        )}
                                    </div>

                                    {!isSidebarCollapsed && <Separator className="my-4" />}

                                    {!isSidebarCollapsed && (
                                        <div className="mb-2">
                                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4">Resources</p>
                                        </div>
                                    )}

                                    <Link
                                        href="/learning_materials"
                                        className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all relative overflow-hidden ${
                                            isActiveRoute('/learning_materials')
                                                ? 'bg-blue-50 text-blue-600 shadow-md'
                                                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                        } ${isSidebarCollapsed ? 'justify-center px-2' : ''}`}
                                        prefetch={false}
                                    >
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 bg-blue-600 transition-transform rounded-r-full ${
                                            isActiveRoute('/learning_materials') ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100'
                                        }`}></div>
                                        <LibraryIcon className={`h-5 w-5 transition-colors ${
                                            isActiveRoute('/learning_materials') ? 'text-blue-600' : 'text-gray-600 group-hover:text-blue-600'
                                        }`} />
                                        {!isSidebarCollapsed && <span>Learning Materials</span>}
                                    </Link>

                                    <Link
                                        href="/activities_log"
                                        className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all relative overflow-hidden ${
                                            isActiveRoute('/activities_log')
                                                ? 'bg-green-50 text-green-600 shadow-md'
                                                : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                                        } ${isSidebarCollapsed ? 'justify-center px-2' : ''}`}
                                        prefetch={false}
                                    >
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 bg-green-600 transition-transform rounded-r-full ${
                                            isActiveRoute('/activities_log') ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100'
                                        }`}></div>
                                        <CalendarIcon className={`h-5 w-5 transition-colors ${
                                            isActiveRoute('/activities_log') ? 'text-green-600' : 'text-gray-600 group-hover:text-green-600'
                                        }`} />
                                        {!isSidebarCollapsed && <span>Activities Log</span>}
                                    </Link>

                                    <div className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all cursor-not-allowed opacity-50 ${
                                        isSidebarCollapsed ? 'justify-center px-2' : ''
                                    }`}>
                                        <ClockIcon className="h-5 w-5 text-gray-400" />
                                        {!isSidebarCollapsed && (
                                            <>
                                                <span className="text-gray-400">Watch Later</span>
                                                <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">Soon</span>
                                            </>
                                        )}
                                    </div>

                                    <div className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all cursor-not-allowed opacity-50 ${
                                        isSidebarCollapsed ? 'justify-center px-2' : ''
                                    }`}>
                                        <ThumbsUpIcon className="h-5 w-5 text-gray-400" />
                                        {!isSidebarCollapsed && (
                                            <>
                                                <span className="text-gray-400">Liked Videos</span>
                                                <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">Soon</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </nav>

                            {/* Theme Toggle Section */}
                            <div className={`p-4 border-t border-gray-200 dark:border-gray-700 ${isSidebarCollapsed ? 'px-2' : ''}`}>
                                {!isSidebarCollapsed ? (
                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 mb-3">
                                            Appearance
                                        </p>
                                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                                            <button
                                                onClick={() => theme === 'dark' && toggleTheme()}
                                                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                                    theme === 'light'
                                                        ? 'bg-white text-gray-900 shadow-md'
                                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                                }`}
                                            >
                                                <Sun className="w-4 h-4" />
                                                <span>Light</span>
                                            </button>
                                            <button
                                                onClick={() => theme === 'light' && toggleTheme()}
                                                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                                    theme === 'dark'
                                                        ? 'bg-gray-700 text-white shadow-md'
                                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                                }`}
                                            >
                                                <Moon className="w-4 h-4" />
                                                <span>Dark</span>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={toggleTheme}
                                        className="w-full flex justify-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                                        title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                                    >
                                        {theme === 'light' ? (
                                            <Sun className="w-5 h-5 text-gray-600 group-hover:text-amber-500 transition-colors" />
                                        ) : (
                                            <Moon className="w-5 h-5 text-gray-400 group-hover:text-indigo-400 transition-colors" />
                                        )}
                                    </button>
                                )}
                            </div>

                            {/* Sidebar Footer */}
                            {!isSidebarCollapsed && (
                                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-indigo-100 dark:border-indigo-800 shadow-sm">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Need Help?</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">Check our documentation</p>
                                        <button className="w-full px-3 py-2 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 text-sm font-medium rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all hover:shadow-md border border-indigo-200 dark:border-indigo-700">
                                            Get Support
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Collapsed state tooltip indicator */}
                        {isSidebarCollapsed && (
                            <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                                <div className="w-1 h-16 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full shadow-lg"></div>
                            </div>
                        )}
                    </aside>
                    <main className="flex-1 overflow-visible">
                        {children}
                       

                    </main>
                    <Toaster />
                    <ThemeDebug />
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
