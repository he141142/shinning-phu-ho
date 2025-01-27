'use client'

import { useState } from "react"
import { Button } from "@/components/drake_libs/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/drake_libs/ui/card"
import { Input } from "@/components/drake_libs/ui/input"
import { Label } from "@/components/drake_libs/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/drake_libs/ui/select"
import { Textarea } from "@/components/drake_libs/ui/textarea"
import { useToast } from "@/components/hooks/use-toast"
import { CalendarIcon, ChevronLeftIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/drake_libs/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/drake_libs/ui/popover"

export function AddNewStudentPage() {
  const { toast } = useToast()
  const [date, setDate] = useState<Date>()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Here you would typically send the form data to your backend
    toast({
      title: "Success",
      description: "New student has been added successfully.",
    })
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" className="mb-4">
          <ChevronLeftIcon className="mr-2 h-4 w-4" /> Back to Students
        </Button>
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Add New Student</CardTitle>
            <CardDescription>Enter the details of the new student below.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Enter first name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Enter last name" required />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={`w-full justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gradeClass">Grade Class</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade class" />
                  </SelectTrigger>
                  <SelectContent>
                    {[9, 10, 11, 12].map((grade) => (
                      <SelectItem key={grade} value={`${grade}`}>
                        Grade {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="student@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="(123) 456-7890" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" placeholder="Enter student's address" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input id="emergencyContact" placeholder="Name and phone number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medicalInfo">Medical Information</Label>
                <Textarea id="medicalInfo" placeholder="Any relevant medical information" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button type="submit">Add Student</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}