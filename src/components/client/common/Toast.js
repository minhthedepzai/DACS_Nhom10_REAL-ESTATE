import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import './Toast.css';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

const TOAST_DURATION = 5000; // Thời gian hiển thị mặc định: 5 giây

export const ToastProvider = ({ children, position = 'toast-top-right' }) => {
  const [toasts, setToasts] = useState([]);
  const toastIdRef = useRef(1);

  const addToast = (message, type, duration = TOAST_DURATION) => {
    const id = toastIdRef.current++;
    const newToast = {
      id,
      message,
      type,
      duration,
      startTime: new Date(),
      progress: 0
    };
    
    setToasts(prevToasts => [...prevToasts, newToast]);
    return id;
  };

  const removeToast = (id) => {
    setToasts(prevToasts =>
      prevToasts.map(toast => 
        toast.id === id ? { ...toast, exiting: true } : toast
      )
    );

    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, 300); // Thời gian cho animation exiting
  };

  const showToast = {
    success: (message, duration) => addToast(message, 'success', duration),
    error: (message, duration) => addToast(message, 'error', duration),
    warning: (message, duration) => addToast(message, 'warning', duration),
    info: (message, duration) => addToast(message, 'info', duration),
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className={`toast-container ${position}`}>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const Toast = ({ toast, onRemove }) => {
  const { id, message, type, duration, exiting } = toast;
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(new Date());

  useEffect(() => {
    startTimeRef.current = new Date();
    
    intervalRef.current = setInterval(() => {
      const elapsedTime = new Date() - startTimeRef.current;
      const newProgress = Math.min((elapsedTime / duration) * 100, 100);
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        clearInterval(intervalRef.current);
        onRemove(id);
      }
    }, 10);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [id, duration, onRemove]);

  const getIcon = () => {
    switch (type) {
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
    <div className={`toast toast-${type} ${exiting ? 'toast-exiting' : ''}`}>
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-content">{message}</div>
      <button className="toast-close" onClick={() => onRemove(id)}>
        <FaTimes />
      </button>
      <div className="toast-progress-container">
        <div 
          className="toast-progress" 
          style={{ width: `${progress}%` }} 
        />
      </div>
    </div>
  );
};

export default ToastProvider; 