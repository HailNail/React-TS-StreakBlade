import { useEffect, useState } from "react";
import HabitCard from "./HabitCard";
import Modal from "./Modal";
import AddHabitForm from "./AddHabitForm";
import ConfirmDialog from "./ConfirmDialog";
import motivatedPhrases from "../utils/motivatedPhrases.json";
import { achievementsData } from "../utils/achievementsData";

interface Habit {
  id: number;
  name: string;
  lastReset?: string;
  history?: string[];
  habit?: string;
}

type Toast = {
  id: string;
  message: string;
};

const STORAGE_KEY = "streakblade_habits";
const TOASTS_KEY = "streakblade_shownToasts";

const HabitList = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"add" | "delete" | "reset" | null>(
    null
  );
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [activeToasts, setActiveToasts] = useState<
    { id: string; message: string }[]
  >([]);

  // Get random motivational phrase
  const [getRandomMotivationalPhrase] = useState(() => {
    const randomIndex = Math.floor(Math.random() * motivatedPhrases.length);
    return motivatedPhrases[randomIndex].phrase;
  });

  // Load from storage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setHabits(JSON.parse(stored));
    }
    setLoaded(true);
  }, []);

  // Save to storage
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    }
  }, [habits, loaded]);

  // Load already shown toasts

  const getShownToasts = (): Record<string, number> => {
    const stored = localStorage.getItem(TOASTS_KEY);
    // Returns an object where keys are habit IDs and values are the highest achievement IDs
    return stored ? JSON.parse(stored) : {};
  };

  const markToastAsShown = (habitId: string, achievementId: number) => {
    const prev = getShownToasts();
    // Check if the current achievement is a higher tier than the previously stored one
    if (!prev[habitId] || achievementId > prev[habitId]) {
      const updated = { ...prev, [habitId]: achievementId };
      localStorage.setItem(TOASTS_KEY, JSON.stringify(updated));
    }
  };

  // Check achievements for all habits

  useEffect(() => {
    if (!loaded) return;
    const alreadyShown = getShownToasts();
    const newToasts: Toast[] = [];
    const sortedAchievements = [...achievementsData].sort(
      (a, b) => b.days - a.days
    );

    habits.forEach((habit) => {
      const streakDays = habit.lastReset
        ? Math.floor(
            (Date.now() - new Date(habit.lastReset).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : 0;

      for (const ach of sortedAchievements) {
        if (streakDays >= ach.days) {
          const uniqueToastId = `${habit.id}-${ach.id}`;

          // Get the highest achievement ID that was previously shown for this habit
          const highestShownAchId = alreadyShown[habit.id];

          // Only add a new toast if a higher-tier achievement is unlocked
          if (!highestShownAchId || ach.id > highestShownAchId) {
            newToasts.push({
              id: uniqueToastId,
              message: `🎉 ${habit.name} unlocked: ${ach.title}!`,
            });
            // Update localStorage with the new highest achievement ID for this habit
            markToastAsShown(habit.id.toString(), ach.id);
            break; // Stop checking lower-tier achievements
          }
        }
      }
    });

    if (newToasts.length > 0) {
      setActiveToasts((prev) => [...prev, ...newToasts]);
    }
  }, [habits, loaded]);

  // Toast auto-remove

  useEffect(() => {
    if (activeToasts.length > 0) {
      const timer = setTimeout(() => {
        setActiveToasts((prev) => prev.slice(1));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [activeToasts]);

  // habit management

  const addHabit = (name: string) => {
    if (!name.trim()) return;

    const habit: Habit = {
      id: Date.now(),
      name,
      lastReset: new Date().toISOString(),
    };

    setHabits((prev) => [...prev, habit]);
  };

  const clearToastsForHabit = (habitId: number) => {
    const shownToasts = getShownToasts(); // returns an object mapping habitId to achievementId
    if (shownToasts.hasOwnProperty(habitId)) {
      delete shownToasts[habitId];
      localStorage.setItem(TOASTS_KEY, JSON.stringify(shownToasts));
    }
  };

  const deleteHabit = (id: number) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== id));
    clearToastsForHabit(id);
  };

  const resetHabit = (id: number) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id
          ? {
              ...habit,
              history: [
                ...(habit.history || []),
                habit.lastReset || new Date().toISOString(),
              ],
              lastReset: new Date().toISOString(),
            }
          : habit
      )
    );
    clearToastsForHabit(id);
  };

  return (
    <div className="space-y-4 font-patrick">
      <div className="flex flex-row justify-between items-center m-4">
        <h2 className="text-lg md:text-2xl font-bold pr-2">
          {getRandomMotivationalPhrase}
        </h2>
        <button className="btn btn-primary" onClick={() => setModalType("add")}>
          + Add Habit
        </button>
      </div>
      <div className="divider"></div>
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-4 m-4">
        {habits
          .map((habit) => (
            <HabitCard
              id={habit.id}
              key={habit.id}
              name={habit.name}
              lastReset={habit.lastReset}
              history={habit.history}
              onReset={() => {
                setSelectedHabit(habit);
                setModalType("reset");
              }}
              onDelete={() => {
                setSelectedHabit(habit);
                setModalType("delete");
              }}
            />
          ))
          .reverse()}
      </div>

      {/* Toast notifications */}
      <div className="toast toast-end z-50">
        {activeToasts.map((toast) => (
          <div className="alert alert-info shadow-lg" key={toast.id}>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      <Modal isOpen={modalType !== null} onClose={() => setModalType(null)}>
        {modalType === "add" && (
          <AddHabitForm
            onSave={(title) => {
              addHabit(title);
              setModalType(null);
            }}
          />
        )}

        {modalType === "delete" && (
          <ConfirmDialog
            message={`Delete "${selectedHabit?.name}"?`}
            onConfirm={() => {
              deleteHabit(selectedHabit!.id);
              setModalType(null);
            }}
            onCancel={() => setModalType(null)}
          />
        )}
        {modalType === "reset" && (
          <ConfirmDialog
            message={`Reset timer for "${selectedHabit?.name}"?`}
            onConfirm={() => {
              resetHabit(selectedHabit!.id);
              setModalType(null);
            }}
            onCancel={() => setModalType(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default HabitList;
