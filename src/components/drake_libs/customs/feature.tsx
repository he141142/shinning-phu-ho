import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/drake_libs/ui/card";
import {
  UserIcon,
  ActivityIcon,
  CalendarIcon,
  SchoolIcon,
  TimerIcon,
  FilesIcon,
  CodeIcon,
} from "../component/home-page";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ListTodo, ClipboardCheck } from "lucide-react";

type FeatureModel = {
  title: string;
  description: string;
  icon: any;
  active?: boolean;
  link_to?: string;
};

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
        link_to: "/student_managements",
      },
      {
        title: "Class Management",
        description: "Organize and manage classes.",
        icon: <CodeIcon className="w-12 h-12 text-green-500" />,
        active: true,
        link_to: "/classes",
      },
      {
        title: "Grades",
        description: "Track and manage student grades.",
        icon: <SchoolIcon className="w-12 h-12 text-yellow-500" />,
      },
      {
        title: "Calendars",
        description: "View and manage academic calendars.",
        icon: <CalendarIcon className="w-12 h-12 text-red-500" />,
        active: true,
        link_to: "/calendar",
      },
      {
        title: "Time Slots",
        description: "Manage time slots for classes and exams.",
        icon: <TimerIcon className="w-12 h-12 text-purple-500" />,
      },
      {
        title: "Assignments",
        description: "Track and manage student assignments.",
        icon: <ActivityIcon className="w-12 h-12 text-orange-500" />,
      },
      {
        title: "Teachers",
        description: "Manage teacher information and schedules.",
        icon: <SchoolIcon className="w-12 h-12 text-pink-500" />,
        active: true,
        link_to: "/teachers?page=1&perPage=6",
      },
      {
        title: "Semesters",
        description: "Manage semester schedules and information.",
        icon: <SchoolIcon className="w-12 h-12 text-teal-500" />,
        link_to: "/semesters",
        active: true,
      },
      {
        title: "Study Materials",
        description: "Access and manage study materials.",
        icon: <FilesIcon className="w-12 h-12 text-indigo-500" />,
      },
      {
        title: "Request Management",
        description: "Access and manage study materials.",
        icon: <ListTodo className="w-12 h-12 text-indigo-500" />,
        active: true,
        link_to: "/requests",
      },
      {
        title: "Attendance",
        description: "Track and manage student attendance records.",
        icon: <ClipboardCheck className="w-12 h-12 text-emerald-500" />,
        active: true,
        link_to: "/attendance/overview",
      },
    ]);
    setLoading(false);
  }, []);

  let animateClass = `group relative overflow-hidden transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20`;

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center col-span-full py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
          {features.map((feature, index) => (
            <Link
              href={feature.link_to || ""}
              className={`z-30 ${!feature.active ? "pointer-events-none" : ""}`}
              key={index}
            >
              <Card
                className={`relative cursor-pointer h-full bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg ${
                  feature.active ? animateClass : "opacity-60"
                }`}
              >
                {/* Active indicator stripe */}
                {feature.active && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                )}

                {/* Hover gradient overlay */}
                {feature.active && (
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-indigo-500/10 group-hover:via-purple-500/10 group-hover:to-blue-500/10 transition-all duration-500 rounded-lg"></div>
                )}

                {/* Coming soon overlay */}
                {!feature.active && (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-sm z-10 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-2">
                        <span className="text-white font-semibold text-sm">
                          🚀 Coming Soon
                        </span>
                      </div>
                      <p className="text-white/80 text-xs">
                        Feature in development
                      </p>
                    </div>
                  </div>
                )}

                <div className="relative z-20">
                  <CardHeader className="pb-4">
                    <div className="mb-4 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-indigo-600">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-2 group-hover:text-gray-700 transition-colors duration-300">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>

                  {feature.active && (
                    <CardContent className="pt-0">
                      <div className="flex items-center text-sm text-indigo-600 font-medium group-hover:text-indigo-700 transition-all duration-300">
                        <span>Explore</span>
                        <svg
                          className="w-4 h-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </CardContent>
                  )}
                </div>

                {/* Corner decoration */}
                {feature.active && (
                  <div className="absolute top-2 right-2 w-16 h-16 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full blur-xl"></div>
                  </div>
                )}
              </Card>
            </Link>
          ))}
        </>
      )}
    </>
  );
};

export default FeatureContainer;
