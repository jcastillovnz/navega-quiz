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
    description: 'Luces de navegación, reglas de paso y balizamiento',
    icon: Scale,
    gradient: 'from-cyan-500/20 to-cyan-500/5',
    borderColor: 'hover:border-cyan-500/60 border-slate-700/80',
    iconColor: 'text-cyan-400'
  },
  {
    id: 'SEGURIDAD',
    number: 2,
    title: 'Seguridad & Fondeo',
    description: 'Inventario PNA, rescate HAA y maniobra de fondeo',
    icon: Shield,
    gradient: 'from-rose-500/20 to-rose-500/5',
    borderColor: 'hover:border-rose-500/60 border-slate-700/80',
    iconColor: 'text-rose-400'
  },
  {
    id: 'NOMENCLATURA',
    number: 3,
    title: 'Nomenclatura',
    description: 'Casco, francobordo, jarcia y arboladura',
    icon: Sailboat,
    gradient: 'from-amber-500/20 to-amber-500/5',
    borderColor: 'hover:border-amber-500/60 border-slate-700/80',
    iconColor: 'text-amber-400'
  },
  {
    id: 'METEOROLOGIA',
    number: 4,
    title: 'Meteorología',
    description: 'Escala Beaufort, Pampero y Sudestada',
    icon: Wind,
    gradient: 'from-sky-500/20 to-sky-500/5',
    borderColor: 'hover:border-sky-500/60 border-slate-700/80',
    iconColor: 'text-sky-400'
  },
  {
    id: 'PRACTICOS',
    number: 5,
    title: 'Ejercicios Prácticos',
    description: 'Declinación magnética, mareas y marcaciones',
    icon: Calculator,
    gradient: 'from-emerald-500/20 to-emerald-500/5',
    borderColor: 'hover:border-emerald-500/60 border-slate-700/80',
    iconColor: 'text-emerald-400'
  },
  {
    id: 'NUDOS',
    number: 6,
    title: 'Nudos Náuticos',
    description: 'Los 5 nudos esenciales con visor 3D y desafío',
    icon: Cable,
    gradient: 'from-pink-500/20 to-pink-500/5',
    borderColor: 'hover:border-pink-500/60 border-slate-700/80',
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
    <div className="h-full flex flex-col gap-3 min-h-0 min-w-0 overflow-hidden">
      {/* Hero compacto */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-3.5 shrink-0 shadow-lg">
        <div className="flex items-center justify-between gap-3 flex-wrap min-w-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <Anchor className="w-5 h-5 text-cyan-400" />
              <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">¡Bienvenido a bordo!</h1>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 flex-1 min-h-0 sm:grid-rows-2">
        {MODULES.map(m => {
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              onClick={() => onSelectModule(m.id)}
              className={`group text-left bg-gradient-to-br ${m.gradient} bg-slate-900/90 border-2 ${m.borderColor} rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl active:scale-[0.99] cursor-pointer h-full`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl bg-slate-950 border border-slate-800 ${m.iconColor} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800">
                    Módulo {m.number}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-white mb-1 group-hover:text-cyan-300 transition-colors">{m.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-medium line-clamp-2">{m.description}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs font-bold text-slate-200 group-hover:text-cyan-400 transition-colors mt-2">
                <span>Ingresar al Módulo</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>

      {/* CTA Examen Final */}
      <button
        onClick={() => onSelectModule('EXAMEN')}
        className="group relative w-full bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-amber-500/20 border-2 border-amber-500/40 hover:border-amber-500 rounded-2xl p-3.5 transition-all duration-300 hover:scale-[1.005] hover:shadow-2xl hover:shadow-amber-500/20 active:scale-[0.99] shrink-0 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6 text-amber-300" />
          </div>
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-base font-extrabold text-amber-200">Simulador de Examen Real PNA</h3>
              <span className="text-[9px] font-black bg-amber-500/30 text-amber-100 px-2 py-0.5 rounded-full border border-amber-500/40 uppercase tracking-wider">
                DESAFÍO FINAL
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              40 puntos combinados • 60 minutos • Cronómetro estricto • Certificación Timonel
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-amber-300 group-hover:translate-x-1.5 transition-transform" />
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
  <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 px-2.5 py-1 rounded-full">
    {icon}
    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{label}</span>
    <span className={`text-xs font-black ${color}`}>{value}</span>
  </div>
);
