import { useEffect } from "react";
import { useHabitsStore } from "../stores/useHabitsStore";
import { useToastStore } from "../stores/useToastStore";
import { achievementsData } from "../utils/achievementsData";
import { getNewAchievements } from "../utils/achievementsLogic";

const TOASTS_KEY = "streakblade_shownToasts";

export const useAchievements = () => {
  const { habits } = useHabitsStore();
  const { addToast } = useToastStore();

  const getShown = (): Record<number, number> =>
    JSON.parse(localStorage.getItem(TOASTS_KEY) || "{}");

  const setShown = (habitId: number, achId: number) => {
    const prev = getShown();
    localStorage.setItem(
      TOASTS_KEY,
      JSON.stringify({ ...prev, [habitId]: achId })
    );
  };

  useEffect(() => {
    const shown = getShown();

    habits.forEach((habit) => {
      const prevId = shown[habit.id];
      const newAchievements = getNewAchievements(
        habit,
        achievementsData,
        prevId
      );

      newAchievements.forEach((ach) => {
        addToast(
          `${habit.id}-${ach.id}`,
          `${habit.name} unlocked: ${ach.title}`
        );
        setShown(habit.id, ach.id);
      });
    });
  }, [addToast, habits]);
};
