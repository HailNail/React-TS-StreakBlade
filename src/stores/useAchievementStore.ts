import { create } from "zustand";
import type { AchievementState } from "../types/achievementTypes";
import { persist } from "zustand/middleware";

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set, get) => ({
      currentStreak: 0,
      maxStreak: 0,

      increaseStreak: () => {
        const { currentStreak, maxStreak } = get();
        const newCurrent = currentStreak + 1;

        set({
          currentStreak: newCurrent,
          maxStreak: Math.max(maxStreak, newCurrent),
        });
      },

      resetStreak: () => {
        set((state) => ({
          ...state,
          currentStreak: 0,
        }));
      },

      hardReset: () => {
        set({
          currentStreak: 0,
          maxStreak: 0,
        });
      },
    }),
    {
      name: "achievements-storage",
    }
  )
);
