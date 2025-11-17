export interface Toast {
  id: string;
  message: string;
}

export interface ToastStore {
  toasts: Toast[];
  addToast: (id: string, message: string) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
}
