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
    <nav className="bg-slate-900 border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <Anchor className="text-cyan-400 w-8 h-8" />
            <span className="text-xl font-bold text-slate-50 tracking-tight">NavegaQuiz</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700 shadow-inner">
              <span className="text-xs text-cyan-300 font-bold uppercase tracking-wider">{rank}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700 shadow-inner">
              <Star className="text-amber-400 w-4 h-4 fill-amber-400" />
              <span className="text-slate-200 font-medium text-sm">{xp} XP</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700 shadow-inner">
              <Flame className="text-amber-500 w-5 h-5 drop-shadow-md" />
              <span className="text-slate-200 font-medium text-sm">{streak} días</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
