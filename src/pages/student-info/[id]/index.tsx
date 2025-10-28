import StudentProfile, { StudentProfileProps } from "./components/student-profile"
import ClassesList, { ClassesListProps } from "./components/classes-list"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs"
import { useRouter } from "next/router"
import { HOST } from "@/static/env"
import { UseFetch } from "@/components/hooks/fetch-data"
import { ErrorPage, LoadingPage } from "@/components/drake_libs/component/loading-page"
import { GetStudentDetailResponse } from "@/models/students/GetStudentDetail/GetStudentDetail"
import { JoinClassModal } from "./components/JoinClassModal"
import { Button } from "@/components/drake_libs/ui/button"
import { useState } from "react"
import { ModalType, UseModal } from "@/components/hooks/useModal"
import { RegistrationCardInfoData, RegistrationCardInfoProps } from "./components/RegistrationCard"

export default function StudentDetailPage() {
    const router = useRouter();
    var id = router.query.id;
    const { closeModal, isOpen, openModal, modalType } = UseModal();

    var query = id ? `
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
            grade{
                grade_id
                grade_name
            }
        }
        }
    `: null;


    const { data, error, loading } = UseFetch<GetStudentDetailResponse>(`${HOST}/query`, query);


    if (!id || loading) {
        return <LoadingPage />
    }

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
    const isModalOpen = isOpen && modalType === ModalType.joinClass;

    const OnClose = () => {
        closeModal();
    };
    // registrationInfo: RegistrationCardInfoProps
    const prePareRegistrationCardInfoProps = (data: GetStudentDetailResponse | undefined): RegistrationCardInfoData => {
        return {
            centerId: data?.GetStudentDetail.center?.center_id || 1,
            centerName: data?.GetStudentDetail.center?.center_name || "",
            className: "",
            classDescription: "",
            currentEnrollment: 0,
            endDate: "",
            grade: data?.GetStudentDetail.grade?.grade_name|| "-",
            startDate:  "",
            classId: 0,
            studentId: data?.GetStudentDetail.id || 0
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <JoinClassModal open={isModalOpen} onOpenChange={OnClose} registrationInfo={prePareRegistrationCardInfoProps(data as GetStudentDetailResponse)} />
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
                    <p className="mt-1 text-sm text-gray-500">{data?.GetStudentDetail.email}</p>
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
                        <Button className="mb-4" onClick={() => openModal(ModalType.joinClass)}>Join Class</Button>
                        <ClassesList classes={toClassesProps(data as GetStudentDetailResponse).classes} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

