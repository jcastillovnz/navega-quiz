import React, { useState, useMemo } from 'react';
import { RotateCcw, ChevronLeft, ChevronRight, Lightbulb, AlertTriangle, Check, BookOpen, BrainCircuit, Trophy } from 'lucide-react';
import { QuizCard } from '../quiz/QuizCard';
import { addXP, addManyToReview, registerStudy } from '../../utils/storage';
import type { QuizQuestion } from '../../types/quiz';

interface KnotStep {
  description: string;
  firmePaths: string[];
  chicotePaths: string[];
}

interface Knot {
  id: string;
  name: string;
  otherNames: string[];
  use: string;
  description: string;
  pros: string[];
  cons: string[];
  steps: KnotStep[];
  color: string;
  difficulty: 'Fácil' | 'Medio' | 'Avanzado';
}

const KNOTS: Knot[] = [
  {
    id: 'bowline',
    name: 'As de Guía',
    otherNames: ['Bowline', 'Nudo de Marinero'],
    use: 'Crear un anillo fijo que NO se corre ni se aprieta bajo carga',
    description: 'Es EL nudo náutico por excelencia. Forma un lazo que no se ajusta ni se desliza, y se desata con un tirón incluso después de haber soportado mucha carga. Imprescindible para rescate, amarre a boyas y HAA.',
    pros: [
      'No se corre ni se aprieta bajo carga',
      'Fácil de desatar después de cargado',
      'Funciona con cualquier tipo de cabo'
    ],
    cons: [
      'Se deshace si no hay carga',
      'Pierde resistencia si el cabo está mojado o sucio'
    ],
    color: '#22d3ee',
    difficulty: 'Medio',
    steps: [
      {
        description: '1. Formá una pequeña gaza con el firme cruzándolo sobre sí mismo: el firme entra por la izquierda, sube, baja, y vuelve a salir. Esto crea un "agujero" en el medio.',
        firmePaths: [
          'M 15 55 Q 25 55 35 50 L 40 30 Q 40 20 50 20 L 60 30 L 60 75 L 50 80 Q 45 80 40 75 L 35 60'
        ],
        chicotePaths: []
      },
      {
        description: '2. Tomá el chicote (extremo libre, azul) y pasálo POR ARRIBA de la parte vertical del firme, entrando por la derecha.',
        firmePaths: [
          'M 15 55 Q 25 55 35 50 L 40 30 Q 40 20 50 20 L 60 30 L 60 75 L 50 80 Q 45 80 40 75 L 35 60'
        ],
        chicotePaths: [
          'M 80 70 Q 65 55 50 45'
        ]
      },
      {
        description: '3. Meté el chicote por el AGUJERO que se forma (de abajo hacia arriba por dentro de la gaza).',
        firmePaths: [
          'M 15 55 Q 25 55 35 50 L 40 30 Q 40 20 50 20 L 60 30 L 60 75 L 50 80 Q 45 80 40 75 L 35 60'
        ],
        chicotePaths: [
          'M 80 70 Q 65 55 50 45 L 55 20'
        ]
      },
      {
        description: '4. Ahora el chicote pasa DETRÁS del firme vertical (el de la gaza) y vuelve a entrar por el mismo agujero, pero de arriba hacia abajo.',
        firmePaths: [
          'M 15 55 Q 25 55 35 50 L 40 30 Q 40 20 50 20 L 60 30 L 60 75 L 50 80 Q 45 80 40 75 L 35 60'
        ],
        chicotePaths: [
          'M 80 70 Q 65 55 50 45 L 55 20 L 55 50 L 75 65'
        ]
      },
      {
        description: '5. Tirá del firme (izquierda) y del chicote (derecha) para ajustar. Queda un anillo que NO se corre.',
        firmePaths: [
          'M 10 55 Q 20 55 30 50 L 35 32 Q 35 22 45 22 L 52 32 L 52 72 L 45 78 Q 40 78 35 72 L 30 60'
        ],
        chicotePaths: [
          'M 85 70 Q 70 55 50 45 L 52 22 L 52 50 L 80 65'
        ]
      }
    ]
  },
  {
    id: 'reef',
    name: 'Nudo Llano',
    otherNames: ['Reef Knot', 'Nudo de Rizo', 'Square Knot'],
    use: 'Unir DOS cabos del MISMO diámetro y del mismo material',
    description: 'Es el clásico nudo de unión. Rápido de hacer y fácil de recordar (izquierda sobre derecha, derecha sobre izquierda). Solo sirve para unir cabos iguales — si los diámetros son distintos, se desliza.',
    pros: [
      'Muy fácil de hacer y recordar',
      'Rápido para uniones temporales',
      'Simétrico y prolijo'
    ],
    cons: [
      'SOLO funciona con cabos del mismo diámetro',
      'Se desliza con cabos mojados o de distinta rigidez',
      'No apto para cargas críticas'
    ],
    color: '#22c55e',
    difficulty: 'Fácil',
    steps: [
      {
        description: '1. Cruzá los dos chicotes (azules) en el centro. El chicote del cabo A pasa POR ENCIMA del chicote del cabo B.',
        firmePaths: [
          'M 10 30 Q 30 35 45 45 L 50 55 L 35 75'
        ],
        chicotePaths: [
          'M 90 30 Q 70 35 55 45 L 65 75'
        ]
      },
      {
        description: '2. El chicote de A pasa por DEBAJO del chicote de B y sale hacia la izquierda abajo.',
        firmePaths: [
          'M 10 30 Q 30 35 45 45 L 50 55 L 35 75'
        ],
        chicotePaths: [
          'M 90 30 Q 70 35 55 45 Q 35 65 15 75'
        ]
      },
      {
        description: '3. Ahora con el chicote de B: pasálo por ENCIMA del chicote de A (la pasada se "invierte" para que el nudo sea simétrico).',
        firmePaths: [
          'M 10 30 Q 30 35 45 45 L 50 55 L 35 75'
        ],
        chicotePaths: [
          'M 90 30 Q 70 35 55 45 Q 35 65 15 75',
          'M 50 50 Q 65 60 80 70'
        ]
      },
      {
        description: '4. Meté el chicote de B por DEBAJO y sacalo hacia abajo a la derecha. Tirá de los 4 extremos firmes: quedan dos "orejitas" simétricas a los costados.',
        firmePaths: [
          'M 10 30 Q 30 35 45 45 L 50 55 L 35 75'
        ],
        chicotePaths: [
          'M 90 30 Q 70 35 55 45 Q 35 65 15 75',
          'M 50 50 Q 65 60 80 70 L 85 90'
        ]
      }
    ]
  },
  {
    id: 'clove',
    name: 'Ballestrinque',
    otherNames: ['Clove Hitch', 'Nudo de Dos Cotes'],
    use: 'Amarrar un cabo a un palo, poste, cáncamo o barandal',
    description: 'Nudo de amarre rápido. Se ajusta solo cuando hay carga tirando del firme. Es el nudo que se usa para empezar y terminar un fondeo temporal, y para colgar defensas del barandal.',
    pros: [
      'Muy rápido de hacer',
      'Se ajusta solo con la carga',
      'Funciona en cualquier dirección'
    ],
    cons: [
      'Puede deslizar si el cabo está mojado',
      'No es seguro para cargas dinámicas (puede destrabarse)',
      'Difícil de desatar bajo tensión'
    ],
    color: '#a855f7',
    difficulty: 'Medio',
    steps: [
      {
        description: '1. Pasá el firme (rojo) por DETRÁS del palo (la línea gris horizontal), de izquierda a derecha.',
        firmePaths: [
          'M 10 60 Q 30 50 50 50 Q 70 50 85 60'
        ],
        chicotePaths: []
      },
      {
        description: '2. Cruzá por ENCIMA del palo y volvé a pasar por detrás, de derecha a izquierda (espejo del paso 1).',
        firmePaths: [
          'M 10 60 Q 30 50 50 50 Q 70 50 85 60 Q 80 75 50 70 Q 20 75 15 60'
        ],
        chicotePaths: []
      },
      {
        description: '3. Meté el chicote (azul) por DEBAJO de la última vuelta que cruza sobre el palo. Esto traba el nudo.',
        firmePaths: [
          'M 10 60 Q 30 50 50 50 Q 70 50 85 60 Q 80 75 50 70 Q 20 75 15 60'
        ],
        chicotePaths: [
          'M 15 60 Q 50 50 80 75'
        ]
      },
      {
        description: '4. Tirá del firme. El nudo se ajusta solo al palo. Ballestrinque terminado.',
        firmePaths: [
          'M 10 60 Q 30 50 50 50 Q 70 50 85 60 Q 80 75 50 70 Q 20 75 15 60'
        ],
        chicotePaths: [
          'M 15 60 Q 50 50 85 80'
        ]
      }
    ]
  },
  {
    id: 'sheet',
    name: 'Vuelta de Escota',
    otherNames: ['Sheet Bend', 'Nudo de Vela'],
    use: 'Unir DOS cabos de DISTINTO diámetro o material',
    description: 'El nudo de unión por excelencia cuando los cabos son diferentes. Es más seguro que el nudo llano para unir cabos de nylon con cabos más gruesos, o cabo con cadena. Usado para prolongar la línea de fondeo.',
    pros: [
      'Funciona con cabos de distinto diámetro',
      'No se desliza con carga',
      'Resiste mejor que el nudo llano'
    ],
    cons: [
      'Más difícil de aprender que el nudo llano',
      'Hay que hacer una "cola de perro" extra al chicote más fino para mayor seguridad'
    ],
    color: '#f59e0b',
    difficulty: 'Avanzado',
    steps: [
      {
        description: '1. Con el cabo más GRUESO (rojo) formá una gaza con el chicote mirando hacia abajo, como una "oreja de conejo".',
        firmePaths: [
          'M 10 25 L 35 25 L 55 45 L 35 45 Z'
        ],
        chicotePaths: []
      },
      {
        description: '2. Pasá el chicote del cabo FINO (azul) por ARRIBA a través de la gaza, entrando desde abajo.',
        firmePaths: [
          'M 10 25 L 35 25 L 55 45 L 35 45 Z'
        ],
        chicotePaths: [
          'M 25 70 L 40 35'
        ]
      },
      {
        description: '3. Cruzá el chicote fino por DETRÁS del firme grueso (la parte de la gaza que cuelga) y pasálo por arriba de su propio firme.',
        firmePaths: [
          'M 10 25 L 35 25 L 55 45 L 35 45 Z'
        ],
        chicotePaths: [
          'M 25 70 L 40 35 L 55 45 L 75 35'
        ]
      },
      {
        description: '4. Para mayor seguridad: trabá el chicote fino con una "cola de perro" (pequeña curva) sobre su propio firme.',
        firmePaths: [
          'M 10 25 L 35 25 L 55 45 L 35 45 Z'
        ],
        chicotePaths: [
          'M 25 70 L 40 35 L 55 45 L 75 35 L 70 50 L 80 60'
        ]
      }
    ]
  },
  {
    id: 'figure8',
    name: 'Nudo de Ocho',
    otherNames: ['Figure Eight', 'Nudo Stopper', 'Nudo de Pajarita'],
    use: 'Tope de cabo / stopper — evita que un cabo se deslice por un ojo, polea o mordaza',
    description: 'El nudo más confiable para "frenar" un cabo. Se hace en el extremo (chicote) y crea un tope grueso que no pasa por los agujeros, ojos o mordazas. Se usa para que el chicote no se pierda dentro del muelle o para evitar que un cabo se deslice por una polea.',
    pros: [
      'Muy fácil de hacer y recordar',
      'Muy resistente y seguro',
      'No se desliza bajo carga',
      'Fácil de identificar visualmente'
    ],
    cons: [
      'Ocupa más cabo que otros topes',
      'A veces es difícil de desatar si se moja'
    ],
    color: '#ec4899',
    difficulty: 'Fácil',
    steps: [
      {
        description: '1. Con el chicote (azul), cruzá POR ENCIMA del firme formando un lazo.',
        firmePaths: [
          'M 75 80 L 50 60'
        ],
        chicotePaths: [
          'M 30 35 L 50 50'
        ]
      },
      {
        description: '2. Pasá el chicote por DEBAJO del firme, rodeándolo por completo.',
        firmePaths: [
          'M 75 80 L 50 60'
        ],
        chicotePaths: [
          'M 30 35 L 50 50 L 50 70 L 70 75'
        ]
      },
      {
        description: '3. Meté el chicote por DENTRO del lazo inicial, de abajo hacia arriba.',
        firmePaths: [
          'M 75 80 L 50 60'
        ],
        chicotePaths: [
          'M 30 35 L 50 50 L 50 70 L 70 75 L 50 30'
        ]
      },
      {
        description: '4. Tirá del firme y del chicote. Queda la clásica forma de "8" o "pajarita".',
        firmePaths: [
          'M 80 80 L 50 60'
        ],
        chicotePaths: [
          'M 30 35 L 50 50 L 50 70 L 70 75 L 50 25'
        ]
      }
    ]
  }
];

const XP_PER_CORRECT = 10;
const PASS_THRESHOLD = 0.7;

interface KnotsViewerProps {
  questions: QuizQuestion[];
}

export const KnotsViewer: React.FC<KnotsViewerProps> = ({ questions }) => {
  const [tab, setTab] = useState<'ESTUDIO' | 'QUIZ'>('ESTUDIO');
  const [activeKnot, setActiveKnot] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);

  // Quiz state
  const [currentIdx, setCurrentIdx] = useState(0);
  const [result, setResult] = useState<{ correct: number; total: number; xpEarned: number } | null>(null);

  const knot = KNOTS[activeKnot];

  const handleAnswer = (isCorrect: boolean, qid: string) => {
    setResult(prev => {
      const base = prev ?? { correct: 0, total: 0, xpEarned: 0 };
      return {
        correct: base.correct + (isCorrect ? 1 : 0),
        total: base.total + 1,
        xpEarned: base.xpEarned + (isCorrect ? XP_PER_CORRECT : 0)
      };
    });
    if (isCorrect) addXP(XP_PER_CORRECT);
    else addManyToReview([qid]);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) setCurrentIdx(c => c + 1);
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setResult(null);
    registerStudy();
  };

  const accuracy = result ? (result.correct / result.total) * 100 : 0;
  const passed = result && result.total === questions.length && accuracy >= PASS_THRESHOLD * 100;
  const finished = result && result.total === questions.length;

  // Shuffled questions memo
  const shuffledQuestions = useMemo(() => [...questions].sort(() => Math.random() - 0.5), [questions]);

  const selectKnot = (idx: number) => {
    setActiveKnot(idx);
    setStepIdx(0);
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-slate-300 text-xs">
        Los 5 nudos fundamentales que te pueden tomar en el examen. Aprendé el uso, los pasos y practicá con el quiz.
      </p>

      {/* Tabs Estudio / Práctica */}
      <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700 max-w-md mx-auto w-full">
        <button
          onClick={() => setTab('ESTUDIO')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            tab === 'ESTUDIO' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Estudio
        </button>
        <button
          onClick={() => setTab('QUIZ')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            tab === 'QUIZ' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BrainCircuit className="w-4 h-4" />
          Práctica
        </button>
      </div>

      {tab === 'ESTUDIO' && (
        <div className="grid md:grid-cols-12 gap-4 animate-[fade-in_0.4s_ease-out]">
          {/* Lista de nudos (sidebar) */}
          <div className="md:col-span-4 space-y-2">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 px-1">5 nudos esenciales</p>
            {KNOTS.map((k, i) => (
              <button
                key={k.id}
                onClick={() => selectKnot(i)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  activeKnot === i
                    ? 'border-cyan-500 bg-cyan-500/10'
                    : 'border-slate-700 bg-slate-800/40 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: k.color, boxShadow: `0 0 8px ${k.color}` }}
                    />
                    <span className="font-bold text-white text-sm">{i + 1}. {k.name}</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-slate-700 text-slate-300">
                    {k.difficulty}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">{k.use}</p>
              </button>
            ))}
          </div>

          {/* Detalle del nudo activo */}
          <div className="md:col-span-8 bg-slate-800/60 border border-slate-700 rounded-2xl p-4">
            {/* Header del nudo */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold text-white">{knot.name}</h3>
                <p className="text-[10px] text-slate-400 italic">
                  {knot.otherNames.join(' · ')}
                </p>
              </div>
              <span
                className="text-[10px] px-2 py-1 rounded-full font-bold"
                style={{ backgroundColor: `${knot.color}20`, color: knot.color }}
              >
                {knot.difficulty}
              </span>
            </div>

            {/* Uso principal */}
            <div className="bg-slate-900/50 rounded-lg p-2.5 mb-3 border border-slate-700">
              <p className="text-[10px] uppercase tracking-wider text-slate-500">Uso principal</p>
              <p className="text-sm text-slate-200 font-medium">{knot.use}</p>
            </div>

            {/* Visor SVG paso a paso */}
            <div className="bg-slate-950/70 rounded-xl p-3 mb-3 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  Paso {stepIdx + 1} de {knot.steps.length}
                </p>
                <button
                  onClick={() => setStepIdx(0)}
                  className="text-[10px] text-slate-500 hover:text-slate-300 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reiniciar
                </button>
              </div>

              <div className="relative w-full aspect-[4/3] bg-slate-900 rounded-lg overflow-hidden">
                <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 w-full h-full">
                  <defs>
                    <pattern id="dotgrid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <circle cx="5" cy="5" r="0.4" fill="#1e293b" />
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="url(#dotgrid)" />

                  {/* Palo de referencia (solo para ballestrinque) */}
                  {knot.id === 'clove' && (
                    <line x1="5" y1="30" x2="95" y2="30" stroke="#64748b" strokeWidth="1" strokeDasharray="3,2" />
                  )}

                  {/* Trazos del FIRME (rojo) - siempre se muestra completo del paso actual */}
                  {knot.steps[stepIdx].firmePaths.map((d, j) => (
                    <path
                      key={`f-${j}`}
                      d={d}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ filter: 'drop-shadow(0 0 1px rgba(0,0,0,0.4))' }}
                    />
                  ))}

                  {/* Trazos del CHICOTE (azul) - se van sumando por paso */}
                  {knot.steps[stepIdx].chicotePaths.map((d, j) => (
                    <path
                      key={`c-${j}`}
                      d={d}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ filter: 'drop-shadow(0 0 1px rgba(0,0,0,0.4))' }}
                    />
                  ))}

                  {/* Etiquetas en las puntas */}
                  <text x="3" y="97" fontSize="4" fill="#ef4444" fontWeight="bold">FIRME</text>
                  <text x="82" y="97" fontSize="4" fill="#3b82f6" fontWeight="bold">CHICOTE</text>
                </svg>

                {/* Mini leyenda de colores */}
                <div className="absolute top-1.5 left-1.5 flex flex-col gap-0.5 text-[9px] font-bold bg-slate-900/85 backdrop-blur px-1.5 py-1 rounded border border-slate-700">
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-1 bg-red-500 rounded" />
                    <span className="text-red-300">FIRME</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-1 bg-blue-500 rounded" />
                    <span className="text-blue-300">CHICOTE</span>
                  </div>
                </div>
              </div>

              {/* Descripción del paso */}
              <p className="text-sm text-slate-200 mt-3 leading-relaxed">
                {knot.steps[stepIdx].description}
              </p>

              {/* Controles de paso */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setStepIdx(s => Math.max(0, s - 1))}
                  disabled={stepIdx === 0}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Anterior
                </button>
                <button
                  onClick={() => setStepIdx(s => Math.min(knot.steps.length - 1, s + 1))}
                  disabled={stepIdx === knot.steps.length - 1}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Siguiente
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Stepper */}
              <div className="flex gap-1 mt-3">
                {knot.steps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      i <= stepIdx ? '' : 'bg-slate-700'
                    }`}
                    style={i <= stepIdx ? { backgroundColor: knot.color } : {}}
                  />
                ))}
              </div>
            </div>

            {/* Pros y contras */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-2.5">
                <p className="text-[10px] uppercase tracking-wider text-emerald-300 mb-1.5 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Ventajas
                </p>
                <ul className="space-y-1">
                  {knot.pros.map((p, i) => (
                    <li key={i} className="text-[11px] text-slate-300 flex gap-1.5">
                      <span className="text-emerald-400 shrink-0">•</span>{p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-2.5">
                <p className="text-[10px] uppercase tracking-wider text-rose-300 mb-1.5 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Desventajas
                </p>
                <ul className="space-y-1">
                  {knot.cons.map((c, i) => (
                    <li key={i} className="text-[11px] text-slate-300 flex gap-1.5">
                      <span className="text-rose-400 shrink-0">•</span>{c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'QUIZ' && !finished && questions.length > 0 && (
        <div className="animate-[fade-in_0.4s_ease-out]">
          <QuizCard
            question={shuffledQuestions[currentIdx]}
            questionNumber={currentIdx + 1}
            totalQuestions={shuffledQuestions.length}
            xpPerCorrect={XP_PER_CORRECT}
            onAnswer={handleAnswer}
            onNext={handleNext}
          />
        </div>
      )}

      {tab === 'QUIZ' && finished && result && (
        <div className="bg-slate-800/70 backdrop-blur-md border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto w-full text-center animate-[fade-in_0.5s_ease-out]">
          {passed ? (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-500 mb-4">
                <Trophy className="w-10 h-10 text-amber-400" />
              </div>
              <h3 className="text-2xl font-bold text-amber-300 mb-2">¡Maestro de Nudos!</h3>
              <p className="text-slate-300 text-sm mb-6">Ya podés amarrar cualquier cosa a bordo.</p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan-500/20 border-2 border-cyan-500 mb-4">
                <Lightbulb className="w-10 h-10 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-cyan-300 mb-2">A repasar nudos</h3>
              <p className="text-slate-300 text-sm mb-6">Necesitas 70% para aprobar. Repasá los usos y volvé a intentar.</p>
            </>
          )}

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
              <p className="text-2xl font-bold text-cyan-400">{accuracy.toFixed(0)}%</p>
              <p className="text-xs text-slate-400 mt-1">Precisión</p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
              <p className="text-2xl font-bold text-emerald-400">{result.correct}/{result.total}</p>
              <p className="text-xs text-slate-400 mt-1">Aciertos</p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
              <p className="text-2xl font-bold text-amber-400">+{result.xpEarned}</p>
              <p className="text-xs text-slate-400 mt-1">XP</p>
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 px-6 rounded-xl transition-all duration-300 mx-auto shadow-lg shadow-cyan-900/40"
          >
            <RotateCcw className="w-4 h-4" />
            Reintentar
          </button>
        </div>
      )}
    </div>
  );
};
