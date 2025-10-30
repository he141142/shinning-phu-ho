import { Button } from "@/components/drake_libs/ui/button";
import { Card, CardContent, CardHeader } from "@/components/drake_libs/ui/card";
import { Badge } from "@/components/drake_libs/ui/badge";
import OnlineStatus from "@/components/common/online";
import {
  MouseEvent,
  MouseEventHandler,
  useMemo,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/router";
import {
  ErrorPage,
  LoadingPage,
} from "@/components/drake_libs/component/loading-page";
import { PaginationNav } from "@/components/drake_libs/component/pagination";
import {
  Search,
  UserPlus,
  Eye,
  Edit,
  Trash2,
  Filter,
  Grid3x3,
  List,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Input } from "@/components/drake_libs/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/drake_libs/ui/select";
import { useGetListStudent } from "@/hooks/students";

export default function StudentManagements() {
  const router = useRouter();

  const page = router.query?.page ? parseInt(router.query.page as string) : 1;
  const [limit, setLimit] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedGrade, setSelectedGrade] = useState<string>("all");

  const onSubmitFunc = useCallback(() => {
    router.push("/students/create");
  }, [router]);

  const getTotalPage = useCallback((total_item: number, per_page: number) => {
    return Math.ceil(total_item / per_page);
  }, []);

  // Fetch data using React Query hook
  const { data: queryData, error, isLoading } = useGetListStudent({
    page,
    limit,
    order_by: "id desc",
    where: {},
  });

  // Extract data from query response
  const data = useMemo(() => {
    if (!queryData) return undefined;
    return queryData;
  }, [queryData]);

  const handlePageChange = useCallback(
    async (page: number) => {
      router.push(`/student_managements?page=${page}`);
    },
    [router]
  );

  const handleOnView = useCallback(
    (id: number) => {
      router.push(`/student-info/${id}`);
    },
    [router]
  );

  const handleEdit = useCallback(
    (id: number) => {
      router.push(`/student-info/${id}?mode=edit`);
    },
    [router]
  );

  const handleDelete = useCallback((id: number) => {
    // TODO: Implement delete confirmation modal
    console.log("Delete student:", id);
  }, []);

  // Filter students based on search and grade
  const filteredStudents = useMemo(() => {
    if (!data?.GetListStudent.data) return [];

    return data.GetListStudent.data.filter((student) => {
      const matchesSearch =
        searchQuery === "" ||
        `${student.first_name} ${student.last_name}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesGrade =
        selectedGrade === "all" || student.grade?.grade_name === selectedGrade;

      return matchesSearch && matchesGrade;
    });
  }, [data, searchQuery, selectedGrade]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return <ErrorPage message={error.message || "Failed to load students"} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Modern Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Student Management
              </h1>
              <p className="text-gray-600 text-sm">
                Manage and organize your students efficiently
              </p>
            </div>
            <Button
              onClick={onSubmitFunc}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </div>

          {/* Filters and Controls */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
              />
            </div>

            {/* Grade Filter */}
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger className="w-full md:w-48 bg-gray-50 border-gray-200">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                <SelectItem value="1">Grade 1</SelectItem>
                <SelectItem value="2">Grade 2</SelectItem>
                <SelectItem value="3">Grade 3</SelectItem>
                <SelectItem value="4">Grade 4</SelectItem>
                <SelectItem value="5">Grade 5</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-white shadow-sm" : ""}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-white shadow-sm" : ""}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            {/* Items per page */}
            <Select
              value={limit.toString()}
              onValueChange={(val) => setLimit(parseInt(val))}
            >
              <SelectTrigger className="w-full md:w-32 bg-gray-50 border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="8">8 per page</SelectItem>
                <SelectItem value="12">12 per page</SelectItem>
                <SelectItem value="24">24 per page</SelectItem>
                <SelectItem value="48">48 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Count */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {filteredStudents.length} of{" "}
              {data?.GetListStudent.total || 0} students
            </span>
            <span>
              Page {page} of{" "}
              {getTotalPage(data?.GetListStudent.total || 0, limit)}
            </span>
          </div>
        </div>

        {/* Students Grid/List View */}
        {filteredStudents.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No students found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "flex flex-col gap-4"
            }
          >
            {filteredStudents.map((student) => (
              <Card
                key={student.id}
                className={`group relative overflow-hidden bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 ${
                  viewMode === "list" ? "flex-row" : ""
                }`}
              >
                {/* Gradient Top Border */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {student.first_name[0]}
                        {student.last_name[0]}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {student.first_name} {student.last_name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200">
                            Grade{" "}
                            {student.grade ? student.grade.grade_name : "-"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <OnlineStatus />
                  </div>
                </CardHeader>

                <CardContent className="space-y-2">
                  {/* Student Info */}
                  <div className="space-y-2 text-sm">
                    {student.email && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="truncate">{student.email}</span>
                      </div>
                    )}
                    {student.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{student.phone}</span>
                      </div>
                    )}
                    {student.address && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="truncate">{student.address}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-500">Class: </span>
                      <span className="text-xs font-medium text-gray-700">
                        {!student.classes || student.classes.length === 0
                          ? "No class assigned"
                          : student.classes[0].class_name}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOnView(student.id)}
                      className="flex-1 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(student.id)}
                      className="flex-1 hover:bg-green-50 hover:text-green-600 hover:border-green-300 transition-colors"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(student.id)}
                      className="hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredStudents.length > 0 && (
          <div className="mt-8">
            <PaginationNav
              currentPage={page}
              totalPages={getTotalPage(data?.GetListStudent.total || 0, limit)}
              handlePageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
