import { createContext, ReactNode, useContext, useRef } from "react";
import { CreateTabStore, TabProps, TabState, TabStore, UseTab } from "../hooks/tab";
import { useStore } from "zustand";
import { shallow } from "zustand/shallow";


type selectState<T> = (state: TabState) => T;

export const useTabContext = <T,>(selector: selectState<T>): T => {
  const store = useContext(TabContext)
  if (!store) throw new Error('Missing BearContext.Provider in the tree')
  return useStore(store, selector);
}


export const TabContext = createContext<TabStore | null>(null);


type TabProviderProps = {
  children: ReactNode,
} & Partial<TabProps>;

// ✅ Create Context Provider (Encapsulates Zustand Store)
export function TabProvider({ children, ...props }: TabProviderProps) {
  const tabStore = useRef(CreateTabStore(props)).current;
  console.log("????");

  return <TabContext.Provider value={tabStore}>{children}</TabContext.Provider>;
}


