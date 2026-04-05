import { useEffect, useState } from "react";

type CardProps = {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  highlight?: boolean;
  onEditClick?: () => void;
  deadline?: number; 
    goal?: number;      
  goalReached?: number;
};

export const GoalCard = ({
  title,
  value,
  subtitle,
  icon,
  highlight,
  onEditClick,
  deadline,
  goal,
  goalReached,
}: CardProps) => {
    const [timeLeft, setTimeLeft] = useState<string>("");
    const isLocked = !!goal && goal > 0 && !goalReached;
  useEffect(() => {
    if (!deadline) return;

    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000); // current time (seconds)
      const diff = deadline - now;

      if (diff <= 0) {
        setTimeLeft("Deadline passed");
        return;
      }

      const days = Math.floor(diff / (24 * 60 * 60));
      const hours = Math.floor((diff % (24 * 60 * 60)) / (60 * 60));

      setTimeLeft(`${days}d ${hours}h remaining`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [deadline]);

  return (
    <div
      className={`flex justify-between items-start p-5 rounded-2xl border transition
        ${
          highlight
            ? "border-yellow-500/30"
            : "border-slate-800"
        }
        bg-linear-to-br from-[#0f172a] to-[#020617] hover:border-slate-700`}
    >
      {/* Left */}
      <div>
        <p className="text-xs text-slate-400 tracking-widest mb-2 uppercase">
          {title}
        </p>

        <h2
          className={`text-2xl font-semibold mb-1 ${
            highlight ? "text-yellow-400" : "text-cyan-400"
          }`}
        >
          {value}
        </h2>

        <p className="text-sm text-slate-500">
          {timeLeft || subtitle}
        </p>

        <button
        onClick={() => {
            if (isLocked) {
            alert("Active goal already exists 🔒");
            return;
            }
            onEditClick?.();
        }}
        disabled={isLocked}
        className={`mt-3 text-xs transition ${
            isLocked
            ? "text-slate-500 cursor-not-allowed"
            : "text-yellow-400 hover:text-yellow-300 cursor-pointer"
        }`}
        >
        {isLocked ? "Goal Active 🔒" : "Edit Goal"}
        </button>
      </div>

      {/* Icon */}
      <div className="bg-slate-800/60 p-3 rounded-xl text-slate-300">
        {icon}
      </div>
    </div>
  );
};