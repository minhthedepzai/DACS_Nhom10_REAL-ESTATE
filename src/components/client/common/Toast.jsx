import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import './Toast.css';

// Context để quản lý toasts
const ToastContext = createContext();

// ID duy nhất cho mỗi toast
let toastCount = 0;

// Hook để sử dụng toast trong các component
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast phải được sử dụng trong ToastProvider');
  }
  return context;
};

// Component hiển thị từng toast
const Toast = ({ toast, onRemove }) => {
  const [exit, setExit] = useState(false);
  const [width, setWidth] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  
  const handleCloseClick = () => {
    setExit(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300);
  };
  
  useEffect(() => {
    if (toast.duration) {
      // Thiết lập progress bar
      const id = setInterval(() => {
        setWidth(prev => {
          if (prev < 100) {
            return prev + 0.5;
          }
          
          clearInterval(id);
          setExit(true);
          setTimeout(() => {
            onRemove(toast.id);
          }, 300);
          return prev;
        });
      }, toast.duration / 200);
      
      setIntervalId(id);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [toast.duration, onRemove, toast.id, intervalId]);
  
  // Chọn icon dựa trên loại toast
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <FaCheckCircle />;
      case 'error':
        return <FaExclamationCircle />;
      case 'warning':
        return <FaExclamationTriangle />;
      case 'info':
        return <FaInfoCircle />;
      default:
        return <FaInfoCircle />;
    }
  };
  
  return (
    <div 
      className={`toast toast-${toast.type} ${exit ? 'exiting' : ''}`}
      onClick={handleCloseClick}
    >
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-content">{toast.message}</div>
      <div className="toast-close" onClick={e => {
        e.stopPropagation();
        handleCloseClick();
      }}>
        <FaTimes />
      </div>
      {toast.duration && (
        <div 
          className="toast-progress" 
          style={{ width: `${width}%` }}
        />
      )}
    </div>
  );
};

// Provider component để quản lý toast trong toàn bộ ứng dụng
export const ToastProvider = ({ children, position = 'toast-top-right' }) => {
  const [toasts, setToasts] = useState([]);
  
  const addToast = (message, type, duration = 3000) => {
    const id = ++toastCount;
    
    const newToast = {
      id,
      message,
      type,
      duration,
    };
    
    setToasts(prevToasts => [...prevToasts, newToast]);
    
    return id;
  };
  
  const removeToast = id => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };
  
  // Các hàm tiện ích cho các loại toast khác nhau
  const success = (message, duration) => addToast(message, 'success', duration);
  const error = (message, duration) => addToast(message, 'error', duration);
  const warning = (message, duration) => addToast(message, 'warning', duration);
  const info = (message, duration) => addToast(message, 'info', duration);
  
  // Clear tất cả toasts
  const clearAll = () => setToasts([]);
  
  const contextValue = {
    success,
    error,
    warning,
    info,
    clearAll,
    removeToast
  };
  
  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className={`toast-container ${position}`}>
        {toasts.map(toast => (
          <Toast 
            key={toast.id} 
            toast={toast} 
            onRemove={removeToast} 
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider; 