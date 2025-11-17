import { useEffect, useMemo, useState } from "react";
import HabitCard from "./HabitCard";
import Modal from "./Modal";
import AddHabitForm from "./AddHabitForm";
import ConfirmDialog from "./ConfirmDialog";
import { useHabitsStore } from "../stores/useHabitsStore";
import { useToastStore } from "../stores/useToastStore";
import { useToastAutoRemove } from "../hooks/useToastAutoRemove";
import { useAchievements } from "../hooks/useAchievements";
import { getRandomPhrase } from "../utils/getRandomPhrase";

const HabitList = () => {
  const { habits, load, addHabit, deleteHabit, resetHabit } = useHabitsStore();
  const { toasts } = useToastStore();

  const [modalType, setModalType] = useState<"add" | "delete" | "reset" | null>(
    null
  );
  const [selectedHabitId, setSelectedHabitId] = useState<number | null>(null);

  useToastAutoRemove();
  useAchievements();

  useEffect(() => {
    load();
  }, []);

  const phrase = useMemo(() => getRandomPhrase(), []);
  const selectedHabit = habits.find((h) => h.id === selectedHabitId);

  return (
    <div className="space-y-4 font-patrick bg-base-200">
      <div className="flex flex-row justify-between items-center m-4">
        <h2 className="text-primary text-lg md:text-2xl font-bold pr-2">
          {phrase}
        </h2>
        <button className="btn btn-primary" onClick={() => setModalType("add")}>
          + Add Habit
        </button>
      </div>

      <div className="divider"></div>

      <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-4 m-4">
        {habits
          .slice()
          .reverse()
          .map((habit) => (
            <HabitCard
              key={habit.id}
              id={habit.id}
              onReset={() => {
                setSelectedHabitId(habit.id);
                setModalType("reset");
              }}
              onDelete={() => {
                setSelectedHabitId(habit.id);
                setModalType("delete");
              }}
            />
          ))}
      </div>

      {/* Toast */}
      <div className="toast toast-end z-50">
        {toasts.map((toast) => (
          <div className="alert alert-success shadow-lg" key={toast.id}>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Modal */}
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
              if (!selectedHabit) return;
              deleteHabit(selectedHabit.id);
              setModalType(null);
            }}
            onCancel={() => setModalType(null)}
          />
        )}

        {modalType === "reset" && (
          <ConfirmDialog
            message={`Reset timer for "${selectedHabit?.name}"?`}
            onConfirm={() => {
              if (!selectedHabit) return;
              resetHabit(selectedHabit.id);
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
