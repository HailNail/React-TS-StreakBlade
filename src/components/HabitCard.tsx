import { useState, useEffect, useRef, useMemo } from "react";
import Achievements from "./Achievements";
import HistoryWithHeatmap from "./HistoryWithHeatmap";
import type { HabitCardProps } from "../types/habitTypes";
import { useHabitsStore } from "../stores/useHabitsStore";
import { useElapsedTime } from "../hooks/useElapsedTime";
import { calculateStreaks } from "../utils/calculateStreakForCard";

const HabitCard = ({ id, onReset, onDelete }: HabitCardProps) => {
  const habit = useHabitsStore((state) =>
    state.habits.find((h) => h.id === id)
  );

  const lastReset = habit?.lastReset;
  const history = habit?.history ?? [];

  const timeElapsed = useElapsedTime(lastReset);
  const [showHistory, setShowHistory] = useState(false);

  const popoverId = `popover-${id}`;
  const popoverRef = useRef<HTMLDivElement>(null);

  // This hook manages the display of the history popover
  useEffect(() => {
    const popoverElement = popoverRef.current;
    if (!popoverElement) return;

    const handleToggle = (e: any) => {
      if (e.newState === "closed") {
        setShowHistory(false);
      }
      if (e.newState === "open") {
        setShowHistory(true);
      }
    };

    popoverElement.addEventListener("toggle", handleToggle);

    return () => {
      popoverElement.removeEventListener("toggle", handleToggle);
    };
  }, [popoverRef]);

  const currentStreakDays = useMemo(() => {
    if (!lastReset) return 0;
    return Math.floor(
      (Date.now() - new Date(lastReset).getTime()) / (1000 * 60 * 60 * 24)
    );
  }, [lastReset]);

  const { lastStreak, maxStreak } = lastReset
    ? calculateStreaks(lastReset, history)
    : { lastStreak: 0, maxStreak: 0 };
  if (!habit) return null;

  return (
    <div className="card bg-base-100 shadow-md border-2 border-neutral p-4 rounded-lg hover:shadow-lg transition-shadow duration-200 font-quattrocento">
      <h2 className="card-title text-secondary text-2xl font-bold m-1">
        {habit.name}
      </h2>
      <p className="text-accent mx-1 my-2">⏱ {timeElapsed}</p>
      <Achievements currentStreakDays={currentStreakDays} />
      <div className="flex">
        <p className="text-sm mx-1 text-secondary">
          Current: <span className="text-accent">{currentStreakDays}</span> d
        </p>
        <p className="text-sm mx-1 text-secondary">
          Last: <span className="text-accent">{lastStreak}</span> d
        </p>
        <p className="text-sm mx-1 text-secondary">
          Max: <span className="text-accent">{maxStreak}</span> d
        </p>
      </div>
      <div className="card-actions flex gap-2 mt-3">
        <button className="btn btn-secondary btn-md" onClick={onReset}>
          Reset
        </button>
        <button className="btn btn-error btn-md" onClick={onDelete}>
          Delete
        </button>
        <button
          className="btn btn-outline btn-secondary btn-md"
          popoverTarget={popoverId}
          style={{ ["anchorName" as any]: `--anchor-${id}` }}
        >
          {showHistory ? "Hide" : "View"} History
        </button>
      </div>
      <div>
        <div
          ref={popoverRef}
          id={popoverId}
          popover="auto"
          className="dropdown dropdown-center menu w-80 h-48 overflow-hidden rounded-box bg-base-200 border-2 border-base-300 shadow-sm text-base"
          style={{ ["positionAnchor" as any]: `--anchor-${id}` }}
        >
          <HistoryWithHeatmap history={history} />
        </div>
      </div>
    </div>
  );
};

export default HabitCard;
