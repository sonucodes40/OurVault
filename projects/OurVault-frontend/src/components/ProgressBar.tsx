import React from 'react';
import { Trophy } from 'lucide-react';

interface ProgressBarProps {
  currentCount?: number;
  totalCount?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentCount = 0, totalCount = 5 }) => {
  // Keep math safe and cap the count so it doesn't go over the total
  const total = totalCount > 0 ? totalCount : 1;
  const count = Math.min(Math.max(0, currentCount), total);
  const percentage = (count / total) * 100;
  const isComplete = percentage === 100;

  // Turn green when finished, otherwise stay cyan
  const barColor = isComplete ? 'bg-green-500' : 'bg-cyan-500';

  return (
    <div className="flex justify-between items-start p-5 rounded-2xl border transition border-yellow-500/30 bg-linear-to-br from-[#0f172a] to-[#020617] hover:border-slate-700">
      
      {/* Left side: Text and Progress Bar */}
      <div className="w-full mr-4">
        <p className="text-xs text-slate-400 tracking-widest mb-2 uppercase">
          Milestones
        </p>

        <h2 className="text-2xl font-semibold mb-1 text-yellow-400">
          {count} / {total}
        </h2>

        {/* Show completion percentage */}
        <p className="text-sm text-slate-500 mb-4">
          {Math.round(percentage)}%
        </p>

        {/* Bar background */}
        <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
          {/* Colored fill */}
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out shadow-sm ${barColor}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Right side: Icon */}
      <div className="bg-slate-800/60 p-3 rounded-xl text-slate-300 shrink-0">
        <Trophy size={20} />
      </div>

    </div>
  );
};

export default ProgressBar;