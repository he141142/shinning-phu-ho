import React from "react";
import { Textarea } from "../drake_libs/ui/textarea";
import { Label } from "../drake_libs/ui/label";
import { BasicElementProps, LabelMetadata } from "./custom.dropdown";
import { cn } from "@/lib/utils";


export interface CustomTextAreaProps {
    LabelMetadata?: LabelMetadata
    BasicElementProps: BasicElementProps
    PlaceHolder?: string
    resize?: boolean
    OnChange ?: (value: string) => void;
}

export const CustomTextArea: React.FC<CustomTextAreaProps> = React.memo(({ LabelMetadata, BasicElementProps, PlaceHolder,resize, OnChange }) => {
    return (
        <>
            {LabelMetadata && <Label htmlFor={LabelMetadata.Key}>{LabelMetadata.Display}</Label>}
            <Textarea
                className={cn(BasicElementProps?.ClassName, !resize && "resize-none")}
                id={BasicElementProps?.Id}
                placeholder={PlaceHolder || ""}
                onChange={(e) => OnChange && OnChange(e.target.value)}
            />
        </>
    )
})