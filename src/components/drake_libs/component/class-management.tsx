"use-client";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/drake_libs/ui/tooltip"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/drake_libs/ui/card"
import { Button } from "@/components/drake_libs/ui/button"
import { useEffect, useMemo, useState } from "react"
import { getListClasses } from "@/models/mocks/get_list_classes"
import { useRouter } from "next/router";
import { ClassInfo, GetListClassResponse } from "@/models/class/class";
import { HOST } from "@/static/env";
import { ErrorPage, LoadingPage } from "./loading-page";
import { PaginationNav } from "./pagination";
import { PlusIcon } from "lucide-react";
import { getTotalPage } from "@/utils/utils";


export function ClassManagement() {
  const [limit, setLimit] = useState(8);
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [totalItem, setTotalItem] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  var page = router.query?.page ? parseInt(router.query.page as string) : 1;
  const variables = useMemo(() => ({
    input: {
      page: router.query?.page ? parseInt(router.query.page as string) : 1,
      limit: limit,
      order_by: "class desc",
      where: {}
    }
  }), [page, limit]);


  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);

      try {
        const response = await fetch(`${HOST}/query`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query {
                GetListClass(input: {
                  page: ${variables.input.page},
                  limit: ${variables.input.limit},
                  order_by: "id desc",
                  where: {}
                }) {
                  total
                  data {
                    class_id
                    class_name
                    description
                    teacher_id
                    start_date
                    end_date
                    max_students
                    current_enrollment
                    room_id
                    schedule
                  }
                }
              }
            `,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        const data: GetListClassResponse = result.data;
        console.log(data);
        setTotalItem(data.GetListClass.total);

        setClasses(data.GetListClass.data.map((data) => {
          let classInfo: ClassInfo = {
            Id: data.class_id,
            Name: data.class_name,
            Description: data.description,
            Teacher: data.teacher_id?.toString() || "-",
            Status: "Active",
            Enrolled: data.current_enrollment,
          }
          return classInfo;
        }));

      } catch (err: any) {


        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleClassOnClick = (classID: number): () => void => {
    return () => {
      console.log("clicked")
      router.push(`/class_detail/${classID}`)
    }
  }

  const handlePageChange = async (page: number) => {
    router.push(`/classes?page=${page}`);
  }

  const renderClassComponent = () => {
    return classes.map((classInfo) => {
      return (
        <Card
          key={classInfo.Id}
          className="group hover:shadow-xl transition-all duration-300 border-gray-200 hover:border-blue-300 cursor-pointer"
          onClick={handleClassOnClick(classInfo.Id)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl font-bold group-hover:text-blue-600 transition-colors line-clamp-1">
                  {classInfo.Name}
                </CardTitle>
                <CardDescription className="mt-2 flex items-center gap-2">
                  <UsersIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">Taught by {classInfo.Teacher}</span>
                </CardDescription>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center group-hover:from-blue-200 group-hover:to-cyan-200 transition-all">
                <BookIcon className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                <div className="flex items-center gap-2">
                  <UsersIcon className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Enrolled</span>
                </div>
                <span className="text-lg font-bold text-blue-600">{classInfo.Enrolled}</span>
              </div>
              <Button
                size="sm"
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClassOnClick(classInfo.Id)();
                }}
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )
    })
  }

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage message="failed to render" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <BookIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Class Management
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Manage and organize all your classes
                  </p>
                </div>
              </div>
              <Button
                onClick={() => router.push('/classes/create')}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md hover:shadow-lg transition-all"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add New Class
              </Button>
            </div>
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
          {renderClassComponent()}
        </div>

        {/* Pagination */}
        <div className="flex justify-center">
          <PaginationNav
            currentPage={page}
            totalPages={classes ? getTotalPage(totalItem, limit) : 1}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  )
}

function BookIcon(props: any) {
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
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  )
}


function CalendarIcon(props: any) {
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


function ClipboardIcon(props: any) {
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
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  )
}


function Package2Icon(props: any) {
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
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
    </svg>
  )
}


function UsersIcon(props: any) {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
