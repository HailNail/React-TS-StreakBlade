export function calculateStreak(lastReset: string): number {
  const last = new Date(lastReset).getTime();
  if (isNaN(last)) return 0;

  const now = Date.now();
  const diff = now - last;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return Math.max(days, 0);
}
