import React, { useEffect, useState, useMemo } from 'react';
import { Shield, LifeBuoy, Flame, Radio, Calculator, Anchor, ArrowRight, ChevronRight, Check, Waves } from 'lucide-react';

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

const FIRE_CLASSES = [
  { id: 'A', fuel: 'Sólidos comunes', examples: 'Madera, papel, telas, plásticos', agent: 'Agua pulverizada, espuma o polvo ABC', avoid: 'No usar agua si hay electricidad activa', color: 'bg-emerald-500' },
  { id: 'B', fuel: 'Líquidos inflamables', examples: 'Nafta, gasoil, aceites, pinturas', agent: 'Espuma, CO₂ o polvo BC/ABC', avoid: 'Nunca chorro de agua: dispersa el combustible', color: 'bg-rose-500' },
  { id: 'C', fuel: 'Gases inflamables', examples: 'GLP, propano, butano', agent: 'Polvo BC/ABC y cortar el suministro', avoid: 'No extinguir sin poder cerrar la fuga', color: 'bg-sky-500' },
  { id: 'D', fuel: 'Metales combustibles', examples: 'Magnesio, sodio, aluminio en polvo', agent: 'Polvo especial clase D', avoid: 'Agua, espuma y CO₂ pueden reaccionar', color: 'bg-amber-500' },
  { id: 'K', fuel: 'Aceites de cocina', examples: 'Grasas y aceites a alta temperatura', agent: 'Agente químico húmedo clase K', avoid: 'Nunca agua: explosión de vapor', color: 'bg-purple-500' },
];

const EMERGENCIES = [
  { title: 'Vía de agua', action: 'Localizar, taponar y achicar', detail: 'Reducí la entrada con cuñas, tapones, lona o colchoneta; activá bombas y controlá la estabilidad.' },
  { title: 'Varada involuntaria', action: 'Detener máquinas y evaluar', detail: 'Comprobá daños y marea. No fuerces la salida hasta conocer el fondo, la vía segura y el estado del casco.' },
  { title: 'Abordaje', action: 'Asistir, controlar daños y comunicar', detail: 'No separarse de inmediato si el otro casco está taponando una vía. Prepará achique y emití la llamada necesaria.' },
  { title: 'Avería de gobierno', action: 'Reducir velocidad y armar timón de fortuna', detail: 'Puede improvisarse con remo, tabla, puerta o elemento firme correctamente trincado y controlado.' },
  { title: 'Remolque', action: 'Cabo largo, firme y amortiguado', detail: 'Afirmá en puntos resistentes, evitá manos y pies en senos, coordiná señales y largá si compromete la seguridad.' },
  { title: 'Abandono', action: 'Solo cuando el barco sea más peligroso', detail: 'Emití MAYDAY, posición y personas; colocá chalecos, prepará balsa y llevá VHF, señales, agua y abrigo.' }
];

const HEAVY_WEATHER = [
  { stage: 'Antes', items: ['Revisar pronóstico y refugios', 'Trincar elementos y cerrar escotillas', 'Preparar chalecos, arneses y líneas de vida', 'Reducir paño antes de necesitarlo'] },
  { stage: 'Durante', items: ['Mantener vigilancia y luces', 'Evitar costa a sotavento', 'Gobernar para reducir balances y golpes', 'Controlar sentinas y estabilidad'] },
  { stage: 'Estrategias', items: ['Capear: proa o amura al viento y mar', 'Correr: navegar a favor controlando velocidad', 'Ancla de capa: reducir abatimiento y mantener orientación', 'Solicitar ayuda antes de perder capacidad'] }
];

type SafetySection = 'INVENTARIO' | 'INCENDIO' | 'AVERIAS' | 'TEMPORAL' | 'HAA' | 'FONDEO';

export const SeguridadViewer: React.FC<{ focusSection?: SafetySection; compact?: boolean }> = ({ focusSection, compact = false }) => {
  const [section, setSection] = useState<SafetySection>(focusSection ?? 'INVENTARIO');
  const [checked, setChecked] = useState<Set<string>>(new Set(['chalecos', 'bengalas', 'cohetes', 'matafuegos', 'vhf']));
  const [haStep, setHaStep] = useState<HaStep>(0);

  const [depth, setDepth] = useState(5);
  const [anchorRatio, setAnchorRatio] = useState(5);

  useEffect(() => {
    if (focusSection) setSection(focusSection);
  }, [focusSection]);

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

  return (
    <div className="h-full flex flex-col gap-2 overflow-hidden">
      {/* Sub-Tabs de Seguridad */}
      {!compact && <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0 mx-auto w-full">
        {([
          { id: 'INVENTARIO', label: 'Inventario PNA', icon: Shield },
          { id: 'INCENDIO', label: 'Fuego y Extintores', icon: Flame },
          { id: 'AVERIAS', label: 'Averías', icon: Shield },
          { id: 'TEMPORAL', label: 'Temporal', icon: Waves },
          { id: 'HAA', label: 'Hombre al Agua', icon: LifeBuoy },
          { id: 'FONDEO', label: 'Calculadora Fondeo', icon: Calculator }
        ] as const).map(s => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={`flex-1 flex items-center justify-center gap-1 px-1.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                section === s.id ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>}

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

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1 min-h-0">
            {SAFETY_ITEMS.map(item => {
              const isChecked = checked.has(item.id);
              const content = <>
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
              </>;

              return compact ? (
                <div
                  key={item.id}
                  className={`text-left rounded-xl border p-2.5 ${
                    isChecked ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  {content}
                </div>
              ) : (
                <button
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`text-left rounded-xl border p-2.5 transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-emerald-500/10 border-emerald-500/50'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {content}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {section === 'INCENDIO' && (
        <div className="flex-1 min-h-0 grid md:grid-cols-12 gap-2 overflow-hidden">
          <div className="md:col-span-4 rounded-2xl border border-orange-500/30 bg-slate-950 p-3 flex flex-col justify-between overflow-hidden">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-orange-300 font-black">Tetraedro del fuego</p>
              <p className="text-[11px] text-slate-400 mt-1">El fuego continúa mientras estén presentes los cuatro elementos.</p>
            </div>
            <div className="relative h-44 my-2 grid place-items-center">
              <div className="absolute w-32 h-32 rotate-45 border-2 border-orange-400/50 bg-orange-500/10" />
              <Flame className="relative z-10 w-12 h-12 text-orange-400" />
              <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] font-black text-rose-300">CALOR</span>
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-black text-amber-300">COMBUSTIBLE</span>
              <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[10px] font-black text-cyan-300">OXÍGENO</span>
              <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] font-black text-purple-300 text-right">REACCIÓN<br/>EN CADENA</span>
            </div>
            <div className="rounded-xl bg-orange-500/10 border border-orange-500/20 p-2.5 text-[10px] text-orange-200">
              Extinguir es quitar al menos un elemento: enfriar, sofocar, retirar combustible o interrumpir la reacción.
            </div>
          </div>

          <div className="md:col-span-8 min-h-0 overflow-y-auto space-y-1.5 pr-1">
            {FIRE_CLASSES.map(item => (
              <div key={item.id} className="grid grid-cols-[42px_1fr] gap-2 rounded-xl border border-slate-800 bg-slate-900 p-2.5">
                <div className={`w-10 h-10 rounded-xl ${item.color} text-slate-950 grid place-items-center text-lg font-black`}>{item.id}</div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <p className="text-xs font-black text-white">{item.fuel}</p>
                    <p className="text-[10px] text-slate-500">{item.examples}</p>
                  </div>
                  <p className="text-[11px] text-emerald-300 mt-1"><strong>Usar:</strong> {item.agent}</p>
                  <p className="text-[10px] text-rose-300"><strong>Evitar:</strong> {item.avoid}</p>
                </div>
              </div>
            ))}
            <div className="rounded-xl border border-cyan-500/25 bg-cyan-500/10 p-2.5 text-[10px] text-cyan-200">
              Riesgo eléctrico: cortá la energía si es posible y usá CO₂ o polvo ABC. Sin tensión, se clasifica por el combustible que arde.
            </div>
          </div>
        </div>
      )}

      {section === 'AVERIAS' && (
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-2 overflow-y-auto pr-1">
          {EMERGENCIES.map((item, index) => (
            <div key={item.title} className="rounded-2xl border border-slate-800 bg-slate-900 p-3 flex gap-3">
              <div className="w-8 h-8 shrink-0 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 grid place-items-center text-xs font-black">{index + 1}</div>
              <div>
                <p className="text-xs font-black text-white">{item.title}</p>
                <p className="text-[10px] font-bold text-cyan-300 mt-0.5">{item.action}</p>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-1">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {section === 'TEMPORAL' && (
        <div className="flex-1 min-h-0 grid md:grid-cols-3 gap-2 overflow-hidden">
          {HEAVY_WEATHER.map((group, index) => (
            <div key={group.stage} className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-blue-950/30 p-3 overflow-y-auto">
              <div className="h-20 rounded-xl bg-slate-950 border border-slate-800 grid place-items-center mb-3 relative overflow-hidden">
                <Waves className={`w-12 h-12 ${index === 0 ? 'text-cyan-400' : index === 1 ? 'text-rose-400' : 'text-amber-400'}`} />
                <div className="absolute inset-x-0 bottom-0 h-5 bg-cyan-900/30 animate-pulse" />
              </div>
              <p className="text-xs font-black text-white mb-2">{group.stage}</p>
              <ul className="space-y-2">
                {group.items.map(item => <li key={item} className="text-[11px] text-slate-300 leading-relaxed flex gap-1.5"><Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />{item}</li>)}
              </ul>
            </div>
          ))}
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
