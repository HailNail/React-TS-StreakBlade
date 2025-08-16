import { useEffect, useState } from "react";
import HabitCard from "./HabitCard";
import Modal from "./Modal";
import AddHabitForm from "./AddHabitForm";
import ConfirmDialog from "./ConfirmDialog";
import motivatedPhrases from "../utils/motivatedPhrases.json";

interface Habit {
  id: number;
  name: string;
  lastReset?: string;
  history?: string[];
  habit?: string;
}

const STORAGE_KEY = "streakblade_habits";

const HabitList = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"add" | "delete" | "reset" | null>(
    null
  );
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

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

  const getRandomMotivationalPhrase = () => {
    const randomIndex = Math.floor(Math.random() * motivatedPhrases.length);
    return motivatedPhrases[randomIndex].phrase;
  };

  const addHabit = (name: string) => {
    if (!name.trim()) return;

    const habit: Habit = {
      id: Date.now(),
      name,
      lastReset: new Date().toISOString(),
    };

    setHabits((prev) => [...prev, habit]);
  };

  const deleteHabit = (id: number) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== id));
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
  };

  return (
    <div className="space-y-4 font-patrick">
      <div className="flex flex-row justify-between items-center m-4">
        <h2 className="text-lg md:text-2xl font-bold pr-2">
          {getRandomMotivationalPhrase()}
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
