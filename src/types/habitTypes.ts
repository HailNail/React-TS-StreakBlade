export interface Habit {
  id: number;
  name: string;
  lastReset: string;
  history?: string[];
  habit?: string;
  maxStreak?: number;
}

export interface HabitCardProps {
  id: number;
  onReset: () => void;
  onDelete: () => void;
}

export interface HabitStore {
  habits: Habit[];
  load: () => void;
  persist: () => void;
  addHabit: (name: string) => void;
  deleteHabit: (id: number) => void;
  resetHabit: (id: number) => void;
}
