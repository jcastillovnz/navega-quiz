import React, { useState, useMemo } from 'react';
import { RotateCcw, BookOpen, BrainCircuit, Trophy, AlertTriangle, Check, Lightbulb } from 'lucide-react';
import { QuizCard } from '../quiz/QuizCard';
import { IntegratedLearningView } from '../learning/IntegratedLearningView';
import { addXP, addManyToReview, registerStudy } from '../../utils/storage';
import type { QuizQuestion } from '../../types/quiz';

// Imágenes hiperrealistas paso a paso
import bowlineSteps from '../../assets/knot_bowline_steps.png';
import reefSteps from '../../assets/knot_reef_steps.png';
import cloveSteps from '../../assets/knot_clove_steps.png';
import sheetBendSteps from '../../assets/knot_sheet_bend_steps.png';
import figure8Steps from '../../assets/knot_figure8_steps.png';

interface Knot {
  id: string;
  name: string;
  otherNames: string[];
  use: string;
  description: string;
  pros: string[];
  cons: string[];
  color: string;
  accent: string;
  difficulty: 'Fácil' | 'Medio' | 'Avanzado';
  stepsImage: string;
  stepsCaption: string[];
}

const KNOTS: Knot[] = [
  {
    id: 'bowline',
    name: 'As de Guía',
    otherNames: ['Bowline', 'Nudo de Marinero'],
    use: 'Crear un anillo fijo que NO se corre ni se aprieta bajo carga',
    description: 'EL nudo náutico por excelencia. Forma un lazo que no se ajusta ni se desliza, y se desata con un tirón incluso después de haber soportado mucha carga.',
    pros: ['No se corre ni se aprieta bajo carga', 'Fácil de desatar', 'Universal — funciona con cualquier cabo'],
    cons: ['Se deshace sin tensión', 'No apto para cabos muy rígidos o mojados'],
    color: '#22d3ee', accent: 'border-cyan-500/50',
    difficulty: 'Medio',
    stepsImage: bowlineSteps,
    stepsCaption: [
      '① Formá una pequeña gaza con el firme (rojo)',
      '② Pasá el chicote (azul) hacia arriba por el agujero de la gaza',
      '③ Rodeá el chicote detrás del firme vertical',
      '④ Volvé a pasar el chicote por la gaza, ajustá — ¡As de Guía listo!'
    ]
  },
  {
    id: 'reef',
    name: 'Nudo Llano',
    otherNames: ['Reef Knot', 'Nudo de Rizo', 'Square Knot'],
    use: 'Unir DOS cabos del MISMO diámetro y material',
    description: 'Clásico nudo de unión simétrico. "Izquierda sobre derecha, derecha sobre izquierda." Solo para cabos del mismo grosor.',
    pros: ['Muy fácil y rápido', 'Prolijo y simétrico', 'Deshace solo con los chicotes'],
    cons: ['SOLO cabos de igual diámetro', 'Se desliza con cabos mojados o diferentes'],
    color: '#22c55e', accent: 'border-emerald-500/50',
    difficulty: 'Fácil',
    stepsImage: reefSteps,
    stepsCaption: [
      '① Cruzá rojo POR ENCIMA del azul',
      '② Pasá rojo por DEBAJO del azul (primer seminudo)',
      '③ Cruzá azul POR ENCIMA del rojo (dirección opuesta)',
      '④ Ajustá los 4 extremos — Nudo Llano simétrico finalizado'
    ]
  },
  {
    id: 'clove',
    name: 'Ballestrinque',
    otherNames: ['Clove Hitch', 'Nudo de Dos Cotes'],
    use: 'Amarrar un cabo a un palo, poste, cáncamo o barandal',
    description: 'Nudo de amarre rápido sobre cualquier poste o barandal. Se ajusta con la carga. Ideal para defensas y fondeos temporales.',
    pros: ['Muy rápido de ejecutar', 'Se ajusta solo con la carga', 'Funciona en cualquier dirección'],
    cons: ['Puede deslizar mojado', 'No para cargas dinámicas o sacudidas'],
    color: '#a855f7', accent: 'border-purple-500/50',
    difficulty: 'Medio',
    stepsImage: cloveSteps,
    stepsCaption: [
      '① Primera vuelta alrededor del palo (de izq. a der.)',
      '② Segunda vuelta cruzando encima de la primera',
      '③ Metés el chicote por debajo del cruce',
      '④ Ajustás tirando del firme — Ballestrinque firme al palo'
    ]
  },
  {
    id: 'sheet',
    name: 'Vuelta de Escota',
    otherNames: ['Sheet Bend', 'Nudo de Vela'],
    use: 'Unir DOS cabos de DISTINTO diámetro o material',
    description: 'El nudo de unión cuando los cabos son diferentes. Más seguro que el Nudo Llano para unir cabo fino con cabo grueso o cadena.',
    pros: ['Funciona con diámetros distintos', 'No se desliza bajo carga'],
    cons: ['Más difícil de aprender', 'Requiere "cola de perro" extra para mayor seguridad'],
    color: '#f59e0b', accent: 'border-amber-500/50',
    difficulty: 'Avanzado',
    stepsImage: sheetBendSteps,
    stepsCaption: [
      '① Formá una gaza con el cabo GRUESO (rojo)',
      '② Pasá el cabo FINO (azul) hacia arriba por dentro de la gaza',
      '③ Rodeá el azul detrás de ambas colas del rojo',
      '④ Pasá el azul por encima de sí mismo — ajustá. ¡Vuelta de Escota!'
    ]
  },
  {
    id: 'figure8',
    name: 'Nudo de Ocho',
    otherNames: ['Figure Eight', 'Nudo Stopper', 'Nudo de Pajarita'],
    use: 'Tope de cabo — evita que el chicote se pase por una polea o ojo',
    description: 'El stopper más seguro. Se hace en el extremo del chicote para impedir que se escape por un ojo, polea o mordaza.',
    pros: ['Fácil y rápido', 'Muy resistente', 'No se desliza', 'Identificable visualmente'],
    cons: ['Difícil de desatar si se moja', 'Ocupa más cabo que otros stopper'],
    color: '#ec4899', accent: 'border-pink-500/50',
    difficulty: 'Fácil',
    stepsImage: figure8Steps,
    stepsCaption: [
      '① Cruzá el chicote POR ENCIMA del firme — forma un lazo',
      '② Rodeá el chicote por DEBAJO del firme',
      '③ Pasá el chicote por DENTRO del lazo inicial',
      '④ Ajustá — queda la clásica forma de "8". ¡Stopper listo!'
    ]
  }
];

const XP_PER_CORRECT = 10;
const PASS_THRESHOLD = 0.7;

interface KnotsViewerProps {
  questions: QuizQuestion[];
}

export const KnotsViewer: React.FC<KnotsViewerProps> = ({ questions }) => {
  const [tab, setTab] = useState<'APRENDER' | 'ESTUDIO' | 'QUIZ'>('APRENDER');
  const [activeKnot, setActiveKnot] = useState(0);

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

  return (
    <div className="h-full flex flex-col gap-2 overflow-hidden">
      {/* Barra de control unificada */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 shrink-0">
        {/* Toggle Modo */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setTab('APRENDER')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
              tab === 'APRENDER' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            Aprender
          </button>
          <button
            onClick={() => setTab('ESTUDIO')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
              tab === 'ESTUDIO' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Explorar
          </button>
          <button
            onClick={() => setTab('QUIZ')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
              tab === 'QUIZ' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            Practicar
          </button>
        </div>

        {/* Pills de nudos */}
        {tab === 'ESTUDIO' && (
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {KNOTS.map((k, i) => (
              <button
                key={k.id}
                onClick={() => setActiveKnot(i)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  activeKnot === i
                    ? `${k.accent} text-white bg-slate-800`
                    : 'border-slate-800 text-slate-400 hover:text-slate-200 bg-slate-950'
                }`}
                style={activeKnot === i ? { borderColor: k.color + '80' } : {}}
              >
                <span style={{ color: k.color }}>{i + 1}.</span> {k.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {tab === 'APRENDER' && (
        <div className="flex-1 min-h-0 overflow-hidden">
          <IntegratedLearningView
            moduleId="NUDOS"
            title="Nudos Náuticos"
            questions={shuffledQuestions}
            visual={null}
            accentClass="bg-pink-500"
            visualForQuestion={question => {
              const text = `${question.question} ${question.explanation}`.toLowerCase();
              const selectedKnot = KNOTS.find(item =>
                [item.name, ...item.otherNames].some(name => text.includes(name.toLowerCase()))
              ) ?? KNOTS[0];
              return (
                <div className="h-full flex flex-col bg-slate-950 p-2">
                  <img
                    src={selectedKnot.stepsImage}
                    alt={`Secuencia detallada para realizar ${selectedKnot.name}`}
                    className="flex-1 min-h-0 w-full object-contain rounded-xl"
                  />
                  <div className="shrink-0 p-2 text-center">
                    <p className="text-sm font-black text-white">{selectedKnot.name}</p>
                    <p className="text-[10px] text-slate-400">{selectedKnot.use}</p>
                  </div>
                </div>
              );
            }}
          />
        </div>
      )}

      {/* ESTUDIO: Grid 2 columnas */}
      {tab === 'ESTUDIO' && (
        <div className="grid md:grid-cols-12 gap-3 flex-1 min-h-0 overflow-hidden">

          {/* Imagen paso a paso hiperrealista (7 cols) */}
          <div
            className={`md:col-span-7 bg-slate-950 border-2 rounded-2xl overflow-hidden flex flex-col h-full relative`}
            style={{ borderColor: knot.color + '40' }}
          >
            <div className="flex-1 min-h-0 flex items-center justify-center p-2 overflow-hidden">
              <img
                key={knot.id}
                src={knot.stepsImage}
                alt={`Pasos para armar el ${knot.name} en cuerda de poliéster con FIRME rojo y CHICOTE azul`}
                className="w-full h-full object-contain rounded-xl"
              />
            </div>

            {/* Leyenda de colores */}
            <div className="bg-slate-900 border-t border-slate-800 px-3 py-2 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4 text-[11px] font-bold">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                  <span className="text-red-400">🔴 FIRME (standing part)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
                  <span className="text-blue-400">🔵 CHICOTE (working end)</span>
                </span>
              </div>
              <span
                className="text-[10px] font-extrabold px-2 py-0.5 rounded-full"
                style={{ color: knot.color, backgroundColor: knot.color + '20' }}
              >
                {knot.difficulty}
              </span>
            </div>
          </div>

          {/* Panel informativo (5 cols) */}
          <div className="md:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 overflow-y-auto h-full">
            {/* Encabezado */}
            <div>
              <h3 className="text-base font-extrabold text-white mb-0.5">{knot.name}</h3>
              <p className="text-[10px] text-slate-500 italic">{knot.otherNames.join(' · ')}</p>
            </div>

            {/* Uso */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
              <p className="text-[10px] font-black uppercase tracking-wider mb-1" style={{ color: knot.color }}>
                ⚓ Uso a Bordo
              </p>
              <p className="text-xs text-slate-200 font-medium leading-relaxed">{knot.use}</p>
            </div>

            {/* Instrucciones paso a paso */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">📋 Pasos en la Imagen</p>
              <ol className="space-y-1.5">
                {knot.stepsCaption.map((caption, i) => (
                  <li key={i} className="text-[11px] text-slate-300 leading-snug flex gap-2">
                    <span className="font-extrabold shrink-0" style={{ color: knot.color }}>
                      {i + 1}.
                    </span>
                    <span>{caption.replace(/^①|②|③|④/, '').trim()}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Pros y Cons */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-2.5">
                <p className="text-[10px] uppercase font-bold text-emerald-300 mb-1 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Ventajas
                </p>
                <ul className="space-y-1">
                  {knot.pros.map((p, i) => (
                    <li key={i} className="text-[10px] text-slate-300 leading-tight">• {p}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-2.5">
                <p className="text-[10px] uppercase font-bold text-rose-300 mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Limitaciones
                </p>
                <ul className="space-y-1">
                  {knot.cons.map((c, i) => (
                    <li key={i} className="text-[10px] text-slate-300 leading-tight">• {c}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Tip */}
            <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl p-2.5 text-[11px] text-amber-300 leading-relaxed mt-auto">
              💡 {knot.description}
            </div>
          </div>
        </div>
      )}

      {/* QUIZ */}
      {tab === 'QUIZ' && !finished && questions.length > 0 && (
        <div className="flex-1 min-h-0 overflow-y-auto">
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

      {/* RESULTADOS */}
      {tab === 'QUIZ' && finished && result && (
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 max-w-lg w-full text-center shadow-2xl">
            {passed ? (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500 mb-3">
                  <Trophy className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-xl font-extrabold text-amber-300 mb-1">¡Maestro de Nudos!</h3>
                <p className="text-slate-300 text-xs mb-4">Podés amarrar cualquier cosa a bordo con seguridad.</p>
              </>
            ) : (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500 mb-3">
                  <Lightbulb className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-xl font-extrabold text-cyan-300 mb-1">Repasá los nudos</h3>
                <p className="text-slate-300 text-xs mb-4">Necesitas 70% para aprobar. Mirá los pasos en la Guía.</p>
              </>
            )}

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <p className="text-xl font-black text-cyan-400">{accuracy.toFixed(0)}%</p>
                <p className="text-[10px] text-slate-400">Precisión</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <p className="text-xl font-black text-emerald-400">{result.correct}/{result.total}</p>
                <p className="text-[10px] text-slate-400">Aciertos</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <p className="text-xl font-black text-amber-400">+{result.xpEarned}</p>
                <p className="text-[10px] text-slate-400">XP</p>
              </div>
            </div>

            <button
              onClick={handleRestart}
              className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 px-5 rounded-xl text-xs transition-all mx-auto shadow-md cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reintentar Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
