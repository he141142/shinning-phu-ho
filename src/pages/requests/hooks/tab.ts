import { RequestType } from "@/models/requests/ListAllRequests";
import { create, createStore } from "zustand";
import { useTabContext } from "../context/TabContext";

export type RequestItem = {
  category: RequestType;
  limit: number;
  page: number;
};

export interface TabProps {
  activeTab: string;
  requestItems: RequestItem[];
}



export interface TabState extends TabProps {
  setActiveTab: (tab: string) => void;
  requestItems: RequestItem[];
  setRequestItems: (items: RequestItem[]) => void;
}

export const UseTab = create<TabState>((set) => ({
  activeTab: "Account Registration",
  setActiveTab: (tab: string) => set({ activeTab: tab }),
  requestItems: [
    {
      category: "TeacherRegistrationRequest",
      limit: 10,
      page: 1,
    },
    {
      category: "StaffRegistrationRequest",
      limit: 10,
      page: 1,
    },
  ],
  setRequestItems: (items: RequestItem[]) => set({ requestItems: items }),
}));

export const CreateTabStore = (initProps?: Partial<TabProps>) => {
  const DEFAULT_PROPS: TabProps = {
    activeTab: "Account Registration",
    requestItems: [
      {
        category: "TeacherRegistrationRequest",
        limit: 10,
        page: 1,
      },
      {
        category: "StaffRegistrationRequest",
        limit: 10,
        page: 1,
      },
    ],
  };


  return createStore<TabState>((set) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    setActiveTab: (tab: string) => set({ activeTab: tab }),
    setRequestItems: (items: RequestItem[]) => set({ requestItems: items }),
  }));
};

export type TabStore = ReturnType<typeof CreateTabStore>;



export const UseTabHook = () => {
  const activeTab = useTabContext((state) => state.activeTab);
  const setActiveTab = useTabContext((state) => state.setActiveTab);

  const requestItems = useTabContext((state) => state.requestItems);
  const setRequestItems = useTabContext((state) => state.setRequestItems);
  
  return { activeTab, setActiveTab, requestItems, setRequestItems };
}