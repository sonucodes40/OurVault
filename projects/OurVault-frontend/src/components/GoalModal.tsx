import { useEffect, useRef, useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: number, duration: number) => void;
  currentGoal: number;
};

export const GoalModal = ({
  isOpen,
  onClose,
  onSave,
  currentGoal,
}: Props) => {
  const [goal, setGoal] = useState<number>(currentGoal);
  const [deadline, setDeadline] = useState<string>("");

  const modalRef = useRef<HTMLDivElement | null>(null);

  const isGoalSet = currentGoal > 0;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (modalRef.current && !modalRef.current.contains(target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // ✅ Convert date → seconds
  
  const calculateDuration = () => {
    if (!deadline) return 0;

    const selected = new Date(deadline).getTime();
    const now = Date.now();

    return Math.floor((selected - now) / 1000); // seconds
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-[#020617] p-6 rounded-2xl border border-slate-800 w-80"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg text-white">Set Goal</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Warning */}
        {isGoalSet && (
          <p className="text-yellow-400 text-sm mb-2">
            Goal already set. Cannot edit.
          </p>
        )}

        {/* Goal Input */}
        <input
          type="number"
          value={goal}
          disabled={isGoalSet}
          onChange={(e) => setGoal(Number(e.target.value))}
          className="w-full p-2 mb-3 rounded bg-slate-900 text-white"
          placeholder="Enter goal (ALGO)"
        />

        {/* Deadline Input */}
        <input
          type="datetime-local"
          disabled={isGoalSet}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-slate-900 text-white"
        />

        {/* Save */}
        <button
          disabled={isGoalSet}
          onClick={() => {
            const duration = calculateDuration();

            if (duration <= 0) {
              alert("Select valid future deadline");
              return;
            }

            onSave(goal, duration);
            onClose();
          }}
          className="w-full bg-yellow-500 text-black py-2 rounded"
        >
          Save Goal
        </button>
      </div>
    </div>
  );
};