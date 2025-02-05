"use-client";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/drake_libs/ui/tooltip"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/drake_libs/ui/card"
import { Button } from "@/components/drake_libs/ui/button"
import { useEffect, useState } from "react"
import { getListClasses } from "@/models/mocks/get_list_classes"
import { useRouter } from "next/router";
import { ClassInfo, GetListClassResponse } from "@/models/class/class";
import { HOST } from "@/static/env";
import { ErrorPage, LoadingPage } from "./loading-page";
import { PaginationNav } from "./pagination";
import { PlusIcon } from "lucide-react";


export function ClassManagement() {


  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
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
                  page: 1,
                  limit: 10,
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

  const renderClassComponent = () => {
    return classes.map((classInfo) => {
      return (
        <Card key={classInfo.Id}>
          <CardHeader>
            <CardTitle>{classInfo.Name}</CardTitle>
            <CardDescription>Taught by {classInfo.Teacher}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span>Enrolled: {classInfo.Enrolled}</span>
              <Button size="sm" onClick={handleClassOnClick(classInfo.Id)}>View Details</Button>
            </div>
          </CardContent>
        </Card>
      )
    })
  }

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage message="failed to render"/>;

  return (
    <div className="flex min-h-screen w-full ">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
       <div className="flex items-center justify-between mb-6">
                       <h1 className="text-2xl font-bold">Class Management</h1>
                       <Button onClick={() => {}} className="flex items-center gap-2">
                           <PlusIcon className="w-4 h-4" />
                           Add Class
                       </Button>
                   </div>
        <main className="grid content-between flex-0 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
          {renderClassComponent()}
          <Card >
            <CardHeader>
              <CardTitle>Physics Lab</CardTitle>
              <CardDescription>Taught by Emily Wang</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span>Enrolled: 20</span>
                <Button size="sm">View Details</Button>
              </div>
            </CardContent>
          </Card>
          
          <PaginationNav initialPage={0} totalPages={100}></PaginationNav>
        </main>
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
