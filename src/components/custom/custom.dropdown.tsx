import { Label } from "@/components/drake_libs/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/drake_libs/ui/select";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export interface CustomDropDown {
    Render?: RenderItems;
    Id: string;
    LabelMetadata?: LabelMetadata;
    ElmProps?: DropDownElmProps;
    PlaceHolder: string;
    SelectItemFn?: (item: SelectItemMetadata) => void;
}

export interface SelectItemMetadata {
    Name: string;
    Key: string;
    Display: string;
}

export interface LabelMetadata {
    Key: string;
    Display: string;
}

export type RenderItems = () => Promise<SelectItemMetadata[]>

export interface BasicElementProps {
    Id?: string;
    ClassName?: string;
}

export interface DropDownElmProps extends BasicElementProps {

}


export const CustomDropDown: React.FC<CustomDropDown> = React.memo(({ Render, Id, LabelMetadata, ElmProps, PlaceHolder, SelectItemFn }) => {
    const [dropDownItems, setDropDownItems] = useState<SelectItemMetadata[]>([]);

    useEffect(() => {
        if (Render) Render().then(data => setDropDownItems(data));
    }, [Render]);

    const renderItems = () => dropDownItems.map((value, index) =>
        <SelectItem key={value.Key} value={value.Name}>{value.Display}</SelectItem>);


    const OnValueChange = (value: string) => {
        let item = dropDownItems.find(item => item.Name === value);        
        if (item) {
            OnSelectValue(item);
        }
    };


    const OnSelectValue = (selectItem: SelectItemMetadata) => {
        if (!selectItem) return;
        if (SelectItemFn) {
            SelectItemFn(selectItem);
        }
    };

    return (
        <>
            {LabelMetadata && <Label htmlFor={LabelMetadata?.Key}>{LabelMetadata?.Display}</Label>}
            <Select onValueChange={OnValueChange}>
                <SelectTrigger id={ElmProps?.Id} className={cn("w-full", ElmProps?.ClassName)}>
                    <SelectValue placeholder={PlaceHolder} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {renderItems()}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </>
    )
});