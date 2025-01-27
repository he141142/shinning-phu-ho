import React from "react";
import { Button } from "../drake_libs/ui/button";
import { BasicElementProps } from "./custom.dropdown";
import { cn } from "@/lib/utils";


interface MyCustomButtonProps {
    // Add your custom props here
    ElmProps?: BasicElementProps;
    DisplayText: string;
}


export const MyCustomButton: React.FC<MyCustomButtonProps> = React.memo(({ ElmProps, DisplayText }) => {
    return (
        <>
            <Button type="button" className={
                cn(ElmProps && ElmProps?.ClassName)
            }>{DisplayText}</Button>
        </>
    )
});