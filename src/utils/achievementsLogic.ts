import type { Achievement } from "../types/achievementTypes";
import type { Habit } from "../types/habitTypes";
import { achievementsData } from "./achievementsData";
import { calculateStreak } from "./calculateStreaks";

export const getUnlockedAchievements = (
  habit: Habit,
  achievementsData: Achievement[]
): Achievement[] => {
  const streak = calculateStreak(habit.lastReset);
  return achievementsData.filter((ach) => streak >= ach.days);
};

export const getNewAchievements = (
  habit: Habit,
  achievementsData: Achievement[],
  shownId: number | undefined
): Achievement[] => {
  const allUnlocked = getUnlockedAchievements(habit, achievementsData);

  return allUnlocked.filter((ach) => !shownId || !ach.id);
};

export const getTopAchievement = (habit: Habit): Achievement | null => {
  const unlocked = getUnlockedAchievements(habit, achievementsData);
  if (unlocked.length === 0) return null;

  return unlocked.reduce((max, a) => (a.days ? a : max));
};
