import { create } from "zustand";

export interface ClassProp {
  class_id: number;
  class_name: string;
  class_description: string;
}

export interface ClassState {
  class_info: ClassProp;
  setClassInfo: (classInfo: ClassProp) => void;
  resetClassInfo: () => void;
}

export type ClassStore = ReturnType<typeof createClassStore>;

export const createClassStore = create<ClassState>((set) => ({
  class_info: {
    class_id: 0,
    class_name: "",
    class_description: "",
  },
  setClassInfo: (classInfo: ClassProp) => {
    set({ class_info: classInfo });
  },
  resetClassInfo: () => {
    set({
      class_info: {
        class_id: 0,
        class_name: "",
        class_description: "",
      },
    });
  },
}));
