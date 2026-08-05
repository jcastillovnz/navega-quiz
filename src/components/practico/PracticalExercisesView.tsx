import React, { useMemo, useState } from 'react';
import { BookOpen, Check, ChevronLeft, ChevronRight, Eye, EyeOff, ListChecks } from 'lucide-react';
import practicosData from '../../data/practicos.json';
import type { PracticalExercise } from '../../types/quiz';
import buenosAiresChart from '../../assets/buenos_aires_nautical_chart_training.png';

const TYPE_LABELS: Record<PracticalExercise['type'], string> = {
  CARTA_LAT_LONG: 'Latitud, longitud, millas y tiempo',
  DECLINACION: 'Declinación magnética',
  MAREAS: 'Mareas y paso crítico',
  MARCACIONES: 'Marcaciones y posición',
  RUMBO_VELOCIDAD: 'Rumbo, distancia y tiempo'
};

type DvtTarget = 'DISTANCIA' | 'TIEMPO';
const DVT_EXERCISES: Record<string, DvtTarget> = {
  prac_carta_3: 'TIEMPO',
  prac_5: 'TIEMPO',
  prac_6: 'DISTANCIA',
  prac_7: 'TIEMPO',
  prac_8: 'TIEMPO',
  prac_9: 'TIEMPO',
  prac_16: 'DISTANCIA',
  prac_17: 'DISTANCIA',
};

const RULE_THREE_EXAMPLES: Record<string, [string, string, string]> = {
  prac_carta_3: ['9 MN → 60 min', '9,1 MN → x min', 'x = (9,1 × 60) ÷ 9 ≈ 61 min'],
  prac_5: ['8 MN → 60 min', '12 MN → x min', 'x = (12 × 60) ÷ 8 = 90 min'],
  prac_6: ['60 min → 6 MN', '45 min → x MN', 'x = (45 × 6) ÷ 60 = 4,5 MN'],
  prac_7: ['9 MN → 60 min', '9,1 MN → x min', 'x = (9,1 × 60) ÷ 9 ≈ 61 min'],
  prac_8: ['6 MN → 60 min', '13 MN → x min', 'x = (13 × 60) ÷ 6 = 130 min'],
  prac_9: ['6,5 MN → 60 min', '9,4 MN → x min', 'x = (9,4 × 60) ÷ 6,5 ≈ 87 min'],
  prac_16: ['60 min → 6 MN', '90 min → x MN', 'x = (90 × 6) ÷ 60 = 9 MN'],
  prac_17: ['60 min → 5 MN', '90 min → x MN', 'x = (90 × 5) ÷ 60 = 7,5 MN'],
};

const DistanceSpeedTimeGuide: React.FC<{ target: DvtTarget; questionId: string }> = ({ target, questionId }) => {
  const isDistance = target === 'DISTANCIA';
  const ruleThree = RULE_THREE_EXAMPLES[questionId];
  return <div className="rounded-xl border border-amber-400/35 bg-amber-400/5 p-3">
    <div className="grid items-center gap-3 sm:grid-cols-[112px_1fr]">
      <div className="mx-auto w-24 overflow-hidden rounded-lg border-2 border-amber-300 bg-slate-950 text-center font-black shadow-lg shadow-amber-950/30" aria-label="Triángulo de distancia, velocidad y tiempo">
        <div className={`border-b-2 border-amber-300 py-1.5 text-lg ${isDistance ? 'bg-amber-300 text-slate-950' : 'text-amber-200'}`}>D</div>
        <div className="grid grid-cols-2 divide-x-2 divide-amber-300">
          <div className="py-1.5 text-base text-cyan-200">V</div>
          <div className={`py-1.5 text-base ${!isDistance ? 'bg-amber-300 text-slate-950' : 'text-cyan-200'}`}>T</div>
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-wider text-amber-300">Cómo usar el triángulo D–V–T</p>
        <p className="mt-1 text-[11px] leading-relaxed text-slate-200"><strong>Tapá la letra que buscás.</strong> Si quedan dos letras juntas, multiplicá; si quedan una arriba y otra abajo, dividí.</p>
        {ruleThree && <div className="mt-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-2 text-[10px] leading-relaxed text-slate-200">
          <p className="font-black text-cyan-300">Resolvelo con una regla de tres simple</p>
          <p className="mt-1 font-mono text-white">{ruleThree[0]}<br />{ruleThree[1]}</p>
          <p className="mt-1"><strong>{ruleThree[2]}.</strong> Es directa: a más distancia corresponde más tiempo; a más tiempo corresponde más distancia.</p>
        </div>}
        <div className="mt-2 grid grid-cols-3 gap-1 text-center text-[10px] font-black">
          <span className={`rounded-md px-1 py-1.5 ${isDistance ? 'bg-amber-300 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>D = V × T</span>
          <span className="rounded-md bg-slate-800 px-1 py-1.5 text-slate-300">V = D ÷ T</span>
          <span className={`rounded-md px-1 py-1.5 ${!isDistance ? 'bg-amber-300 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>T = D ÷ V</span>
        </div>
        <p className="mt-2 text-[10px] leading-relaxed text-slate-400"><strong className="text-cyan-300">Unidades:</strong> D en millas náuticas, V en nudos (MN/h) y T en horas. Si el tiempo está en minutos, usá horas = minutos ÷ 60.</p>
      </div>
    </div>
  </div>;
};

type TideRow = { time: string; event?: string; tide: number; available?: number; safe?: boolean };
type TideExerciseData = { prompt: string; baseDepth?: number; wind?: number; required?: number; rows: TideRow[] };

const TIDE_EXERCISES: Record<string, TideExerciseData> = {
  prac_10: {
    prompt: '¿Cuál es la amplitud de la marea?',
    rows: [
      { time: '10:00', event: 'Pleamar', tide: 1.80 },
      { time: '16:00', event: 'Bajamar', tide: 0.60 }
    ]
  },
  prac_11: {
    prompt: '¿A qué hora se puede cruzar con seguridad?',
    baseDepth: 0.70,
    wind: -0.20,
    required: 1.40,
    rows: [
      { time: '06:00', tide: 0.80, available: 1.30, safe: false },
      { time: '12:00', tide: 0.40, available: 0.90, safe: false },
      { time: '17:00', tide: 0.95, available: 1.45, safe: true },
      { time: '23:00', tide: 0.70, available: 1.20, safe: false }
    ]
  },
  prac_18: {
    prompt: '¿A qué hora se puede cruzar con seguridad?',
    baseDepth: 0.50,
    wind: 0.20,
    required: 1.55,
    rows: [
      { time: '06:00', tide: 0.80, available: 1.50, safe: false },
      { time: '12:00', tide: 0.40, available: 1.10, safe: false },
      { time: '17:00', tide: 0.95, available: 1.65, safe: true },
      { time: '23:00', tide: 0.70, available: 1.40, safe: false }
    ]
  }
};

const metres = (value: number) => `${value.toFixed(2).replace('.', ',')} m`;

const TideExerciseTable: React.FC<{ data: TideExerciseData; reveal: boolean }> = ({ data, reveal }) => {
  const passage = data.baseDepth !== undefined;
  return <div className="mt-4 overflow-hidden rounded-xl border border-cyan-500/30 bg-slate-950">
    {passage && <div className="grid grid-cols-3 divide-x divide-slate-700 border-b border-slate-700 bg-slate-900 text-center">
      <div className="p-2"><p className="text-[8px] font-black uppercase tracking-wider text-slate-400">Fondo de carta</p><p className="mt-0.5 text-xs font-black text-white">{metres(data.baseDepth!)}</p></div>
      <div className="p-2"><p className="text-[8px] font-black uppercase tracking-wider text-slate-400">Corrección viento</p><p className={`mt-0.5 text-xs font-black ${data.wind! >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>{data.wind! >= 0 ? '+' : '−'} {metres(Math.abs(data.wind!))}</p></div>
      <div className="p-2"><p className="text-[8px] font-black uppercase tracking-wider text-slate-400">Mínimo necesario</p><p className="mt-0.5 text-xs font-black text-amber-300">{metres(data.required!)}</p></div>
    </div>}
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] border-collapse text-left text-[10px]">
        <thead className="bg-cyan-500/10 text-cyan-200">
          <tr><th className="px-3 py-2">Hora</th>{!passage&&<th className="px-3 py-2">Estado</th>}<th className="px-3 py-2">Altura de marea</th>{passage&&<><th className="px-3 py-2">Profundidad disponible</th><th className="px-3 py-2 text-center">¿Alcanza?</th></>}</tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {data.rows.map(row => <tr key={row.time} className={row.safe ? 'bg-emerald-500/10' : ''}>
            <td className="px-3 py-2 font-black text-white">{row.time}</td>
            {!passage&&<td className="px-3 py-2 text-slate-300">{row.event}</td>}
            <td className="px-3 py-2 font-bold text-cyan-200">{metres(row.tide)}</td>
            {passage&&<><td className="px-3 py-2">{reveal ? <><span className="font-black text-white">{metres(row.available!)}</span><span className="ml-1 text-[8px] text-slate-500">fondo + marea + viento</span></> : <span className="font-bold text-slate-500">Calculá</span>}</td><td className={`px-3 py-2 text-center font-black ${reveal ? row.safe ? 'text-emerald-300' : 'text-rose-300' : 'text-slate-600'}`}>{reveal ? row.safe ? 'SÍ' : 'NO' : '—'}</td></>}
          </tr>)}
        </tbody>
      </table>
    </div>
    {!passage&&<p className="border-t border-slate-800 px-3 py-2 text-[9px] text-slate-300"><strong className="text-amber-300">Amplitud</strong> = pleamar − bajamar = 1,80 − 0,60 = <strong className="text-white">1,20 m</strong>.</p>}
  </div>;
};

const ChartScaleGuide: React.FC = () => (
  <div className="mt-4 rounded-xl border border-cyan-500/30 bg-slate-950 p-3">
    <div className="mb-3 grid gap-2 sm:grid-cols-2">
      <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-3">
        <p className="text-[10px] font-black uppercase tracking-wider text-cyan-300">¿Por qué 1′ equivale a 1 MN?</p>
        <p className="mt-1 text-[10px] leading-relaxed text-slate-200">La latitud divide cada grado del meridiano terrestre en 60 minutos de arco. <strong className="text-white">Una milla náutica corresponde a un minuto de ese arco</strong>; internacionalmente se fijó en 1.852 metros. Por eso, 7′ de latitud representan 7 MN.</p>
      </div>
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
        <p className="text-[10px] font-black uppercase tracking-wider text-amber-300">¿Por qué se mide sobre latitud?</p>
        <p className="mt-1 text-[10px] leading-relaxed text-slate-200">Los meridianos convergen hacia los polos: un minuto de <strong className="text-white">longitud</strong> se hace más corto al alejarse del Ecuador. La escala lateral de <strong className="text-white">latitud</strong> conserva la referencia náutica correcta en la carta Mercator.</p>
      </div>
    </div>
    <div className="relative overflow-hidden rounded-lg border border-slate-700 aspect-[5/4] bg-slate-800">
      <img src={buenosAiresChart} alt="Carta abierta del Río de la Plata frente a Buenos Aires con señales marítimas" className="absolute inset-0 h-full w-full object-cover" />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" role="img" aria-label="Derrota entre las posiciones A y B sobre una carta del área de Buenos Aires">
        <defs>
          <marker id="ba-route-arrow" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0 0L5 2.5L0 5Z" fill="#f59e0b" /></marker>
        </defs>
        <g stroke="#0891b2" strokeWidth=".35" strokeDasharray="1.5 1" opacity=".85">
          <line x1="0" y1="14" x2="100" y2="14" /><line x1="0" y1="43.4" x2="100" y2="43.4" /><line x1="0" y1="72.9" x2="100" y2="72.9" />
          <line x1="10" y1="0" x2="10" y2="100" /><line x1="38.4" y1="0" x2="38.4" y2="100" /><line x1="66.9" y1="0" x2="66.9" y2="100" />
        </g>
        <path d="M14.7 28.7L47.9 63.1" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="2 1" markerEnd="url(#ba-route-arrow)" />
        <circle cx="14.7" cy="28.7" r="2.2" fill="#06b6d4" stroke="white" strokeWidth=".7" />
        <circle cx="47.9" cy="63.1" r="2.2" fill="#f59e0b" stroke="white" strokeWidth=".7" />
      </svg>
      <div className="absolute left-[16%] top-[25%] rounded bg-cyan-600 px-1.5 py-0.5 text-[9px] font-black text-white shadow">A · 34°27′S / 58°29′W</div>
      <div className="absolute left-[50%] top-[60%] rounded bg-amber-500 px-1.5 py-0.5 text-[9px] font-black text-slate-950 shadow">B · 34°34′S / 58°22′W</div>
      <div className="absolute inset-y-0 right-0 w-14 border-l-2 border-cyan-500 bg-slate-950/80 flex flex-col justify-around py-3 text-center text-[8px] font-black text-cyan-200">
        <span>34°24′ S</span><span>34°30′ S</span><span>34°36′ S</span>
        <span className="rounded bg-cyan-500 px-1 py-1 text-slate-950">ESCALA<br />LATITUD</span>
      </div>
      <div className="absolute bottom-1 left-1 rounded bg-slate-950/80 px-1.5 py-1 text-[7px] text-slate-300">© OpenStreetMap · OpenSeaMap · CARTO</div>
    </div>
    <div className="mt-2 overflow-hidden rounded-lg border border-cyan-500/30 bg-slate-900 p-2">
      <p className="mb-1 text-[9px] font-black uppercase tracking-wider text-cyan-300">Ampliación de la escala lateral · cada división de este ejemplo es 1′</p>
      <svg viewBox="0 0 760 150" className="h-auto w-full" role="img" aria-label="Escala de latitud ampliada y compás midiendo siete minutos, equivalentes a siete millas náuticas">
        <rect width="760" height="150" rx="12" fill="#020617"/>
        <path d="M72 82H688" stroke="#e2e8f0" strokeWidth="4"/>
        {Array.from({length:11},(_,minute)=>{
          const x=72+minute*61.6;
          const major=minute===0||minute===5||minute===10;
          return <g key={minute}>
            <path d={`M${x} ${major?48:62}V102`} stroke={major?'#22d3ee':'#94a3b8'} strokeWidth={major?5:3}/>
            <text x={x} y="121" textAnchor="middle" fill={major?'#67e8f9':'#cbd5e1'} fontSize={major?16:13} fontWeight="800">{24+minute}′</text>
          </g>;
        })}
        <text x="72" y="31" fill="#67e8f9" fontSize="15" fontWeight="900">34°24′ S</text>
        <text x="688" y="31" textAnchor="end" fill="#67e8f9" fontSize="15" fontWeight="900">34°34′ S</text>
        <path d="M72 72 Q287 0 503 72" fill="none" stroke="#fbbf24" strokeWidth="6"/>
        <circle cx="72" cy="72" r="8" fill="#fbbf24"/><circle cx="503" cy="72" r="8" fill="#fbbf24"/>
        <path d="M72 66L40 16 M503 66L535 16" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round"/>
        <rect x="250" y="5" width="128" height="30" rx="15" fill="#f59e0b"/>
        <text x="314" y="25" textAnchor="middle" fill="#0f172a" fontSize="15" fontWeight="900">7′ = 7 MN</text>
        <text x="380" y="143" textAnchor="middle" fill="#94a3b8" fontSize="12">Una rayita = 1′ = 1 MN en esta escala</text>
      </svg>
      <p className="mt-1 text-[9px] leading-relaxed text-slate-300"><strong className="text-amber-300">Cómo se usa:</strong> abrí el compás entre los dos puntos de la derrota, sin cambiar su abertura apoyá una punta en una marca de minuto y contá las divisiones hasta la otra punta. En el ejemplo abarca de 24′ a 31′: son 7 divisiones, por lo tanto 7 MN.</p>
      <p className="mt-1 text-[9px] leading-relaxed text-slate-400"><strong className="text-rose-300">Antes de contar rayitas:</strong> en esta carta, entre 24′ y 25′ hay cinco espacios; cada espacio vale 0,2′ = 0,2 MN.</p>
    </div>
    <div className="mt-2 grid grid-cols-3 gap-1.5 text-[9px] leading-snug">
      <div className="rounded-lg border border-cyan-500/25 bg-cyan-500/10 p-2 text-cyan-100"><strong>1. Abrí el compás</strong><br />desde A hasta B.</div>
      <div className="rounded-lg border border-cyan-500/25 bg-cyan-500/10 p-2 text-cyan-100"><strong>2. Trasladalo</strong><br />a la escala de latitud más próxima a la derrota.</div>
      <div className="rounded-lg border border-amber-500/25 bg-amber-500/10 p-2 text-amber-100"><strong>3. Leé minutos</strong><br />1′ de latitud = 1 MN.</div>
    </div>
    <p className="mt-2 text-[9px] leading-relaxed text-slate-400"><strong className="text-rose-300">No midas millas sobre la escala horizontal de longitud.</strong> En cartas Mercator, tomá la distancia sobre la escala lateral de latitud y a la altura media de la derrota, porque la escala varía de norte a sur. Esta lámina usa cartografía abierta para aprendizaje y no reemplaza una carta oficial actualizada.</p>
  </div>
);

export const PracticalExercisesView: React.FC = () => {
  const exercises = practicosData as PracticalExercise[];
  const [index, setIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const exercise = exercises[index];
  const tideData = TIDE_EXERCISES[exercise.id];
  const dvtTarget = DVT_EXERCISES[exercise.id];
  const steps = useMemo(() => exercise.explanationStepByStep
    .split('\n')
    .map(step => step.replace(/^\s*\d+[.)-]?\s*/, '').trim())
    .filter(Boolean), [exercise]);

  const goTo = (nextIndex: number) => {
    setIndex(Math.min(exercises.length - 1, Math.max(0, nextIndex)));
    setShowSolution(false);
  };

  return (
    <div className="h-full min-h-0 grid grid-cols-1 md:grid-cols-12 gap-2 overflow-hidden">
      <section className="md:col-span-5 min-h-0 rounded-2xl border border-slate-800 bg-slate-900 flex flex-col overflow-hidden">
        <div className="shrink-0 p-3 border-b border-slate-800">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-emerald-400 font-black">Módulo 7 · Ejercicio {index + 1} de {exercises.length}</p>
              <h3 className="text-sm font-black text-white">{TYPE_LABELS[exercise.type]}</h3>
            </div>
            <ListChecks className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-4">
          <div className="flex items-center gap-1.5 text-cyan-300 mb-2">
            <BookOpen className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-wider font-black">Enunciado</span>
          </div>
          <p className="text-sm text-slate-100 leading-relaxed font-semibold whitespace-pre-line">{tideData?.prompt ?? exercise.statement}</p>
          {tideData && <TideExerciseTable data={tideData} reveal={showSolution} />}
          {exercise.type === 'CARTA_LAT_LONG' && <ChartScaleGuide />}
        </div>

        <div className="shrink-0 p-3 border-t border-slate-800 space-y-2">
          <button
            onClick={() => setShowSolution(value => !value)}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-2.5 text-xs font-black transition-all duration-300"
          >
            {showSolution ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showSolution ? 'Ocultar resolución' : 'Ver resolución paso a paso'}
          </button>
          <div className="flex gap-2">
            <button onClick={() => goTo(index - 1)} disabled={index === 0} className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-slate-700 bg-slate-950 py-2 text-xs font-bold text-slate-300 disabled:opacity-30">
              <ChevronLeft className="w-4 h-4" /> Anterior
            </button>
            <button onClick={() => goTo(index + 1)} disabled={index === exercises.length - 1} className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-slate-700 bg-slate-950 py-2 text-xs font-bold text-slate-300 disabled:opacity-30">
              Siguiente <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="md:col-span-7 min-h-0 rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden flex flex-col">
        <div className="shrink-0 p-3 border-b border-slate-800">
          <p className="text-[9px] uppercase tracking-widest text-amber-400 font-black">Resolución explicada</p>
          <h3 className="text-sm font-black text-white">Qué hacer, por qué y cómo reconocerlo</h3>
        </div>

        {!showSolution ? (
          <div className="flex-1 grid place-items-center p-6 text-center">
            <div>
              <Eye className="w-10 h-10 text-slate-700 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-300">Intentá resolver el enunciado primero</p>
              <p className="text-[11px] text-slate-500 mt-1">Cuando estés listo, revelá el procedimiento desde el panel izquierdo.</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-2">
            {dvtTarget && <DistanceSpeedTimeGuide target={dvtTarget} questionId={exercise.id} />}
            {steps.map((step, stepIndex) => (
              <div key={`${exercise.id}-${stepIndex}`} className="grid grid-cols-[34px_1fr] gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 grid place-items-center text-xs font-black">{stepIndex + 1}</div>
                <p className="text-xs text-slate-200 leading-relaxed self-center whitespace-pre-line">{step}</p>
              </div>
            ))}
            <div className="grid grid-cols-[34px_1fr] gap-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 grid place-items-center"><Check className="w-4 h-4" /></div>
              <div><p className="text-[9px] uppercase tracking-wider text-emerald-400 font-black">Resultado</p><p className="text-sm font-black text-emerald-200">{String(exercise.expectedResult)}</p></div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
