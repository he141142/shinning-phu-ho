

import React, { ReactNode, FC, createContext, useContext, useRef } from "react";
import { createPaginationStore, PaginationProp, PaginationState, PaginationStore } from "./paginationsotre";
import { useStore } from "zustand";
import { PaginationContent } from "@/components/drake_libs/ui/pagination";
import { useRouter } from "next/router";


const PaginationContext = createContext<PaginationStore | null>(null);

type paginationStateSelector<T,> = (state: PaginationState) => T;

const usePaginationContext = <T,>(selector: paginationStateSelector<T>): T => {
    const store = useContext(PaginationContext);
    if (!store) throw new Error("missing pagination context");
    return useStore(store, selector);
}


export interface PaginationProviderProps extends PaginationProp {
    children: ReactNode
}

export const UsePaginationHook = (): PaginationState => {
    const router = useRouter();

   // Get entire store at once to prevent multiple re-renders
   const paginationState = usePaginationContext(state => state);
   const { page: pageStore, perPage: perPageStore, onPageChange, onPerPageChange } = paginationState;

    let page = router.query.page ? parseInt(router.query.page as string) : pageStore;
    let perPage = router.query.perPage ? parseInt(router.query.perPage as string) : perPageStore;

    return {
        page, perPage, onPageChange, onPerPageChange
    }
}


export const PaginationProvider: React.FC<PaginationProviderProps> = ({ children, ...props }) => {
    const paginationStore: PaginationStore = useRef<PaginationStore>(createPaginationStore({
        ...props
    })).current;
    return <>
        <PaginationContext.Provider value={paginationStore}>
            {children}
        </PaginationContext.Provider>
    </>
};