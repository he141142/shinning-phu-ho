"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/drake_libs/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/drake_libs/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/drake_libs/ui/popover"
import { UseFetch } from "@/components/hooks/fetch-data"
import { HOST } from "@/static/env"
import { ClassInfo, GetListClassResponse } from "@/models/class/class"


export const ClassesComboBox = React.memo(({ classes, onselectClass, selectedClass }: { 
    classes: ClassInfo[]
    , onselectClass: (c: ClassInfo) => void ,
    selectedClass: ClassInfo | null
}) => {
    const [open, setOpen] = React.useState(false)
    const selectedIDRef = React.useRef<number | null>(selectedClass?.Id || null);


    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between h-full"
                >
                    {selectedIDRef?.current
                        ? classes?.find((c) => c.Id === selectedIDRef?.current)?.Name
                        : "Select Class..."}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search framework..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                            {classes?.map((c) => (
                                <CommandItem
                                    key={c.Id}
                                    value={String(c.Name)}
                                    onSelect={(currentValue) => {
                                        if (currentValue === c.Name) {
                                            onselectClass(c);
                                            selectedIDRef.current = c.Id;
                                        }
                                        setOpen(false)
                                    }}
                                >
                                    {c.Name}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            selectedIDRef?.current === c.Id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
});
