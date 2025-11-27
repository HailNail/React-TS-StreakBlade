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

  // Sort by days descending to get highest achievement first
  const sortedUnlocked = [...allUnlocked].sort((a, b) => b.days - a.days);

  if (sortedUnlocked.length === 0) return [];

  // Get the highest achievement unlocked
  const highestUnlocked = sortedUnlocked[0];

  // If no achievement was shown before, or current highest is greater than what was shown
  if (shownId === undefined || highestUnlocked.id > shownId) {
    return [highestUnlocked];
  }

  return [];
};

export const getTopAchievement = (habit: Habit): Achievement | null => {
  const unlocked = getUnlockedAchievements(habit, achievementsData);
  if (unlocked.length === 0) return null;

  return unlocked.reduce((max, a) => (a.days ? a : max));
};
