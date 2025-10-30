"use client";

import { CheckCircle2, GraduationCap } from "lucide-react";
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
import { useCreateClass } from "@/hooks/classes";
import type { CreateClassInput } from "@/models/class/CreateClass";

interface CreateClassConfirmModalProps {
  open: boolean;
  onClose: () => void;
  classData: CreateClassInput;
  onSuccess: () => void;
}

export function CreateClassConfirmModal({
  open,
  onClose,
  classData,
  onSuccess,
}: CreateClassConfirmModalProps) {
  const { toast } = useToast();
  const { mutate: createClass, isPending } = useCreateClass();

  const handleConfirm = () => {
    createClass(
      { input: classData },
      {
        onSuccess: (response) => {
          toast({
            ...RenderSuccessToast(
              response.message || "Class created successfully!"
            ),
          });
          onSuccess();
          onClose();
        },
        onError: (error) => {
          toast({
            ...RenderFailedToast(
              error.message || "Failed to create class. Please try again."
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
          <div className="flex items-center gap-2 text-primary">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Create Class
            </DialogTitle>
          </div>
          <DialogDescription className="text-base">
            Are you ready to create this class?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 p-5 space-y-3 border border-blue-100">
            <div className="space-y-2">
              <p className="text-sm text-gray-500 font-medium">Class Name</p>
              <p className="font-semibold text-gray-900 text-lg">
                {classData.class_name || "Unnamed Class"}
              </p>
            </div>

            {classData.description && (
              <div className="space-y-2">
                <p className="text-sm text-gray-500 font-medium">Description</p>
                <p className="text-gray-700">{classData.description}</p>
              </div>
            )}

            {classData.grade_id && (
              <div className="space-y-2">
                <p className="text-sm text-gray-500 font-medium">Grade</p>
                <p className="text-gray-700">Grade {classData.grade_id}</p>
              </div>
            )}

            {(classData.start_date || classData.end_date) && (
              <div className="grid grid-cols-2 gap-3">
                {classData.start_date && (
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500 font-medium">Start Date</p>
                    <p className="text-gray-700 text-sm">
                      {new Date(classData.start_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {classData.end_date && (
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500 font-medium">End Date</p>
                    <p className="text-gray-700 text-sm">
                      {new Date(classData.end_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="min-w-[100px]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className="min-w-[140px] bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md hover:shadow-lg transition-all"
          >
            {isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Confirm
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
