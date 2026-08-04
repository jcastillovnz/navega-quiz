import React, { useEffect, useState } from 'react';
import { Anchor, Flame, Star } from 'lucide-react';
import { loadProgress } from '../../utils/storage';

export const Navbar: React.FC = () => {
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [rank, setRank] = useState('Grumete');

  useEffect(() => {
    const p = loadProgress();
    setStreak(p.currentStreak);
    setXp(p.xp);
    setRank(p.rank);
  }, []);

  return (
    <nav className="bg-slate-900 border-b border-white/10 shrink-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          <div className="flex items-center gap-2">
            <Anchor className="text-cyan-400 w-6 h-6" />
            <span className="text-base font-bold text-slate-50 tracking-tight">NavegaQuiz</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="hidden sm:flex items-center gap-1 bg-slate-800/50 px-2 py-0.5 rounded-full border border-slate-700 shadow-inner">
              <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider">{rank}</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-800/50 px-2 py-0.5 rounded-full border border-slate-700 shadow-inner">
              <Star className="text-amber-400 w-3.5 h-3.5 fill-amber-400" />
              <span className="text-slate-200 font-medium text-xs">{xp} XP</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-800/50 px-2 py-0.5 rounded-full border border-slate-700 shadow-inner">
              <Flame className="text-amber-500 w-3.5 h-3.5 drop-shadow-md" />
              <span className="text-slate-200 font-medium text-xs">{streak}d</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
