import { achievementsData } from "../utils/achievementsData";

interface AchievementsProps {
  currentStreakDays: number;
}

export default function Achievements({ currentStreakDays }: AchievementsProps) {
  return (
    <div className="dropdown">
      <div
        tabIndex={0}
        role="presentation"
        className="cursor-pointer hover:text-primary-content transition-colors duration-200 m-1 px-0"
      >
        Current Status:{" "}
        {achievementsData
          .slice()
          .sort((a, b) => b.days - a.days)
          .find((ach) => currentStreakDays >= ach.days)?.title ||
          "No Achievement"}
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box w-52 p-2 shadow-sm"
      >
        <div
          className="overflow-y-auto max-h-48 px-2 sm:px-1 [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-base-200
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-base-300"
        >
          {achievementsData.map((ach) => {
            const progressPercent = Math.min(
              (currentStreakDays / ach.days) * 100,
              100
            );
            const isCompleted = currentStreakDays >= ach.days;

            return (
              <div key={ach.id} className="mb-2">
                <div className="flex justify-between text-sm">
                  <span>{ach.title}</span>
                  <span>
                    {isCompleted
                      ? "Completed"
                      : `${progressPercent.toFixed(0)}%`}
                  </span>
                </div>
                <progress
                  className="progress progress-success w-full"
                  value={progressPercent}
                  max={100}
                />
              </div>
            );
          })}
        </div>
      </ul>
    </div>
  );
}
