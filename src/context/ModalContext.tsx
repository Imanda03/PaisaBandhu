import React, { createContext, useContext, useState, useCallback } from 'react';
import CustomModal, { ModalButton } from '../components/core/Modal';

interface ModalState {
  visible: boolean;
  title?: string;
  message: string;
  buttons?: ModalButton[];
  type?: 'info' | 'warning' | 'error' | 'success';
  onDismiss?: () => void;
}

interface ModalContextType {
  showModal: (config: Omit<ModalState, 'visible'>) => void;
  hideModal: () => void;
  showAlert: (title: string, message: string, type?: ModalState['type']) => Promise<void>;
  showConfirm: (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [modalState, setModalState] = useState<ModalState>({
    visible: false,
    message: '',
  });

  const showModal = useCallback((config: Omit<ModalState, 'visible'>) => {
    setModalState({
      ...config,
      visible: true,
    });
  }, []);

  const hideModal = useCallback(() => {
    setModalState((prev) => ({
      ...prev,
      visible: false,
    }));
  }, []);

  const showAlert = useCallback(
    async (
      title: string,
      message: string,
      type: ModalState['type'] = 'info'
    ): Promise<void> => {
      return new Promise((resolve) => {
        showModal({
          title,
          message,
          type,
          onDismiss: () => {
            hideModal();
            resolve();
          },
        });
      });
    },
    [showModal, hideModal]
  );

  const showConfirm = useCallback(
    (
      title: string,
      message: string,
      onConfirm: () => void,
      onCancel?: () => void
    ) => {
      showModal({
        title,
        message,
        type: 'warning',
        buttons: [
          {
            text: 'Cancel',
            onPress: () => {
              hideModal();
              onCancel?.();
            },
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: () => {
              hideModal();
              onConfirm();
            },
            style: 'destructive',
          },
        ],
      });
    },
    [showModal, hideModal]
  );

  return (
    <ModalContext.Provider value={{ showModal, hideModal, showAlert, showConfirm }}>
      {children}
      <CustomModal
        visible={modalState.visible}
        title={modalState.title}
        message={modalState.message}
        buttons={modalState.buttons}
        type={modalState.type}
        onDismiss={() => {
          hideModal();
          modalState.onDismiss?.();
        }}
      />
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

// Default export for convenience
export default useModal;

