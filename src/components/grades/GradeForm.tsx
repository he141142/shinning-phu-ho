"use client";

import { useForm } from "react-hook-form";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/drake_libs/ui/button";
import { Input } from "@/components/drake_libs/ui/input";
import { Label } from "@/components/drake_libs/ui/label";
import type { Grade } from "@/models/grades/ListAllGrades";

export interface GradeFormData {
  grade_name: string;
}

interface GradeFormProps {
  onSubmit: (data: GradeFormData) => void;
  onCancel: () => void;
  defaultValues?: Partial<GradeFormData>;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function GradeForm({
  onSubmit,
  onCancel,
  defaultValues,
  isSubmitting = false,
  submitLabel = "Save Grade",
}: GradeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GradeFormData>({
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <GraduationCap className="w-5 h-5" />
          Grade Information
        </h3>

        <div className="space-y-2">
          <Label htmlFor="grade_name" className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Grade Name *
          </Label>
          <Input
            id="grade_name"
            {...register("grade_name", {
              required: "Grade name is required",
              minLength: {
                value: 2,
                message: "Grade name must be at least 2 characters",
              },
              maxLength: {
                value: 50,
                message: "Grade name must not exceed 50 characters",
              },
            })}
            placeholder="e.g., Grade 10, Year 1, etc."
            className={errors.grade_name ? "border-red-500" : ""}
            autoFocus
          />
          {errors.grade_name && (
            <p className="text-sm text-red-600">
              {errors.grade_name.message}
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            Enter a descriptive name for the grade level
          </p>
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-w-[120px]"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
}
