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
  { id: 'cohetes', name: 'Cohetes Paracaídas (x3)', category: 'PNA_OBLIGATORIO', icon: 'flares2', description: 'Alcanzan 300m de altura. Señales diurnas/nocturnas.' },
  { id: 'matafuegos', name: 'Matafuegos (x2)', category: 'PNA_OBLIGATORIO', icon: 'extinguisher', description: 'ABC de 1kg mínimo en cockpit y camarote.' },
  { id: 'vhf', name: 'Radio VHF Canal 16', category: 'PNA_OBLIGATORIO', icon: 'vhf', description: 'Para emitir MAYDAY / PAN PAN / SECURITE.' },
  { id: 'espejos', name: 'Espejo de Señales', category: 'RECOMENDADO', icon: 'mirror', description: 'Señales diurnas por reflexión solar.' },
  { id: 'remos', name: 'Remo/Bichero', category: 'RECOMENDADO', icon: 'paddle', description: 'Para maniobra de rescate o empuje.' },
  { id: 'botiquin', name: 'Botiquín Primeros Auxilios', category: 'RECOMENDADO', icon: 'firstaid', description: 'Curitas, antiséptico, vendas, analgésicos.' }
];

const ICON_MAP: Record<SafetyItem['icon'], React.ReactNode> = {
  lifejacket: <LifeBuoy className="w-6 h-6" />,
  flares: <Flame className="w-6 h-6" />,
  flares2: <Flame className="w-6 h-6" />,
  extinguisher: <Shield className="w-6 h-6" />,
  vhf: <Radio className="w-6 h-6" />,
  mirror: <Shield className="w-6 h-6" />,
  paddle: <ArrowRight className="w-6 h-6" />,
  firstaid: <Shield className="w-6 h-6" />
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
  { condition: 'Aguas protegidas', ratio: 3, label: '3:1' },
  { condition: 'Condiciones normales', ratio: 5, label: '5:1' },
  { condition: 'Mal tiempo / Tormenta', ratio: 7, label: '7:1' },
  { condition: 'Temporal muy fuerte', ratio: 10, label: '10:1' }
];

export const SeguridadViewer: React.FC = () => {
  const [section, setSection] = useState<'INVENTARIO' | 'HAA' | 'FONDEO'>('INVENTARIO');
  const [checked, setChecked] = useState<Set<string>>(new Set(['chalecos', 'bengalas', 'cohetes', 'matafuegos', 'vhf']));
  const [haStep, setHaStep] = useState<HaStep>(0);

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

  const haProgress = ((haStep + 1) / HA_STEPS.length) * 100;

  const lineLength = useMemo(() => {
    return (depth * anchorRatio).toFixed(1);
  }, [depth, anchorRatio]);

  const lineMax = 50;
  const linePercent = Math.min(100, (parseFloat(lineLength) / lineMax) * 100);

  return (
    <div className="h-full flex flex-col gap-2 overflow-hidden">
      {/* Sub-Tabs de Seguridad */}
      <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0 max-w-lg mx-auto w-full">
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
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                section === s.id ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* --- INVENTARIO --- */}
      {section === 'INVENTARIO' && (
        <div className="flex-1 min-h-0 flex flex-col gap-2 overflow-y-auto pr-1">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between shrink-0">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Checklist PNA Obligatorio</p>
              <p className="text-lg font-extrabold text-white mt-0.5">
                {recommendedChecked}/{totalRecommended}{' '}
                <span className="text-xs font-normal text-slate-400">ítems a bordo</span>
              </p>
            </div>
            <div className="text-right">
              <p className={`text-2xl font-black ${safetyScore === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {safetyScore}%
              </p>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Seguridad</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1">
            {SAFETY_ITEMS.map(item => {
              const isChecked = checked.has(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`text-left rounded-xl border p-2.5 transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-emerald-500/10 border-emerald-500/50'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <div className={`p-1.5 rounded-lg border ${COLOR_MAP[item.icon]}`}>
                      {ICON_MAP[item.icon]}
                    </div>
                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                      isChecked ? 'bg-emerald-500 border-emerald-500' : 'border-slate-700'
                    }`}>
                      {isChecked && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </div>
                  <p className={`text-xs font-bold ${isChecked ? 'text-emerald-200' : 'text-slate-200'}`}>
                    {item.name}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{item.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* --- HOMBRE AL AGUA --- */}
      {section === 'HAA' && (
        <div className="flex-1 min-h-0 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between overflow-hidden">
          <div className="flex items-center gap-2 mb-1">
            <LifeBuoy className="w-5 h-5 text-rose-400" />
            <h3 className="text-base font-bold text-white">Maniobra de Hombre al Agua (HAA)</h3>
          </div>

          <div className="mb-2">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Paso {haStep + 1} de {HA_STEPS.length}</span>
              <span className="font-bold text-rose-400">{Math.round(haProgress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 transition-all duration-300"
                style={{ width: `${haProgress}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-950 border-l-4 border-rose-500 rounded-xl p-4 flex-1 flex flex-col justify-center my-2">
            <h4 className="text-sm font-bold text-rose-300 mb-1">{HA_STEPS[haStep].title}</h4>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">{HA_STEPS[haStep].text}</p>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setHaStep(s => (Math.max(0, s - 1) as HaStep))}
              disabled={haStep === 0}
              className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-700 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
            >
              ← Anterior
            </button>
            <button
              onClick={() => setHaStep(s => (Math.min(HA_STEPS.length - 1, s + 1) as HaStep))}
              disabled={haStep === HA_STEPS.length - 1}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500 text-slate-950 font-black text-xs hover:bg-rose-400 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
            >
              Siguiente Paso <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* --- FONDEO --- */}
      {section === 'FONDEO' && (
        <div className="flex-1 min-h-0 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <Anchor className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Calculadora de Fondeo</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4 flex-1 min-h-0">
            <div className="flex flex-col gap-3 justify-center">
              <div className="bg-slate-950 rounded-xl p-3 border border-slate-800">
                <label className="flex items-center justify-between text-xs font-bold text-slate-200 mb-1">
                  <span>Profundidad</span>
                  <span className="text-cyan-400 font-extrabold text-base">{depth} m</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={depth}
                  onChange={e => setDepth(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <p className="text-xs font-bold text-slate-300 mb-1.5">Condición del Tiempo</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {ANCHOR_RATIOS.map(r => (
                    <button
                      key={r.ratio}
                      onClick={() => setAnchorRatio(r.ratio)}
                      className={`p-2 rounded-lg text-xs text-left transition-all cursor-pointer ${
                        anchorRatio === r.ratio
                          ? 'bg-cyan-500 text-slate-950 font-black'
                          : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="font-bold">{r.label}</div>
                      <div className="text-[10px] opacity-80">{r.condition}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Línea a Filar</p>
                <p className="text-3xl font-black text-cyan-400 mt-0.5">
                  {lineLength} <span className="text-sm font-normal text-slate-400">metros</span>
                </p>
              </div>

              <div className="relative h-20 bg-slate-900 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center my-2">
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-cyan-950/40" />
                <div className="relative z-10 flex items-center gap-2 text-xs font-bold text-slate-300">
                  <Anchor className="w-5 h-5 text-amber-400 animate-bounce" />
                  <span>Cadena: {lineLength}m en {depth}m fondo</span>
                </div>
              </div>

              <div className="bg-slate-900 p-2 rounded-lg text-[10px] text-slate-400">
                💡 <strong className="text-slate-200">Fórmula:</strong> {depth}m profundidad × {anchorRatio} (Ratio) = {lineLength}m.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
