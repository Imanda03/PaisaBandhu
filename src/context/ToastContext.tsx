import { createContext, ReactNode, useContext, useState } from 'react';
import Toast from '../components/core/Toast';

type ToastType = 'success' | 'error' | 'warning';

interface ToastContextType {
    showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toastMessage, setToastMessage] = useState('');

    const [toastType, setToastType] = useState<ToastType>('success');

    const showToast = (message: string, type: ToastType) => {
        setToastMessage(message);
        setToastType(type);
    };

    const hideToast = () => {
        setToastMessage('');
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <Toast message={toastMessage} type={toastType} onHide={hideToast} />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
