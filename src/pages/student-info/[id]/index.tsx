import StudentProfile, { StudentProfileProps } from "./components/student-profile"
import ClassesList, { ClassesListProps } from "./components/classes-list"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs"
import { useRouter } from "next/router"
import { HOST } from "@/static/env"
import { UseFetch } from "@/components/hooks/fetch-data"
import { ErrorPage, LoadingPage } from "@/components/drake_libs/component/loading-page"
import { GetStudentDetailResponse } from "@/models/students/GetStudentDetail/GetStudentDetail"
import { JoinClassModal } from "./components/JoinClassModal"
import { Button } from "@/components/drake_libs/ui/button"
import { useState, useMemo, useCallback } from "react"
import { ModalType, UseModal } from "@/components/hooks/useModal"
import { RegistrationCardInfoData, RegistrationCardInfoProps } from "./components/RegistrationCard"
import { ArrowLeft, Mail, Phone, MapPin, Calendar, UserCircle, Plus, BookOpen, GraduationCap, Edit2, Save, X } from "lucide-react"
import { Badge } from "@/components/drake_libs/ui/badge"
import { Input } from "@/components/drake_libs/ui/input"
import { useUpdateStudent } from "@/hooks/students"
import { useToast } from "@/components/hooks/use-toast"
import { UpdateStudentInput } from "@/models/students/UpdateStudent/UpdateStudent"

export default function StudentDetailPage() {
    const router = useRouter();
    const id = router.query.id;
    const { closeModal, isOpen, openModal, modalType } = UseModal();
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState<Partial<UpdateStudentInput>>({});

    // Build query
    const query = useMemo(() => {
        if (!id) return null;
        return `
        query{
            GetStudentDetail(student_id:${id}){
                id
                first_name
                last_name
                dob
                email
                phone
                address
                emergency_contact_name
                emergency_contact_phone
                classes{
                    class_id
                    class_name
                    description
                    teacher_id
                    start_date
                    end_date
                    max_students
                    current_enrollment
                }
                center{
                    center_id
                    center_name
                    address
                    phone_number
                    email
                    is_active
                    website
                }
                grade{
                    grade_id
                    grade_name
                }
            }
        }
        `;
    }, [id]);

    // Fetch data
    const { data, error, loading, refetch } = UseFetch<GetStudentDetailResponse>(`${HOST}/query`, query);

    // Update mutation
    const { mutate: updateStudent, isPending: isUpdating } = useUpdateStudent({
        onSuccess: (response) => {
            toast({
                title: "Success",
                description: "Student information updated successfully",
            });
            setIsEditing(false);
            setEditedData({});
            refetch();
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to update student information",
                variant: "destructive",
            });
        },
    });

    // Define callbacks BEFORE any conditional returns
    const handleClose = useCallback(() => {
        closeModal();
    }, [closeModal]);

    const handleBack = useCallback(() => {
        router.back();
    }, [router]);

    const toStudentProps = useCallback((data: GetStudentDetailResponse | undefined): StudentProfileProps => {
        return {
            student: {
                first_name: data?.GetStudentDetail.first_name || "",
                last_name: data?.GetStudentDetail.last_name || "",
                email: data?.GetStudentDetail.email || "",
                dob: data?.GetStudentDetail.dob || "",
                phone: data?.GetStudentDetail.phone || "",
                address: data?.GetStudentDetail.address || "",
                emergency_contact_name: data?.GetStudentDetail.emergency_contact_name || "",
                emergency_contact_phone: data?.GetStudentDetail.emergency_contact_phone || "",
                center: data?.GetStudentDetail.center || undefined,
                gender: "undefined"
            }
        }
    }, []);

    const toClassesProps = useCallback((data: GetStudentDetailResponse | undefined): ClassesListProps => {
        return {
            classes: data?.GetStudentDetail.classes || []
        }
    }, []);

    const prepareRegistrationCardInfoProps = useCallback((data: GetStudentDetailResponse | undefined): RegistrationCardInfoData => {
        return {
            centerId: data?.GetStudentDetail.center?.center_id || 1,
            centerName: data?.GetStudentDetail.center?.center_name || "",
            className: "",
            classDescription: "",
            currentEnrollment: 0,
            endDate: "",
            grade: data?.GetStudentDetail.grade?.grade_name || "-",
            startDate: "",
            classId: 0,
            studentId: data?.GetStudentDetail.id || 0
        }
    }, []);

    // Handle edit mode
    const handleEditClick = useCallback(() => {
        if (data?.GetStudentDetail) {
            setEditedData({
                student_id: data.GetStudentDetail.id,
                first_name: data.GetStudentDetail.first_name,
                last_name: data.GetStudentDetail.last_name,
                dob: data.GetStudentDetail.dob,
                email: data.GetStudentDetail.email,
                phone: data.GetStudentDetail.phone,
                address: data.GetStudentDetail.address,
                emergency_contact_name: data.GetStudentDetail.emergency_contact_name,
                emergency_contact_phone: data.GetStudentDetail.emergency_contact_phone,
                grade: data.GetStudentDetail.grade?.grade_id?.toString() || "",
                gender: "undefined",
            });
            setIsEditing(true);
        }
    }, [data]);

    const handleCancelEdit = useCallback(() => {
        setIsEditing(false);
        setEditedData({});
    }, []);

    const handleSave = useCallback(() => {
        // Validation
        if (!editedData.first_name?.trim()) {
            toast({
                title: "Validation Error",
                description: "First name is required",
                variant: "destructive",
            });
            return;
        }

        if (!editedData.last_name?.trim()) {
            toast({
                title: "Validation Error",
                description: "Last name is required",
                variant: "destructive",
            });
            return;
        }

        if (!editedData.email?.trim()) {
            toast({
                title: "Validation Error",
                description: "Email is required",
                variant: "destructive",
            });
            return;
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(editedData.email)) {
            toast({
                title: "Validation Error",
                description: "Please enter a valid email address",
                variant: "destructive",
            });
            return;
        }

        if (!editedData.phone?.trim()) {
            toast({
                title: "Validation Error",
                description: "Phone number is required",
                variant: "destructive",
            });
            return;
        }

        if (editedData.student_id && editedData.first_name && editedData.last_name) {
            updateStudent({
                input: editedData as UpdateStudentInput,
            });
        }
    }, [editedData, updateStudent, toast]);

    const handleFieldChange = useCallback((field: keyof UpdateStudentInput, value: string) => {
        setEditedData((prev) => ({ ...prev, [field]: value }));
    }, []);

    // Memoized computed values
    const isModalOpen = useMemo(() => isOpen && modalType === ModalType.joinClass, [isOpen, modalType]);
    const studentData = useMemo(() => data?.GetStudentDetail, [data]);

    // NOW handle loading and error states AFTER all hooks
    if (!id || loading) {
        return <LoadingPage />
    }

    if (error) {
        return <ErrorPage message={error} />
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <JoinClassModal
                    open={isModalOpen}
                    onOpenChange={handleClose}
                    registrationInfo={prepareRegistrationCardInfoProps(data as GetStudentDetailResponse)}
                />

                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="mb-6 hover:bg-white hover:shadow-md transition-all"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Students
                </Button>

                {/* Edit Mode Banner */}
                {isEditing && (
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl shadow-lg mb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                <p className="font-semibold">Edit Mode Active</p>
                                <p className="text-sm text-white/90">Make your changes and click Save to update</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modern Student Card */}
                <div className={`bg-white rounded-2xl shadow-xl overflow-hidden border-2 transition-all ${isEditing ? 'border-amber-400' : 'border-gray-200'}`}>
                    {/* Header with Gradient */}
                    <div className="relative h-48 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>

                        {/* Decorative Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                                </pattern>
                                <rect width="100%" height="100%" fill="url(#grid)" />
                            </svg>
                        </div>
                    </div>

                    {/* Profile Section */}
                    <div className="relative px-6 pb-6">
                        {/* Avatar */}
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
                            <div className="flex items-end gap-6">
                                <div className="-mt-16 relative">
                                    <div className="w-32 h-32 rounded-2xl border-4 border-white bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-5xl font-bold text-white shadow-2xl">
                                        {studentData?.first_name?.[0]}{studentData?.last_name?.[0]}
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full"></div>
                                </div>

                                <div className="pb-4">
                                    {isEditing ? (
                                        <div className="space-y-2">
                                            <div className="flex gap-2">
                                                <Input
                                                    value={editedData.first_name || ""}
                                                    onChange={(e) => handleFieldChange("first_name", e.target.value)}
                                                    className="text-2xl font-bold h-12"
                                                    placeholder="First Name"
                                                />
                                                <Input
                                                    value={editedData.last_name || ""}
                                                    onChange={(e) => handleFieldChange("last_name", e.target.value)}
                                                    className="text-2xl font-bold h-12"
                                                    placeholder="Last Name"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                            {studentData?.first_name} {studentData?.last_name}
                                        </h1>
                                    )}
                                    <div className="flex flex-wrap gap-2">
                                        {studentData?.grade && (
                                            <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200">
                                                <GraduationCap className="w-3 h-3 mr-1" />
                                                Grade {studentData.grade.grade_name}
                                            </Badge>
                                        )}
                                        {studentData?.center && (
                                            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                                                <BookOpen className="w-3 h-3 mr-1" />
                                                {studentData.center.center_name}
                                            </Badge>
                                        )}
                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                                            Active Student
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="mt-4 sm:mt-0 flex gap-2">
                                {!isEditing ? (
                                    <>
                                        <Button
                                            variant="outline"
                                            className="hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300"
                                            onClick={handleEditClick}
                                        >
                                            <Edit2 className="w-4 h-4 mr-2" />
                                            Edit Profile
                                        </Button>
                                        <Button
                                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                        >
                                            Contact
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            variant="outline"
                                            className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                                            onClick={handleCancelEdit}
                                            disabled={isUpdating}
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            Cancel
                                        </Button>
                                        <Button
                                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                            onClick={handleSave}
                                            disabled={isUpdating}
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            {isUpdating ? "Saving..." : "Save Changes"}
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Quick Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                            {/* Email */}
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-500 font-medium">Email</p>
                                    {isEditing ? (
                                        <Input
                                            type="email"
                                            value={editedData.email || ""}
                                            onChange={(e) => handleFieldChange("email", e.target.value)}
                                            className="mt-1 h-8 text-sm"
                                            placeholder="Email"
                                        />
                                    ) : (
                                        <p className="text-sm font-semibold text-gray-900 truncate">{studentData?.email}</p>
                                    )}
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-5 h-5 text-green-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-500 font-medium">Phone</p>
                                    {isEditing ? (
                                        <Input
                                            type="tel"
                                            value={editedData.phone || ""}
                                            onChange={(e) => handleFieldChange("phone", e.target.value)}
                                            className="mt-1 h-8 text-sm"
                                            placeholder="Phone"
                                        />
                                    ) : (
                                        <p className="text-sm font-semibold text-gray-900">{studentData?.phone}</p>
                                    )}
                                </div>
                            </div>

                            {/* Date of Birth */}
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                                    <Calendar className="w-5 h-5 text-purple-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-500 font-medium">Date of Birth</p>
                                    {isEditing ? (
                                        <Input
                                            type="date"
                                            value={editedData.dob ? new Date(editedData.dob).toISOString().split('T')[0] : ""}
                                            onChange={(e) => handleFieldChange("dob", e.target.value)}
                                            className="mt-1 h-8 text-sm"
                                        />
                                    ) : (
                                        <p className="text-sm font-semibold text-gray-900">
                                            {studentData?.dob ? new Date(studentData.dob).toLocaleDateString() : "-"}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modern Tabs */}
                    <Tabs defaultValue="profile" className="px-6 pb-8">
                        <TabsList className="inline-flex h-12 items-center justify-center rounded-xl bg-gray-100 p-1 mb-6">
                            <TabsTrigger
                                value="profile"
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-6 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
                            >
                                <UserCircle className="w-4 h-4 mr-2" />
                                Profile
                            </TabsTrigger>
                            <TabsTrigger
                                value="classes"
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-6 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
                            >
                                <BookOpen className="w-4 h-4 mr-2" />
                                Classes ({studentData?.classes?.length || 0})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="profile" className="mt-0">
                            <StudentProfile
                                student={toStudentProps(data as GetStudentDetailResponse).student}
                                isEditing={isEditing}
                                editedData={editedData}
                                onFieldChange={handleFieldChange}
                            />
                        </TabsContent>

                        <TabsContent value="classes" className="mt-0">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Enrolled Classes</h3>
                                    <p className="text-sm text-gray-600">Manage student class enrollment</p>
                                </div>
                                <Button
                                    onClick={() => openModal(ModalType.joinClass)}
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Join Class
                                </Button>
                            </div>
                            <ClassesList classes={toClassesProps(data as GetStudentDetailResponse).classes} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

