import React from 'react';
import {
  Scale,
  Shield,
  Sailboat,
  Wind,
  Calculator,
  GraduationCap,
  ChevronRight,
  Anchor,
  Cable
} from 'lucide-react';

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
    description: 'RIPA significa Reglamento Internacional para Prevenir Abordajes. Aprendé prioridades, cruces, luces, marcas y señales acústicas.',
    icon: Scale,
    gradient: 'from-cyan-500/20 to-cyan-500/5',
    borderColor: 'hover:border-cyan-500/60 border-slate-700/80',
    iconColor: 'text-cyan-400'
  },
  {
    id: 'IALA',
    number: 2,
    title: 'Balizamiento IALA',
    description: 'IALA es la Asociación Internacional de Ayudas a la Navegación Marítima. Reconocé el sistema B aplicado en Argentina.',
    icon: Anchor,
    gradient: 'from-blue-500/20 to-blue-500/5',
    borderColor: 'hover:border-blue-500/60 border-slate-700/80',
    iconColor: 'text-blue-400'
  },
  {
    id: 'SEGURIDAD',
    number: 3,
    title: 'Seguridad & Fondeo',
    description: 'Preparación y respuesta ante incendios, fondeo, hombre al agua, temporal, supervivencia y comunicaciones MAYDAY, PAN PAN y SÉCURITÉ.',
    icon: Shield,
    gradient: 'from-rose-500/20 to-rose-500/5',
    borderColor: 'hover:border-rose-500/60 border-slate-700/80',
    iconColor: 'text-rose-400'
  },
  {
    id: 'NOMENCLATURA',
    number: 4,
    title: 'Nomenclatura y Navegación',
    description: 'Casco, jarcia, motor y fondeo junto con carta náutica, instrumentos, estima, mareas, proyecciones y publicaciones.',
    icon: Sailboat,
    gradient: 'from-amber-500/20 to-amber-500/5',
    borderColor: 'hover:border-amber-500/60 border-slate-700/80',
    iconColor: 'text-amber-400'
  },
  {
    id: 'METEOROLOGIA',
    number: 5,
    title: 'Meteorología',
    description: 'Interpretación de viento, presión, nubes, oleaje, escala Beaufort y fenómenos regionales como Pampero, Sudestada y Nortazo.',
    icon: Wind,
    gradient: 'from-sky-500/20 to-sky-500/5',
    borderColor: 'hover:border-sky-500/60 border-slate-700/80',
    iconColor: 'text-sky-400'
  },
  {
    id: 'NUDOS',
    number: 6,
    title: 'Nudos Náuticos',
    description: 'Cabullería aplicada: estructura del cabo, elección y ejecución de nudos, afirmado, unión, tope y distintos tipos de adujes.',
    icon: Cable,
    gradient: 'from-pink-500/20 to-pink-500/5',
    borderColor: 'hover:border-pink-500/60 border-slate-700/80',
    iconColor: 'text-pink-400'
  },
  {
    id: 'PRACTICOS',
    number: 7,
    title: 'Ejercicios Prácticos',
    description: 'Resolución guiada de carta náutica, latitud, longitud, millas, tiempos, velocidad, declinación, mareas y marcaciones.',
    icon: Calculator,
    gradient: 'from-emerald-500/20 to-emerald-500/5',
    borderColor: 'hover:border-emerald-500/60 border-slate-700/80',
    iconColor: 'text-emerald-400'
  },
  {
    id: 'EXAMEN',
    badge: 'Desafío final',
    title: 'Examen Real PNA',
    description: 'Simulación integradora PNA: 40 preguntas en 60 minutos para comprobar conocimientos, administrar el tiempo y detectar temas a repasar.',
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
  return (
    <div className="h-full min-h-0 min-w-0 overflow-hidden">
      <div className="grid h-full grid-cols-2 grid-rows-4 gap-2 md:grid-cols-4 md:grid-rows-2">
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
