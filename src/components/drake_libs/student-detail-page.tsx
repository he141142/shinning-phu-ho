'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/drake_libs/ui/avatar"
import { Button } from "@/components/drake_libs/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/drake_libs/ui/card"
import { Badge } from "@/components/drake_libs/ui/badge"
import { CalendarDays, GraduationCap, Mail, MapPin, Phone, User } from "lucide-react"

export function StudentDetailPage() {
  // This would typically come from a database or API
  const student = {
    firstName: "Jane",
    lastName: "Doe",
    age: 16,
    gradeClass: "11A",
    email: "jane.doe@school.edu",
    phone: "(555) 123-4567",
    address: "123 School St, Anytown, AN 12345"
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Student Detail</h1>
          <Button>Edit Profile</Button>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="/placeholder.svg?height=80&width=80" alt={`${student.firstName} ${student.lastName}`} />
                  <AvatarFallback>{student.firstName[0]}{student.lastName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{student.firstName} {student.lastName}</CardTitle>
                  <CardDescription>Student ID: 12345678</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="text-gray-500" />
                    <span>Age: {student.age}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="text-gray-500" />
                    <span>Grade: {student.gradeClass}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="text-gray-500" />
                    <span>{student.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="text-gray-500" />
                    <span>{student.phone}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <MapPin className="text-gray-500" />
                    <span>{student.address}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Academic Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>GPA</span>
                    <Badge>3.8</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Class Rank</span>
                    <Badge variant="outline">15 of 200</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Attendance Rate</span>
                    <Badge variant="secondary">98%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {[1, 2, 3].map((_, index) => (
                    <li key={index} className="flex items-center gap-4">
                      <CalendarDays className="text-gray-500" />
                      <div>
                        <p className="font-medium">Submitted Math Assignment</p>
                        <p className="text-sm text-gray-500">2 days ago</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {[1, 2, 3].map((_, index) => (
                    <li key={index} className="flex items-center gap-4">
                      <CalendarDays className="text-gray-500" />
                      <div>
                        <p className="font-medium">Parent-Teacher Conference</p>
                        <p className="text-sm text-gray-500">March 15, 2024</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full">View Transcript</Button>
                <Button className="w-full" variant="outline">Schedule Meeting</Button>
                <Button className="w-full" variant="secondary">Report Absence</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="bg-white shadow mt-8">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © 2024 School Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}