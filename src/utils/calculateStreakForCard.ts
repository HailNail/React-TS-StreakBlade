import { calculateStreak } from "./calculateStreaks";

export const calculateStreaks = (lastReset: string, history: string[] = []) => {
  const current = calculateStreak(lastReset);
  if (!history.length) return { lastStreak: 0, maxStreak: current };

  const allDates = [...history, lastReset]
    .filter(Boolean)
    .map((d) => new Date(d).getTime());
  const streaks: number[] = [];

  for (let i = 1; i < allDates.length; i++) {
    streaks.push(
      Math.floor((allDates[i] - allDates[i - 1]) / (1000 * 60 * 60 * 24))
    );
  }

  const lastStreak = streaks[streaks.length - 1] ?? 0;
  const maxStreak = Math.max(current, ...streaks);

  return { lastStreak, maxStreak };
};
