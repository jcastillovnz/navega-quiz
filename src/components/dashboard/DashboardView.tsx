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

export type ModuleId = 'RIPA' | 'IALA' | 'SEGURIDAD' | 'NOMENCLATURA' | 'METEOROLOGIA' | 'PRACTICOS' | 'NUDOS' | 'EXAMEN';

interface ModuleCard {
  id: ModuleId;
  number?: number;
  badge?: string;
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
    title: 'RIPA',
    description: 'Reglas de paso, luces, marcas y señales acústicas',
    icon: Scale,
    gradient: 'from-cyan-500/20 to-cyan-500/5',
    borderColor: 'hover:border-cyan-500/60 border-slate-700/80',
    iconColor: 'text-cyan-400'
  },
  {
    id: 'IALA',
    number: 2,
    title: 'Balizamiento IALA',
    description: 'Laterales, cardinales, peligros y señales especiales',
    icon: Anchor,
    gradient: 'from-blue-500/20 to-blue-500/5',
    borderColor: 'hover:border-blue-500/60 border-slate-700/80',
    iconColor: 'text-blue-400'
  },
  {
    id: 'SEGURIDAD',
    number: 3,
    title: 'Seguridad & Fondeo',
    description: 'Inventario PNA, rescate HAA y maniobra de fondeo',
    icon: Shield,
    gradient: 'from-rose-500/20 to-rose-500/5',
    borderColor: 'hover:border-rose-500/60 border-slate-700/80',
    iconColor: 'text-rose-400'
  },
  {
    id: 'NOMENCLATURA',
    number: 4,
    title: 'Nomenclatura',
    description: 'Casco, francobordo, jarcia y arboladura',
    icon: Sailboat,
    gradient: 'from-amber-500/20 to-amber-500/5',
    borderColor: 'hover:border-amber-500/60 border-slate-700/80',
    iconColor: 'text-amber-400'
  },
  {
    id: 'METEOROLOGIA',
    number: 5,
    title: 'Meteorología',
    description: 'Escala Beaufort, Pampero y Sudestada',
    icon: Wind,
    gradient: 'from-sky-500/20 to-sky-500/5',
    borderColor: 'hover:border-sky-500/60 border-slate-700/80',
    iconColor: 'text-sky-400'
  },
  {
    id: 'NUDOS',
    number: 6,
    title: 'Nudos Náuticos',
    description: 'Los 5 nudos esenciales con secuencias detalladas',
    icon: Cable,
    gradient: 'from-pink-500/20 to-pink-500/5',
    borderColor: 'hover:border-pink-500/60 border-slate-700/80',
    iconColor: 'text-pink-400'
  },
  {
    id: 'PRACTICOS',
    number: 7,
    title: 'Ejercicios Prácticos',
    description: 'Carta, declinación, mareas, marcaciones y tiempo',
    icon: Calculator,
    gradient: 'from-emerald-500/20 to-emerald-500/5',
    borderColor: 'hover:border-emerald-500/60 border-slate-700/80',
    iconColor: 'text-emerald-400'
  },
  {
    id: 'EXAMEN',
    badge: 'Desafío final',
    title: 'Examen Real PNA',
    description: '40 preguntas, 60 minutos y cronómetro estricto',
    icon: GraduationCap,
    gradient: 'from-amber-500/25 to-amber-500/5',
    borderColor: 'hover:border-amber-400/80 border-amber-500/40',
    iconColor: 'text-amber-300'
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
    <div className="h-full flex flex-col gap-2 min-h-0 min-w-0 overflow-hidden">
      {/* Hero compacto */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-2.5 shrink-0 shadow-lg">
        <div className="flex items-center justify-between gap-3 flex-wrap min-w-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <Anchor className="w-5 h-5 text-cyan-400" />
              <h1 className="text-lg md:text-xl font-extrabold text-white tracking-tight leading-tight">¡Bienvenido a bordo!</h1>
            </div>
            <p className="text-slate-300 text-xs font-medium">
              {progress && progress.xp > 0
                ? `Continuá tu preparación para el examen de Timonel de Yate Vela y Motor.`
                : `Elegí un módulo para empezar. Teoría visual fotorrealista + práctica + examen final.`}
            </p>
          </div>

          {progress && progress.xp > 0 && (
            <div className="flex gap-2 flex-wrap">
              <StatChip
                icon={<Trophy className="w-3.5 h-3.5" />}
                label="Mejor"
                value={`${bestScore}%`}
                color="text-amber-300"
              />
              <StatChip
                icon={<Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />}
                label="Prom."
                value={`${avgScore}%`}
                color="text-cyan-300"
              />
              <StatChip
                icon={<GraduationCap className="w-3.5 h-3.5" />}
                label="Ex."
                value={String(examCount)}
                color="text-emerald-300"
              />
            </div>
          )}
        </div>
      </div>

      {/* Grid de módulos que ocupa el 100% del alto restante (Sin Espacio Vacío) */}
      <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-4 md:grid-rows-2 gap-2 flex-1 min-h-0">
        {MODULES.map(m => {
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              onClick={() => onSelectModule(m.id)}
              className={`group min-w-0 min-h-0 text-left bg-gradient-to-br ${m.gradient} bg-slate-900/90 border-2 ${m.borderColor} rounded-2xl p-2.5 lg:p-3 flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl active:scale-[0.99] cursor-pointer h-full overflow-hidden`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className={`p-1.5 rounded-xl bg-slate-950 border border-slate-800 ${m.iconColor} group-hover:scale-110 transition-transform shrink-0`}>
                    <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
                  </div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wide bg-slate-950 px-1.5 py-0.5 rounded-full border border-slate-800 whitespace-nowrap">
                    {m.badge ?? `Módulo ${m.number}`}
                  </span>
                </div>
                <h3 className="text-sm lg:text-base font-extrabold text-white mb-1 group-hover:text-cyan-300 transition-colors leading-tight break-words">{m.title}</h3>
                <p className="text-[10px] lg:text-[11px] xl:text-xs text-slate-300 leading-snug font-medium break-words">{m.description}</p>
              </div>

              <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-slate-800/80 text-[10px] lg:text-xs font-bold text-slate-200 group-hover:text-cyan-400 transition-colors mt-1.5 shrink-0">
                <span className="whitespace-nowrap">Ingresar</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
};

const StatChip: React.FC<{ icon: React.ReactNode; label: string; value: string; color: string }> = ({
  icon,
  label,
  value,
  color
}) => (
  <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 px-2.5 py-1 rounded-full">
    {icon}
    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{label}</span>
    <span className={`text-xs font-black ${color}`}>{value}</span>
  </div>
);
