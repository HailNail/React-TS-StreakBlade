import { useEffect } from "react";
import { useToastStore } from "../stores/useToastStore";

export const useToastAutoRemove = (timeout = 5000) => {
  const { toasts, removeToast } = useToastStore();

  useEffect(() => {
    if (toasts.length === 0) return;

    const timer = setTimeout(() => {
      removeToast(toasts[0].id);
    }, timeout);

    return () => clearTimeout(timer);
  }, [toasts, removeToast, timeout]);
};
