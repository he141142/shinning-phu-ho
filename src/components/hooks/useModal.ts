import { create } from "zustand";

interface ModalState {
  isOpen: boolean;
  modalType?: string | null;
  openModal: (modalType: string) => void;
  closeModal: () => void;
}

export const ModalType = {
  joinClass: "JOIN_CLASS",
  ConfirmEdit: "CONFIRM_EDIT",
  RegisterTeacher: "REGISTER_TEACHER",
  ConfirmDropout: "CONFIRM_DROPOUT",
  CREATE_SCHEDULE: "CREATE_SCHEDULE",
  VIEW_SCHEDULE_DETAIL : "VIEW_SCHEDULE_DETAIL",
};

export const UseModal = create<ModalState>((set) => ({
  modalType: null,
  isOpen: false,
  openModal: (modalType: string) => set({ isOpen: true, modalType: modalType }),
  closeModal: () => set({ isOpen: false, modalType: null }),
}));
