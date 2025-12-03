import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface ToastProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose: (id: string) => void;
}

interface ToastContextType {
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning', duration?: number) => void;
}

const ToastContainer = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 400px;
`;

const ToastItem = styled.div<{ type: string; isVisible: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transform: translateX(${({ isVisible }) => (isVisible ? '0' : '100%')});
  opacity: ${({ isVisible }) => (isVisible ? '1' : '0')};
  transition: transform 0.3s ease, opacity 0.3s ease;
  border-left: 4px solid;

  ${({ type }) => {
    switch (type) {
      case 'success':
        return `
          background-color: #f0fdf4;
          color: #166534;
          border-left-color: #22c55e;
        `;
      case 'error':
        return `
          background-color: #fef2f2;
          color: #991b1b;
          border-left-color: #ef4444;
        `;
      case 'warning':
        return `
          background-color: #fffbeb;
          color: #92400e;
          border-left-color: #f59e0b;
        `;
      case 'info':
      default:
        return `
          background-color: #eff6ff;
          color: #1e40af;
          border-left-color: #3b82f6;
        `;
    }
  }}
`;

const IconWrapper = styled.div<{ type: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  ${({ type }) => {
    switch (type) {
      case 'success':
        return 'color: #22c55e;';
      case 'error':
        return 'color: #ef4444;';
      case 'warning':
        return 'color: #f59e0b;';
      case 'info':
      default:
        return 'color: #3b82f6;';
    }
  }}
`;

const Message = styled.div`
  flex: 1;
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: currentColor;
  cursor: pointer;
  opacity: 0.7;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }

  &:focus {
    outline: none;
    opacity: 1;
  }
`;

const getIcon = (type: string) => {
  switch (type) {
    case 'success':
      return <CheckCircle size={20} />;
    case 'error':
      return <AlertCircle size={20} />;
    case 'warning':
      return <AlertTriangle size={20} />;
    case 'info':
    default:
      return <Info size={20} />;
  }
};

const Toast: React.FC<ToastProps> = ({ id, message, type, duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show toast
    const showTimer = setTimeout(() => setIsVisible(true), 100);

    // Hide toast after duration
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300); // Wait for animation to finish
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [id, duration, onClose]);

  return (
    <ToastItem type={type} isVisible={isVisible}>
      <IconWrapper type={type}>
        {getIcon(type)}
      </IconWrapper>
      <Message>{message}</Message>
      <CloseButton onClick={() => onClose(id)} type="button">
        <X size={16} />
      </CloseButton>
    </ToastItem>
  );
};

// Toast Provider Context
const ToastContext = React.createContext<ToastContextType | null>(null);

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Array<ToastProps & { duration: number }>>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning', duration = 5000) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type, duration, onClose: removeToast }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer>
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default Toast;