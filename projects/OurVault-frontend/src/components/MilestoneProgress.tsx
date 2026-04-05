"use client";
import React, { useState } from "react";
import { TrendingUp, CheckCircle } from "lucide-react";
import clsx from "clsx";
import RewardsModal from "./reward";

type Milestone = {
  title: string;
  amount: number;
  icon: string;
};

type Props = {
  totalSaving?: number;
  totalGoalReached?: number;
};

const milestones: Milestone[] = [
  { title: "Starter", amount: 1, icon: "🌱" },
  { title: "Saver", amount: 5, icon: "💎" },
  { title: "Hodler", amount: 10, icon: "🚀" },
  { title: "Whale", amount: 50, icon: "🐳" },
  { title: "Legend", amount: 100, icon: "👑" },
  { title: "Grinder", amount: 150, icon: "⚒️" },
  { title: "Collector", amount: 200, icon: "📦" },
  { title: "Strategist", amount: 300, icon: "🧠" },
  { title: "Investor", amount: 500, icon: "📈" },
  { title: "Tycoon", amount: 750, icon: "🏦" },
  { title: "Mogul", amount: 1000, icon: "💼" },
  { title: "Elite", amount: 1500, icon: "🧿" },
  { title: "Overlord", amount: 2000, icon: "⚡" },
  { title: "Titan", amount: 3000, icon: "🗿" },
  { title: "Mythic", amount: 5000, icon: "🔥" },
  { title: "Immortal", amount: 10000, icon: "🌌" },
  { title: "God Mode", amount: 20000, icon: "⚜️" },
];

export default function MilestoneCard({ totalSaving = 0, totalGoalReached = 0 }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const totalSavings = totalSaving; 

  const achieved = milestones.filter((m) => totalSavings >= m.amount);
  const nextMilestone = milestones.find((m) => totalSavings < m.amount);

  return (
    <>
      <div className="w-full max-w-3xl p-6 rounded-2xl border border-slate-800 bg-linear-to-br from-[#0f172a] to-[#020617] shadow-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-cyan-400" size={18} />
            <h2 className="text-white font-semibold">
              Milestones
            </h2>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-xs px-3 py-1.5 rounded-lg border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition cursor-pointer"
          >
            View Details
          </button>
        </div>

        {/* Total Savings & Goals */}
        <div className="flex justify-between gap-6">
          <div className="flex-1">
            <p className="text-sm text-slate-400">
              Total Savings
            </p>
            <h1 className="text-3xl font-bold text-cyan-400">
              {totalSavings.toFixed(2)} ALGO
            </h1>
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-400">
              Goals Reached
            </p>
            <h1 className="text-3xl font-bold text-cyan-400">
              {totalGoalReached}
            </h1>
          </div>
        </div>

        {/* Badges */}
        <div className="mt-6">
          <p className="text-sm text-slate-400 mb-3">
            Your Badges
          </p>

          {achieved.length === 0 ? (
            <p className="text-xs text-slate-500">
              No milestones unlocked yet 🚀
            </p>
          ) : (
            <div className="relative">
              {/* Left Fade */}
              <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-linear-to-r from-[#020617] to-transparent z-10" />

              {/* Right Fade */}
              <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-linear-to-l from-[#020617] to-transparent z-10" />

              {/* Scroll Area */}
              <div className="flex gap-4 overflow-x-auto pb-3 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-cyan-500/40 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-cyan-400/70 scroll-smooth">
                {achieved.map((m, i) => (
                  <div
                    key={i}
                    className="min-w-25 flex flex-col items-center justify-center p-4 rounded-xl border border-cyan-500/40 bg-cyan-500/10 shrink-0 hover:scale-105 transition"
                  >
                    <div className="text-2xl mb-2">
                      {m.icon}
                    </div>
                    <p className="text-sm font-medium text-cyan-400">
                      {m.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      {m.amount} ALGO
                    </p>
                    <CheckCircle
                      size={16}
                      className="text-cyan-400 mt-2"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="mt-6 space-y-3">
          {/* Next Milestone */}
          {nextMilestone && (
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40">
              <p className="text-xs text-slate-400">
                Next Milestone
              </p>
              <p className="text-sm text-white font-medium">
                {nextMilestone.title} ({nextMilestone.amount} ALGO)
              </p>
              <p className="text-xs text-cyan-400 mt-1">
                {(nextMilestone.amount - totalSavings).toFixed(2)} ALGO more to unlock 🚀
              </p>
            </div>
          )}

          {/* Stats */}
          <p className="text-xs text-slate-500">
            You’ve unlocked {achieved.length} milestones so far 🎉
          </p>
        </div>
      </div>

      {/* The Modal */}
      <RewardsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        totalSavings={totalSavings} 
      />
    </>
  );
}