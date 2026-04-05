import React, { useState } from "react";
import { Star, Trophy, Target, Zap, Shield, Award, Lock, CheckCircle, TrendingUp, Gift, X } from "lucide-react";

{/* badge definitions */}

const SAVINGS_MILESTONES = [
  { id: 1, label: "First Deposit",  threshold: 1,     reward: "5 pts",   icon: "💰", color: "green"  },
  { id: 2, label: "Save 10 ALGO",   threshold: 10,    reward: "15 pts",  icon: "🏦", color: "blue"   },
  { id: 3, label: "Save 25 ALGO",   threshold: 25,    reward: "30 pts",  icon: "⚡", color: "yellow" },
  { id: 4, label: "Save 50 ALGO",   threshold: 50,    reward: "60 pts",  icon: "🔥", color: "orange" },
  { id: 5, label: "Save 100 ALGO",  threshold: 100,   reward: "150 pts", icon: "💎", color: "purple" },
  { id: 6, label: "Save 250 ALGO",  threshold: 250,   reward: "400 pts", icon: "👑", color: "amber"  },
];

const BADGE_DEFINITIONS = [
  { id: 1, name: "First Steps",   desc: "Made your first deposit",      icon: <Star size={28} />,       color: "green",  pts: 5,   threshold: 1   },
  { id: 2, name: "Vault Keeper",  desc: "Kept funds locked for 7 days", icon: <Shield size={28} />,     color: "blue",   pts: 20,  threshold: null },
  { id: 3, name: "Goal Setter",   desc: "Set your first savings goal",  icon: <Target size={28} />,     color: "purple", pts: 10,  threshold: null },
  { id: 4, name: "Half Way",      desc: "Reached 50% of your goal",     icon: <TrendingUp size={28} />, color: "yellow", pts: 25,  threshold: null },
  { id: 5, name: "Goal Crusher",  desc: "Hit your savings target",      icon: <Trophy size={28} />,     color: "orange", pts: 50,  threshold: null },
  { id: 6, name: "Diamond Saver", desc: "Saved 100+ ALGO",              icon: <Award size={28} />,      color: "cyan",   pts: 100, threshold: 100  },
  { id: 7, name: "Streak Master", desc: "10 consecutive deposits",      icon: <Zap size={28} />,        color: "red",    pts: 75,  threshold: null },
  { id: 8, name: "Grand Vault",   desc: "Saved 250+ ALGO",              icon: <Gift size={28} />,       color: "amber",  pts: 200, threshold: 250  },
];

const colorMap = {
  green:  { bg: "bg-green-500/20",  text: "text-green-400",  border: "border-green-500/50",  ring: "ring-green-500/50"  },
  blue:   { bg: "bg-blue-500/20",   text: "text-blue-400",   border: "border-blue-500/50",   ring: "ring-blue-500/50"   },
  purple: { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/50", ring: "ring-purple-500/50" },
  yellow: { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/50", ring: "ring-yellow-500/50" },
  orange: { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/50", ring: "ring-orange-500/50" },
  amber:  { bg: "bg-amber-500/20",  text: "text-amber-400",  border: "border-amber-500/50",  ring: "ring-amber-500/50"  },
  cyan:   { bg: "bg-cyan-500/20",   text: "text-cyan-400",   border: "border-cyan-500/50",   ring: "ring-cyan-500/50"   },
  red:    { bg: "bg-red-500/20",    text: "text-red-400",    border: "border-red-500/50",    ring: "ring-red-500/50"    },
};

// functions

function computeBadges(totalSavings: number, totalGoalsReached: number) {
  return BADGE_DEFINITIONS.map((b) => {
    let earned = false;
    if (b.id === 1) earned = totalSavings >= 1;
    else if (b.id === 3) earned = totalGoalsReached >= 1;
    else if (b.id === 5) earned = totalGoalsReached >= 1;
    else if (b.id === 6) earned = totalSavings >= 100;
    else if (b.id === 8) earned = totalSavings >= 250;
    // ids 2, 4, 7 require off-chain data — keep locked for now
    return { ...b, earned };
  });
}

// cards define

const BadgeCard = ({ badge }: { badge: any }) => {
  const [flipped, setFlipped] = useState(false);
  const c = colorMap[badge.color as keyof typeof colorMap];

  return (
    <div
      className="relative cursor-pointer select-none"
      style={{ perspective: "800px" }}
      onClick={() => setFlipped((f) => !f)}
    >
      <div
        style={{
          transition: "transform 0.55s cubic-bezier(.4,2,.6,1)",
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          position: "relative",
          minHeight: "160px",
        }}
      >
        {/* FRONT */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-slate-800 bg-[#020617] ${badge.earned ? "" : "opacity-50"}`}
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          <div className={`rounded-full p-3 ${c.bg} ${c.text} ${badge.earned ? `ring-2 ${c.ring}` : ""}`}>
            {badge.icon}
          </div>
          <p className="text-center text-sm font-semibold text-white">{badge.name}</p>
          {badge.earned ? (
            <span className={`flex items-center gap-1 rounded-full border ${c.border} px-2 py-0.5 text-xs font-medium ${c.text}`}>
              <CheckCircle size={11} /> Earned · {badge.pts} pts
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full border border-slate-700 px-2 py-0.5 text-xs font-medium text-slate-400">
              <Lock size={11} /> Locked
            </span>
          )}
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center rounded-xl border border-slate-800 bg-[#020617]"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <p className={`text-2xl font-bold ${c.text}`}>{badge.pts} pts</p>
          <p className="text-xs text-slate-400">{badge.desc}</p>
          {badge.earned && <CheckCircle size={20} className="text-green-400 mt-1" />}
        </div>
      </div>
    </div>
  );
};

// ─── MilestoneTrack ───────────────────────────────────────────────────────────

const MilestoneTrack = ({ savedAmount }: { savedAmount: number }) => (
  <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden h-full">
    <div className="flex items-center gap-3 border-b border-slate-800 p-4 bg-slate-800/30">
      <div className="w-fit rounded-lg bg-amber-500/20 p-2 text-amber-400">
        <Trophy size={22} />
      </div>
      <p className="font-semibold text-white">Savings Milestones</p>
    </div>
    <div className="p-6">
      <div className="relative mt-2">
        <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-slate-800" />
        <div className="flex flex-col gap-6">
          {SAVINGS_MILESTONES.map((m) => {
            const done = savedAmount >= m.threshold;
            const c = colorMap[m.color as keyof typeof colorMap];
            return (
              <div key={m.id} className="relative flex items-center gap-4">
                <div className={`z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-lg ${done ? `${c.bg} ring-2 ${c.ring}` : "bg-slate-800"}`}>
                  {done ? m.icon : <Lock size={14} className="text-slate-500" />}
                </div>
                <div className="flex flex-1 items-center justify-between">
                  <div>
                    <p className={`text-sm font-semibold ${done ? "text-white" : "text-slate-400"}`}>{m.label}</p>
                    <p className="text-xs text-slate-500">{m.threshold} ALGO required</p>
                  </div>
                  <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${done ? `${c.border} ${c.text}` : "border-slate-700 text-slate-500"}`}>
                    {done ? `✅ ${m.reward}` : m.reward}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
);

// ─── Main Modal ───────────────────────────────────────────────────────────────

type RewardsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  totalSavings: number;
  totalGoalsReached: number;
};

export default function RewardsModal({ isOpen, onClose, totalSavings, totalGoalsReached }: RewardsModalProps) {
  if (!isOpen) return null;

  const badges = computeBadges(totalSavings, totalGoalsReached);
  const earnedCount = badges.filter((b) => b.earned).length;
  const nextMilestone = SAVINGS_MILESTONES.find((m) => totalSavings < m.threshold);
  const progressToNext = nextMilestone
    ? Math.min((totalSavings / nextMilestone.threshold) * 100, 100)
    : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm sm:p-6">
      <div
        className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-800 bg-[#0f172a] shadow-2xl [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-800 bg-[#0f172a]/95 p-6 backdrop-blur-md">
          <div>
            <h1 className="text-2xl font-bold text-white">Your Rewards Hub</h1>
            <p className="text-sm text-slate-400">Track your progress, earn badges, and unlock milestones.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-colors cursor-pointer">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col gap-y-6 p-6">

          {/* ── Top stat cards ── */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

            {/* Total Savings (replaces Total Points) */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden">
              <div className="flex items-center gap-3 border-b border-slate-800 p-4">
                <div className="w-fit rounded-lg bg-cyan-500/20 p-2 text-cyan-400">
                  <TrendingUp size={20} />
                </div>
                <p className="font-semibold text-white">Total Savings</p>
              </div>
              <div className="p-4 bg-[#020617]/50">
                <p className="text-3xl font-bold text-cyan-400">{totalSavings.toFixed(2)}</p>
                <span className="mt-2 flex w-fit items-center gap-x-2 rounded-full border border-cyan-500/50 px-2 py-1 text-xs font-medium text-cyan-400 bg-cyan-500/10">
                  💰 ALGO Saved
                </span>
              </div>
            </div>

            {/* Goals Reached (replaces Badges count) */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden">
              <div className="flex items-center gap-3 border-b border-slate-800 p-4">
                <div className="w-fit rounded-lg bg-green-500/20 p-2 text-green-400">
                  <Trophy size={20} />
                </div>
                <p className="font-semibold text-white">Goals Reached</p>
              </div>
              <div className="p-4 bg-[#020617]/50">
                <p className="text-3xl font-bold text-white">{totalGoalsReached}</p>
                <span className="mt-2 flex w-fit items-center gap-x-2 rounded-full border border-green-500/50 px-2 py-1 text-xs font-medium text-green-400 bg-green-500/10">
                  🎯 Completed
                </span>
              </div>
            </div>

            {/* Next Milestone */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden">
              <div className="flex items-center gap-3 border-b border-slate-800 p-4">
                <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-400">
                  <Target size={20} />
                </div>
                <p className="font-semibold text-white">Next Target</p>
              </div>
              <div className="p-4 bg-[#020617]/50">
                <p className="text-3xl font-bold text-white">
                  {nextMilestone ? `${nextMilestone.threshold} ALGO` : "All done!"}
                </p>
                <span className="mt-2 flex w-fit items-center gap-x-2 rounded-full border border-blue-500/50 px-2 py-1 text-xs font-medium text-blue-400 bg-blue-500/10">
                  🎯 {nextMilestone ? nextMilestone.label : "Completed"}
                </span>
              </div>
            </div>

            {/* Progress to next */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden">
              <div className="flex items-center gap-3 border-b border-slate-800 p-4">
                <div className="w-fit rounded-lg bg-purple-500/20 p-2 text-purple-400">
                  <Award size={20} />
                </div>
                <p className="font-semibold text-white">Progress</p>
              </div>
              <div className="p-4 bg-[#020617]/50">
                <p className="text-3xl font-bold text-white">{progressToNext.toFixed(0)}%</p>
                <div className="mt-3 w-full">
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        progressToNext >= 100 ? "bg-green-400" : progressToNext >= 50 ? "bg-yellow-400" : "bg-cyan-400"
                      }`}
                      style={{ width: `${progressToNext}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">{earnedCount}/{badges.length} badges earned</p>
              </div>
            </div>
          </div>

          {/* ── Badges + Milestones ── */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
            <div className="col-span-1 lg:col-span-4 rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 p-4 bg-slate-800/30">
                <div className="flex items-center gap-3">
                  <div className="w-fit rounded-lg bg-purple-500/20 p-2 text-purple-400">
                    <Award size={20} />
                  </div>
                  <p className="font-semibold text-white">Achievement Badges</p>
                </div>
                <span className="text-xs text-slate-400 hidden sm:inline-block">Click badge to flip</span>
              </div>
              <div className="p-6 bg-[#020617]/30">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {badges.map((badge) => (
                    <BadgeCard key={badge.id} badge={badge} />
                  ))}
                </div>
              </div>
            </div>

            <div className="col-span-1 lg:col-span-3">
              <MilestoneTrack savedAmount={totalSavings} />
            </div>
          </div>

          {/* ── How to earn more ── */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden mb-4">
            <div className="flex items-center gap-3 border-b border-slate-800 p-4 bg-slate-800/30">
              <div className="w-fit rounded-lg bg-green-500/20 p-2 text-green-400">
                <Trophy size={20} />
              </div>
              <p className="font-semibold text-white">How to Earn More Rewards</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { icon: "💰", title: "Deposit ALGO",    desc: "Every deposit grows your savings.",        pts: "First Steps"   },
                  { icon: "🎯", title: "Hit Your Goal",   desc: "Complete goals to earn Goal Crusher.",     pts: "+50 pts"       },
                  { icon: "🔒", title: "Stay Consistent", desc: "Keep funds locked for Vault Keeper badge.", pts: "+20 pts"       },
                  { icon: "📈", title: "Save Milestones", desc: "Hit ALGO thresholds for milestone rewards.", pts: "Up to 400 pts" },
                ].map((tip, i) => (
                  <div key={i} className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-[#020617] p-4 hover:border-slate-700 transition-colors">
                    <span className="text-2xl">{tip.icon}</span>
                    <p className="text-sm font-semibold text-white">{tip.title}</p>
                    <p className="text-xs text-slate-400 flex-1">{tip.desc}</p>
                    <span className="w-fit rounded-full border border-green-500/50 px-2 py-0.5 text-xs font-medium text-green-400 bg-green-500/10 mt-1">
                      {tip.pts}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}