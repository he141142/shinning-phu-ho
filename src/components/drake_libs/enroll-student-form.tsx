'use client'

import { useState } from "react"
import { Button } from "@/components/drake_libs/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/drake_libs/ui/card"
import { Input } from "@/components/drake_libs/ui/input"
import { Label } from "@/components/drake_libs/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/drake_libs/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/drake_libs/ui/tabs"

export default function EnrollStudentFormComponent({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState("select-student")
  const [selectedStudent, setSelectedStudent] = useState("")
  const [classInfo, setClassInfo] = useState({
    startDate: "",
    endDate: "",
  })
  const [completedSteps, setCompletedSteps] = useState({
    "select-student": false,
    "class-info": false,
  })

  const handleStudentSelect = (value: string) => {
    setSelectedStudent(value)
    setCompletedSteps(prev => ({ ...prev, "select-student": true }))
    setActiveTab("class-info")
  }

  const handleClassInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCompletedSteps(prev => ({ ...prev, "class-info": true }))
    setActiveTab("confirm")
  }

  const handleConfirm = () => {
    // Here you would typically send the enrollment data to your backend
    console.log("Enrolling student:", selectedStudent, "with class info:", classInfo)
    onClose()
  }

  const isTabDisabled = (tabValue: string) => {
    if (tabValue === "select-student") return false
    if (tabValue === "class-info") return !completedSteps["select-student"]
    if (tabValue === "confirm") return !completedSteps["class-info"]
    return false
  }

  return (
    <Card className="w-ful]">
      <CardHeader>
        <CardTitle>Enroll Student</CardTitle>
        <CardDescription>Complete the following steps to enroll a student</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="select-student">Select Student</TabsTrigger>
            <TabsTrigger value="class-info" disabled={isTabDisabled("class-info")}>Class Info</TabsTrigger>
            <TabsTrigger value="confirm" disabled={isTabDisabled("confirm")}>Confirm</TabsTrigger>
          </TabsList>
          <TabsContent value="select-student">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="student-select">Select a student</Label>
                <Select onValueChange={handleStudentSelect}>
                  <SelectTrigger id="student-select">
                    <SelectValue placeholder="Select a student" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alice">Alice Johnson</SelectItem>
                    <SelectItem value="bob">Bob Smith</SelectItem>
                    <SelectItem value="charlie">Charlie Brown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="class-info">
            <form onSubmit={handleClassInfoSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={classInfo.startDate}
                    onChange={(e) => setClassInfo({ ...classInfo, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={classInfo.endDate}
                    onChange={(e) => setClassInfo({ ...classInfo, endDate: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit">Next</Button>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="confirm">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Selected Student:</h3>
                <p>{selectedStudent}</p>
              </div>
              <div>
                <h3 className="font-medium">Class Information:</h3>
                <p>Start Date: {classInfo.startDate}</p>
                <p>End Date: {classInfo.endDate}</p>
              </div>
              <Button onClick={handleConfirm}>Confirm Enrollment</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button 
          onClick={() => {
            if (activeTab === "select-student") onClose()
            else if (activeTab === "class-info") setActiveTab("select-student")
            else if (activeTab === "confirm") setActiveTab("class-info")
          }}
        >
          {activeTab === "select-student" ? "Close" : "Back"}
        </Button>
      </CardFooter>
    </Card>
  )
}