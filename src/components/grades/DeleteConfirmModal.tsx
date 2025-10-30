"use client";

import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/drake_libs/ui/dialog";
import { Button } from "@/components/drake_libs/ui/button";
import { useToast } from "@/components/hooks/use-toast";
import {
  RenderFailedToast,
  RenderSuccessToast,
} from "@/components/drake_libs/customs/custom-toast";
import { useDeleteGrade } from "@/hooks/grades";
import type { Grade } from "@/models/grades/ListAllGrades";

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  grade: Grade | null;
}

export function DeleteConfirmModal({
  open,
  onClose,
  grade,
}: DeleteConfirmModalProps) {
  const { toast } = useToast();
  const { mutate: deleteGrade, isPending } = useDeleteGrade();

  const handleDelete = () => {
    if (!grade) return;

    deleteGrade(
      { grade_id: grade.grade_id },
      {
        onSuccess: (response) => {
          toast({
            ...RenderSuccessToast(
              response.message || "Grade deleted successfully!"
            ),
          });
          onClose();
        },
        onError: (error) => {
          toast({
            ...RenderFailedToast(
              error.message || "Failed to delete grade. Please try again."
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
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-6 h-6" />
            <DialogTitle className="text-2xl font-bold">
              Delete Grade
            </DialogTitle>
          </div>
          <DialogDescription className="text-base">
            Are you sure you want to delete this grade?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <p className="font-semibold">Grade: {grade?.grade_name}</p>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone. All students and classes associated
              with this grade may be affected.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
            className="min-w-[120px]"
          >
            {isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Deleting...
              </>
            ) : (
              "Delete Grade"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
