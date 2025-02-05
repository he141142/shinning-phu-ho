import StudentProfile, { StudentProfileProps } from "./components/student-profile"
import ClassesList, { ClassesListProps } from "./components/classes-list"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs"
import { useRouter } from "next/router"
import { UseFetchGraphqlWithVariable } from "@/components/hooks/fetch-variable"
import { HOST } from "@/static/env"
import { UseFetch } from "@/components/hooks/fetch-data"
import { ErrorPage, LoadingPage } from "@/components/drake_libs/component/loading-page"
import { GetStudentDetailResponse } from "@/models/students/GetStudentDetail/GetStudentDetail"

// This would typically come from an API or database
const studentData = {
    first_name: "Nguyen",
    last_name: "Long",
    email: "longnguyen@gmail.com",
    dob: "2000-08-08",
    phone: "+840899837466",
    address: "Phu Tho",
    emergency_contact_name: "Phu Huynh",
    emergency_contact_phone: "+840899283766",
    center_id: 1,
    gender: "Male",
}

// This would typically come from an API or database
const classesData = [
    {
        class_id: 13,
        class_name: "Hoa Hong",
        description: "",
        teacher_id: null,
        start_date: null,
        end_date: null,
        max_students: 0,
        current_enrollment: 0,
        room_number: null,
        schedule: "",
    },
    // Add more classes as needed
]

export default function StudentDetailPage() {
    const router = useRouter()
    var id = router.query.id;

    if (!id) {
        return <LoadingPage />
    }

    const { data, error, loading } = UseFetch<GetStudentDetailResponse>(`${HOST}/query`, `
        query{
            GetStudentDetail(student_id:${id}){
                id
                first_name
                last_name
                dob
                email
                phone
                address
                emergency_contact_name
                emergency_contact_phone
                classes{
                    class_id
                    class_name
                    description
                    teacher_id
                    start_date
                    end_date
                    max_students
                    current_enrollment
                }
                center{
                    center_id
                    center_name
                    address
                    phone_number
                    email
                    is_active
                    website
                }
            }
            }
        `);


    const toStudentProps = (data: GetStudentDetailResponse | undefined): StudentProfileProps => {
        return {
            student: {
                first_name: data?.GetStudentDetail.first_name || "",
                last_name: data?.GetStudentDetail.last_name || "",
                email: data?.GetStudentDetail.email || "",
                dob: data?.GetStudentDetail.dob || "",
                phone: data?.GetStudentDetail.phone || "",
                address: data?.GetStudentDetail.address || "",
                emergency_contact_name: data?.GetStudentDetail.emergency_contact_name || "",
                emergency_contact_phone: data?.GetStudentDetail.emergency_contact_phone || "",
                center: data?.GetStudentDetail.center || undefined,
                gender: "undefined"
            }
        }
    }

    const toClassesProps = (data: GetStudentDetailResponse | undefined): ClassesListProps => {
        return {
            classes: data?.GetStudentDetail.classes || []
        }
    }


    if (loading) return <LoadingPage />
    if (error) return <ErrorPage message={error} />

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <div className="relative px-4 py-6 sm:px-6 lg:px-8">
                    <div className="absolute -top-16 left-4 sm:left-6 lg:left-8">
                        <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-600">
                            {data?.GetStudentDetail.first_name}
                            {data?.GetStudentDetail.last_name}
                        </div>
                    </div>
                    <h1 className="mt-16 text-3xl font-bold text-gray-900">
                        {data?.GetStudentDetail.first_name} {data?.GetStudentDetail.last_name}
                    </h1>studentData
                    <p className="mt-1 text-sm text-gray-500">{studentData.email}</p>
                </div>
                <Tabs defaultValue="profile" className="px-4 sm:px-6 lg:px-8 pb-8">
                    <TabsList>
                        <TabsTrigger className="inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300
                        
                        data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:after:scale-x-0 data-[state=active]:text-blue-400" value="profile">Profile</TabsTrigger>
                        <TabsTrigger className="inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300
                        data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:after:scale-x-0 data-[state=active]:text-blue-400"  value="classes">Classes</TabsTrigger>
                    </TabsList>
                    <TabsContent value="profile">
                        <StudentProfile student={toStudentProps(data as GetStudentDetailResponse).student} />
                    </TabsContent>
                    <TabsContent value="classes">
                        <ClassesList classes={toClassesProps(data as GetStudentDetailResponse).classes} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

