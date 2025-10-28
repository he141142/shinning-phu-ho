'use client'

import { useState } from "react"
import { Button } from "@/components/drake_libs/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/drake_libs/ui/card"
import { Input } from "@/components/drake_libs/ui/input"
import { Label } from "@/components/drake_libs/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/drake_libs/ui/select"
import { Textarea } from "@/components/drake_libs/ui/textarea"
import {  useToast } from "@/components/hooks/use-toast"
import { CalendarIcon, ChevronLeftIcon } from "lucide-react"
import { format, set } from "date-fns"
import { Calendar } from "@/components/drake_libs/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/drake_libs/ui/popover"
import { Toast } from "@/components/drake_libs/ui/toast"

import { UseFetch } from "@/components/hooks/fetch-data"
import { HOST } from "@/static/env"
import { ListAllGradesResponse } from "@/models/grades/ListAllGrades"
import { ErrorPage, LoadingPage } from "@/components/drake_libs/component/loading-page"
import { useRouter } from 'next/navigation';
import { CheckCircleIcon, XCircleIcon } from "lucide-react";
import { CreateStudentInputVariable } from "@/models/students/CreateStudent/CreateStudent"
import moment from 'moment';
import { log } from "console"

export default function AddNewStudentPage() {
  const { toast } = useToast();


  const [date, setDate] = useState<Date>();

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [emergencyContact, setEmergencyContact] = useState<string>('');
  const [emergencyContactName, setEmergencyContactName] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [gradeClass, setGradeClass] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const { data, error, loading } = UseFetch<ListAllGradesResponse>(`${HOST}/query`, `
      query{
        ListAllGrades{
          grade_id
          grade_name
        }
      }
    `);

  if (loading) return <LoadingPage />
  if (error) return <ErrorPage message={error} />

  

  const TickToast: React.ReactNode = (
    <div className="flex items-center">
      <CheckCircleIcon className="text-green-500 mr-2 h-6 w-6 animate-bounce" />
      <span> student has been added successfully.</span>
    </div>
  );


  const FailToast = (error: string): React.ReactNode => (
    <div className="flex items-center">
      <CheckCircleIcon className="text-red-500 mr-2 h-6 w-6 animate-pulse" />
      <span> Failed To Add Student, Error: {error} </span>
    </div>
  );

  const renderSuccessToast = () => {
    return {
      title: "Success",
      description: TickToast,
      duration: 5000,
    }
  };

   const renderFailedToast = (error: string) => {
    console.log("triggered");
    
    return {
      title: "Failed",
      description: FailToast(error),
      duration: 5000,
    }
  };

  const backToStudentPage = () => {
    // Redirect to the student page
    router.push('/student_managements')
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let studentData: CreateStudentInputVariable = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phone,
      address: address,
      emergency_contact_phone: emergencyContact,
      emergency_contact_name: emergencyContactName,
      grade: gradeClass,
      gender: gender,
      dob: date ? moment(date).format('YYYY-MM-DD') : "",
    };

    const mutation = `
      mutation{
        CreateStudent(input:{
              first_name: "${studentData.first_name}",
              last_name:"${studentData.last_name}",
              email:"${studentData.email}",
              dob:"${studentData.dob}",
              phone:"${studentData.phone}",
              address:"${studentData.address}",
              emergency_contact_name:"${studentData.emergency_contact_name}",
              emergency_contact_phone:"${studentData.emergency_contact_phone}",
              center_id: 1,
              gender:"${studentData.gender}",
              grade:"${studentData.grade}"
        }){
              entity_id
              status
              message
        }
      }
    `;

    try {
      const response = await fetch(`${HOST}/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query: mutation })
      });

      if (!response.ok) {
        throw new Error("Failed to add student");
      }


      const result = await response.json();
      if (result.data.CreateStudent.status === "200") {
        console.log(result);

        toast(renderSuccessToast());
        setLoading(true); 
        await new Promise(resolve => setTimeout(resolve, 1000));
        router.push('/student_managements');
      }else{
                
        throw result.data.CreateStudent.message;
      }

     
    
    } catch (e) {
      console.log(e);

      toast({...renderFailedToast("Failed to add student")});
    } finally {
      setLoading(false); // Hide loading animation
    };

  };
  const monthCaptionStyle = {
    borderBottom: "1px solid currentColor",
    paddingBottom: "0.5em"
  };
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" className="mb-4" onClick={backToStudentPage}>
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
                  <Input id="firstName" placeholder="Enter first name" required onChange={(e) => { setFirstName(e.target.value) }} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Enter last name" required onChange={(e) => { setLastName(e.target.value) }} />
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
                        className="hide-selected-month"
                        captionLayout="dropdown"
                        fromYear={2010}
                        toYear={2030}
                        styles={{
                          dropdown_month: {
                            flex: "1 1 0",
                            width: "auto",
                            minWidth: "0",
                            maxWidth: "100%",
                            padding: "0.5rem",
                            border: "1px solid #e5e7eb",
                            borderRadius: "0.375rem",
                            backgroundColor: "#fff",
                            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                            color: "#374151",
                            fontSize: "0.875rem",
                            lineHeight: "1.25rem",
                            appearance: "none",
                            display: "block",
                          },
                          dropdown: {
                            accentColor: "red",
                            color: "blue",
                          },
                          dropdown_year: {
                            flex: "1 1 0",
                            width: "auto",
                            minWidth: "0",
                            maxWidth: "100%",
                            padding: "0.5rem",
                            border: "1px solid #e5e7eb",
                            borderRadius: "0.375rem",
                            backgroundColor: "#fff",
                            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                            color: "#374151",
                            fontSize: "0.875rem",
                            lineHeight: "1.25rem",
                            appearance: "none",
                            display: "block",
                          },
                        }}
                      />
                    </PopoverContent>
                  </Popover>

                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select onValueChange={(value) => setGender(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gradeClass">Grade Class</Label>
                <Select onValueChange={(value) => setGradeClass(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade class" />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      data?.ListAllGrades.map((grade) => (
                        <SelectItem key={grade.grade_id} value={`${grade.grade_id}`}>
                          {grade.grade_name}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="student@example.com" required onChange={(e) => { setEmail(e.target.value) }} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="(123) 456-7890" onChange={(e) => { setPhone(e.target.value) }} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" placeholder="Enter student's address" onChange={(e) => { setAddress(e.target.value) }} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact Phone Number</Label>
                <Input id="emergencyContact" placeholder="Emergency Contact Phone Number" onChange={(e) => { setEmergencyContact(e.target.value) }} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                <Input id="emergencyContactName" placeholder="Emergency Contact Name" onChange={(e) => { setEmergencyContactName(e.target.value) }} />
              </div>

            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button type="submit" disabled={isLoading}>{
                isLoading ? (
                  <span>
                    <XCircleIcon className="mr-2 h-4 w-4 animate-spin" />
                    Adding Student
                  </span>
                ) : (
                  <span>
                    <CheckCircleIcon className="mr-2 h-4 w-4" />
                    Add Student
                  </span>
                )
              }</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}