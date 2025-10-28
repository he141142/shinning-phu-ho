

import { Card, CardHeader, CardTitle, CardContent } from "@/components/drake_libs/ui/card";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Button } from "@/components/drake_libs/ui/button";
import { Mail, Phone, Calendar, User, Briefcase, Users, School, Clock } from "lucide-react";
import { LoadingPage } from "@/components/drake_libs/component/loading-page";
import { UseFetch } from "@/components/hooks/fetch-data";
import { HOST } from "@/static/env";
import { GetTeacherDetail, Teacher } from "@/models/teachers/ListTeachers";
import { ReactNode } from "react";
import { ClassSection } from "./components/classsection";

interface TeacherDetail {
  id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  center: string;
  email: string;
  phone_number: string;
  gender: string;
  dob: string;
  join_date: string;
  total_experience: number;
  total_classes: number;
  current_students: number;
}

export default function TeacherDetail() {
  const router = useRouter();

  // Wait until query is ready
  if (!router.query.id) {
    return <LoadingPage />;
  }

  const id = Number(router.query.id); // Convert it to a number safely

  if (id === 0) {
    return <div>Invalid ID</div>;
  };


  const { data, error, loading, refetch } = UseFetch<GetTeacherDetail>(`${HOST}/query`, `
      query{
        GetTeacherDetail(teacher_id: ${id}){
            address
                teacher_id
                classes{
                    class_id
                    class_name
                    current_enrollment
                    semester{
                        semester_id
                        semester_name
                    }
                }
                address
                email
                first_name
                last_name
                user_account{
                    username
                    user_id
                }
                total_students
                center{
                    center_id
                    center_name
                }
        }
    }
    `);

    let teacher: Teacher | undefined = data?.GetTeacherDetail;

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const onDropout = () => {
    refetch();
  }

  return (
    <motion.div
      className="max-w-5xl mx-auto p-6 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 🖼 Profile Header */}
      <Card className="rounded-lg shadow-lg bg-white hover:shadow-xl transition-all duration-300 relative">
        <div className="h-36 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-lg"></div>
        <div className="relative flex items-center justify-between p-6 -mt-16">
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 bg-gray-200 rounded-full border-4 border-white flex items-center justify-center text-4xl font-bold text-gray-600">
              {teacher?.first_name}
              {teacher?.last_name}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {teacher?.first_name} {teacher?.middle_name || ""} {teacher?.last_name}
              </h1>
              <p className="text-sm text-gray-500">{teacher?.center?.center_name}</p>
            </div>
          </div>
          <Button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all duration-300"
            onClick={() => router.back()}
          >
            Back
          </Button>
        </div>
      </Card>

      {/* 📌 Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 🔹 Personal Info */}
        <Card className="rounded-lg shadow-md bg-white p-6">
          <CardTitle className="text-lg font-semibold mb-4">Personal Information</CardTitle>
          <InfoRow icon={<User />} label="Gender" value={teacher?.gender || "Other"} />
          <InfoRow icon={<Calendar />} label="Date of Birth" value={teacher?.dob || ""} />
          <InfoRow icon={<Mail />} label="Email" value={teacher?.email || ""} />
          <InfoRow icon={<Phone />} label="Phone" value={teacher?.phone_number || ""} />
          <InfoRow icon={<Clock />} label="Join Date" value={teacher?.hire_date || ""} />
        </Card>

        {/* 🔹 Professional Info */}
        <Card className="rounded-lg shadow-md bg-white p-6">
          <CardTitle className="text-lg font-semibold mb-4">Professional Information</CardTitle>
          <InfoRow icon={<Briefcase />} label="Total Experience" value={`N/A years`} />
          <InfoRow icon={<School />} label="Total Classes" value={teacher?.classes ? teacher.classes.length : 0} />
          <InfoRow icon={<Users />} label="Current Students" value={teacher?.total_students || 0} />
        </Card>
      </div>

      {/* 🌍 Social Links (Optional) */}
      <Card className="rounded-lg shadow-md bg-white p-6">
        <CardTitle className="text-lg font-semibold mb-4">Connect</CardTitle>
        <div className="flex space-x-4">
          <motion.a
            href={`mailto:${teacher?.email}`}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all duration-300 flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <Mail className="w-5 h-5" /> Email
          </motion.a>
          <motion.a
            href={`tel:${teacher?.phone_number}`}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all duration-300 flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <Phone className="w-5 h-5" /> Call
          </motion.a>
        </div>
      </Card>

      {/* 📚 Classes Section */
      teacher && 
       <ClassSection classes={teacher.classes} onDropout={()=>{
        refetch();
      }} teacherID={teacher.teacher_id }  />
  
      }
    </motion.div>
  );
}

// 🟢 Reusable InfoRow Component with Icons
const InfoRow = ({ icon, label, value }: { icon: ReactNode; label: string; value: string | number }) => (
  <div className="flex items-center space-x-3 border-b pb-3">
    <div className="text-gray-600">{icon}</div>
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="ml-auto text-sm font-semibold text-gray-900">{value}</dd>
  </div>
);
