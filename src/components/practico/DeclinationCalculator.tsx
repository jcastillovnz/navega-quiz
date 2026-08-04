import React, { useState, useMemo } from 'react';
import { Compass, Calculator, Info, Lightbulb } from 'lucide-react';

interface DeclinationResult {
  yearsDiff: number;
  totalVariationMinutes: number;
  isSameSign: boolean;
  operation: string;
  resultMinutes: number;
  finalDegrees: number;
  finalMinutes: number;
  hemisphere: 'W' | 'E';
}

const computeDeclination = (
  currentYear: number,
  chartYear: number,
  baseDegrees: number,
  baseMinutes: number,
  baseHemisphere: 'W' | 'E',
  variationMinutes: number,
  variationHemisphere: 'W' | 'E'
): DeclinationResult => {
  const yearsDiff = currentYear - chartYear;
  const totalVariationMinutes = yearsDiff * variationMinutes;
  const isSameSign = baseHemisphere === variationHemisphere;

  // Trabajar en minutos totales para evitar errores de acarreo
  const baseTotal = baseDegrees * 60 + baseMinutes;
  // W = negativo, E = positivo
  const baseSigned = baseHemisphere === 'W' ? -baseTotal : baseTotal;
  const variationSigned = variationHemisphere === 'W' ? -totalVariationMinutes : totalVariationMinutes;
  const netSigned = baseSigned + variationSigned;
  const absNet = Math.abs(netSigned);
  const finalHemisphere: 'W' | 'E' = netSigned < 0 ? 'W' : 'E';
  const finalDegrees = Math.floor(absNet / 60);
  const finalMinutes = absNet % 60;
  const operation = isSameSign
    ? `Suma (mismo signo: ${baseHemisphere})`
    : `Resta (signos opuestos: ${baseHemisphere} y ${variationHemisphere})`;

  return {
    yearsDiff,
    totalVariationMinutes,
    isSameSign,
    operation,
    resultMinutes: finalMinutes,
    finalDegrees,
    finalMinutes,
    hemisphere: finalHemisphere
  };
};

// Ejemplos precargados (del JSON prácticos)
const PRESETS = [
  { label: 'Ejemplo 1 (06° 10\' W → 2025)', year: 2025, chartYear: 2021, baseD: 6, baseM: 10, baseH: 'W' as const, var: 8, varH: 'W' as const },
  { label: 'Ejemplo 2 (05° 40\' W → 2026)', year: 2026, chartYear: 2020, baseD: 5, baseM: 40, baseH: 'W' as const, var: 5, varH: 'E' as const }
];

export const DeclinationCalculator: React.FC = () => {
  // Inputs
  const [currentYear, setCurrentYear] = useState(2026);
  const [chartYear, setChartYear] = useState(2020);
  const [baseD, setBaseD] = useState(5);
  const [baseM, setBaseM] = useState(40);
  const [baseH, setBaseH] = useState<'W' | 'E'>('W');
  const [variation, setVariation] = useState(5);
  const [varH, setVarH] = useState<'W' | 'E'>('E');

  const result = useMemo(
    () => computeDeclination(currentYear, chartYear, baseD, baseM, baseH, variation, varH),
    [currentYear, chartYear, baseD, baseM, baseH, variation, varH]
  );

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setCurrentYear(p.year);
    setChartYear(p.chartYear);
    setBaseD(p.baseD);
    setBaseM(p.baseM);
    setBaseH(p.baseH);
    setVariation(p.var);
    setVarH(p.varH);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 mb-3">
          <Compass className="w-7 h-7 text-cyan-400" />
        </div>
        <h3 className="text-2xl font-bold text-white">Calculadora de Declinación Magnética</h3>
        <p className="text-sm text-slate-400 mt-1">
          Calcula la D<sub>m</sub> actualizada al año actual a partir de los datos de la carta náutica.
        </p>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-2 justify-center">
        <span className="text-xs text-slate-500 self-center">Ejemplos:</span>
        {PRESETS.map((p, i) => (
          <button
            key={i}
            onClick={() => applyPreset(p)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Panel de Inputs */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Calculator className="w-4 h-4 text-cyan-400" />
            Datos de Entrada
          </h4>

          {/* Años */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Año actual</label>
              <input
                type="number"
                value={currentYear}
                onChange={e => setCurrentYear(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Año de la carta</label>
              <input
                type="number"
                value={chartYear}
                onChange={e => setChartYear(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Dm base */}
          <div>
            <label className="text-xs text-slate-400 block mb-1">D<sub>m</sub> de la carta</label>
            <div className="flex gap-1">
              <input
                type="number"
                placeholder="°"
                value={baseD}
                onChange={e => setBaseD(parseInt(e.target.value) || 0)}
                className="w-1/3 bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-white focus:border-cyan-500 focus:outline-none text-center"
              />
              <input
                type="number"
                placeholder="'"
                value={baseM}
                onChange={e => setBaseM(parseInt(e.target.value) || 0)}
                className="w-1/3 bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-white focus:border-cyan-500 focus:outline-none text-center"
              />
              <div className="flex w-1/3 bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
                {(['W', 'E'] as const).map(h => (
                  <button
                    key={h}
                    onClick={() => setBaseH(h)}
                    className={`flex-1 text-sm font-bold transition-all ${
                      baseH === h ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Variación anual */}
          <div>
            <label className="text-xs text-slate-400 block mb-1">Variación anual (minutos)</label>
            <div className="flex gap-1">
              <input
                type="number"
                value={variation}
                onChange={e => setVariation(parseInt(e.target.value) || 0)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
              />
              <div className="flex w-1/3 bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
                {(['W', 'E'] as const).map(h => (
                  <button
                    key={h}
                    onClick={() => setVarH(h)}
                    className={`flex-1 text-sm font-bold transition-all ${
                      varH === h ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 bg-slate-900/50 rounded p-2 leading-relaxed">
            <Info className="w-3 h-3 inline mr-1" />
            W = Oeste (negativo). E = Este (positivo). Si D<sub>m</sub> y variación tienen el mismo signo, se <strong>suma</strong>. Si son opuestos, se <strong>resta</strong>.
          </div>
        </div>

        {/* Panel de Resultado y pasos */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 flex flex-col">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            Resolución Paso a Paso
          </h4>

          <div className="space-y-2 mb-4 text-sm">
            <div className="flex items-start gap-2">
              <span className="shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center text-xs font-bold">1</span>
              <p className="text-slate-300">
                Diferencia de años: <strong className="text-white">{currentYear} - {chartYear} = {result.yearsDiff} años</strong>
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center text-xs font-bold">2</span>
              <p className="text-slate-300">
                Variación total: <strong className="text-white">{result.yearsDiff} × {variation}' = {result.totalVariationMinutes}' {varH}</strong>
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center text-xs font-bold">3</span>
              <p className="text-slate-300">
                {result.isSameSign ? (
                  <>Mismo signo (<strong className="text-emerald-300">{baseH}</strong>). Se <strong className="text-emerald-300">suman</strong>.</>
                ) : (
                  <>Signos opuestos (<strong className="text-amber-300">{baseH}</strong> y <strong className="text-amber-300">{varH}</strong>). Se <strong className="text-amber-300">restan</strong>.</>
                )}
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center text-xs font-bold">4</span>
              <p className="text-slate-300">
                Operación: <strong className="text-white">{baseD}° {baseM}' {baseH} {result.isSameSign ? '+' : '-'} {result.totalVariationMinutes}' {varH}</strong>
              </p>
            </div>
          </div>

          {/* Resultado final destacado */}
          <div className="mt-auto bg-gradient-to-br from-amber-500/20 to-amber-500/5 border-2 border-amber-500/50 rounded-xl p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-amber-300/80 mb-1">D<sub>m</sub> para {currentYear}</p>
            <p className="text-4xl font-bold text-amber-300">
              {String(result.finalDegrees).padStart(2, '0')}° {String(result.finalMinutes).padStart(2, '0')}' {result.hemisphere}
            </p>
          </div>

          <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-400 bg-slate-900/50 rounded p-2">
            <Lightbulb className="w-3 h-3 text-amber-400 shrink-0" />
            <span>Regla mnemotécnica: <strong>"Igual suma, distinto resta"</strong> (signos de D<sub>m</sub> y variación).</span>
          </div>
        </div>
      </div>
    </div>
  );
};
