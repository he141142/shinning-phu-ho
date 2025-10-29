"use client";

import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/drake_libs/ui/button";
import { request, gql } from "graphql-request";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/drake_libs/ui/card";
import { Input } from "@/components/drake_libs/ui/input";
import { Label } from "@/components/drake_libs/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/drake_libs/ui/select";
import { Textarea } from "@/components/drake_libs/ui/textarea";
import { useToast } from "@/components/hooks/use-toast";
import {
  CalendarIcon,
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Users,
  GraduationCap,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/drake_libs/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/drake_libs/ui/popover";

import { UseFetch } from "@/components/hooks/fetch-data";
import { HOST } from "@/static/env";
import { ListAllGradesResponse } from "@/models/grades/ListAllGrades";
import {
  ErrorPage,
  LoadingPage,
} from "@/components/drake_libs/component/loading-page";
import { useRouter } from "next/navigation";
import { CreateStudentInputVariable } from "@/models/students/CreateStudent/CreateStudent";
import moment from "moment";
import { cn } from "@/lib/utils";

export default function AddNewStudentPage() {
  const { toast } = useToast();
  const router = useRouter();

  // Form state
  const [date, setDate] = useState<Date>();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [emergencyContact, setEmergencyContact] = useState<string>("");
  const [emergencyContactName, setEmergencyContactName] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [gradeClass, setGradeClass] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);

  // Fetch grades
  const { data, error, loading } = UseFetch<ListAllGradesResponse>(
    `${HOST}/query`,
    `
      query{
        ListAllGrades{
          grade_id
          grade_name
        }
      }
    `
  );

  // Validation state
  const isFormValid = useMemo(() => {
    return firstName.trim() !== "" &&
           lastName.trim() !== "" &&
           email.trim() !== "" &&
           date !== undefined;
  }, [firstName, lastName, email, date]);

  // Define callbacks BEFORE conditional returns
  const backToStudentPage = useCallback(() => {
    router.push("/student_managements");
  }, [router]);

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
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
      dob: date ? moment(date).format("YYYY-MM-DD") : "",
    };

    const mutation = gql`
      mutation CreateStudent($input: CreateStudentInput!) {
        CreateStudent(input: $input) {
          entity_id
          status
          message
        }
      }
    `;
    const endpoint = `${HOST}/query`;

    const variables = {
      input: {
        first_name: studentData.first_name,
        last_name: studentData.last_name,
        email: studentData.email,
        dob: studentData.dob,
        phone: studentData.phone,
        address: studentData.address,
        emergency_contact_name: studentData.emergency_contact_name,
        emergency_contact_phone: studentData.emergency_contact_phone,
        center_id: 1,
        gender: studentData.gender,
        grade: studentData.grade,
      },
    };

    try {
      setLoading(true);
      const data = await request(endpoint, mutation, variables);
      const result = data.CreateStudent;
      if (result.status === "200") {
        toast({
          title: "Success",
          description: (
            <div className="flex items-center">
              <CheckCircle2 className="text-green-500 mr-2 h-5 w-5" />
              <span>Student has been added successfully.</span>
            </div>
          ),
          duration: 5000,
        });
        await new Promise((r) => setTimeout(r, 1000));
        router.push("/student_managements");
      } else {
        throw new Error(result.message);
      }
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: (
          <div className="flex items-center">
            <AlertCircle className="text-red-500 mr-2 h-5 w-5" />
            <span>Failed to add student. Please try again.</span>
          </div>
        ),
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }, [firstName, lastName, email, phone, address, emergencyContact, emergencyContactName, gender, gradeClass, date, router, toast]);

  // NOW handle loading and error states AFTER all hooks
  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage message={error} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={backToStudentPage}
            className="mb-4 hover:bg-white hover:shadow-md transition-all"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Students
          </Button>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Add New Student
                </h1>
                <p className="text-gray-600 mt-1">
                  Fill in the information below to register a new student
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit}>
          <Card className="shadow-xl border-gray-200">
            <CardContent className="p-8 space-y-8">
              {/* Section: Personal Information */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">
                      Date of Birth <span className="text-red-500">*</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 transition-colors",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-indigo-600" />
                          {date ? format(date, "PPP") : "Select date of birth"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 shadow-xl border-gray-200" align="start">
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white">
                          <p className="text-sm font-medium">Select Date of Birth</p>
                          {date && (
                            <p className="text-2xl font-bold mt-1">{format(date, "PPP")}</p>
                          )}
                        </div>
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          captionLayout="dropdown-buttons"
                          fromYear={1990}
                          toYear={2020}
                          classNames={{
                            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 p-4",
                            month: "space-y-4",
                            caption: "flex justify-center pt-1 relative items-center",
                            caption_label: "text-sm font-medium",
                            caption_dropdowns: "flex gap-2",
                            nav: "space-x-1 flex items-center",
                            nav_button: cn(
                              "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-indigo-50 rounded-md transition-colors"
                            ),
                            nav_button_previous: "absolute left-1",
                            nav_button_next: "absolute right-1",
                            table: "w-full border-collapse space-y-1",
                            head_row: "flex",
                            head_cell: "text-muted-foreground rounded-md w-10 font-normal text-[0.8rem]",
                            row: "flex w-full mt-2",
                            cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                            day: cn(
                              "h-10 w-10 p-0 font-normal rounded-md hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                            ),
                            day_selected: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:bg-indigo-700 hover:text-white focus:bg-indigo-700 focus:text-white shadow-md",
                            day_today: "bg-indigo-100 text-indigo-900 font-semibold",
                            day_outside: "text-muted-foreground opacity-50",
                            day_disabled: "text-muted-foreground opacity-50",
                            day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                            day_hidden: "invisible",
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
                      Gender
                    </Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
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
              </div>

              {/* Section: Academic Information */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Academic Information</h3>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gradeClass" className="text-sm font-medium text-gray-700">
                    Grade Class
                  </Label>
                  <Select value={gradeClass} onValueChange={setGradeClass}>
                    <SelectTrigger className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                      <SelectValue placeholder="Select grade class" />
                    </SelectTrigger>
                    <SelectContent>
                      {data?.ListAllGrades.map((grade) => (
                        <SelectItem key={grade.grade_id} value={`${grade.grade_name}`}>
                          Grade {grade.grade_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Section: Contact Information */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="student@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(123) 456-7890"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mt-6">
                  <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                    Address
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Textarea
                      id="address"
                      placeholder="123 Main Street, City, State, ZIP"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="pl-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              {/* Section: Emergency Contact */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Emergency Contact</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactName" className="text-sm font-medium text-gray-700">
                      Emergency Contact Name
                    </Label>
                    <Input
                      id="emergencyContactName"
                      placeholder="Jane Doe"
                      value={emergencyContactName}
                      onChange={(e) => setEmergencyContactName(e.target.value)}
                      className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact" className="text-sm font-medium text-gray-700">
                      Emergency Contact Phone
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="emergencyContact"
                        type="tel"
                        placeholder="(123) 456-7890"
                        value={emergencyContact}
                        onChange={(e) => setEmergencyContact(e.target.value)}
                        className="pl-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 bg-gray-50 px-8 py-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={backToStudentPage}
                className="w-full sm:w-auto hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !isFormValid}
                className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Student...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Add Student
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}
