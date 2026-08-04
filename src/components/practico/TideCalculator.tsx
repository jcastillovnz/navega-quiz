import React, { useState, useMemo } from 'react';
import { Waves, Clock, TrendingUp, TrendingDown, Calculator, Lightbulb } from 'lucide-react';

interface TidePoint {
  time: string; // "HH:MM"
  height: number; // metros
  type: 'HIGH' | 'LOW';
}

const TIME_RE = /^(\d{1,2}):(\d{2})$/;

const parseTime = (t: string): number => {
  const m = TIME_RE.exec(t);
  if (!m) return 0;
  return parseInt(m[1]) * 60 + parseInt(m[2]);
};

// Predicción simple de altura por interpolación lineal
const predictHeight = (minutes: number, points: TidePoint[]): number => {
  if (points.length < 2) return 0;
  const sorted = [...points].sort((a, b) => parseTime(a.time) - parseTime(b.time));
  // Caso de cruce de medianoche: agregar último al día siguiente
  const withNext: Array<{ t: number; h: number; type: 'HIGH' | 'LOW' }> = [];
  for (let i = 0; i < sorted.length; i++) {
    const t = parseTime(sorted[i].time);
    withNext.push({ t, h: sorted[i].height, type: sorted[i].type });
    if (i === sorted.length - 1) {
      // cerrar el ciclo volviendo al primer punto del día siguiente
      withNext.push({ t: t + 1440, h: sorted[0].height, type: sorted[0].type });
    }
  }
  if (minutes < withNext[0].t) minutes += 1440;
  for (let i = 0; i < withNext.length - 1; i++) {
    const a = withNext[i];
    const b = withNext[i + 1];
    if (minutes >= a.t && minutes <= b.t) {
      const ratio = (minutes - a.t) / (b.t - a.t);
      return a.h + ratio * (b.h - a.h);
    }
  }
  return 0;
};

// Encuentra la pleamar o bajamar más cercana al tiempo dado
const findNearestExtremum = (minutes: number, points: TidePoint[]): { point: TidePoint; minsAway: number } | null => {
  if (points.length === 0) return null;
  let best: { point: TidePoint; minsAway: number } | null = null;
  for (const p of points) {
    let m = parseTime(p.time);
    let diff = m - minutes;
    if (Math.abs(diff) > 720) {
      // cruce de medianoche
      m += 1440;
      diff = m - minutes;
    }
    if (!best || Math.abs(diff) < Math.abs(best.minsAway)) {
      best = { point: p, minsAway: diff };
    }
  }
  return best;
};

export const TideCalculator: React.FC = () => {
  const [points, setPoints] = useState<TidePoint[]>([
    { time: '06:00', height: 0.4, type: 'LOW' },
    { time: '10:00', height: 1.8, type: 'HIGH' },
    { time: '16:00', height: 0.6, type: 'LOW' }
  ]);
  const [queryTime, setQueryTime] = useState('12:00');
  const [criticalDepth, setCriticalDepth] = useState(0.5);

  const amplitude = useMemo(() => {
    if (points.length < 2) return 0;
    const heights = points.map(p => p.height);
    return Math.max(...heights) - Math.min(...heights);
  }, [points]);

  const queryMinutes = parseTime(queryTime);
  const predictedHeight = useMemo(() => predictHeight(queryMinutes, points), [queryMinutes, points]);
  const nearest = useMemo(() => findNearestExtremum(queryMinutes, points), [queryMinutes, points]);

  // Estado de marea (subiendo/bajando) según los puntos adyacentes
  const sortedPoints = useMemo(
    () => [...points].sort((a, b) => parseTime(a.time) - parseTime(b.time)),
    [points]
  );
  const tideDirection = useMemo<'RISING' | 'FALLING' | 'STABLE'>(() => {
    if (sortedPoints.length < 2) return 'STABLE';
    for (let i = 0; i < sortedPoints.length - 1; i++) {
      const a = sortedPoints[i];
      const b = sortedPoints[i + 1];
      const tA = parseTime(a.time);
      const tB = parseTime(b.time);
      if (queryMinutes >= tA && queryMinutes <= tB) {
        return b.height > a.height ? 'RISING' : 'FALLING';
      }
    }
    return 'STABLE';
  }, [queryMinutes, sortedPoints]);

  const canCross = predictedHeight >= criticalDepth;
  const minutesToNextExtreme = nearest ? Math.abs(nearest.minsAway) : 0;

  const updatePoint = (idx: number, field: keyof TidePoint, value: string) => {
    setPoints(prev => prev.map((p, i) => {
      if (i !== idx) return p;
      if (field === 'height') return { ...p, height: parseFloat(value) || 0 };
      if (field === 'time') return { ...p, time: value };
      return p;
    }));
  };

  const addPoint = () => {
    if (points.length >= 6) return;
    setPoints(prev => [...prev, { time: '20:00', height: 1.0, type: 'HIGH' }]);
  };

  const removePoint = (idx: number) => {
    if (points.length <= 2) return;
    setPoints(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto p-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 mb-3">
          <Waves className="w-7 h-7 text-cyan-400" />
        </div>
        <h3 className="text-2xl font-bold text-white">Calculadora de Mareas</h3>
        <p className="text-sm text-slate-400 mt-1">
          Tabla de mareas: pleamares y bajamares. Calcula altura, amplitud y hora crítica de paso.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Tabla de mareas */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            Tabla de Mareas
          </h4>
          <div className="space-y-2">
            {points.map((p, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-1 text-xs text-slate-500 text-center">{i + 1}</div>
                <input
                  type="text"
                  value={p.time}
                  onChange={e => updatePoint(i, 'time', e.target.value)}
                  placeholder="HH:MM"
                  className="col-span-4 bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-white text-sm focus:border-cyan-500 focus:outline-none"
                />
                <input
                  type="number"
                  step="0.1"
                  value={p.height}
                  onChange={e => updatePoint(i, 'height', e.target.value)}
                  className="col-span-3 bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-white text-sm focus:border-cyan-500 focus:outline-none"
                />
                <span className={`col-span-2 text-[10px] font-bold text-center px-1 py-0.5 rounded ${
                  p.type === 'HIGH' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {p.type === 'HIGH' ? 'PLEA' : 'BAJA'}
                </span>
                <button
                  onClick={() => removePoint(i)}
                  disabled={points.length <= 2}
                  className="col-span-2 text-rose-400 hover:text-rose-300 text-xs disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>

          <div className="mt-3 flex justify-between items-center text-[10px] text-slate-500 px-1">
            <span>Hora (HH:MM) / Altura (m)</span>
            <button
              onClick={addPoint}
              disabled={points.length >= 6}
              className="text-cyan-400 hover:text-cyan-300 disabled:opacity-30"
            >
              + Agregar punto
            </button>
          </div>

          {/* Amplitud */}
          <div className="mt-4 bg-slate-900/50 rounded-lg p-3 border border-slate-700">
            <p className="text-[10px] uppercase tracking-wider text-slate-400">Amplitud de la marea</p>
            <p className="text-xl font-bold text-cyan-300">{amplitude.toFixed(2)} m</p>
            <p className="text-[10px] text-slate-500 mt-1">= Marea más alta − Marea más baja</p>
          </div>
        </div>

        {/* Resultados y cruce */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 flex flex-col gap-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Calculator className="w-4 h-4 text-amber-400" />
            Consulta a una hora
          </h4>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Hora de consulta</label>
            <input
              type="text"
              value={queryTime}
              onChange={e => setQueryTime(e.target.value)}
              placeholder="HH:MM"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Calado crítico (m)</label>
            <input
              type="number"
              step="0.1"
              value={criticalDepth}
              onChange={e => setCriticalDepth(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Predicción */}
          <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border-2 border-cyan-500/40 rounded-xl p-4 text-center">
            <p className="text-[10px] uppercase tracking-wider text-cyan-300/80 mb-1">Altura predicha a las {queryTime}</p>
            <p className="text-4xl font-bold text-cyan-300">{predictedHeight.toFixed(2)} m</p>
            <div className="mt-2 flex items-center justify-center gap-1 text-xs text-slate-300">
              {tideDirection === 'RISING' ? (
                <><TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Subiendo</>
              ) : tideDirection === 'FALLING' ? (
                <><TrendingDown className="w-3.5 h-3.5 text-rose-400" /> Bajando</>
              ) : (
                <span>Estable</span>
              )}
            </div>
          </div>

          {/* Veredicto cruce */}
          <div className={`rounded-xl p-3 text-center border-2 ${
            canCross
              ? 'bg-emerald-500/10 border-emerald-500/50'
              : 'bg-rose-500/10 border-rose-500/50'
          }`}>
            <p className={`text-sm font-bold ${canCross ? 'text-emerald-300' : 'text-rose-300'}`}>
              {canCross ? '✓ PUEDES CRUZAR' : '✗ NO CRUZAR'}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Altura {predictedHeight.toFixed(2)}m vs calado crítico {criticalDepth.toFixed(2)}m
            </p>
          </div>

          {/* Próximo extremo */}
          {nearest && (
            <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
              <p className="text-[10px] uppercase tracking-wider text-slate-400">Próximo extremo</p>
              <p className="text-sm font-bold text-white">
                {nearest.point.type === 'HIGH' ? 'Pleamar' : 'Bajamar'} a las {nearest.point.time} ({nearest.point.height}m)
              </p>
              <p className="text-[11px] text-slate-300">
                {nearest.minsAway > 0 ? 'en' : nearest.minsAway < 0 ? 'hace' : 'ahora'}{' '}
                <strong className="text-cyan-300">
                  {Math.floor(minutesToNextExtreme / 60)}h {minutesToNextExtreme % 60}m
                </strong>
              </p>
            </div>
          )}

          <div className="mt-auto flex items-start gap-2 text-[10px] text-slate-400 bg-slate-900/50 rounded p-2">
            <Lightbulb className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
            <span>La interpolación es lineal entre puntos consecutivos. En la realidad, la marea sigue una curva sinusoidal.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
