import { create } from "zustand";
import type { Habit, HabitStore } from "../types/habitTypes";

const STORAGE_KEY = "streakblade_habits";

export const useHabitsStore = create<HabitStore>((set, get) => ({
  habits: [],

  load: () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      set({ habits: JSON.parse(stored) });
    }
  },

  persist: () => {
    const { habits } = get();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  },

  addHabit: (name) => {
    const newHabit: Habit = {
      id: Date.now(),
      name,
      lastReset: new Date(Date.now() - 7 * 24 * 60 * 60 * 999.98).toISOString(),
      maxStreak: 0,
    };
    set({ habits: [...get().habits, newHabit] });
    get().persist();
  },

  deleteHabit: (id) => {
    set({ habits: get().habits.filter((h) => h.id !== id) });
    get().persist();
  },

  resetHabit: (id) => {
    set({
      habits: get().habits.map((habit) => {
        if (habit.id !== id) return habit;

        const currentStreak = Math.floor(
          (Date.now() - new Date(habit.lastReset).getTime()) /
            (1000 * 60 * 60 * 24)
        );

        const newMax = Math.max(habit.maxStreak ?? 0, currentStreak);

        return {
          ...habit,
          history: [...(habit.history || []), habit.lastReset],
          lastReset: new Date().toISOString(),
          maxStreak: newMax,
        };
      }),
    });

    get().persist();
  },
}));
