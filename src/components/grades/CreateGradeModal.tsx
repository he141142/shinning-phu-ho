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
import { useCreateGrade } from "@/hooks/grades";
import { GradeForm, type GradeFormData } from "./GradeForm";

interface CreateGradeModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateGradeModal({ open, onClose }: CreateGradeModalProps) {
  const { toast } = useToast();
  const { mutate: createGrade, isPending } = useCreateGrade();

  const handleSubmit = (data: GradeFormData) => {
    createGrade(
      { input: { grade_name: data.grade_name } },
      {
        onSuccess: (response) => {
          toast({
            ...RenderSuccessToast(
              response.message || "Grade created successfully!"
            ),
          });
          onClose();
        },
        onError: (error) => {
          toast({
            ...RenderFailedToast(
              error.message || "Failed to create grade. Please try again."
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
          <DialogTitle className="text-2xl font-bold">
            Create New Grade
          </DialogTitle>
          <DialogDescription className="text-base">
            Add a new grade level to the system
          </DialogDescription>
        </DialogHeader>

        <GradeForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isPending}
          submitLabel="Create Grade"
        />
      </DialogContent>
    </Dialog>
  );
}
