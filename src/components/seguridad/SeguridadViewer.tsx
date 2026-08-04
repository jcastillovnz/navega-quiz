import React, { useState, useMemo } from 'react';
import { Shield, LifeBuoy, Flame, Radio, Calculator, Anchor, ArrowRight, ChevronRight, Check } from 'lucide-react';

interface SafetyItem {
  id: string;
  name: string;
  category: 'PNA_OBLIGATORIO' | 'RECOMENDADO';
  icon: 'lifejacket' | 'flares' | 'extinguisher' | 'vhf' | 'flares2' | 'paddle' | 'firstaid' | 'mirror';
  description: string;
}

const SAFETY_ITEMS: SafetyItem[] = [
  { id: 'chalecos', name: 'Chalecos Salvavidas', category: 'PNA_OBLIGATORIO', icon: 'lifejacket', description: '1 por tripulante, aprobado PNA, con silbato y luz.' },
  { id: 'bengalas', name: 'Bengalas de Mano (x6)', category: 'PNA_OBLIGATORIO', icon: 'flares', description: 'Mínimo 6 bengalas con fecha de vigencia vigente.' },
  { id: 'cohetes', name: 'Cohetes con Paracaídas (x3)', category: 'PNA_OBLIGATORIO', icon: 'flares2', description: 'Alcanzan 300m de altura. Señales diurnas/nocturnas.' },
  { id: 'matafuegos', name: 'Matafuegos (x2)', category: 'PNA_OBLIGATORIO', icon: 'extinguisher', description: 'ABC de 1kg mínimo, uno en cockpit y otro en camarote.' },
  { id: 'vhf', name: 'Radio VHF Canal 16', category: 'PNA_OBLIGATORIO', icon: 'vhf', description: 'Para emitir MAYDAY / PAN PAN / SECURITE.' },
  { id: 'espejos', name: 'Espejo de Señales', category: 'RECOMENDADO', icon: 'mirror', description: 'Señales diurnas por reflexión solar.' },
  { id: 'remos', name: 'Remo/Bichero', category: 'RECOMENDADO', icon: 'paddle', description: 'Para maniobra de rescate o empuje.' },
  { id: 'botiquin', name: 'Botiquín de Primeros Auxilios', category: 'RECOMENDADO', icon: 'firstaid', description: 'Curitas, antiséptico, vendas, analgésicos.' }
];

const ICON_MAP: Record<SafetyItem['icon'], React.ReactNode> = {
  lifejacket: <LifeBuoy className="w-10 h-10" />,
  flares: <Flame className="w-10 h-10" />,
  flares2: <Flame className="w-10 h-10" />,
  extinguisher: <Shield className="w-10 h-10" />,
  vhf: <Radio className="w-10 h-10" />,
  mirror: <Shield className="w-10 h-10" />,
  paddle: <ArrowRight className="w-10 h-10" />,
  firstaid: <Shield className="w-10 h-10" />
};

const COLOR_MAP: Record<SafetyItem['icon'], string> = {
  lifejacket: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  flares: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  flares2: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  extinguisher: 'bg-red-500/20 text-red-300 border-red-500/40',
  vhf: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
  mirror: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
  paddle: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  firstaid: 'bg-pink-500/20 text-pink-300 border-pink-500/40'
};

type HaStep = 0 | 1 | 2 | 3 | 4 | 5;
const HA_STEPS = [
  { title: '1. GRITAR "¡HOMBRE AL AGUA!"', text: 'Mantener siempre la visual de la víctima. Lanzar aro salvavidas por la banda más cercana.' },
  { title: '2. TIMÓN A LA BANDA DE LA VÍCTIMA', text: 'Reducir la arrancada. Mantener proa al náufrago si es posible.' },
  { title: '3. AVISAR A PNA POR VHF', text: 'Emitir MAYDAY o PAN PAN en canal 16 con posición, cantidad de personas, tipo de embarcación.' },
  { title: '4. MOTOR: APROAR Y RETORNAR', text: 'Forma más rápida a motor. Virar 180° a la banda de la víctima y volver.' },
  { title: '5. VELA: MÉTODO WILLIAMSON', text: 'Orzar 60°, virar, ceñir hasta 180° del viento, orzar, ceñir hasta 240° y aproar a la víctima.' },
  { title: '6. IZAR A BORDO', text: 'Con bichero o escalerilla, atender al náufrago. Cubrirlo con manta térmica.' }
];

const ANCHOR_RATIOS = [
  { condition: 'Buen tiempo / Aguas protegidas', ratio: 3, label: '3:1' },
  { condition: 'Condiciones normales', ratio: 5, label: '5:1' },
  { condition: 'Mal tiempo / Tormenta', ratio: 7, label: '7:1' },
  { condition: 'Temporal muy fuerte', ratio: 10, label: '10:1' }
];

export const SeguridadViewer: React.FC = () => {
  const [section, setSection] = useState<'INVENTARIO' | 'HAA' | 'FONDEO'>('INVENTARIO');
  const [checked, setChecked] = useState<Set<string>>(new Set(['chalecos', 'bengalas', 'cohetes', 'matafuegos', 'vhf']));
  const [haStep, setHaStep] = useState<HaStep>(0);

  // Fondeo calculator state
  const [depth, setDepth] = useState(5);
  const [anchorRatio, setAnchorRatio] = useState(5);

  const toggleCheck = (id: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const recommended = SAFETY_ITEMS.filter(i => i.category === 'PNA_OBLIGATORIO');
  const recommendedChecked = recommended.filter(i => checked.has(i.id)).length;
  const totalRecommended = recommended.length;
  const safetyScore = Math.round((recommendedChecked / totalRecommended) * 100);

  // HAA progress
  const haProgress = ((haStep + 1) / HA_STEPS.length) * 100;

  // Fondeo
  const lineLength = useMemo(() => {
    return (depth * anchorRatio).toFixed(1);
  }, [depth, anchorRatio]);

  // Longitud visual en metros en escala: 50m máx
  const lineMax = 50;
  const linePercent = Math.min(100, (parseFloat(lineLength) / lineMax) * 100);

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto p-4">
      {/* Tabs */}
      <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700 max-w-2xl mx-auto w-full">
        {([
          { id: 'INVENTARIO', label: 'Inventario PNA', icon: Shield },
          { id: 'HAA', label: 'Hombre al Agua', icon: LifeBuoy },
          { id: 'FONDEO', label: 'Calculadora Fondeo', icon: Calculator }
        ] as const).map(s => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                section === s.id ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{s.label}</span>
              <span className="sm:hidden">{s.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* --- INVENTARIO --- */}
      {section === 'INVENTARIO' && (
        <div className="flex flex-col gap-4 animate-[fade-in_0.4s_ease-out]">
          {/* Score de seguridad */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Checklist PNA Obligatorio</p>
              <p className="text-2xl font-bold text-white mt-1">
                {recommendedChecked}/{totalRecommended}{' '}
                <span className="text-sm font-normal text-slate-400">ítems</span>
              </p>
            </div>
            <div className="text-right">
              <p className={`text-3xl font-bold ${safetyScore === 100 ? 'text-emerald-400' : safetyScore >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                {safetyScore}%
              </p>
              <p className="text-xs text-slate-400">Seguridad</p>
            </div>
          </div>

          {/* Grid de items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SAFETY_ITEMS.map(item => {
              const isChecked = checked.has(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`text-left rounded-xl border-2 p-3 transition-all duration-200 hover:scale-[1.02] active:scale-95 ${
                    isChecked
                      ? 'bg-emerald-500/10 border-emerald-500'
                      : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className={`p-2 rounded-lg border ${COLOR_MAP[item.icon]}`}>
                      {ICON_MAP[item.icon]}
                    </div>
                    <div
                      className={`w-6 h-6 rounded-md flex items-center justify-center border-2 transition-all ${
                        isChecked ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'
                      }`}
                    >
                      {isChecked && <Check className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                  <p className={`text-sm font-bold ${isChecked ? 'text-emerald-200' : 'text-slate-100'}`}>
                    {item.name}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{item.description}</p>
                  <span
                    className={`text-[9px] mt-2 inline-block px-1.5 py-0.5 rounded font-bold ${
                      item.category === 'PNA_OBLIGATORIO' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-600/50 text-slate-300'
                    }`}
                  >
                    {item.category === 'PNA_OBLIGATORIO' ? 'OBLIGATORIO' : 'RECOMENDADO'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* --- HOMBRE AL AGUA (HAA) --- */}
      {section === 'HAA' && (
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 animate-[fade-in_0.4s_ease-out]">
          <div className="flex items-center gap-2 mb-1">
            <LifeBuoy className="w-5 h-5 text-rose-400" />
            <h3 className="text-xl font-bold text-white">Maniobra de Hombre al Agua (HAA)</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">Procedimiento paso a paso para rescatar un náufrago.</p>

          {/* Progreso */}
          <div className="mb-5">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span>Paso {haStep + 1} de {HA_STEPS.length}</span>
              <span className="font-bold text-rose-300">{Math.round(haProgress)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-rose-300 transition-all duration-500"
                style={{ width: `${haProgress}%` }}
              />
            </div>
          </div>

          {/* Tarjeta del paso actual */}
          <div className="bg-slate-900/60 border-l-4 border-rose-500 rounded-xl p-5 mb-4 min-h-32">
            <h4 className="text-lg font-bold text-white mb-2">{HA_STEPS[haStep].title}</h4>
            <p className="text-sm text-slate-300 leading-relaxed">{HA_STEPS[haStep].text}</p>
          </div>

          {/* Navegación entre pasos */}
          <div className="flex gap-3">
            <button
              onClick={() => setHaStep(s => (Math.max(0, s - 1) as HaStep))}
              disabled={haStep === 0}
              className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              ← Anterior
            </button>
            <button
              onClick={() => setHaStep(s => (Math.min(HA_STEPS.length - 1, s + 1) as HaStep))}
              disabled={haStep === HA_STEPS.length - 1}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-rose-500 text-white font-medium hover:bg-rose-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-rose-900/40"
            >
              Siguiente paso
              <ChevronRight className="w-4 h-4" />
            </button>
            {haStep === HA_STEPS.length - 1 && (
              <button
                onClick={() => setHaStep(0)}
                className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-medium hover:bg-cyan-400 transition-all"
              >
                Reiniciar
              </button>
            )}
          </div>

          {/* Stepper visual */}
          <div className="flex gap-1 mt-5">
            {HA_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all ${
                  i <= haStep ? 'bg-rose-500' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* --- CALCULADORA DE FONDEO --- */}
      {section === 'FONDEO' && (
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 animate-[fade-in_0.4s_ease-out]">
          <div className="flex items-center gap-2 mb-1">
            <Anchor className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xl font-bold text-white">Calculadora de Fondeo</h3>
          </div>
          <p className="text-xs text-slate-400 mb-5">Calcula la cantidad de línea (cabo + cadena) a filar según la profundidad y el estado del tiempo.</p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Controles */}
            <div className="flex flex-col gap-4">
              {/* Profundidad */}
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                <label className="flex items-center justify-between text-sm font-medium text-slate-200 mb-2">
                  <span>Profundidad</span>
                  <span className="text-cyan-300 font-bold text-lg">{depth} m</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={depth}
                  onChange={e => setDepth(parseInt(e.target.value))}
                  className="w-full accent-cyan-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>1m</span>
                  <span>15m</span>
                  <span>30m</span>
                </div>
              </div>

              {/* Estado del tiempo */}
              <div>
                <p className="text-sm font-medium text-slate-200 mb-2">Condición del tiempo</p>
                <div className="grid grid-cols-2 gap-2">
                  {ANCHOR_RATIOS.map(r => (
                    <button
                      key={r.ratio}
                      onClick={() => setAnchorRatio(r.ratio)}
                      className={`p-2.5 rounded-lg text-xs font-medium text-left transition-all ${
                        anchorRatio === r.ratio
                          ? 'bg-cyan-500/20 border border-cyan-500 text-cyan-200'
                          : 'bg-slate-900/50 border border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="font-bold">{r.label}</div>
                      <div className="text-[10px] opacity-70">{r.condition}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Resultado visual */}
            <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700 flex flex-col">
              <p className="text-xs uppercase tracking-wider text-slate-400">Línea a filar</p>
              <p className="text-4xl font-bold text-cyan-300 mt-1 mb-3">
                {lineLength} <span className="text-lg text-slate-400">metros</span>
              </p>

              {/* Visualización cadena + profundidad */}
              <div className="flex-1 flex flex-col justify-end mb-3">
                <div className="text-center text-xs text-slate-500 mb-1">Fondo</div>
                <div className="relative h-32 bg-slate-950 rounded overflow-hidden border border-slate-800">
                  {/* Profundidad visual (mitad izquierda) */}
                  <div className="absolute bottom-0 left-0 h-full w-1/2 bg-gradient-to-b from-cyan-900/20 to-cyan-950/60">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-300/40 text-xs font-bold">
                      {depth}m
                    </div>
                  </div>
                  {/* Línea de fondeo (escala horizontal) */}
                  <div className="absolute top-1/2 left-0 right-0 h-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 transition-all duration-500"
                      style={{ width: `${linePercent}%` }}
                    />
                    {/* Eslabones decorativos */}
                    {Array.from({ length: Math.floor(linePercent / 4) }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute top-0 w-1 h-0.5 bg-amber-300"
                        style={{ left: `${i * 4}%` }}
                      />
                    ))}
                  </div>
                  {/* Ancla */}
                  <div className="absolute top-1/2 -translate-y-1/2" style={{ left: `${linePercent}%`, transform: 'translate(-50%, -50%)' }}>
                    <Anchor className="w-5 h-5 text-amber-400" />
                  </div>
                </div>
                <div className="text-center text-xs text-slate-500 mt-1">Barco (origen)</div>
              </div>

              <div className="bg-slate-950/50 rounded-lg p-3 text-xs text-slate-300 space-y-1">
                <p><strong className="text-cyan-300">Fórmula:</strong> Profundidad × Ratio</p>
                <p><strong className="text-cyan-300">Cálculo:</strong> {depth} m × {anchorRatio} = {lineLength} m</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
