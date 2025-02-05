import { SelectItem } from "@/components/drake_libs/ui/select";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { Label } from "@/components/drake_libs/ui/label"
import React from "react";
import { cn } from "@/lib/utils";


export const GradeDiv = ({ className, ...props }: React.ComponentProps<"div">): React.ReactNode => {
    return (
        <>
            <div className={cn("space-y-2", className)} {...props}>
                <Label htmlFor="gradeClass">Grade Class</Label>
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Select grade class" />
                    </SelectTrigger>
                    <SelectContent>
                        {[9, 10, 11, 12].map((grade) => (
                            <SelectItem key={grade} value={`${grade}`}>
                                Grade {grade}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </>
    )
}

GradeDiv.displayName = "GradeDiv"


