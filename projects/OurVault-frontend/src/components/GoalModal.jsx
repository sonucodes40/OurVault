import { useEffect, useRef, useState } from "react";

export const GoalModal = ({ isOpen, onClose, onSave, currentGoal }) => {
  const [goal, setGoal] = useState(currentGoal);
  const modalRef = useRef();

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose(); // keep old goal
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      
      <div
        ref={modalRef}
        className="bg-[#020617] p-6 rounded-2xl border border-slate-800 w-80"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg text-white">Set Goal</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        {/* Input */}
        <input
          type="number"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white mb-4"
          placeholder="Enter goal"
        />

        {/* Save */}
        <button
          onClick={() => {
            onSave(goal);
            onClose();
          }}
          className="w-full bg-yellow-500 text-black py-2 rounded-lg hover:bg-yellow-400"
        >
          Save Goal
        </button>
      </div>
    </div>
  );
};