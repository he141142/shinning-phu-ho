import { useRouter } from "next/router";
import { createStore } from "zustand";

export type PaginationProp = {
  page: number;
  perPage: number;
};

export type PaginationState = PaginationProp & {
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
};

export type PaginationStore = ReturnType<typeof createPaginationStore>;

export const createPaginationStore = (initialProps: PaginationProp) => {
  const defaultProps: PaginationProp = {
    page: 1,
    perPage: 10,
  };

  const router = useRouter();

  //prefer router query param

  let queryPage = router.query.page ? parseInt(router.query.page as string) : initialProps.page;

  let queryPerPage = router.query.perPage
    ? parseInt(router.query.perPage as string)
    : initialProps.perPage;


  let finalProps: PaginationProp = {
    page: queryPage,
    perPage: queryPerPage,
  }

  return createStore<PaginationState>((set) => {
    return {
      ...defaultProps,
      ...initialProps,
      ...finalProps,
      onPageChange: (page: number) => {
        set({ page });
      },
      onPerPageChange: (perPage: number) => {
        set({ perPage });
      },
    };
  });
};

