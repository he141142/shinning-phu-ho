"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  PlusIcon,
  SearchIcon,
  EditIcon,
  TrashIcon,
} from "lucide-react";
import { Button } from "@/components/drake_libs/ui/button";
import { Input } from "@/components/drake_libs/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/drake_libs/ui/card";
import { Badge } from "@/components/drake_libs/ui/badge";
import { ErrorPage } from "@/components/drake_libs/component/loading-page";
import { useGetAllGrades } from "@/hooks/grades";
import { CreateGradeModal } from "@/components/grades/CreateGradeModal";
import { EditGradeModal } from "@/components/grades/EditGradeModal";
import { DeleteConfirmModal } from "@/components/grades/DeleteConfirmModal";
import type { Grade } from "@/models/grades/ListAllGrades";

export default function GradesManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);

  // Fetch grades data
  const { data, error, isLoading } = useGetAllGrades();

  // Filter grades based on search query
  const filteredGrades = useMemo(() => {
    if (!data?.ListAllGrades) return [];
    if (!searchQuery.trim()) return data.ListAllGrades;

    const query = searchQuery.toLowerCase();
    return data.ListAllGrades.filter((grade) =>
      grade.grade_name.toLowerCase().includes(query)
    );
  }, [data?.ListAllGrades, searchQuery]);

  const handleEdit = (grade: Grade) => {
    setSelectedGrade(grade);
    setIsEditModalOpen(true);
  };

  const handleDelete = (grade: Grade) => {
    setSelectedGrade(grade);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedGrade(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading grades...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorPage message={error.message || "Failed to load grades"} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Modals */}
      <CreateGradeModal
        open={isCreateModalOpen}
        onClose={handleCloseModals}
      />
      <EditGradeModal
        open={isEditModalOpen}
        onClose={handleCloseModals}
        grade={selectedGrade}
      />
      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onClose={handleCloseModals}
        grade={selectedGrade}
      />

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <GraduationCap className="w-8 h-8" />
              Grade Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and view all grade levels (
              {data?.ListAllGrades?.length || 0} total)
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
            size="lg"
          >
            <PlusIcon className="w-5 h-5" />
            Add Grade
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder="Search grades by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-6 text-base shadow-sm"
          />
        </div>
      </motion.div>

      {/* Empty State */}
      {filteredGrades.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <GraduationCap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No grades found</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery
              ? "Try adjusting your search criteria"
              : "Get started by adding your first grade level"}
          </p>
          {!searchQuery && (
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Your First Grade
            </Button>
          )}
        </motion.div>
      )}

      {/* Grades Grid */}
      {filteredGrades.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {filteredGrades.map((grade, index) => (
            <motion.div
              key={grade.grade_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-primary" />
                      <Badge variant="secondary" className="text-xs">
                        ID: {grade.grade_id}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-xl mb-4 truncate">
                    {grade.grade_name}
                  </CardTitle>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(grade)}
                    >
                      <EditIcon className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDelete(grade)}
                    >
                      <TrashIcon className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Stats Footer */}
      {filteredGrades.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 p-4 bg-muted/50 rounded-lg"
        >
          <div className="flex flex-wrap gap-4 justify-center text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span>
                Showing {filteredGrades.length} of{" "}
                {data?.ListAllGrades?.length || 0} grades
              </span>
            </div>
            {searchQuery && (
              <div className="flex items-center gap-2">
                <SearchIcon className="w-4 h-4" />
                <span>Search: &quot;{searchQuery}&quot;</span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
