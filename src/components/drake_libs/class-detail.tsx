'use client'

import { useEffect, useState } from "react"
import { CalendarDays, GraduationCap, Users, UserPlus, UserRoundCog } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/drake_libs/ui/avatar"
import { Badge } from "@/components/drake_libs/ui/badge"
import { Button } from "@/components/drake_libs/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/drake_libs/ui/card"
import { Label } from "@/components/drake_libs/ui/label"
import { Switch } from "@/components/drake_libs/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/drake_libs/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/drake_libs/ui/table"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/drake_libs/ui/dialog"
import EnrollStudentForm from "./enroll-student-form"
import { HOST } from "@/static/env"
import { GetClassById, GetClassByIdResponse, StudentTabListModel } from "@/models/class/class.detail"
import { UseFetch } from "../hooks/fetch-data"
import { ErrorPage, LoadingPage } from "./component/loading-page"
import { GraphQLResponse, TimeTable } from "@/models/class/class"
import EditableSection from "@/pages/class_detail/components/editablesection"

export function ClassDetailComponent({ slug }: { slug: string }) {
  const [activeTab, setActiveTab] = useState("details")
  const [activeStudentTab, setActiveStudentTab] = useState("all")
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false)
  const [config, setConfig] = useState<Record<string, boolean>>({});


  console.log(slug);


  const { data, error, loading } = UseFetch<GetClassById>(`${HOST}/query`, `
    query{
      GetClassById(input:{
        class_id: ${slug}
      }){
        class_id
        class_name
        description
        students{
          id
          first_name
          last_name
          dob
          email
          phone
          address
          emergency_contact_name
          emergency_contact_phone
        }
        semester{
            end_date
            semester_id
            semester_name
            start_date
        }
        class_config{
          name
          description
          config_id
          is_enable
        }
        max_students
        current_enrollment
        room_id
        room{
            capacity
            center{
                center_id
            }
            room_id
            room_number
        }
        teacher{
          teacher_id
          first_name
          last_name
          middle_name
          dob
          gender
          phone_number
          email
          specialization
          hire_date
          profile_picture
          
        }
      }
    }
    `)

  useEffect(() => {
    if (data) {
      let cfg: Record<string, boolean> = {};
      data?.GetClassById?.class_config.forEach((config) => {
        cfg[config.config_id.toString()] = config.is_enable;
      });

      setConfig(cfg); // Set state here once
      console.log(cfg);

    }
  }, [data]);

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage message="failed to render" />;


  // TODO: Fetch timetable data from the server
  function fetchTimeTable(): TimeTable[] {
    return [
      {
        day: "Monday",
        room: "Tech 101",
        time: "10:00 AM - 11:30 AM"
      },
      {
        day: "Wednesday",
        room: "Tech 101",
        time: "10:00 AM - 11:30 AM"
      },
      {
        day: "Friday",
        room: "Online",
        time: "3:30 PM"
      }
    ]
  }

  function transformToStudentModel(): StudentTabListModel {
    let studentTabModel: StudentTabListModel = {
      all: [],
      active: [],
      in_active: []
    }
    data?.GetClassById?.students.forEach(student => {
      studentTabModel.all.push({
        id: student.id,
        first_name: student.first_name,
        last_name: student.last_name,
        dob: student.dob,
        email: student.email,
        phone: student.phone,
        address: student.address,
        emergency_contact_name: student.emergency_contact_name,
        emergency_contact_phone: student.emergency_contact_phone,
        avatar: "/placeholder.svg?height=40&width=40"
      })
    });
    studentTabModel.active = studentTabModel.all.filter(student => student.id % 2 === 0)
    studentTabModel.in_active = studentTabModel.all.filter(student => student.id % 2 !== 0)
    return studentTabModel
  }

  if (!data) {
    return <div>No data found</div>
  }

  let dataLoaded = transformToStudentModel();

  const handleConfigChange = (key: string) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      [key as keyof typeof config]: !prevConfig[key as keyof typeof config]
    }))
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <EditableSection title="Class Name" onSave={() => console.log("Saved")}>
            {
              (isEditing) => {
                return (
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">{data?.GetClassById?.class_name}</CardTitle>
                      <CardDescription>Class ID: {data?.GetClassById?.class_id}</CardDescription>
                    </div>
                    <Badge variant="secondary">{data?.GetClassById?.grade}</Badge>
                  </div>
                )
              }
            }
          </EditableSection>

        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="font-semibold">Description</Label>
                <p className="text-sm text-muted-foreground">{data?.GetClassById?.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span className="text-sm">Total Enrollment: {data?.GetClassById?.current_enrollment}</span>
              </div>
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-4 w-4" />
                <span className="text-sm">Current Semester: {data?.GetClassById?.semster?.semester_name || "N/A"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CalendarDays className="h-4 w-4" />
                <span className="text-sm">Start Date: {data?.GetClassById?.start_date}</span>
              </div>
            </div>
            <div>
              <Label className="font-semibold">Teacher (Host)</Label>
              <div className="flex items-center space-x-2 mt-2">
                <Avatar>
                  <AvatarImage src={data?.GetClassById?.teacher?.profile_picture} alt={data?.GetClassById?.teacher?.first_name + " " + data?.GetClassById?.teacher?.last_name} />
                  {/* <AvatarFallback>{data.teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback> */}
                </Avatar>
                <span>{data?.GetClassById?.teacher?.last_name}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="details">Class Details</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="config">Class Configuration</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Class Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="font-semibold">Description</Label>
                    <p className="text-sm text-muted-foreground">{data?.GetClassById?.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">Total Enrollment: {data?.GetClassById?.current_enrollment}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4" />
                    <span className="text-sm">Current Semester: {data?.GetClassById?.current_semester}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CalendarDays className="h-4 w-4" />
                    <span className="text-sm">Start Date: {data?.GetClassById?.start_date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <UserRoundCog  className="h-4 w-4" />
                    <span className="text-sm">Max Enrollment: {data?.GetClassById?.max_students}</span>
                  </div>
                </div>
              </CardContent>
            </Card> 
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Day</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Room</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fetchTimeTable().map((session, index) => (
                      <TableRow key={index}>
                        <TableCell>{session.day}</TableCell>
                        <TableCell>{session.time}</TableCell>
                        <TableCell>{session.room}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Student List</CardTitle>
                <Dialog open={isEnrollModalOpen} onOpenChange={setIsEnrollModalOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="mr-2 h-10 w-10" />
                      Enroll Student
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-full h-[50%] max-w-[50%]">
                    <EnrollStudentForm onClose={() => setIsEnrollModalOpen(false)} />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeStudentTab} onValueChange={setActiveStudentTab}>
                <TabsList>
                  <TabsTrigger value="all">All Students</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="inactive">Inactive</TabsTrigger>
                </TabsList>
                {(Object.keys(dataLoaded) as Array<keyof typeof dataLoaded>).map((category) => (
                  <TabsContent key={category} value={category}>
                    <div className="space-y-4">
                      {dataLoaded[category].map((student) => (
                        <div key={student.id} className="flex items-center space-x-2">
                          <Avatar>
                            <AvatarImage src={student.avatar} alt={student?.first_name + " " + student?.last_name} />
                            {/* <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback> */}
                          </Avatar>
                          <span>{student?.first_name + " " + student?.last_name}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle>Class Configuration</CardTitle>
              <CardDescription>Manage settings for this class</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {
                  data?.GetClassById?.class_config.map((cfg) => (
                    <div key={cfg.config_id} className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-grading">{cfg.name}</Label>
                        <p className="text-sm text-muted-foreground">{config.description}</p>
                      </div>
                      <Switch
                        id="auto-grading"
                        checked={config[cfg.config_id.toString()]}
                        onCheckedChange={() => handleConfigChange(cfg.config_id.toString())}
                      />
                    </div>
                  ))
                }
              </div>
              <Button className="mt-6">Save Configuration</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}