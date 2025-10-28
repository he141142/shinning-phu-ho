import { PaginationStore } from "@/components/hooks/usePaginationContext";
import { createContext } from 'react'


export const PaginationContext = createContext<PaginationStore | null>(null)

