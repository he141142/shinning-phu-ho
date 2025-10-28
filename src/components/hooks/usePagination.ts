import { useRouter } from "next/router";
import { useEffect } from "react";
import { create } from "zustand";

export interface PaginationState {
  page: number;
  perPage: number;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  handlePageChange: (page: number) => Promise<void>;
}

const usePagination = create<PaginationState>((set) => ({
  page: 1,
  perPage: 6,
  setPage: (page: number) => set({ page }),
  setPerPage: (perPage: number) => set({ perPage }),
  handlePageChange: async (page: number) => {
    set({ page });
  },
}));

export const useSyncPagination = () => {
  const router = useRouter();
  const {
    page = 1,
    perPage = 10,
    setPage,
    setPerPage,
    handlePageChange,
  } = usePagination();
  useEffect(() => {

    
    
    let queryPage = router.query.page
      ? parseInt(router.query.page as string)
      : 1;

    let queryPerPage = router.query.perPage
      ? parseInt(router.query.perPage as string)
      : 10;


      
    if (queryPage !== page) setPage(queryPage);
    if (queryPerPage !== perPage) setPerPage(queryPerPage);
  }),
    [page, perPage, setPage, setPerPage, handlePageChange];

  const updatePagination = (page: number, perPage: number) => {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        page: page,
        perPage: perPage,
      },
    });
  };

  const handlePageChangeAsync = async (page: number) => {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        page: page,
        perPage: perPage,
      },
    });

    handlePageChange(page);
  };

  return {
    page,
    perPage,
    setPage: updatePagination,
    setPerPage: (perPage: number) => {
      updatePagination(1, perPage);
    },
    handlePageChangeAsync,
  };
};

export { usePagination };
