import type { Habit } from "./habitTypes";

export interface AchievementState {
  currentStreak: number;
  maxStreak: number;

  increaseStreak: () => void;
  resetStreak: () => void;
  hardReset: () => void;
}

export interface Achievement {
  id: number;
  days: number;
  title: string;
  progress?: number;
  completed?: boolean;
}

export interface getNewAchievementsProps {
  habit: Habit;
  achievementData: Achievement[];
  shownId: number | undefined;
}
