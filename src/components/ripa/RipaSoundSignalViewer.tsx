import React from 'react';
import { Bell, Volume2 } from 'lucide-react';

type Blast = 'SHORT' | 'LONG';
type Scene = 'MANEUVER' | 'OVERTAKE' | 'BEND' | 'FOG' | 'ANCHOR' | 'EQUIPMENT' | 'DURATION';

interface SignalSpec {
  title: string;
  blasts: Blast[];
  scene: Scene;
  interval?: string;
  bell?: boolean;
  gong?: boolean;
  aground?: boolean;
  patternLabel?: string;
  maneuver?: 'PORT' | 'STARBOARD' | 'ASTERN' | 'DOUBT';
}

const signalFrom = (text: string): SignalSpec => {
  const value = text.toLowerCase();
  if (/ripa_27\b/.test(value)) return { title: 'Duración reglamentaria de cada pitada', blasts: ['SHORT', 'LONG'], scene: 'DURATION' };
  if (/ripa_rule33_whistle/.test(value)) return { title: 'Pito reglamentario según la eslora', blasts: ['SHORT'], scene: 'EQUIPMENT' };
  if (/ripa_rule33_bell/.test(value)) return { title: 'Pito y campana según la eslora', blasts: [], scene: 'EQUIPMENT', bell: true };
  if (/ripa_rule36_attention/.test(value)) return { title: 'Señal de atención sin crear confusión', blasts: ['SHORT'], scene: 'MANEUVER', maneuver: 'DOUBT' };
  if (/ripa_sound_anchor_100m/.test(value)) return { title: 'Fondeado de 100 m o más', blasts: [], scene: 'ANCHOR', interval: 'Repetir cada ≤ 1 min', bell: true, gong: true, patternLabel: 'CAMPANA PROA 5 s → GONG POPA 5 s' };
  if (/ripa_sound_aground_fog/.test(value)) return { title: 'Varado en visibilidad reducida', blasts: [], scene: 'ANCHOR', interval: 'Repetir cada ≤ 1 min', bell: true, aground: true, patternLabel: '3 GOLPES → REPIQUE 5 s → 3 GOLPES' };
  if (/fondead|campana/.test(value)) return { title: 'Fondeado en visibilidad reducida', blasts: [], scene: 'ANCHOR', interval: 'Repique rápido durante 5 s · cada ≤ 1 min', bell: true };
  if (/duda|incomprensi|cinco|5 pitadas/.test(value)) return { title: 'Duda o peligro ante la maniobra', blasts: ['SHORT', 'SHORT', 'SHORT', 'SHORT', 'SHORT'], scene: 'MANEUVER', maneuver: 'DOUBT' };
  if (/recodo|curva|obstru/.test(value)) return { title: 'Buques ocultos por un recodo', blasts: ['LONG'], scene: 'BEND' };
  if (/acepta|acuerdo/.test(value)) return { title: 'El alcanzado acepta la maniobra', blasts: ['LONG', 'SHORT', 'LONG', 'SHORT'], scene: 'OVERTAKE' };
  if (/alcanz|adelant/.test(value) && /babor/.test(value)) return { title: 'Adelantamiento por babor del alcanzado', blasts: ['LONG', 'LONG', 'SHORT', 'SHORT'], scene: 'OVERTAKE' };
  if (/alcanz|adelant/.test(value) && /estribor/.test(value)) return { title: 'Adelantamiento por estribor del alcanzado', blasts: ['LONG', 'LONG', 'SHORT'], scene: 'OVERTAKE' };
  if (/detenido|sin arrancada/.test(value)) return { title: 'Motor detenido y sin arrancada en niebla', blasts: ['LONG', 'LONG'], scene: 'FOG', interval: '2 s entre pitadas · repetir cada ≤ 2 min' };
  if (/velero|remolc/.test(value)) return { title: 'Buque de capacidad de maniobra condicionada', blasts: ['LONG', 'SHORT', 'SHORT'], scene: 'FOG', interval: 'Repetir cada ≤ 2 min' };
  if (/marcha atrás|propulsión atrás|tres pitadas/.test(value)) return { title: 'Propulsión operando hacia atrás', blasts: ['SHORT', 'SHORT', 'SHORT'], scene: 'MANEUVER', maneuver: 'ASTERN' };
  if (/babor|dos pitadas/.test(value)) return { title: 'Buque cayendo a babor', blasts: ['SHORT', 'SHORT'], scene: 'MANEUVER', maneuver: 'PORT' };
  if (/estribor|una pitada corta/.test(value)) return { title: 'Buque cayendo a estribor', blasts: ['SHORT'], scene: 'MANEUVER', maneuver: 'STARBOARD' };
  return { title: 'Motor con arrancada en niebla', blasts: ['LONG'], scene: 'FOG', interval: 'Repetir cada ≤ 2 min' };
};

const Ship = ({ x, y, angle = 0, color = '#e2e8f0' }: { x: number; y: number; angle?: number; color?: string }) => (
  <g transform={`translate(${x} ${y}) rotate(${angle})`} filter="url(#shipShadow)">
    <path d="M-82 18 L-54 -25 L62 -25 L88 3 L57 29 L-60 29Z" fill={color} stroke="#0f172a" strokeWidth="5" />
    <path d="M-43 -25 L-23 -54 H39 L59 -25Z" fill="#dbeafe" stroke="#334155" strokeWidth="4" />
    <rect x="-7" y="-76" width="7" height="25" rx="3" fill="#475569" />
    <path d="M-68 31 Q0 43 68 29" fill="none" stroke="#7dd3fc" strokeWidth="5" opacity=".75" />
    <circle cx="65" cy="0" r="5" fill="#22c55e" />
    <circle cx="-56" cy="-12" r="5" fill="#ef4444" />
  </g>
);

const SoundWaves = ({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`} fill="none" stroke="#67e8f9" strokeWidth="5" strokeLinecap="round">
    <path d="M0 -20 Q34 0 0 20" /><path d="M18 -34 Q72 0 18 34" opacity=".75" /><path d="M38 -48 Q112 0 38 48" opacity=".45" />
  </g>
);

const ContextScene = ({ signal }: { signal: SignalSpec }) => (
  <svg viewBox="0 0 1000 360" className="h-full w-full" role="img" aria-label={signal.title} preserveAspectRatio="xMidYMid meet">
    <defs>
      <linearGradient id="soundSky" x1="0" y1="0" x2="0" y2="1"><stop stopColor={signal.scene === 'FOG' || signal.scene === 'ANCHOR' ? '#64748b' : '#bae6fd'} /><stop offset="1" stopColor="#e0f2fe" /></linearGradient>
      <linearGradient id="soundSea" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#0e7490" /><stop offset="1" stopColor="#082f49" /></linearGradient>
      <filter id="shipShadow"><feDropShadow dx="4" dy="6" stdDeviation="4" floodOpacity=".45" /></filter>
      <filter id="fog"><feGaussianBlur stdDeviation="18" /></filter>
      <marker id="arrowHead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6Z" fill="#fbbf24" /></marker>
    </defs>
    <rect width="1000" height="205" fill="url(#soundSky)" />
    <rect y="205" width="1000" height="155" fill="url(#soundSea)" />
    <path d="M0 235 Q100 220 200 235 T400 235 T600 235 T800 235 T1000 235 M0 300 Q90 285 180 300 T360 300 T540 300 T720 300 T900 300" fill="none" stroke="#67e8f9" strokeWidth="4" opacity=".35" />

    {signal.scene === 'MANEUVER' && <>
      <Ship x={420} y={225} angle={signal.maneuver === 'PORT' ? -12 : signal.maneuver === 'STARBOARD' ? 12 : 0} />
      <Ship x={780} y={190} angle={-18} color="#cbd5e1" />
      <SoundWaves x={500} y={130} />
      {signal.maneuver === 'PORT' && <path d="M420 145 Q315 100 275 185" fill="none" stroke="#fbbf24" strokeWidth="9" markerEnd="url(#arrowHead)" />}
      {signal.maneuver === 'STARBOARD' && <path d="M420 145 Q525 100 565 185" fill="none" stroke="#fbbf24" strokeWidth="9" markerEnd="url(#arrowHead)" />}
      {signal.maneuver === 'ASTERN' && <path d="M335 260 H220" stroke="#fbbf24" strokeWidth="9" markerEnd="url(#arrowHead)" />}
      {signal.maneuver === 'DOUBT' && <path d="M590 80 l18 -30 18 30 18 -30 18 30" fill="none" stroke="#fb7185" strokeWidth="8" />}
    </>}

    {signal.scene === 'OVERTAKE' && <>
      <path d="M120 100 H880" stroke="#f8fafc" strokeWidth="7" strokeDasharray="24 18" opacity=".55" />
      <path d="M120 310 H880" stroke="#f8fafc" strokeWidth="7" strokeDasharray="24 18" opacity=".55" />
      <Ship x={640} y={205} angle={0} color="#cbd5e1" /><Ship x={325} y={260} angle={-5} color="#f8fafc" />
      <path d="M285 190 Q420 85 590 150" fill="none" stroke="#fbbf24" strokeWidth="9" markerEnd="url(#arrowHead)" />
      <SoundWaves x={390} y={175} />
    </>}

    {signal.scene === 'BEND' && <>
      <path d="M0 0 H310 Q430 105 395 360 H0Z M1000 0 H690 Q570 105 605 360 H1000Z" fill="#647f38" />
      <path d="M0 0 H290 Q410 105 375 360 H0Z M1000 0 H710 Q590 105 625 360 H1000Z" fill="#334d2c" opacity=".7" />
      <Ship x={470} y={265} angle={-55} /><Ship x={560} y={95} angle={125} color="#cbd5e1" />
      <SoundWaves x={485} y={170} /><SoundWaves x={548} y={155} flip />
    </>}

    {(signal.scene === 'FOG' || signal.scene === 'ANCHOR') && <>
      <Ship x={500} y={235} />
      {signal.scene === 'ANCHOR' ? <>
        {signal.aground ? <>
          <path d="M340 282 L390 220 L445 285 L505 226 L565 287 L625 230 L690 292Z" fill="#78716c" stroke="#292524" strokeWidth="7" />
          <path d="M350 296 H690" stroke="#f59e0b" strokeWidth="5" strokeDasharray="12 8" />
          {[410, 445, 480, 520, 555, 590].map((x, index) => <circle key={x} cx={x} cy="112" r={index === 2 || index === 3 ? 8 : 5} fill="#fbbf24" opacity={index === 2 || index === 3 ? .95 : .65} />)}
        </> : <>
          <path d="M500 260 Q515 315 580 338" fill="none" stroke="#d6a45d" strokeWidth="8" />
          <path d="M580 310 V345 M557 323 H603 M580 345 Q550 342 538 325 M580 345 Q610 342 622 325" fill="none" stroke="#1e293b" strokeWidth="8" />
        </>}
        <g transform="translate(585 92)"><Bell className="text-amber-300" /></g>
        {signal.gong && <g transform="translate(375 105)"><circle r="28" fill="#b45309" stroke="#fbbf24" strokeWidth="6" /><circle r="7" fill="#fcd34d" /><path d="M-32 -36 H32" stroke="#78350f" strokeWidth="6" /><path d="M-25 -35 V-15 M25 -35 V-15" stroke="#78350f" strokeWidth="5" /></g>}
      </> : <SoundWaves x={505} y={115} />}
      <g opacity=".62" filter="url(#fog)"><rect x="0" y="45" width="1000" height="80" rx="40" fill="#f8fafc" /><rect x="80" y="155" width="840" height="70" rx="35" fill="#f8fafc" /></g>
    </>}

    {signal.scene === 'EQUIPMENT' && <>
      <Ship x={500} y={245} />
      <path d="M500 163 V80" stroke="#475569" strokeWidth="9" />
      <path d="M485 82 h30 l22 -13 v35 l-22 -13 h-30Z" fill="#cbd5e1" stroke="#334155" strokeWidth="4" />
      <SoundWaves x={540} y={86} />
      <path d="M700 210 q38 -55 76 0 v35 h-76Z" fill="#fbbf24" stroke="#78350f" strokeWidth="6" />
      <circle cx="738" cy="253" r="8" fill="#fbbf24" />
      <path d="M205 290 H805" stroke="#f8fafc" strokeWidth="5" strokeDasharray="12 10" />
      <path d="M205 275 V305 M805 275 V305" stroke="#f8fafc" strokeWidth="7" />
    </>}

    {signal.scene === 'DURATION' && <>
      <Ship x={300} y={245} /><SoundWaves x={375} y={125} />
      <circle cx="705" cy="170" r="92" fill="#f8fafc" stroke="#334155" strokeWidth="10" />
      <path d="M705 170 L705 105 M705 170 L758 194" stroke="#0f172a" strokeWidth="9" strokeLinecap="round" />
      <circle cx="705" cy="170" r="11" fill="#0891b2" />
      <path d="M650 70 H760" stroke="#fbbf24" strokeWidth="12" strokeLinecap="round" />
      <path d="M660 286 H690 M720 286 H850" stroke="#67e8f9" strokeWidth="13" strokeLinecap="round" />
    </>}
  </svg>
);

export const RipaSoundSignalViewer: React.FC<{ context: string }> = ({ context }) => {
  const signal = signalFrom(context);
  return (
    <figure className="h-full min-h-0 grid grid-rows-[minmax(0,1fr)_auto] overflow-hidden bg-slate-950">
      <div className="relative min-h-0 overflow-hidden">
        <ContextScene signal={signal} />
      </div>
      <div className="flex min-h-10 items-center justify-center gap-2 overflow-x-auto border-t border-cyan-400/25 bg-slate-900 px-2 py-1" role="img" aria-label={`Patrón acústico de ${signal.title}`}>
        <div className="shrink-0 rounded-full border border-cyan-400/35 bg-slate-950 p-1.5">
          {signal.bell ? <Bell className="h-4 w-4 text-amber-300" /> : <Volume2 className="h-4 w-4 text-cyan-300" />}
        </div>
        {signal.bell ? <span className="whitespace-nowrap text-[10px] font-black text-amber-200">{signal.patternLabel ?? 'REPIQUE CONTINUO · 5 s'}</span> : signal.blasts.map((blast, index) => (
          <div key={`${blast}-${index}`} className="flex shrink-0 flex-col items-center gap-0.5">
            <div className={`h-2 rounded-full ${blast === 'LONG' ? 'w-12 bg-cyan-300' : 'w-4 bg-amber-300'}`} />
            <span className="text-[7px] font-black text-slate-400">{blast === 'LONG' ? '4–6 s' : '≈1 s'}</span>
          </div>
        ))}
        {signal.interval && <span className="ml-1 whitespace-nowrap rounded bg-slate-950 px-2 py-1 text-[8px] font-bold text-slate-300">{signal.interval}</span>}
      </div>
    </figure>
  );
};
