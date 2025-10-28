"use client";
import { createPaginationStore, DefaultPaginationProps, PaginationStore } from "@/components/hooks/usePaginationContext";
import { PaginationContext } from "@/context/pagination.context";
import { useRef } from "react";

type PaginationproviderProps = React.PropsWithChildren<DefaultPaginationProps>

export function Paginationprovider({ children, ...props }: PaginationproviderProps) {
    const storeRef = useRef<PaginationStore>();
    console.log("loading pagination provider");
    
    if (!storeRef.current) {
        storeRef.current = createPaginationStore(props)
    }
    return (
        <>
            <PaginationContext.Provider value={storeRef.current}>
                {children}
            </PaginationContext.Provider>
        </>
    );
};