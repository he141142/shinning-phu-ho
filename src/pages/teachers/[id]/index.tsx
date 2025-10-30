import { Card } from "@/components/drake_libs/ui/card";
import { useRouter } from "next/router";
import { Button } from "@/components/drake_libs/ui/button";
import {
  Mail,
  Phone,
  Calendar,
  User,
  Briefcase,
  Users,
  School,
  ArrowLeft,
  Edit2,
  Save,
  X,
  MapPin,
  BookOpen,
  UserCircle,
} from "lucide-react";
import { LoadingPage, ErrorPage } from "@/components/drake_libs/component/loading-page";
import { Teacher } from "@/models/teachers/ListTeachers";
import { ClassSection } from "./components/classsection";
import { useState, useCallback, useMemo } from "react";
import { Badge } from "@/components/drake_libs/ui/badge";
import { Input } from "@/components/drake_libs/ui/input";
import { useToast } from "@/components/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { useGetTeacherDetail, useUpdateTeacher } from "@/hooks/teachers";
import { UpdateTeacherInput } from "@/models/teachers/UpdateTeacher/UpdateTeacher";

export default function TeacherDetail() {
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Partial<UpdateTeacherInput>>({});

  // Parse teacher ID from router query
  const teacherId = useMemo(() => {
    const id = router.query.id;
    return id ? parseInt(id as string, 10) : 0;
  }, [router.query.id]);

  // Fetch data using React Query hook
  const { data: queryData, error, isLoading, refetch } = useGetTeacherDetail(teacherId);

  // Extract teacher data from the query response
  const teacher = useMemo(() => {
    return queryData?.GetTeacherDetail;
  }, [queryData]);

  // Update mutation
  const { mutate: updateTeacher, isPending: isUpdating } = useUpdateTeacher({
    onSuccess: (response) => {
      toast({
        title: "Success",
        description: "Teacher information updated successfully",
      });
      setIsEditing(false);
      setEditedData({});
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update teacher information",
        variant: "destructive",
      });
    },
  });

  // Callbacks
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleEditClick = useCallback(() => {
    if (teacher) {
      setEditedData({
        teacher_id: teacher.teacher_id,
        first_name: teacher.first_name,
        last_name: teacher.last_name,
        email: teacher.email,
        phone_number: teacher.phone_number,
        address: teacher.address,
      });
      setIsEditing(true);
    }
  }, [teacher]);

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

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editedData.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    if (!editedData.phone_number?.trim()) {
      toast({
        title: "Validation Error",
        description: "Phone number is required",
        variant: "destructive",
      });
      return;
    }

    // Submit the update
    if (
      editedData.teacher_id &&
      editedData.first_name &&
      editedData.last_name &&
      editedData.email &&
      editedData.phone_number
    ) {
      updateTeacher({
        input: editedData as UpdateTeacherInput,
      });
    }
  }, [editedData, updateTeacher, toast]);

  const handleFieldChange = useCallback(
    (field: keyof UpdateTeacherInput, value: string) => {
      setEditedData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // Handle loading and error states
  if (!router.query.id || isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return <ErrorPage message={error.message || "Failed to load teacher details"} />;
  }

  if (!teacher) {
    return <ErrorPage message="Teacher not found" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-6 hover:bg-white hover:shadow-md transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Teachers
        </Button>

        {/* Edit Mode Banner */}
        {isEditing && (
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl shadow-lg mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <p className="font-semibold">Edit Mode Active</p>
                <p className="text-sm text-white/90">
                  Make your changes and click Save to update
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Modern Teacher Card */}
        <div
          className={`bg-white rounded-2xl shadow-xl overflow-hidden border-2 transition-all ${
            isEditing ? "border-amber-400" : "border-gray-200"
          }`}
        >
          {/* Header with Gradient */}
          <div className="relative h-48 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>

            {/* Decorative Pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                  />
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
                  <div className="w-32 h-32 rounded-2xl border-4 border-white bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-5xl font-bold text-white shadow-2xl">
                    {teacher?.first_name?.[0]}
                    {teacher?.last_name?.[0]}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full"></div>
                </div>

                <div className="pb-4">
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          value={editedData.first_name || ""}
                          onChange={(e) =>
                            handleFieldChange("first_name", e.target.value)
                          }
                          className="text-2xl font-bold h-12"
                          placeholder="First Name"
                        />
                        <Input
                          value={editedData.last_name || ""}
                          onChange={(e) =>
                            handleFieldChange("last_name", e.target.value)
                          }
                          className="text-2xl font-bold h-12"
                          placeholder="Last Name"
                        />
                      </div>
                    </div>
                  ) : (
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {teacher?.first_name} {teacher?.last_name}
                    </h1>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {teacher?.center && (
                      <Badge className="bg-cyan-100 text-cyan-700 hover:bg-cyan-200">
                        <School className="w-3 h-3 mr-1" />
                        {teacher.center.center_name}
                      </Badge>
                    )}
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                      Active Teacher
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
                      className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                      onClick={handleEditClick}
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {/* Email */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 font-medium">Email</p>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={editedData.email || ""}
                      onChange={(e) =>
                        handleFieldChange("email", e.target.value)
                      }
                      className="mt-1 h-8 text-sm"
                      placeholder="Email"
                    />
                  ) : (
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {teacher?.email}
                    </p>
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
                      value={editedData.phone_number || ""}
                      onChange={(e) =>
                        handleFieldChange("phone_number", e.target.value)
                      }
                      className="mt-1 h-8 text-sm"
                      placeholder="Phone"
                    />
                  ) : (
                    <p className="text-sm font-semibold text-gray-900">
                      {teacher?.phone_number || "-"}
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
                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-6 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
              >
                <UserCircle className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="classes"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-6 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Classes ({teacher?.classes?.length || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-0">
              <TeacherProfile
                teacher={teacher}
                isEditing={isEditing}
                editedData={editedData}
                onFieldChange={handleFieldChange}
              />
            </TabsContent>

            <TabsContent value="classes" className="mt-0">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Teaching Classes
                </h3>
                <p className="text-sm text-gray-600">
                  Manage teacher class assignments
                </p>
              </div>
              <ClassSection
                classes={teacher.classes}
                onDropout={() => {
                  refetch();
                }}
                teacherID={teacher.teacher_id}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// Teacher Profile Component
interface TeacherProfileProps {
  teacher: Teacher | undefined;
  isEditing: boolean;
  editedData: Partial<UpdateTeacherInput>;
  onFieldChange: (field: keyof UpdateTeacherInput, value: string) => void;
}

const TeacherProfile = ({ teacher, isEditing, editedData, onFieldChange }: TeacherProfileProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Contact Information */}
      <Card className="p-6 bg-gradient-to-br from-white to-gray-50 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
        </div>
        <div className="space-y-4">
          <InfoField
            icon={<MapPin className="w-4 h-4" />}
            label="Address"
            value={teacher?.address || "Not specified"}
            isEditing={isEditing}
            editValue={editedData.address}
            onEdit={(val) => onFieldChange("address", val)}
          />
          <InfoField
            icon={<Mail className="w-4 h-4" />}
            label="Email"
            value={teacher?.email || "Not specified"}
            isEditing={false}
          />
          <InfoField
            icon={<Phone className="w-4 h-4" />}
            label="Phone Number"
            value={teacher?.phone_number || "Not specified"}
            isEditing={false}
          />
        </div>
      </Card>

      {/* Professional Information */}
      <Card className="p-6 bg-gradient-to-br from-white to-gray-50 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-cyan-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>
        </div>
        <div className="space-y-4">
          <InfoField
            icon={<School className="w-4 h-4" />}
            label="Center"
            value={teacher?.center?.center_name || "Not assigned"}
            isEditing={false}
          />
          <InfoField
            icon={<School className="w-4 h-4" />}
            label="Total Classes"
            value={teacher?.classes?.length.toString() || "0"}
            isEditing={false}
          />
          <InfoField
            icon={<Users className="w-4 h-4" />}
            label="Total Students"
            value={teacher?.total_students?.toString() || "0"}
            isEditing={false}
          />
        </div>
      </Card>

      {/* Contact Actions */}
      <Card className="p-6 md:col-span-2 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Button
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
            onClick={() => window.open(`mailto:${teacher?.email}`, '_blank')}
          >
            <Mail className="w-4 h-4 mr-2" />
            Send Email
          </Button>
          <Button
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
            onClick={() => window.open(`tel:${teacher?.phone_number}`, '_blank')}
          >
            <Phone className="w-4 h-4 mr-2" />
            Call Teacher
          </Button>
        </div>
      </Card>
    </div>
  );
};

// Info Field Component
interface InfoFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  isEditing: boolean;
  editValue?: string;
  onEdit?: (value: string) => void;
}

const InfoField = ({ icon, label, value, isEditing, editValue, onEdit }: InfoFieldProps) => (
  <div className="flex items-start gap-3 pb-3 border-b border-gray-200 last:border-0">
    <div className="text-gray-600 mt-1">{icon}</div>
    <div className="flex-1">
      <dt className="text-xs text-gray-500 font-medium mb-1">{label}</dt>
      {isEditing && onEdit ? (
        <Input
          value={editValue || ""}
          onChange={(e) => onEdit(e.target.value)}
          className="h-8 text-sm"
          placeholder={label}
        />
      ) : (
        <dd className="text-sm font-semibold text-gray-900">{value}</dd>
      )}
    </div>
  </div>
);
