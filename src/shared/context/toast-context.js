import React, { createContext, useContext, useState } from "react";
import { Toast } from "@themesberg/react-bootstrap";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success", duration = 5000) => {
    const id = Date.now();
    const newToast = {
      id,
      message,
      type,
      duration,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove toast after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const success = (message, duration) =>
    showToast(message, "success", duration);
  const error = (message, duration) => showToast(message, "danger", duration);
  const warning = (message, duration) =>
    showToast(message, "warning", duration);
  const info = (message, duration) => showToast(message, "info", duration);

  const getToastClassName = (type) => {
    switch (type) {
      case "success":
        return "bg-success text-white";
      case "danger":
        return "bg-danger text-white";
      case "warning":
        return "bg-warning text-dark";
      case "info":
        return "bg-info text-white";
      default:
        return "bg-success text-white";
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 1055,
          maxWidth: "350px",
        }}
      >
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            show={true}
            onClose={() => removeToast(toast.id)}
            className={`${getToastClassName(toast.type)} my-2`}
            delay={toast.duration}
            autohide
          >
            <Toast.Header className="text-white" closeButton>
              <strong className="me-auto">
                {toast.type === "success" && "Success"}
                {toast.type === "danger" && "Error"}
                {toast.type === "warning" && "Warning"}
                {toast.type === "info" && "Info"}
              </strong>
            </Toast.Header>
            <Toast.Body>{toast.message}</Toast.Body>
          </Toast>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
