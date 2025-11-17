import { create } from "zustand";
import type { ToastStore } from "../types/toastTypes";

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  addToast: (id, message) =>
    set((state) => {
      if (state.toasts.some((t) => t.id === id)) return state;

      return {
        toasts: [...state.toasts, { id, message }],
      };
    }),

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  clearAll: () => set({ toasts: [] }),
}));
