import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, BookOpen, BrainCircuit, Lightbulb } from 'lucide-react';
import ripaIala from '../../data/ripa_iala.json';
import ripaSound from '../../data/ripa_senales_auditivas.json';
import ripaExtended from '../../data/ripa_ampliado.json';
import meteorologiaApunte from '../../data/meteorologia_apunte.json';
import seguridadApunte from '../../data/seguridad_apunte.json';
import teoria from '../../data/teoria.json';
import nudos from '../../data/nudos.json';
import nomenclatura from '../../data/nomenclatura.json';
import practicos from '../../data/practicos.json';
import type { QuizQuestion } from '../../types/quiz';

type AllQuestion = QuizQuestion & { _source: string; options: { id: string; text: string }[] };

const PRACTICOS_QUESTIONS: AllQuestion[] = (practicos as unknown as Array<{
  id: string;
  statement: string;
  expectedResult: string | number;
  explanationStepByStep: string;
}>).map(p => ({
  id: p.id,
  category: 'PRACTICO' as const,
  question: p.statement,
  options: [
    { id: 'A', text: String(p.expectedResult), isCorrect: true },
    { id: 'B', text: 'Cálculo basado en declinación', isCorrect: false },
    { id: 'C', text: 'Cálculo basado en rumbo', isCorrect: false }
  ],
  explanation: p.explanationStepByStep,
  _source: 'Prácticos'
}));

const ALL_QUESTIONS: AllQuestion[] = [
  ...(ripaIala as QuizQuestion[]).map(q => ({ ...q, _source: 'RIPA/IALA' })),
  ...(ripaSound as QuizQuestion[]).map(q => ({ ...q, _source: 'RIPA/IALA' })),
  ...(ripaExtended as QuizQuestion[]).map(q => ({ ...q, _source: 'RIPA/IALA' })),
  ...(teoria as QuizQuestion[]).map(q => ({ ...q, _source: 'Teoría' })),
  ...(meteorologiaApunte as QuizQuestion[]).map(q => ({ ...q, _source: 'Teoría' })),
  ...(seguridadApunte as QuizQuestion[]).map(q => ({ ...q, _source: 'Teoría' })),
  ...(nudos as QuizQuestion[]).map(q => ({ ...q, _source: 'Nudos' })),
  ...(nomenclatura as QuizQuestion[]).map(q => ({ ...q, _source: 'Nomenclatura' })),
  ...PRACTICOS_QUESTIONS
];

const CATEGORY_COLORS: Record<string, string> = {
  'RIPA/IALA': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'Teoría': 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  'Nudos': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  'Nomenclatura': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'Prácticos': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'RIPA/IALA': <BookOpen className="w-3 h-3" />,
  'Teoría': <Lightbulb className="w-3 h-3" />,
  'Nudos': <BrainCircuit className="w-3 h-3" />,
  'Nomenclatura': <BookOpen className="w-3 h-3" />,
  'Prácticos': <BookOpen className="w-3 h-3" />
};

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);

  const results = useMemo<AllQuestion[]>(() => {
    if (!query.trim() || query.length < 2) return [];
    const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return ALL_QUESTIONS.filter(item => {
      const text = `${item.question} ${item.explanation || ''} ${item.options.map(o => o.text).join(' ')}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return text.includes(q);
    }).slice(0, 30);
  }, [query]);

  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setSelectedIdx(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIdx(i => Math.min(results.length - 1, i + 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIdx(i => Math.max(0, i - 1));
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, results, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-slate-950/85 backdrop-blur-sm flex items-start justify-center pt-12 sm:pt-20 px-3"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700 shrink-0">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            placeholder={`Buscar en las ${ALL_QUESTIONS.length} preguntas del banco (ej: 'eslora', 'Pampero', 'ballestrinque')...`}
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none text-sm"
          />
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 shrink-0"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scroll p-2">
          {query.length < 2 ? (
            <div className="text-center py-12 text-slate-500">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">Escribí al menos 2 caracteres para buscar</p>
              <p className="text-xs mt-1 text-slate-600">Atajo: <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-cyan-400">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-cyan-400">K</kbd></p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p className="text-sm">Sin resultados para "{query}"</p>
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedIdx(idx)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedIdx === idx
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-transparent hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border flex items-center gap-1 shrink-0 ${CATEGORY_COLORS[item._source] || ''}`}>
                      {CATEGORY_ICONS[item._source]}
                      {item._source}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono shrink-0">{item.id}</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-snug line-clamp-2 mb-1">
                    {highlightMatch(item.question, query)}
                  </p>
                  {item.explanation && (
                    <p className="text-[10px] text-slate-500 leading-snug line-clamp-1">
                      {item.explanation.substring(0, 120)}...
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-slate-700 px-4 py-2 flex items-center justify-between text-[10px] text-slate-500 shrink-0">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1 py-0.5 bg-slate-800 rounded">↑↓</kbd> navegar</span>
            <span><kbd className="px-1 py-0.5 bg-slate-800 rounded">Esc</kbd> cerrar</span>
          </div>
          <span>{results.length > 0 ? `${results.length} resultado${results.length === 1 ? '' : 's'}` : `${ALL_QUESTIONS.length} preguntas indexadas`}</span>
        </div>
      </div>
    </div>
  );
};

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim() || query.length < 2) return text;
  const normText = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const normQuery = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const idx = normText.indexOf(normQuery);
  if (idx === -1) return text;
  return (
    <>
      {text.substring(0, idx)}
      <mark className="bg-amber-500/40 text-amber-200 px-0.5 rounded">
        {text.substring(idx, idx + query.length)}
      </mark>
      {text.substring(idx + query.length)}
    </>
  );
}
