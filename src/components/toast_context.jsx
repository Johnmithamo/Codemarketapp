import React, { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = "success", duration = 3000) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, type }]);
      if (duration) {
        setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ showToast, dismiss }}>
      {children}

      {/* Toast stack — fixed, top of screen, above everything including modals */}
      <div className="fixed top-4 inset-x-0 z-[999] flex flex-col items-center gap-2 px-4 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto w-full max-w-[380px] flex items-center gap-2 px-4 py-3 rounded-2xl shadow-lg text-sm font-medium animate-[toast-in_0.2s_ease-out] ${
              t.type === "error"
                ? "bg-red-600 text-white"
                : t.type === "info"
                ? "bg-gray-900 text-white"
                : "bg-green-600 text-white"
            }`}
          >
            {t.type === "error" ? (
              <XCircle size={18} className="flex-shrink-0" />
            ) : t.type === "info" ? (
              <Info size={18} className="flex-shrink-0" />
            ) : (
              <CheckCircle2 size={18} className="flex-shrink-0" />
            )}
            <span className="flex-1">{t.message}</span>
            <button onClick={() => dismiss(t.id)} className="flex-shrink-0 opacity-80 hover:opacity-100">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

// Usage: const { toast } = useToast(); toast("Profile submitted successfully");
// toast(message, "error") for failures, "info" for neutral notices.
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return { toast: ctx.showToast, dismissToast: ctx.dismiss };
}
