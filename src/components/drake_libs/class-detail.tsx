'use client'

import { useState } from "react"
import { CalendarDays, GraduationCap, Users, UserPlus } from "lucide-react"
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

export function ClassDetailComponent() {
  const [activeTab, setActiveTab] = useState("details")
  const [activeStudentTab, setActiveStudentTab] = useState("all")
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false)
  const [config, setConfig] = useState({
    autoGrading: false,
    attendanceRequired: true,
    lateSubmissions: true,
    peerReviews: false,
    groupProjects: true,
  })

  // Mock data - replace with actual data in a real application
  const classData = {
    name: "Advanced Web Development",
    id: "WEB301",
    totalEnrollment: 25,
    description: "This course covers advanced topics in web development including modern frameworks, serverless architectures, and progressive web apps.",
    grade: "Undergraduate",
    teacher: {
      name: "Dr. Jane Smith",
      avatar: "/placeholder.svg?height=40&width=40"
    },
    startDate: "2023-09-01",
    currentSemester: "Fall 2023",
    students: {
      all: [
        { id: 1, name: "Alice Johnson", avatar: "/placeholder.svg?height=40&width=40" },
        { id: 2, name: "Bob Williams", avatar: "/placeholder.svg?height=40&width=40" },
        { id: 3, name: "Charlie Brown", avatar: "/placeholder.svg?height=40&width=40" },
        { id: 4, name: "Diana Ross", avatar: "/placeholder.svg?height=40&width=40" },
        { id: 5, name: "Ethan Hunt", avatar: "/placeholder.svg?height=40&width=40" },
      ],
      active: [
        { id: 1, name: "Alice Johnson", avatar: "/placeholder.svg?height=40&width=40" },
        { id: 2, name: "Bob Williams", avatar: "/placeholder.svg?height=40&width=40" },
        { id: 4, name: "Diana Ross", avatar: "/placeholder.svg?height=40&width=40" },
      ],
      inactive: [
        { id: 3, name: "Charlie Brown", avatar: "/placeholder.svg?height=40&width=40" },
        { id: 5, name: "Ethan Hunt", avatar: "/placeholder.svg?height=40&width=40" },
      ],
    },
    timetable: [
      { day: "Monday", time: "10:00 AM - 11:30 AM", room: "Tech 101" },
      { day: "Wednesday", time: "10:00 AM - 11:30 AM", room: "Tech 101" },
      { day: "Friday", time: "2:00 PM - 3:30 PM", room: "Online" },
    ]
  }

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
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{classData.name}</CardTitle>
              <CardDescription>Class ID: {classData.id}</CardDescription>
            </div>
            <Badge variant="secondary">{classData.grade}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="font-semibold">Description</Label>
                <p className="text-sm text-muted-foreground">{classData.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span className="text-sm">Total Enrollment: {classData.totalEnrollment}</span>
              </div>
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-4 w-4" />
                <span className="text-sm">Current Semester: {classData.currentSemester}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CalendarDays className="h-4 w-4" />
                <span className="text-sm">Start Date: {classData.startDate}</span>
              </div>
            </div>
            <div>
              <Label className="font-semibold">Teacher (Host)</Label>
              <div className="flex items-center space-x-2 mt-2">
                <Avatar>
                  <AvatarImage src={classData.teacher.avatar} alt={classData.teacher.name} />
                  <AvatarFallback>{classData.teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <span>{classData.teacher.name}</span>
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
                    <p className="text-sm text-muted-foreground">{classData.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">Total Enrollment: {classData.totalEnrollment}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4" />
                    <span className="text-sm">Current Semester: {classData.currentSemester}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CalendarDays className="h-4 w-4" />
                    <span className="text-sm">Start Date: {classData.startDate}</span>
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
                    {classData.timetable.map((session, index) => (
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
                {(Object.keys(classData.students) as Array<keyof typeof classData.students>).map((category) => (
                  <TabsContent key={category} value={category}>
                    <div className="space-y-4">
                      {classData.students[category].map((student) => (
                        <div key={student.id} className="flex items-center space-x-2">
                          <Avatar>
                            <AvatarImage src={student.avatar} alt={student.name} />
                            <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span>{student.name}</span>
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
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-grading">Auto Grading</Label>
                    <p className="text-sm text-muted-foreground">Enable automatic grading for assignments</p>
                  </div>
                  <Switch
                    id="auto-grading"
                    checked={config.autoGrading}
                    onCheckedChange={() => handleConfigChange('autoGrading')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="attendance">Attendance Required</Label>
                    <p className="text-sm text-muted-foreground">Make attendance mandatory for this class</p>
                  </div>
                  <Switch
                    id="attendance"
                    checked={config.attendanceRequired}
                    onCheckedChange={() => handleConfigChange('attendanceRequired')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="late-submissions">Allow Late Submissions</Label>
                    <p className="text-sm text-muted-foreground">Permit students to submit assignments after the deadline</p>
                  </div>
                  <Switch
                    id="late-submissions"
                    checked={config.lateSubmissions}
                    onCheckedChange={() => handleConfigChange('lateSubmissions')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="peer-reviews">Enable Peer Reviews</Label>
                    <p className="text-sm text-muted-foreground">Allow students to review each other's work</p>
                  </div>
                  <Switch
                    id="peer-reviews"
                    checked={config.peerReviews}
                    onCheckedChange={() => handleConfigChange('peerReviews')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="group-projects">Enable Group Projects</Label>
                    <p className="text-sm text-muted-foreground">Allow collaborative group projects</p>
                  </div>
                  <Switch
                    id="group-projects"
                    checked={config.groupProjects}
                    onCheckedChange={() => handleConfigChange('groupProjects')}
                  />
                </div>
              </div>
              <Button className="mt-6">Save Configuration</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}