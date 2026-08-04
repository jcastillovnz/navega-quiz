import React from 'react';
import {
  Scale,
  Shield,
  Sailboat,
  Wind,
  Calculator,
  GraduationCap,
  ChevronRight,
  Star,
  Trophy,
  Anchor,
  Cable
} from 'lucide-react';
import { loadProgress, getBestScore, getAverageScore, loadExams } from '../../utils/storage';
import type { UserProgress } from '../../types/quiz';

export type ModuleId = 'RIPA' | 'SEGURIDAD' | 'NOMENCLATURA' | 'METEOROLOGIA' | 'PRACTICOS' | 'NUDOS' | 'EXAMEN';

interface ModuleCard {
  id: ModuleId;
  number: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  borderColor: string;
  iconColor: string;
}

const MODULES: ModuleCard[] = [
  {
    id: 'RIPA',
    number: 1,
    title: 'RIPA & IALA',
    description: 'Luces, reglas de paso y balizamiento',
    icon: Scale,
    gradient: 'from-cyan-500/20 to-cyan-500/5',
    borderColor: 'hover:border-cyan-500/60',
    iconColor: 'text-cyan-400'
  },
  {
    id: 'SEGURIDAD',
    number: 2,
    title: 'Seguridad & Fondeo',
    description: 'Inventario PNA, HAA y maniobra',
    icon: Shield,
    gradient: 'from-rose-500/20 to-rose-500/5',
    borderColor: 'hover:border-rose-500/60',
    iconColor: 'text-rose-400'
  },
  {
    id: 'NOMENCLATURA',
    number: 3,
    title: 'Nomenclatura',
    description: 'Casco, jarcia y arboladura',
    icon: Sailboat,
    gradient: 'from-amber-500/20 to-amber-500/5',
    borderColor: 'hover:border-amber-500/60',
    iconColor: 'text-amber-400'
  },
  {
    id: 'METEOROLOGIA',
    number: 4,
    title: 'Meteorología',
    description: 'Beaufort, Pampero y Sudestada',
    icon: Wind,
    gradient: 'from-sky-500/20 to-sky-500/5',
    borderColor: 'hover:border-sky-500/60',
    iconColor: 'text-sky-400'
  },
  {
    id: 'PRACTICOS',
    number: 5,
    title: 'Ejercicios Prácticos',
    description: 'Declinación, mareas y marcaciones',
    icon: Calculator,
    gradient: 'from-emerald-500/20 to-emerald-500/5',
    borderColor: 'hover:border-emerald-500/60',
    iconColor: 'text-emerald-400'
  },
  {
    id: 'NUDOS',
    number: 6,
    title: 'Nudos Náuticos',
    description: 'Los 5 nudos esenciales del examen',
    icon: Cable,
    gradient: 'from-pink-500/20 to-pink-500/5',
    borderColor: 'hover:border-pink-500/60',
    iconColor: 'text-pink-400'
  }
];

interface DashboardViewProps {
  onSelectModule: (id: ModuleId) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onSelectModule }) => {
  const [progress, setProgress] = React.useState<UserProgress | null>(null);
  const [bestScore, setBestScore] = React.useState(0);
  const [avgScore, setAvgScore] = React.useState(0);
  const [examCount, setExamCount] = React.useState(0);

  React.useEffect(() => {
    setProgress(loadProgress());
    setBestScore(getBestScore());
    setAvgScore(getAverageScore());
    setExamCount(loadExams().length);
  }, []);

  return (
    <div className="flex-1 flex flex-col gap-3 min-h-0 overflow-hidden">
      {/* Hero compacto */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700 rounded-2xl p-3 shrink-0">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <Anchor className="w-4 h-4 text-cyan-400" />
              <h1 className="text-xl md:text-2xl font-bold text-white">¡Bienvenido a bordo!</h1>
            </div>
            <p className="text-slate-300 text-xs">
              {progress && progress.xp > 0
                ? `Continuá tu preparación para el examen de Timonel de Yate Vela y Motor.`
                : `Elegí un módulo para empezar. Teoría visual + práctica + examen final.`}
            </p>
          </div>

          {progress && progress.xp > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              <StatChip
                icon={<Trophy className="w-3 h-3" />}
                label="Mejor"
                value={`${bestScore}%`}
                color="text-amber-300"
              />
              <StatChip
                icon={<Star className="w-3 h-3 fill-amber-400 text-amber-400" />}
                label="Prom."
                value={`${avgScore}%`}
                color="text-cyan-300"
              />
              <StatChip
                icon={<GraduationCap className="w-3 h-3" />}
                label="Ex."
                value={String(examCount)}
                color="text-emerald-300"
              />
            </div>
          )}
        </div>
      </div>

      {/* Grid de módulos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 flex-1 min-h-0 content-start">
        {MODULES.map(m => {
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              onClick={() => onSelectModule(m.id)}
              className={`group text-left bg-gradient-to-br ${m.gradient} bg-slate-800/50 border-2 border-slate-700 ${m.borderColor} rounded-xl p-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]`}
            >
              <div className="flex items-start justify-between mb-1.5">
                <div className={`p-1.5 rounded-lg bg-slate-900/60 border border-slate-700 ${m.iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider bg-slate-900/60 px-1.5 py-0.5 rounded">
                  M{m.number}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mb-0.5">{m.title}</h3>
              <p className="text-[11px] text-slate-400 mb-2 line-clamp-1">{m.description}</p>
              <div className="flex items-center text-[10px] font-bold text-slate-300 group-hover:text-cyan-300 transition-colors">
                Empezar
                <ChevronRight className="w-3 h-3 ml-0.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>

      {/* CTA Examen Final */}
      <button
        onClick={() => onSelectModule('EXAMEN')}
        className="group relative w-full bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-amber-500/20 border-2 border-amber-500/40 hover:border-amber-500 rounded-xl p-3 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl hover:shadow-amber-500/20 active:scale-[0.99] shrink-0"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/40">
            <GraduationCap className="w-6 h-6 text-amber-300" />
          </div>
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-base font-bold text-amber-200">Simulador de Examen Real PNA</h3>
              <span className="text-[9px] font-bold bg-amber-500/30 text-amber-100 px-1.5 py-0.5 rounded-full">
                DESAFÍO FINAL
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              40 puntos • 60 minutos • Cronómetro estricto
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-amber-300 group-hover:translate-x-1 transition-transform" />
        </div>
      </button>
    </div>
  );
};

const StatChip: React.FC<{ icon: React.ReactNode; label: string; value: string; color: string }> = ({
  icon,
  label,
  value,
  color
}) => (
  <div className="flex items-center gap-1 bg-slate-900/60 border border-slate-700 px-2 py-0.5 rounded-full">
    {icon}
    <span className="text-[9px] text-slate-400 uppercase tracking-wider">{label}</span>
    <span className={`text-xs font-bold ${color}`}>{value}</span>
  </div>
);
