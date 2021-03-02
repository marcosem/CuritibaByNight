import React, { createContext, useContext, useState, useCallback } from 'react';
import ModalDialogBox from '../components/ModalDialogBox';

interface IModalBoxData {
  type?: 'warning' | 'error' | 'info';
  title: string;
  description?: string;
  btn1Title?: string;
  btn1Function?: () => void;
  btn2Title?: string;
  btn2Function?: () => void;
  btn3Title?: string;
  btn3Function?: () => void;
}

interface IModalBoxContextData {
  showModal(modalData: IModalBoxData): void;
  closeModal(): void;
}

const ModalBoxContext = createContext<IModalBoxContextData>(
  {} as IModalBoxContextData,
);

const ModalBoxProvider: React.FC = ({ children }) => {
  const [isModalBoxOpen, setModalBoxOpen] = useState<boolean>(false);
  const [currentModalBox, setCurrentModalBox] = useState<IModalBoxData>(
    {} as IModalBoxData,
  );

  const closeModal = useCallback(() => {
    if (!isModalBoxOpen) {
      return;
    }

    setCurrentModalBox({} as IModalBoxData);
    setModalBoxOpen(false);
  }, [isModalBoxOpen]);

  const showModal = useCallback((modalData: IModalBoxData) => {
    setCurrentModalBox(modalData);
    setModalBoxOpen(true);
  }, []);

  return (
    <ModalBoxContext.Provider value={{ showModal, closeModal }}>
      {children}
      {isModalBoxOpen && <ModalDialogBox modalData={currentModalBox} />}
    </ModalBoxContext.Provider>
  );
};

function useModalBox(): IModalBoxContextData {
  const context = useContext(ModalBoxContext);

  if (!context) {
    throw new Error('useModalBox must be used within a ModalBoxProvider');
  }

  return context;
}

export { ModalBoxProvider, useModalBox };
