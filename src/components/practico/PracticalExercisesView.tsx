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

const QUICK_METHODS: Record<string, string[]> = {
  prac_carta_1: ['Leé 7 minutos de arco en la escala lateral de latitud.', 'Cada minuto de latitud representa 1 milla náutica.', 'Entonces: 7′ = 7 MN.'],
  prac_carta_2: ['En examen, abrí el compás entre A y B.', 'Sin cambiar la abertura, llevalo a la escala de latitud más cercana a la derrota.', 'La abertura mide aproximadamente 9,1 MN; no hace falta trigonometría.'],
  prac_carta_3: ['Tiempo = 9,1 ÷ 9 ≈ 1 hora.', 'Como sobra 0,1 MN, agregá aproximadamente 1 minuto.', '10:20 + 1:01 = 11:21.'],
  prac_1: ['Años: 2025 − 2021 = 4.', 'Cambio: 4 × 8′ = 32′ W.', 'Mismo sentido: 6°10′ + 32′ = 6°42′ W.'],
  prac_2: ['Años transcurridos: 2026 − 2020 = 6.', 'La carta da 5′ E por año: el símbolo ′ indica minutos de arco, no grados. Por eso se multiplican 6 años × 5′/año.', 'Cambio acumulado: 6 × 5′ = 30′ E. Como 60′ = 1°, entonces 30′ = 0°30′, no 30°.', 'Como W y E son sentidos opuestos, se restan sus magnitudes: 5°40′ − 0°30′ = 5°10′.', 'El resultado sigue siendo W porque 5°40′ W es mayor que la corrección opuesta de 0°30′ E. Resultado: 5°10′ W.'],
  prac_3: ['Años: 2025 − 2021 = 4.', 'Cambio: 8′24″ × 4 = 33′36″.', 'Sumá a 7°25′00″: resultado 7°58′36″ W.'],
  prac_4: ['Años: 2025 − 2021 = 4.', 'Cambio: 4 × 8″ = 32″.', '54″ + 32″ = 86″ = 1′26″; resultado 6°57′26″ W.'],
  prac_5: ['Tiempo = distancia ÷ velocidad.', '12 ÷ 8 = 1,5 horas.', 'Media hora es 30 minutos: total 1 h 30 min.'],
  prac_6: ['45 minutos son 3/4 de hora.', 'Distancia = 6 × 3/4.', '6 ÷ 4 × 3 = 4,5 MN.'],
  prac_7: ['Medí en carta: 9,1 MN.', 'Oeste se resta al verdadero: Rm = 150° + 8° = 158°.', 'Tiempo: 9,1 ÷ 9 ≈ 1 h 1 min.'],
  prac_8: ['Medí distancia y rumbo directamente en carta: 13 MN y 231° magnético.', 'Tiempo = 13 ÷ 6 = 2 horas y sobra 1 MN.', 'A 6 kn, 1 MN lleva 10 min: total 2 h 10 min.'],
  prac_9: ['Medí en carta: 9,4 MN y 318° magnético.', 'Tiempo = 9,4 ÷ 6,5 ≈ 1,45 h.', '0,45 h × 60 ≈ 27 min: aproximadamente 1 h 26 min.'],
  prac_10: ['Amplitud = pleamar − bajamar.', '1,80 − 0,60 = 1,20 m.'],
  prac_11: ['Necesitás: calado 1,10 + margen 0,30 = 1,40 m.', 'En cada horario sumá: fondo 0,70 + marea − 0,20 de viento.', 'El primer horario que alcanza 1,40 m es 17:00.'],
  prac_12: ['Trazá cada marcación desde su objeto conocido.', 'El cruce de ambas rectas es la posición del barco.', 'No hay cuenta: es una resolución gráfica.'],
  prac_13: ['Restá 9° W a cada marcación: 249°→240° y 197°→188°.', 'Sacá las recíprocas: 060° y 008°.', 'Trazalas desde los objetos; su cruce da la posición.'],
  prac_14: ['Restá 9° W: 284°→275° y 162°→153°.', 'Recíprocas: 095° y 333°.', 'Trazá ambas; el cruce queda junto a Torre Agua.'],
  prac_15: ['Restá 7° W: 268°→261° y 195°→188°.', 'Recíprocas: 081° y 008°.', 'Trazalas desde ambos objetos y leé la intersección.'],
  prac_16: ['Actualizá Dm: 7°36′ + 18′ = 7°54′ W.', 'Rumbo verdadero: 13° − 7°54′ ≈ 5°.', 'Distancia: 6 × 1,5 = 9 MN; trazá 9 MN al 005°.'],
  prac_17: ['Actualizá Dm: 7°32′ + 21′ = 7°53′ W.', 'Rumbo verdadero: 38° − 7°53′ ≈ 30°.', 'Distancia: 5 × 1,5 = 7,5 MN; trazá al 030°.'],
  prac_18: ['Necesitás: 1,25 + 0,30 = 1,55 m.', 'Probá cada hora: fondo 0,50 + marea + 0,20 de viento.', 'A las 17:00: 0,50 + 0,95 + 0,20 = 1,65 m; alcanza.'],
  prac_19: ['Usá escala 1 cm = 1 kn.', 'Dibujá 5 cm al 090° y, desde su punta, 2 cm al 150°.', 'Uní origen con punta final y medí: ≈106° y 6,3 kn.'],
  prac_20: ['Trazá la derrota deseada al 105°.', 'Dibujá la corriente invertida: 1,5 cm al 350°.', 'Con compás de 6 cm cerrá el triángulo y medí: ≈086° y 6,3 kn.'],
  prac_21: ['Rumbo verdadero: 190° − 3° − 12° = 175°.', 'Abatimiento a estribor: 175° + 10° = 185°.', 'Resultado: Rv 175°; derrota 185°.']
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
  const steps = useMemo(() => QUICK_METHODS[exercise.id] ?? exercise.explanationStepByStep
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
          <p className="text-[9px] uppercase tracking-widest text-amber-400 font-black">Resolución sencilla</p>
          <h3 className="text-sm font-black text-white">Método corto · mente o calculadora básica</h3>
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
