import React, { useState, useMemo } from 'react';
import { RotateCcw, BookOpen, BrainCircuit, Trophy, AlertTriangle, Check, ChevronRight, ChevronLeft, Lightbulb } from 'lucide-react';
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
        description: '1. Formá una pequeña gaza con el firme. El firme entra por arriba y vuelve a salir por abajo, formando un pequeño "agujero" en el medio.',
        firmePaths: ['M 15 50 Q 25 50 35 45 L 40 30 Q 40 20 50 20 L 60 30 L 60 65 L 50 70 Q 45 70 40 65 L 35 55'],
        chicotePaths: []
      },
      {
        description: '2. Tomá el chicote (extremo libre) y pasálo POR ARRIBA de la parte vertical del firme.',
        firmePaths: ['M 15 50 Q 25 50 35 45 L 40 30 Q 40 20 50 20 L 60 30 L 60 65 L 50 70 Q 45 70 40 65 L 35 55'],
        chicotePaths: ['M 75 70 Q 65 60 50 50']
      },
      {
        description: '3. Meté el chicote por el AGUJERO que se forma (de abajo hacia arriba por dentro de la gaza).',
        firmePaths: ['M 15 50 Q 25 50 35 45 L 40 30 Q 40 20 50 20 L 60 30 L 60 65 L 50 70 Q 45 70 40 65 L 35 55'],
        chicotePaths: ['M 75 70 Q 65 60 50 50 L 55 25']
      },
      {
        description: '4. El chicote pasa DETRÁS del firme vertical. Rodealo y meté el chicote NUEVAMENTE por la gaza, de arriba hacia abajo.',
        firmePaths: ['M 15 50 Q 25 50 35 45 L 40 30 Q 40 20 50 20 L 60 30 L 60 65 L 50 70 Q 45 70 40 65 L 35 55'],
        chicotePaths: [
          'M 75 70 Q 65 60 50 50 L 55 25 L 55 50 L 80 75'
        ]
      },
      {
        description: '5. Tirá del firme (izquierda) y del chicote (derecha) para ajustar. Queda un lazo firme que NO se corre. ¡LISTO!',
        firmePaths: ['M 10 50 Q 20 50 30 45 L 35 32 Q 35 22 45 22 L 52 32 L 52 65 L 45 72 Q 40 72 35 67 L 30 55'],
        chicotePaths: [
          'M 85 75 Q 70 60 50 50 L 52 25 L 52 50 L 80 70'
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
        description: '1. Cruzá los dos chicotes: el del cabo A por ENCIMA del cabo B. La frase "izquierda sobre derecha" ayuda.',
        firmePaths: ['M 10 30 Q 30 35 45 45'],
        chicotePaths: ['M 90 30 Q 70 35 55 45']
      },
      {
        description: '2. El chicote de A pasa por DEBAJO del chicote de B y sale hacia tu izquierda.',
        firmePaths: ['M 10 30 Q 30 35 45 45'],
        chicotePaths: ['M 90 30 Q 70 35 55 45 Q 35 65 15 75']
      },
      {
        description: '3. Con el chicote de B: pasálo por ENCIMA del chicote de A (la pasada se "invierte" para que sea simétrico).',
        firmePaths: ['M 10 30 Q 30 35 45 45'],
        chicotePaths: ['M 90 30 Q 70 35 55 45 Q 35 65 15 75', 'M 50 50 Q 65 60 80 70']
      },
      {
        description: '4. Meté el chicote de B por DEBAJO del firme de A y sacalo hacia abajo a la derecha. Tirá de los 4 extremos firmes: quedan dos "orejitas" simétricas.',
        firmePaths: ['M 10 30 Q 30 35 45 45'],
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
        description: '1. Pasá el firme por DETRÁS del palo (la línea gris horizontal), de izquierda a derecha.',
        firmePaths: ['M 10 30 Q 30 30 50 35 Q 70 30 90 30'],
        chicotePaths: []
      },
      {
        description: '2. Cruzá por ENCIMA del palo y volvé a pasar por detrás, de derecha a izquierda (espejo del paso 1).',
        firmePaths: [
          'M 10 30 Q 30 30 50 35 Q 70 30 90 30',
          'M 90 30 Q 80 50 50 50 Q 20 50 10 30'
        ],
        chicotePaths: []
      },
      {
        description: '3. Meté el chicote (extremo) por DEBAJO de la última vuelta que cruza sobre el palo. Esto traba el nudo.',
        firmePaths: [
          'M 10 30 Q 30 30 50 35 Q 70 30 90 30',
          'M 90 30 Q 80 50 50 50 Q 20 50 10 30'
        ],
        chicotePaths: ['M 10 30 Q 50 40 80 55']
      },
      {
        description: '4. Tirá del firme. El nudo se ajusta solo al palo. ¡Ballestrinque firme!',
        firmePaths: [
          'M 10 30 Q 30 30 50 35 Q 70 30 90 30',
          'M 90 30 Q 80 50 50 50 Q 20 50 10 30'
        ],
        chicotePaths: ['M 10 30 Q 50 40 85 60']
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
        firmePaths: ['M 10 25 L 35 25 L 55 45 L 35 45 Z'],
        chicotePaths: []
      },
      {
        description: '2. Pasá el chicote del cabo FINO (azul) por ARRIBA a través de la gaza, entrando desde abajo.',
        firmePaths: ['M 10 25 L 35 25 L 55 45 L 35 45 Z'],
        chicotePaths: ['M 25 70 L 40 35']
      },
      {
        description: '3. Cruzá el chicote fino por DETRÁS del firme grueso (la parte de la gaza que cuelga) y pasálo por arriba de su propio firme.',
        firmePaths: ['M 10 25 L 35 25 L 55 45 L 35 45 Z'],
        chicotePaths: ['M 25 70 L 40 35 L 55 45 L 75 35']
      },
      {
        description: '4. Para mayor seguridad: trabá el chicote fino con una "cola de perro" sobre su propio firme.',
        firmePaths: ['M 10 25 L 35 25 L 55 45 L 35 45 Z'],
        chicotePaths: [
          'M 25 70 L 40 35 L 55 45 L 75 35 L 70 50 L 85 65'
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
        description: '1. Con el chicote, cruzá POR ENCIMA del firme formando una lazada. Imaginá un círculo.',
        firmePaths: ['M 80 75 L 50 60'],
        chicotePaths: ['M 30 35 L 50 50']
      },
      {
        description: '2. Pasá el chicote por DEBAJO del firme (rodeándolo por completo), como dando la vuelta.',
        firmePaths: ['M 80 75 L 50 60'],
        chicotePaths: ['M 30 35 L 50 50 L 50 70 L 70 75']
      },
      {
        description: '3. Meté el chicote por DENTRO del lazo inicial (de abajo hacia arriba, a través del primer cruce).',
        firmePaths: ['M 80 75 L 50 60'],
        chicotePaths: ['M 30 35 L 50 50 L 50 70 L 70 75 L 50 30']
      },
      {
        description: '4. Tirá del firme y del chicote. Queda la clásica forma de "8" o "pajarita". ¡Listo!',
        firmePaths: ['M 85 80 L 50 60'],
        chicotePaths: ['M 30 35 L 50 50 L 50 70 L 70 75 L 50 25']
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

  const shuffledQuestions = useMemo(() => [...questions].sort(() => Math.random() - 0.5), [questions]);

  const selectKnot = (idx: number) => {
    setActiveKnot(idx);
    setStepIdx(0);
  };

  return (
    <div className="flex flex-col gap-2 h-full overflow-hidden">
      <p className="text-[11px] text-slate-400 shrink-0">
        Los 5 nudos fundamentales que te pueden tomar en el examen. Aprendé el uso, los pasos y practicá con el quiz.
      </p>

      {/* Tabs Estudio / Práctica */}
      <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700 max-w-md mx-auto w-full shrink-0">
        <button
          onClick={() => setTab('ESTUDIO')}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            tab === 'ESTUDIO' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Estudio
        </button>
        <button
          onClick={() => setTab('QUIZ')}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            tab === 'QUIZ' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BrainCircuit className="w-4 h-4" />
          Práctica
        </button>
      </div>

      {tab === 'ESTUDIO' && (
        <div className="grid md:grid-cols-12 gap-2 flex-1 min-h-0 overflow-hidden">
          {/* Lista de nudos */}
          <div className="md:col-span-3 space-y-1.5 overflow-y-auto pr-1">
            {KNOTS.map((k, i) => (
              <button
                key={k.id}
                onClick={() => selectKnot(i)}
                className={`w-full text-left p-2 rounded-lg border transition-all ${
                  activeKnot === i
                    ? 'border-cyan-500 bg-cyan-500/10'
                    : 'border-slate-700 bg-slate-800/40 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: k.color, boxShadow: `0 0 6px ${k.color}` }}
                    />
                    <span className="font-bold text-white text-xs">{i + 1}. {k.name}</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-slate-700 text-slate-300 shrink-0">
                    {k.difficulty}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 line-clamp-1">{k.use}</p>
              </button>
            ))}
          </div>

          {/* Detalle del nudo activo */}
          <div className="md:col-span-9 bg-slate-800/60 border border-slate-700 rounded-xl p-3 flex flex-col gap-2 overflow-y-auto custom-scroll">
            <div className="flex items-start justify-between shrink-0">
              <div>
                <h3 className="text-base font-bold text-white">{knot.name}</h3>
                <p className="text-[10px] text-slate-400 italic">{knot.otherNames.join(' · ')}</p>
              </div>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0"
                style={{ backgroundColor: `${knot.color}20`, color: knot.color }}
              >
                {knot.difficulty}
              </span>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-2 border border-slate-700 shrink-0">
              <p className="text-[10px] uppercase tracking-wider text-slate-500">Uso principal</p>
              <p className="text-xs text-slate-200 font-medium">{knot.use}</p>
            </div>

            {/* Visor SVG paso a paso */}
            <div className="bg-slate-950/70 rounded-xl p-2 border border-slate-800 shrink-0">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  Paso {stepIdx + 1} de {knot.steps.length}
                </p>
                <button
                  onClick={() => setStepIdx(0)}
                  className="text-[10px] text-slate-500 hover:text-slate-300 flex items-center gap-1"
                >
                  <RotateCcw className="w-2.5 h-2.5" /> Reiniciar
                </button>
              </div>

              <div className="relative w-full aspect-[4/3] bg-slate-900 rounded-lg overflow-hidden">
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="xMidYMid meet"
                  className="absolute inset-0 w-full h-full"
                >
                  <defs>
                    <pattern id={`dotgrid-${knot.id}`} width="10" height="10" patternUnits="userSpaceOnUse">
                      <circle cx="5" cy="5" r="0.4" fill="#1e293b" />
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill={`url(#dotgrid-${knot.id})`} />

                  {/* Palo de referencia para ballestrinque */}
                  {knot.id === 'clove' && (
                    <line x1="5" y1="30" x2="95" y2="30" stroke="#64748b" strokeWidth="1" strokeDasharray="3,2" />
                  )}

                  {/* Trazos del FIRME (rojo) */}
                  {knot.steps[stepIdx].firmePaths.map((d, j) => (
                    <path
                      key={`f-${j}`}
                      d={d}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ))}

                  {/* Trazos del CHICOTE (azul) */}
                  {knot.steps[stepIdx].chicotePaths.map((d, j) => (
                    <path
                      key={`c-${j}`}
                      d={d}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ))}

                  {/* Etiquetas */}
                  <text x="3" y="97" fontSize="3.5" fill="#ef4444" fontWeight="bold">FIRME</text>
                  <text x="83" y="97" fontSize="3.5" fill="#3b82f6" fontWeight="bold">CHICOTE</text>
                </svg>

                {/* Mini leyenda */}
                <div className="absolute top-1 left-1 flex flex-col gap-0.5 text-[9px] font-bold bg-slate-900/85 backdrop-blur px-1.5 py-1 rounded border border-slate-700">
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

              <p className="text-[11px] text-slate-200 mt-2 leading-relaxed">
                {knot.steps[stepIdx].description}
              </p>

              <div className="flex gap-1.5 mt-2">
                <button
                  onClick={() => setStepIdx(s => Math.max(0, s - 1))}
                  disabled={stepIdx === 0}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-medium hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-3 h-3" /> Anterior
                </button>
                <button
                  onClick={() => setStepIdx(s => Math.min(knot.steps.length - 1, s + 1))}
                  disabled={stepIdx === knot.steps.length - 1}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-cyan-500 text-slate-950 text-[10px] font-bold hover:bg-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Siguiente <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="flex gap-1 mt-1.5">
                {knot.steps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-0.5 flex-1 rounded-full transition-all ${i <= stepIdx ? '' : 'bg-slate-700'}`}
                    style={i <= stepIdx ? { backgroundColor: knot.color } : {}}
                  />
                ))}
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed shrink-0">{knot.description}</p>

            <div className="grid grid-cols-2 gap-1.5 shrink-0">
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-2">
                <p className="text-[9px] uppercase tracking-wider text-emerald-300 mb-1 flex items-center gap-1 font-bold">
                  <Check className="w-2.5 h-2.5" /> Ventajas
                </p>
                <ul className="space-y-0.5">
                  {knot.pros.map((p, i) => (
                    <li key={i} className="text-[10px] text-slate-300 flex gap-1">
                      <span className="text-emerald-400 shrink-0">•</span>{p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-2">
                <p className="text-[9px] uppercase tracking-wider text-rose-300 mb-1 flex items-center gap-1 font-bold">
                  <AlertTriangle className="w-2.5 h-2.5" /> Desventajas
                </p>
                <ul className="space-y-0.5">
                  {knot.cons.map((c, i) => (
                    <li key={i} className="text-[10px] text-slate-300 flex gap-1">
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
        <div className="flex-1 min-h-0 overflow-y-auto custom-scroll">
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
        <div className="flex-1 min-h-0 overflow-y-auto custom-scroll">
          <div className="bg-slate-800/70 border border-white/10 rounded-2xl p-6 max-w-xl mx-auto w-full text-center my-auto shadow-2xl">
            {passed ? (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500 mb-3">
                  <Trophy className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-amber-300 mb-2">¡Maestro de Nudos!</h3>
                <p className="text-slate-300 text-xs mb-4">Ya podés amarrar cualquier cosa a bordo.</p>
              </>
            ) : (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/20 border-2 border-cyan-500 mb-3">
                  <Lightbulb className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-cyan-300 mb-2">A repasar nudos</h3>
                <p className="text-slate-300 text-xs mb-4">Necesitas 70% para aprobar. Repasá los usos y volvé a intentar.</p>
              </>
            )}

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-700">
                <p className="text-2xl font-bold text-cyan-400">{accuracy.toFixed(0)}%</p>
                <p className="text-[10px] text-slate-400">Precisión</p>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-700">
                <p className="text-2xl font-bold text-emerald-400">{result.correct}/{result.total}</p>
                <p className="text-[10px] text-slate-400">Aciertos</p>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-700">
                <p className="text-2xl font-bold text-amber-400">+{result.xpEarned}</p>
                <p className="text-[10px] text-slate-400">XP</p>
              </div>
            </div>

            <button
              onClick={handleRestart}
              className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 px-5 rounded-xl text-xs transition-all mx-auto shadow-md"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reintentar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
