import { useState } from "react";

type AddHabitFormProps = {
  onSave: (title: string) => void;
};

export default function AddHabitForm({ onSave }: AddHabitFormProps) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Please enter a pernicious habit name");
      return;
    }

    onSave(title.trim());
    setTitle("");
    setError("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h3 className="text-lg font-bold">Add New Pernicious Habit</h3>

      <div>
        <input
          type="text"
          placeholder="Pernicious habit name..."
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError("");
          }}
          className={`input input-bordered w-full mb-2 text-lg ${
            error ? "input-error" : ""
          }`}
        />
        {error && (
          <p className="pl-3 text-error text-md font-semibold">{error}</p>
        )}
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setTitle("")}
          >
            Clear
          </button>
          <button type="submit" className="btn btn-primary">
            Add
          </button>
        </div>
      </div>
    </form>
  );
}
