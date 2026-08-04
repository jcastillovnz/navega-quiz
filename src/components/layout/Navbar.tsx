import React from 'react';
import { Anchor, Flame } from 'lucide-react';

export const Navbar: React.FC = () => {
  // En el futuro, la racha vendrá del localStorage (Tarea 24)
  const streakCount = 3;

  return (
    <nav className="bg-slate-900 border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <Anchor className="text-cyan-400 w-8 h-8" />
            <span className="text-xl font-bold text-slate-50 tracking-tight">NavegaQuiz</span>
          </div>

          {/* Gamification / Stats */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700 shadow-inner">
              <Flame className="text-amber-500 w-5 h-5 drop-shadow-md" />
              <span className="text-slate-200 font-medium">{streakCount} días</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
