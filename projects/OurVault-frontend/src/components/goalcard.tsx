type CardProps = {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  highlight?: boolean;
  onEditClick?: () => void;
};

export const GoalCard = ({ title, value, subtitle, icon, highlight, onEditClick }: CardProps) => {
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

        <p className="text-sm text-slate-500">{subtitle}</p>
        <button
            onClick={onEditClick}
            className="mt-3 text-xs text-yellow-400 hover:text-yellow-300 transition"
            >
            Edit Goal
            </button>
      </div>

      {/* Icon */}
      <div className="bg-slate-800/60 p-3 rounded-xl text-slate-300">
        {icon}
      </div>
    </div>
  );
};
