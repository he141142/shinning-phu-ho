"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/drake_libs/ui/dialog";
import { useToast } from "@/components/hooks/use-toast";
import {
  RenderFailedToast,
  RenderSuccessToast,
} from "@/components/drake_libs/customs/custom-toast";
import { useUpdateGrade } from "@/hooks/grades";
import { GradeForm, type GradeFormData } from "./GradeForm";
import type { Grade } from "@/models/grades/ListAllGrades";

interface EditGradeModalProps {
  open: boolean;
  onClose: () => void;
  grade: Grade | null;
}

export function EditGradeModal({ open, onClose, grade }: EditGradeModalProps) {
  const { toast } = useToast();
  const { mutate: updateGrade, isPending } = useUpdateGrade();

  const handleSubmit = (data: GradeFormData) => {
    if (!grade) return;

    updateGrade(
      {
        input: {
          grade_id: grade.grade_id,
          grade_name: data.grade_name,
        },
      },
      {
        onSuccess: (response) => {
          toast({
            ...RenderSuccessToast(
              response.message || "Grade updated successfully!"
            ),
          });
          onClose();
        },
        onError: (error) => {
          toast({
            ...RenderFailedToast(
              error.message || "Failed to update grade. Please try again."
            ),
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold">Edit Grade</DialogTitle>
          <DialogDescription className="text-base">
            Update the grade information
          </DialogDescription>
        </DialogHeader>

        <GradeForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          defaultValues={
            grade ? { grade_name: grade.grade_name } : undefined
          }
          isSubmitting={isPending}
          submitLabel="Update Grade"
        />
      </DialogContent>
    </Dialog>
  );
}
