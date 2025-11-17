import { useState, useEffect } from "react";

export const useElapsedTime = (lastReset: string | undefined) => {
  const [timeElapsed, setTimeElapsed] = useState("Not started yet");

  useEffect(() => {
    if (!lastReset) return;

    const formatDuration = (ms: number) => {
      const seconds = Math.floor(ms / 1000) % 60;
      const minutes = Math.floor(ms / (1000 * 60)) % 60;
      const hours = Math.floor(ms / (1000 * 60 * 60)) % 24;
      const days = Math.floor(ms / (1000 * 60 * 60 * 24));
      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    const update = () =>
      setTimeElapsed(
        formatDuration(Date.now() - new Date(lastReset).getTime())
      );

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [lastReset]);

  return timeElapsed;
};
