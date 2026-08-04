import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Clock, CheckCircle2, ChevronRight, Trophy, AlertTriangle, RotateCcw } from 'lucide-react';
import { generateExam, gradeExam, type GeneratedExam, type ExamQuestion } from '../../utils/examGenerator';
import { saveExamResult, addManyToReview, addXP, registerStudy } from '../../utils/storage';
import type { QuizCategory, ExamResult } from '../../types/quiz';

const CATEGORY_LABELS: Record<QuizCategory, string> = {
  RIPA: 'RIPA',
  IALA: 'IALA',
  SEGURIDAD: 'Seguridad',
  NOMENCLATURA: 'Nomenclatura',
  METEOROLOGIA: 'Meteorología',
  PRACTICO: 'Prácticos',
  NUDOS: 'Nudos'
};

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export const RealExamView: React.FC = () => {
  const [exam, setExam] = useState<GeneratedExam | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [finished, setFinished] = useState(false);
  const [report, setReport] = useState<ReturnType<typeof gradeExam> | null>(null);
  const startRef = useRef<number>(0);

  // Inicializar examen
  const startExam = useCallback(() => {
    const e = generateExam();
    setExam(e);
    setCurrentIdx(0);
    setAnswers({});
    setTimeLeft(e.config.durationMinutes * 60);
    setFinished(false);
    setReport(null);
    startRef.current = Date.now();
  }, []);

  useEffect(() => {
    startExam();
  }, [startExam]);

  // Cronómetro regresivo
  useEffect(() => {
    if (!exam || finished) return;
    if (timeLeft <= 0) {
      handleFinish();
      return;
    }
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exam, finished, timeLeft <= 0]);

  const handleSelect = (qid: string, oid: string) => {
    setAnswers(prev => ({ ...prev, [qid]: oid }));
  };

  const handleFinish = useCallback(() => {
    if (!exam) return;
    const r = gradeExam(exam, answers);
    r.timeSpentSeconds = Math.floor((Date.now() - startRef.current) / 1000);
    setReport(r);
    setFinished(true);

    // Persistir resultado
    const examResult: ExamResult = {
      id: `exam_${Date.now()}`,
      date: Date.now(),
      score: r.score,
      passed: r.passed,
      timeSpentSeconds: r.timeSpentSeconds,
      moduleScores: Object.fromEntries(
        Object.entries(r.moduleScores).map(([k, v]) => [
          k as QuizCategory,
          Math.round((v.correct / v.total) * 100)
        ])
      ) as Record<QuizCategory, number>,
      incorrectQuestionIds: r.incorrectIds
    };
    saveExamResult(examResult);

    // Ruteo de fallos al SpacedRepetition
    if (r.incorrectIds.length > 0) {
      addManyToReview(r.incorrectIds);
    }

    // XP por completar examen + bonus por aprobar
    const earned = r.score + (r.passed ? 50 : 0);
    addXP(earned);
    registerStudy();
  }, [exam, answers]);

  const currentQ: ExamQuestion | undefined = exam?.questions[currentIdx];
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const total = exam?.totalPoints ?? 0;
  const isLowTime = timeLeft < 300; // < 5 min

  if (!exam || !currentQ) {
    return <div className="text-center text-slate-400 py-12">Cargando examen...</div>;
  }

  // --- PANTALLA DE REPORTE FINAL ---
  if (finished && report) {
    const minutes = Math.floor(report.timeSpentSeconds / 60);
    const seconds = report.timeSpentSeconds % 60;

    // Construir datos del RadarChart en SVG
    const moduleData = Object.entries(report.moduleScores) as [QuizCategory, { correct: number; total: number }][];
    const radarModules = moduleData.length > 0 ? moduleData : [];
    const radarSize = 280;
    const radarCx = radarSize / 2;
    const radarCy = radarSize / 2;
    const radarR = radarSize / 2 - 30;
    const angleStep = (Math.PI * 2) / Math.max(1, radarModules.length);

    return (
      <div className="max-w-full mx-auto p-1 flex flex-col gap-2 animate-[fade-in_0.6s_ease-out] flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-hidden custom-scroll">
        <div className="text-center">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-2 ${
              report.passed ? 'bg-amber-500/20 border-2 border-amber-500' : 'bg-rose-500/20 border-2 border-rose-500'
            }`}
          >
            {report.passed ? <Trophy className="w-8 h-8 text-amber-400" /> : <AlertTriangle className="w-8 h-8 text-rose-400" />}
          </div>
          <h2 className={`text-2xl font-bold mb-1 ${report.passed ? 'text-amber-300' : 'text-rose-300'}`}>
            {report.passed ? '¡APROBADO!' : 'No alcanzaste el 70%'}
          </h2>
          <p className="text-slate-400 text-xs">
            Examen PNA Simulado — Timonel de Yate Vela y Motor
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {/* Score grande */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 text-center">
            <p className="text-[10px] uppercase tracking-wider text-slate-400">Puntaje Final</p>
            <p className={`text-5xl font-bold my-1 ${report.passed ? 'text-amber-300' : 'text-rose-300'}`}>
              {report.score}<span className="text-xl text-slate-500">/100</span>
            </p>
            <p className="text-[10px] text-slate-400">
              {report.correctCount} aciertos de {report.totalCount} • {minutes}m {String(seconds).padStart(2, '0')}s
            </p>
            {report.passed && (
              <div className="mt-2 inline-block bg-amber-500/20 text-amber-200 px-2 py-1 rounded-full text-[10px] font-bold border border-amber-500/40">
                🎖️ MEDALLA DE TIMONEL
              </div>
            )}
          </div>

          {/* Radar chart por módulo */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1 text-center">Rendimiento por Módulo</p>
            {radarModules.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-12">Sin datos.</p>
            ) : (
              <div className="flex justify-center">
                <svg width={radarSize} height={radarSize} viewBox={`0 0 ${radarSize} ${radarSize}`}>
                  {/* Anillos concéntricos */}
                  {[0.25, 0.5, 0.75, 1].map(r => (
                    <circle
                      key={r}
                      cx={radarCx}
                      cy={radarCy}
                      r={radarR * r}
                      fill="none"
                      stroke="#334155"
                      strokeWidth="0.5"
                    />
                  ))}
                  {/* Radios + labels */}
                  {radarModules.map(([cat], i) => {
                    const angle = -Math.PI / 2 + i * angleStep;
                    const x2 = radarCx + Math.cos(angle) * radarR;
                    const y2 = radarCy + Math.sin(angle) * radarR;
                    const lx = radarCx + Math.cos(angle) * (radarR + 18);
                    const ly = radarCy + Math.sin(angle) * (radarR + 18);
                    return (
                      <g key={cat}>
                        <line x1={radarCx} y1={radarCy} x2={x2} y2={y2} stroke="#475569" strokeWidth="0.5" />
                        <text
                          x={lx}
                          y={ly}
                          fill="#94a3b8"
                          fontSize="9"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontWeight="bold"
                        >
                          {CATEGORY_LABELS[cat]}
                        </text>
                      </g>
                    );
                  })}
                  {/* Polígono del resultado */}
                  {(() => {
                    const points = radarModules.map(([_cat, m], i) => {
                      const angle = -Math.PI / 2 + i * angleStep;
                      const ratio = m.correct / m.total;
                      const x = radarCx + Math.cos(angle) * radarR * ratio;
                      const y = radarCy + Math.sin(angle) * radarR * ratio;
                      return `${x},${y}`;
                    }).join(' ');
                    return (
                      <>
                        <polygon points={points} fill="rgba(34,211,238,0.3)" stroke="#22d3ee" strokeWidth="2" />
                        {radarModules.map(([_cat, m], i) => {
                          const angle = -Math.PI / 2 + i * angleStep;
                          const ratio = m.correct / m.total;
                          const x = radarCx + Math.cos(angle) * radarR * ratio;
                          const y = radarCy + Math.sin(angle) * radarR * ratio;
                          return <circle key={i} cx={x} cy={y} r="3" fill="#22d3ee" />;
                        })}
                      </>
                    );
                  })()}
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Detalle por módulo */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-2">Detalle por módulo</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
            {radarModules.map(([cat, m]) => {
              const pct = Math.round((m.correct / m.total) * 100);
              return (
                <div key={cat} className="bg-slate-900/50 rounded-lg p-2 border border-slate-700">
                  <p className="text-[9px] text-slate-400 uppercase tracking-wider">{CATEGORY_LABELS[cat]}</p>
                  <p className="text-sm font-bold text-white">{m.correct}/{m.total}</p>
                  <div className="w-full h-1 bg-slate-700 rounded-full mt-1 overflow-hidden">
                    <div
                      className={`h-full ${pct >= 70 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {!report.passed && report.incorrectIds.length > 0 && (
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-2 text-xs text-cyan-200 flex items-start gap-2">
            <RotateCcw className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <p>
              <strong className="text-cyan-100">Caja de Repaso:</strong> {report.incorrectIds.length} pregunta(s) se
              enviarán a tu algoritmo de repetición espaciada.
            </p>
          </div>
        )}

        <button
          onClick={startExam}
          className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2 px-4 rounded-lg transition-all duration-300 mx-auto shadow-lg shadow-cyan-900/40 text-sm shrink-0"
        >
          <RotateCcw className="w-4 h-4" />
          Generar Nuevo Examen
        </button>
      </div>
    );
  }

  // --- PANTALLA DE EXAMEN EN CURSO ---
  return (
    <div className="max-w-full mx-auto p-1 flex flex-col gap-2 flex-1 min-h-0 min-w-0">
      {/* Header con cronómetro */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-2 flex items-center justify-between shrink-0">
        <div>
          <p className="text-[9px] uppercase tracking-wider text-slate-400">Examen PNA</p>
          <p className="text-xs font-bold text-white">Simulacro Oficial • {total} pts</p>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border ${
          isLowTime ? 'bg-rose-500/20 border-rose-500 animate-pulse' : 'bg-slate-900 border-slate-700'
        }`}>
          <Clock className={`w-3.5 h-3.5 ${isLowTime ? 'text-rose-400' : 'text-cyan-400'}`} />
          <span className={`font-mono font-bold text-sm ${isLowTime ? 'text-rose-300' : 'text-white'}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Progreso */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 shrink-0 px-1">
        <span>Pregunta <strong className="text-white">{currentIdx + 1}</strong>/{total}</span>
        <span>Respondidas: <strong className="text-cyan-300">{answeredCount}</strong>/{total}</span>
      </div>
      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 transition-all"
          style={{ width: `${((currentIdx + 1) / total) * 100}%` }}
        />
      </div>

      {/* Pregunta (sin feedback inmediato) */}
      <div className="bg-slate-800/70 backdrop-blur-md border border-white/10 rounded-lg p-3 shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[9px] uppercase tracking-wider text-slate-400">
            {CATEGORY_LABELS[currentQ.category]} • {currentQ.type === 'THEORETICAL' ? 'Teórica' : 'Práctica'}
          </span>
        </div>
        <h3 className="text-sm md:text-base font-semibold text-slate-50 leading-snug">
          {currentQ.question}
        </h3>
      </div>

      {/* Opciones (sin colores de feedback) */}
      <div className="flex flex-col gap-1.5 flex-1 min-h-0">
        {currentQ.options.map(option => {
          const isSelected = answers[currentQ.id] === option.id;
          return (
            <button
              key={option.id}
              onClick={() => handleSelect(currentQ.id, option.id)}
              className={`w-full text-left p-2 rounded-lg border-2 transition-all duration-200 flex items-start gap-2 ${
                isSelected
                  ? 'bg-cyan-500/15 border-cyan-500 text-cyan-50'
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-500 text-slate-200'
              }`}
            >
              <span
                className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                  isSelected ? 'bg-cyan-500 text-slate-950 border-cyan-500' : 'border-slate-600 text-slate-400'
                }`}
              >
                {option.id}
              </span>
              <span className="text-sm">{option.text}</span>
            </button>
          );
        })}
      </div>

      {/* Navegación */}
      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
          disabled={currentIdx === 0}
          className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
        >
          ← Anterior
        </button>

        {currentIdx < total - 1 ? (
          <button
            onClick={() => setCurrentIdx(i => i + 1)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2 rounded-lg transition-all shadow-lg shadow-cyan-900/40 text-sm"
          >
            Siguiente
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleFinish}
            className="flex-1 flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 rounded-lg transition-all shadow-lg shadow-amber-900/40 text-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            Finalizar Examen
          </button>
        )}
      </div>

      {/* Mini-mapa de preguntas - horizontal, sin overflow vertical */}
      <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-1.5 shrink-0 overflow-hidden">
        <p className="text-[9px] uppercase tracking-wider text-slate-400 mb-1 px-1">Mapa</p>
        <div className="flex gap-0.5 overflow-x-auto overflow-y-hidden custom-scroll pb-0.5" style={{ maxWidth: '100%' }}>
          {exam.questions.map((q, i) => {
            const isAnswered = !!answers[q.id];
            const isCurrent = i === currentIdx;
            return (
              <button
                key={q.id}
                onClick={() => setCurrentIdx(i)}
                className={`shrink-0 w-5 h-5 text-[9px] font-bold rounded flex items-center justify-center ${
                  isCurrent
                    ? 'bg-cyan-500 text-slate-950 ring-1 ring-cyan-300'
                    : isAnswered
                    ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/40'
                    : 'bg-slate-700 text-slate-500'
                }`}
                title={`Pregunta ${i + 1}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
