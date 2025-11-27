"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/drake_libs/ui/card";
import { Button } from "@/components/drake_libs/ui/button";
import { Input } from "@/components/drake_libs/ui/input";
import { Label } from "@/components/drake_libs/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/drake_libs/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/drake_libs/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/drake_libs/ui/table";
import { useToast } from "@/components/hooks/use-toast";
import { Calendar, Edit, Trash2, Plus } from "lucide-react";
import { useGetListSemesters, useCreateSemester, useUpdateSemester, useDeleteSemester } from "@/hooks/semesters";
import type { Semester } from "@/models/semesters/entity";
import { format } from "date-fns";

export function SemesterManagement() {
  const { toast } = useToast();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState<Semester | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    semester_name: "",
    start_date: "",
    end_date: "",
  });

  // Fetch semesters
  const { data, isLoading, error } = useGetListSemesters({
    page: 1,
    limit: 100,
    order_by: "start_date desc",
  });

  const semesters = data?.ListAllSemesters || [];

  // Create mutation
  const createMutation = useCreateSemester({
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Semester created successfully!",
      });
      setCreateDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create semester",
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateMutation = useUpdateSemester({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Semester updated successfully!",
      });
      setEditDialogOpen(false);
      resetForm();
      setSelectedSemester(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update semester",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useDeleteSemester({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Semester deleted successfully!",
      });
      setDeleteDialogOpen(false);
      setSelectedSemester(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete semester",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      semester_name: "",
      start_date: "",
      end_date: "",
    });
  };

  const handleCreate = () => {
    if (!formData.semester_name || !formData.start_date || !formData.end_date) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    createMutation.mutate({
      input: {
        semester_name: formData.semester_name,
        start_date: formData.start_date,
        end_date: formData.end_date,
      },
    });
  };

  const handleEdit = (semester: Semester) => {
    setSelectedSemester(semester);
    setFormData({
      semester_name: semester.semester_name,
      start_date: semester.start_date.split("T")[0],
      end_date: semester.end_date.split("T")[0],
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedSemester) return;

    if (!formData.semester_name || !formData.start_date || !formData.end_date) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    updateMutation.mutate({
      input: {
        semester_id: selectedSemester.semester_id,
        semester_name: formData.semester_name,
        start_date: formData.start_date,
        end_date: formData.end_date,
      },
    });
  };

  const handleDeleteClick = (semester: Semester) => {
    setSelectedSemester(semester);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (!selectedSemester) return;

    deleteMutation.mutate({
      input: {
        semester_id: selectedSemester.semester_id,
      },
    });
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading semesters...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-red-600">Error loading semesters: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Semester Management
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Manage academic semesters and terms
                  </p>
                </div>
              </div>
              <Button
                onClick={() => {
                  resetForm();
                  setCreateDialogOpen(true);
                }}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Semester
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            {semesters.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No semesters found</p>
                <p className="text-gray-400 text-sm mt-2">Create your first semester to get started</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold text-purple-700">ID</TableHead>
                    <TableHead className="font-bold text-purple-700">Semester Name</TableHead>
                    <TableHead className="font-bold text-purple-700">Start Date</TableHead>
                    <TableHead className="font-bold text-purple-700">End Date</TableHead>
                    <TableHead className="font-bold text-purple-700 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {semesters.map((semester) => (
                    <TableRow key={semester.semester_id} className="hover:bg-purple-50/50 transition-colors">
                      <TableCell className="font-medium">{semester.semester_id}</TableCell>
                      <TableCell className="font-semibold text-gray-800">{semester.semester_name}</TableCell>
                      <TableCell>{formatDate(semester.start_date)}</TableCell>
                      <TableCell>{formatDate(semester.end_date)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(semester)}
                            className="hover:bg-blue-50 hover:border-blue-300"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClick(semester)}
                            className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Create Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Semester</DialogTitle>
              <DialogDescription>Add a new academic semester to the system</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="create-name">Semester Name</Label>
                <Input
                  id="create-name"
                  placeholder="e.g., Fall 2024"
                  value={formData.semester_name}
                  onChange={(e) => setFormData({ ...formData, semester_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-start">Start Date</Label>
                <Input
                  id="create-start"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-end">End Date</Label>
                <Input
                  id="create-end"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={createMutation.isPending}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {createMutation.isPending ? "Creating..." : "Create Semester"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Semester</DialogTitle>
              <DialogDescription>Update semester information</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Semester Name</Label>
                <Input
                  id="edit-name"
                  placeholder="e.g., Fall 2024"
                  value={formData.semester_name}
                  onChange={(e) => setFormData({ ...formData, semester_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-start">Start Date</Label>
                <Input
                  id="edit-start"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-end">End Date</Label>
                <Input
                  id="edit-end"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={updateMutation.isPending}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {updateMutation.isPending ? "Updating..." : "Update Semester"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the semester "{selectedSemester?.semester_name}".
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
