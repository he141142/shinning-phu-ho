import { SelectItem } from "@/components/drake_libs/ui/select";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { Label } from "@/components/drake_libs/ui/label"
import React from "react";
import { cn } from "@/lib/utils";
import { useGetAllGrades } from "@/hooks/grades";

export const GradeDiv = ({ className, ...props }: React.ComponentProps<"div">): React.ReactNode => {
    const { data: gradesData, isLoading } = useGetAllGrades();
    const grades = gradesData?.ListAllGrades || [];

    return (
        <>
            <div className={cn("space-y-2", className)} {...props}>
                <Label htmlFor="gradeClass">Grade Class</Label>
                <Select disabled={isLoading}>
                    <SelectTrigger>
                        <SelectValue placeholder={isLoading ? "Loading grades..." : "Select grade class"} />
                    </SelectTrigger>
                    <SelectContent>
                        {grades.map((grade) => (
                            <SelectItem key={grade.grade_id} value={`${grade.grade_id}`}>
                                {grade.grade_name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </>
    )
}

GradeDiv.displayName = "GradeDiv"


