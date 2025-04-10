import React, { createContext, useState, useContext } from "react";

type ModalType = "login" | "register" | null;

interface ModalContextType {
  modalType: ModalType;
  openModal: (type: ModalType) => void;
  closeModal: () => void;
  openPopover: boolean;
  togglePopover: () => void;
}

const defaultContextValue: ModalContextType = {
  modalType: null,
  openModal: () => {},
  closeModal: () => {},
  openPopover: false,
  togglePopover: () => {},
};

export const ModalContext =
  createContext<ModalContextType>(defaultContextValue);

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [modalType, setModalType] = useState<ModalType>(null);
  const [openPopover, setOpenPopover] = useState(false);

  const openModal = (type: ModalType) => {
    setModalType(type);
    setOpenPopover(false);
  };

  const closeModal = () => setModalType(null);
  const togglePopover = () => setOpenPopover((prev) => !prev);

  return (
    <ModalContext.Provider
      value={{ modalType, openModal, closeModal, openPopover, togglePopover }}
    >
      {children}
    </ModalContext.Provider>
  );
};
