import { createStore, useStore } from "zustand";
import { PaginationState } from "./usePagination";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { PaginationContext } from "@/context/pagination.context";

export interface DefaultPaginationProps {
  page: number;
  perPage: number;
}

export type PaginationStore = ReturnType<typeof createPaginationStore>;

export const createPaginationStore = (initProps?: Partial<DefaultPaginationProps>) => {
  const DEFAULT_PROPS: DefaultPaginationProps = {
    page: 1,
    perPage: 10,
  };
  
  return createStore<PaginationState>()((set) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    setPage: (page: number) => set({ page }),
    setPerPage: (perPage: number) => set({ perPage }),
    handlePageChange: async (page: number) => {
      set({ page });
    },
  }));
};


const usePaginationContext = <T>(selector: (state: PaginationState) => T): T => {
    const store = useContext(PaginationContext)
    if (!store) throw new Error('Missing BearContext.Provider in the tree')
    return useStore(store, selector)
}


// export const useSyncPagination = () => {
//     const router = useRouter();
//     const store = useContext(PaginationContext);

//     if (!store) {
//        return null;
//     }

//     let state:PaginationState  = store.getState();

//     const {page,perPage,handlePageChange,setPage,setPerPage} = state;
    
//     useEffect(() => {
      
//       let queryPage = router.query.page
//         ? parseInt(router.query.page as string)
//         : 1;
  
//       let queryPerPage = router.query.perPage
//         ? parseInt(router.query.perPage as string)
//         : 10;
  
  
        
//       if (queryPage !== page) setPage(queryPage);
//       if (queryPerPage !== perPage) setPerPage(queryPerPage);
//     }),
//       [page, perPage, setPage, setPerPage, handlePageChange];
  
//     const updatePagination = (page: number, perPage: number) => {
//       router.push({
//         pathname: router.pathname,
//         query: {
//           ...router.query,
//           page: page,
//           perPage: perPage,
//         },
//       });
//     };
  
//     const handlePageChangeAsync = async (page: number) => {
//       router.push({
//         pathname: router.pathname,
//         query: {
//           ...router.query,
//           page: page,
//           perPage: perPage,
//         },
//       });
  
//       handlePageChange(page);
//     };
  
//     return {
//       page,
//       perPage,
//       setPage: updatePagination,
//       setPerPage: (perPage: number) => {
//         updatePagination(1, perPage);
//       },
//       handlePageChangeAsync,
//     };
//   };