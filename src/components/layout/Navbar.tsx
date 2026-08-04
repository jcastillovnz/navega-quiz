import React from 'react';
import { Anchor, Flame, Award, Home } from 'lucide-react';

interface NavbarProps {
  onGoHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onGoHome }) => {
  return (
    <nav className="h-12 bg-slate-900 border-b border-white/10 px-4 flex items-center justify-between shrink-0 z-50">
      {/* Botón de Inicio / Logo */}
      <button 
        onClick={onGoHome}
        className="flex items-center gap-2 hover:opacity-80 transition-all cursor-pointer text-left bg-transparent border-0 p-0"
        title="Volver al Menú Principal"
      >
        <Anchor className="text-cyan-400 w-5 h-5" />
        <span className="text-base font-bold text-slate-50 tracking-tight">NavegaQuiz</span>
        <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/30 font-semibold hidden sm:inline-block">
          PNA Timonel
        </span>
      </button>

      {/* Acciones y Status */}
      <div className="flex items-center gap-2 sm:gap-3">
        {onGoHome && (
          <button
            onClick={onGoHome}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-lg border border-slate-700 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-all cursor-pointer shadow-sm"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Menú Principal</span>
          </button>
        )}

        <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700 text-xs">
          <Flame className="text-amber-500 w-3.5 h-3.5" />
          <span className="text-slate-200 font-bold text-xs">3 días</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700 text-xs">
          <Award className="text-cyan-400 w-3.5 h-3.5" />
          <span className="text-slate-200 font-bold text-xs">Grumete</span>
        </div>
      </div>
    </nav>
  );
};
