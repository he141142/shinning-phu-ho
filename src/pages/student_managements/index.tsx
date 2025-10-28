

import { Button } from "@/components/drake_libs/ui/button"
import { Card, CardContent } from "@/components/drake_libs/ui/card"
import { Badge } from "@/components/drake_libs/ui/badge"
import OnlineStatus from "@/components/common/online"
import { MouseEvent, MouseEventHandler, useMemo, useState } from "react"
import { useRouter } from 'next/router'
import { UseFetchGraphqlWithVariable } from "@/components/hooks/fetch-variable"
import { HOST } from "@/static/env"
import { ErrorPage, LoadingPage } from "@/components/drake_libs/component/loading-page"
import { GetListStudentResponse } from "@/models/students/GetListStudent/GetListStudent"
import { PaginationNav } from "@/components/drake_libs/component/pagination"

export default function StudentManagements() {
    const router = useRouter();

    var page = router.query?.page ? parseInt(router.query.page as string) : 1;

    const [limit, setLimit] = useState(8);

    const variables = useMemo(() => ({
        input: {
            page: router.query?.page ? parseInt(router.query.page as string) : 1,
            limit: limit,
            order_by: "class desc",
            where: {}
        }
    }), [page, limit]);



    const onSubmitFunc = (e: MouseEvent<HTMLButtonElement>) => {
        router.push("/students/create");
    };

    const getTotalPage = (total_item: number, per_page: number) => {
        return Math.ceil(total_item / per_page);
    }


    const { data, error, loading } = UseFetchGraphqlWithVariable<GetListStudentResponse>(`${HOST}/query`, `
            query getListStudent($input:GetListStudentInput!){
                GetListStudent(input: $input){
                    total
                    data{
                        id
                        first_name
                        last_name
                        dob
                        email
                        address
                        classes{
                            class_id
                            class_name
                        }
                        subject{
                            id
                            name
                        }
                        grade{
                            grade_id
                            grade_name
                        }
                    }
                }
            }
        `,
        variables
    );

    const handlePageChange = async (page: number) => {
        router.push(`/student_managements?page=${page}`);
    };


    if (loading) {
        return <LoadingPage />
    }

    if (error) {
        return <ErrorPage message={error} />
    }

    const handleOnView = (id: number) => {
        router.push(`/student-info/${id}`);
    }
    return (
        <div className="max-w-100 mx-auto  ">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Student Management</h1>
                <Button onClick={onSubmitFunc} className="flex items-center gap-2">
                    <PlusIcon className="w-4 h-4" />
                    Add Student
                </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                {
                    data?.GetListStudent.data.map((student, index) => {
                        return (
                            <>
                                <Card className="relative">
                                    <OnlineStatus style={
                                        {
                                            position: "absolute",
                                            top: "0",
                                            right: "0",
                                            zIndex: 10
                                        }
                                    } />
                                    <CardContent className="p-4 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <h2 className="text-lg font-semibold">{`${student.first_name} ${student.last_name}`}</h2>
                                                <div className="flex items-center gap-2">
                                                    <Badge>Grade {student.grade ? student.grade.grade_name : "-"}</Badge>
                                                    <Badge variant="secondary">English</Badge>
                                                </div>
                                            </div>
                                            <div className="text-muted-foreground">
                                                <div>Class: {!student.classes ? "-" : student.classes.length == 0 ? "-" : student.classes[0].class_name}</div>
                                                <div>Grade: B+</div>
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2 mt-4">
                                            <Button variant="outline" size="sm" onClick={() => handleOnView(student.id)}>
                                                <EyeIcon className="w-4 h-4"

                                                />
                                                View
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <FilePenIcon className="w-4 h-4" />
                                                Edit
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <TrashIcon className="w-4 h-4" />
                                                Delete
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        )
                    })
                }
            </div>
            <PaginationNav currentPage={page} totalPages={data ? getTotalPage(data.GetListStudent.total,limit) : 1} handlePageChange={handlePageChange} />
        </div>
    )
}

function EyeIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            // width="24"
            // height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    )
}


function FilePenIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            // width="24"
            // height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
        </svg>
    )
}


function PlusIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            // width="24"
            // height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    )
}


function TrashIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            // width="24"
            // height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
    )
}
