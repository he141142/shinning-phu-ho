import { Input } from "@/components/drake_libs/ui/input";
import { Label } from "@/components/drake_libs/ui/label";
import React, { useCallback, useState } from "react";

type InputProps = {
    id: string;
    name: string;
    label: string;
    type?: string;
    OnChange ?: (value: string) => void;
    ValidateFunction?: (value: string) => string | undefined | null;
}

export const CustomInput: React.FC<InputProps> = React.memo(({ id, name, label, type = "text", OnChange, ValidateFunction }) =>  {
    const [inputValue, setInputValue] = useState<string>("");
    const [error, setError] = useState<string | null| undefined>(null);
    
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);

        // If a validation function is provided, validate the value
        if (ValidateFunction) {
            const validationError = ValidateFunction(value);
            setError(validationError);
        }

        // Pass the value to parent if needed
        if (OnChange) {
            OnChange(value);
        }
    }, [OnChange, ValidateFunction]);
        

    return (
        <>
        <Label htmlFor={name}>{label}</Label>
        <Input 
         id={id}
         name={name}
         type={type}
         value={inputValue}
         onChange={handleInputChange}
         className={`border p-2 w-full ${error ? "border-red-500" : ""}`}
        />
        {error && <span className="text-red-500">{error}</span>}
        </>
    )
});