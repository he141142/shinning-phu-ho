import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";

const editTeacher = z.object({
  teacher_id: z
    .number()
    .min(0, "teacher must not be blank")
    .nullable()
    .optional(),
  teacher_name: z.string().min(2, "Name too short"),
});

const editClassSchema = z.object({
  editedClassName: z.string().min(2, "Name too short"),
  editedTeacherId: z
    .number()
    .min(0, "teacher must not be blank")
    .nullable()
    .optional(),
  editedSemesterId: z.number().min(0, "semester must not be blank").nullable(),
  editedGradeId: z
    .number()
    .min(0, "grade must not be blank")
    .nullable()
    .optional(),
  editTeacher: editTeacher.nullable().optional(),
});

type ClassSchema = z.infer<typeof editClassSchema>;

// Hook to initialize the form - this should be called inside the component
const useClassSchemaEdit = () => {
  return useForm<ClassSchema>({
    resolver: zodResolver(editClassSchema),
    defaultValues: {
      editedClassName: "",
      editedTeacherId: null,
      editedSemesterId: null,
      editedGradeId: null,
    },
  });
};

export type { ClassSchema };
export { useClassSchemaEdit, editClassSchema };
