"use client";
import { Button } from "@/components/drake_libs/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/drake_libs/ui/avatar"
import { Label } from "@/components/drake_libs/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/drake_libs/ui/select"
import { Input } from "@/components/drake_libs/ui/input"
import { Textarea } from "@/components/drake_libs/ui/textarea"
import Link from "next/link"
import { FeedBackStatus, StudentObject } from "@/models/student";
import { useEffect, useRef, useState } from "react";
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import { getListStatus } from "@/models/mocks/get_list_student_object";

export function StudentFeedBackList(props: {
  students: StudentObject[]
}) {

  const alertRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [selectStudent, setSelectStudent] = useState<StudentObject | undefined>(undefined);
  const [toogleAlert, setToogleAlert] = useState(false);
  const [listStatus, setListStatus] = useState<FeedBackStatus[]>([]);

  const handleStudentChange = (value: string) => {
    const student: StudentObject | undefined = props.students.find(s => s.id.toString() === value);
    setSelectStudent(student);
  }

  const handleSendFeedback = () => {
    setToogleAlert(true);
    timeoutRef.current = setTimeout(() => {
      setToogleAlert(false);
    }, 5000);
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (alertRef.current && !alertRef.current.contains(event.target as Node)) {
      setToogleAlert(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  }

  useEffect(() => {
    setListStatus(getListStatus);
  },[]);

  useEffect(() => {
    if (toogleAlert) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toogleAlert]);

  return (
    <div className="flex flex-col h-full bg-slate-400 relative">
      {/* {
     toogleAlert &&  <div className="absolute top-0 left-0 bg-black bg-opacity-50 w-full h-full" style={{ zIndex: 10 }} />
     } */}
      <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <ClapperboardIcon className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Parent-Teacher Communication</h1>
        </div>
        <Button variant="ghost">
          <PlusIcon className="w-5 h-5" />
          <span className="sr-only">Create New Feedback</span>
        </Button>
      </header>
      <main className="flex-1 grid grid-cols-[300px_1fr] gap-6 p-6 ">
        <div className="bg-background rounded-lg shadow-md p-4 overflow-y-auto h-[500px]">
          <h2 className="text-lg font-bold mb-4">My Students</h2>
          <div className="grid gap-2">
            {
              props.students.filter(s => s.feedback_status).map((student) => (
                <div className="flex items-center justify-between bg-muted rounded-md p-2">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src="/placeholder-user.jpg" alt={student.name} />
                      <AvatarFallback>{student.name}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-xs text-muted-foreground">{student.grade}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${student.feedback_status === "Good" ? "bg-green-500" : student.feedback_status == "Not Good" ? "bg-yellow-600" : "bg-red-500"}`} />
                    <span className="text-xs text-muted-foreground">{student.feedback_status}</span>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
        <div className="bg-background rounded-lg shadow-md p-4">
          <h2 className="text-lg font-bold mb-4">Feedback Composer</h2>
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="student">Student</Label>
              <Select  onValueChange={handleStudentChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a student" />
                </SelectTrigger>
                <SelectContent>
                  {
                    props.students.map((student) => (
                      <SelectItem value={student.id.toString()}>{student.name}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <div className="flex justify-between">

                <div>
                  <Label htmlFor="grades">Grades</Label>
                  {
                    selectStudent ? <Input disabled={true} id="grades" value={selectStudent.grade} /> : <Input disabled={true} id="grades" placeholder="student grades come here..." />
                  }
                </div>
                <div className="basis-1/2">
                  <div className="w-[50%]">
                    <Select onValueChange={handleStudentChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose status" />
                      </SelectTrigger>
                      <SelectContent>
                        {
                          listStatus.map((status) => (
                            <SelectItem value={status.status}>{status.status}</SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

            </div>
            <div className="grid gap-2">
              <Label htmlFor="behavior">Behavior</Label>
              <Textarea id="behavior" placeholder="Describe student behavior" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="progress">Assignment Progress</Label>
              <Input id="progress" placeholder="Enter assignment progress" />
            </div>
            <Button type="button" onClick={handleSendFeedback}>Send Feedback</Button>
          </form>
        </div>
      </main>
      <footer className="bg-muted text-muted-foreground py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <CopyrightIcon className="w-4 h-4" />
          <span className="text-sm">2023 Parent-Teacher Communication</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="#" className="text-sm hover:underline" prefetch={false}>
            Privacy Policy
          </Link>
          <Link href="#" className="text-sm hover:underline" prefetch={false}>
            Terms of Service
          </Link>
        </div>
        {
          toogleAlert && <Alert className={`z-20 absolute top-0 right-0 alert ${toogleAlert ? 'transition ease-in-out delay-150 bg-blue-500 hover:-translate-y-1 scale-110 hover:bg-indigo-500 duration-300' : 'fade-out'}`} ref={alertRef} icon={<CheckIcon fontSize="inherit" />} severity="success">
            Feedback Sent Successfully
          </Alert>
        }


      </footer>
    </div>
  )
}

function ClapperboardIcon(props: any) {
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
      <path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z" />
      <path d="m6.2 5.3 3.1 3.9" />
      <path d="m12.4 3.4 3.1 4" />
      <path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
    </svg>
  )
}


function CopyrightIcon(props: any) {
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
      <path d="M14.83 14.83a4 4 0 1 1 0-5.66" />
    </svg>
  )
}


function PlusIcon(props: any) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
