import React from 'react';
import outboardCutaway from '../../assets/outboard_engine_cutaway_3d-v1.png';
import propellerCutaway from '../../assets/propeller_shaft_3d-v1.png';

type EnginePart = 'INTAKE'|'PLATE'|'CLAMPS'|'LEG'|'COWLING'|'STARTER'|'THROTTLE'|'TILT'|'CYLINDER'|'PUMP'|'TELLTALE'|'EXHAUST'|'TRANSMISSION'|'FILTER'|'FUEL'|'SPARK'|'IMPELLER';

const enginePartFrom = (text: string): EnginePart => {
  const value = text.toLowerCase();
  if (/chorro testigo|salida de agua/.test(value)) return 'TELLTALE';
  if (/toma de agua|aspira agua/.test(value)) return 'INTAKE';
  if (/anticavit/.test(value)) return 'PLATE';
  if (/pinzas|mordazas|sujeci.n segura/.test(value)) return 'CLAMPS';
  if (/pasador de inclinaci.n|.ngulo b.sico/.test(value)) return 'TILT';
  if (/tirador|arranque manual/.test(value)) return 'STARTER';
  if (/acelerador|r.gimen/.test(value)) return 'THROTTLE';
  if (/carcasa|cap./.test(value)) return 'COWLING';
  if (/cilindro|comprime la mezcla/.test(value)) return 'CYLINDER';
  if (/rotor|impulsor de goma/.test(value)) return 'IMPELLER';
  if (/bomba de agua|hace circular/.test(value)) return 'PUMP';
  if (/escape|gases de combusti.n/.test(value)) return 'EXHAUST';
  if (/transmisi.n|lleva el movimiento/.test(value)) return 'TRANSMISSION';
  if (/filtro de combustible|retiene agua/.test(value)) return 'FILTER';
  if (/sistema de combustible|almacena, conduce/.test(value)) return 'FUEL';
  if (/buj.a|produce la chispa/.test(value)) return 'SPARK';
  return 'LEG';
};

const engineRasterFocus: Record<EnginePart, { x: number; y: number; rx: number; ry: number }> = {
  COWLING:{x:940,y:205,rx:360,ry:190}, STARTER:{x:920,y:125,rx:145,ry:75}, THROTTLE:{x:570,y:365,rx:105,ry:80},
  CLAMPS:{x:635,y:490,rx:105,ry:150}, TILT:{x:675,y:530,rx:75,ry:90}, CYLINDER:{x:900,y:315,rx:160,ry:145},
  FILTER:{x:1110,y:325,rx:95,ry:105}, FUEL:{x:1040,y:330,rx:250,ry:145}, SPARK:{x:885,y:205,rx:130,ry:80},
  TELLTALE:{x:1210,y:455,rx:70,ry:55}, LEG:{x:1000,y:610,rx:180,ry:250}, TRANSMISSION:{x:960,y:650,rx:130,ry:210},
  PUMP:{x:1010,y:680,rx:110,ry:85}, IMPELLER:{x:1010,y:680,rx:72,ry:62}, INTAKE:{x:975,y:760,rx:105,ry:65}, PLATE:{x:1115,y:690,rx:225,ry:55}, EXHAUST:{x:1140,y:765,rx:110,ry:80}
};

const EngineRasterView:React.FC<{context:string}>=({context})=>{const focus=engineRasterFocus[enginePartFrom(context)];return <div className="relative h-full min-h-0 w-full overflow-hidden"><img src={outboardCutaway} alt="Motor fuera de borda completo en corte técnico tridimensional" className="h-full w-full object-contain"/><svg viewBox="0 0 1774 887" preserveAspectRatio="xMidYMid meet" className="pointer-events-none absolute inset-0 h-full w-full"><ellipse cx={focus.x} cy={focus.y} rx={focus.rx} ry={focus.ry} fill="#fb7185" fillOpacity=".08" stroke="#fb7185" strokeWidth="10" strokeDasharray="20 12"/><circle cx={focus.x} cy={focus.y} r="10" fill="#fecdd3"/></svg></div>};

const PropellerRasterView:React.FC<{part:string}>=({part})=><div className="relative h-full min-h-0 w-full overflow-hidden">
  <img src={propellerCutaway} alt="Hélice de tres palas, eje y bocina en corte técnico tridimensional" className="h-full w-full object-contain"/>
  <svg viewBox="0 0 2172 724" preserveAspectRatio="xMidYMid meet" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
    {part==='SHAFT'&&<rect x="540" y="271" width="850" height="82" rx="40" fill="#22d3ee" fillOpacity=".09" stroke="#22d3ee" strokeWidth="10" strokeDasharray="20 12"/>}
    {part==='STERN_TUBE'&&<rect x="450" y="185" width="725" height="278" rx="80" fill="#fbbf24" fillOpacity=".08" stroke="#fbbf24" strokeWidth="10" strokeDasharray="20 12"/>}
    {part==='CAP'&&<ellipse cx="1587" cy="335" rx="94" ry="72" fill="#fb7185" fillOpacity=".12" stroke="#fb7185" strokeWidth="10"/>}
    {part==='HUB'&&<ellipse cx="1515" cy="340" rx="178" ry="125" fill="#fb7185" fillOpacity=".09" stroke="#fb7185" strokeWidth="10"/>}
    {part==='BLADE'&&<path d="M1425 255 C1350 85 1420 15 1532 35 C1625 55 1614 182 1550 300Z" fill="#fbbf24" fillOpacity=".18" stroke="#fbbf24" strokeWidth="11"/>}
    {part==='ROOT_TIP'&&<><circle cx="1425" cy="300" r="46" fill="none" stroke="#fb7185" strokeWidth="11"/><circle cx="1490" cy="46" r="38" fill="none" stroke="#fbbf24" strokeWidth="11"/></>}
    {part==='EDGE'&&<path d="M1425 255 C1350 85 1420 15 1532 35" fill="none" stroke="#fb7185" strokeWidth="14"/>}
    {part==='DIAMETER'&&<><path d="M1480 42 L1417 680" stroke="#fbbf24" strokeWidth="10"/><path d="M1480 42 l-20 35 41 4 M1417 680 l-20 -35 41 4" fill="none" stroke="#fbbf24" strokeWidth="9"/></>}
    {part==='BLADE_ANGLE'&&<><path d="M1515 340 H1940" stroke="#e2e8f0" strokeWidth="7" strokeDasharray="18 12"/><path d="M1515 340 L1830 225" stroke="#fbbf24" strokeWidth="10"/><path d="M1700 340 A185 185 0 0 0 1688 276" fill="none" stroke="#fb7185" strokeWidth="10"/></>}
    {(part==='ROTATION'||part==='PITCH')&&<><path d="M1510 52 A315 315 0 1 1 1245 185" fill="none" stroke="#22d3ee" strokeWidth="11" strokeDasharray="22 14"/><path d="M1238 185 l45 -27 -8 52Z" fill="#22d3ee"/></>}
    {part==='CAVITATION'&&[0,1,2,3,4,5].map(i=><circle key={i} cx={1840+i*42} cy={330+(i%2)*55} r={11+i*2} fill="#e0f2fe" fillOpacity=".75" stroke="#38bdf8" strokeWidth="4"/>)}
  </svg>
</div>;

export const MarinePropulsionViewer: React.FC<{focus:'ENGINE'|'PROPELLER'; context:string}> = ({focus,context}) => {
  const lower=context.toLowerCase();
  const propellerFocus=lower.includes('capacete')?'CAP':lower.includes('barra transmite')||lower.includes('eje de hélice')?'SHAFT':lower.includes('conducto')||lower.includes('bocina')?'STERN_TUBE':lower.includes('diámetro')&&lower.includes('palas opuestas')?'DIAMETER':lower.includes('ángulo de pala')||lower.includes('inclinación')?'BLADE_ANGLE':lower.includes('cada superficie')||lower.includes('pala o aspa')?'BLADE':lower.includes('núcleo')||lower.includes('cubo')?'HUB':lower.includes('raíz')?'ROOT_TIP':lower.includes('paso')?'PITCH':lower.includes('dextr')?'ROTATION':lower.includes('cavit')?'CAVITATION':'EDGE';
  return <figure className="h-full flex flex-col overflow-hidden bg-slate-950">
    <div className="flex-1 min-h-0">{focus==='ENGINE'?<EngineRasterView context={context}/>:<PropellerRasterView part={propellerFocus}/>}</div>
    <figcaption className="shrink-0 border-t border-amber-400/30 bg-slate-900 px-3 py-1.5"><p className="text-[10px] sm:text-xs text-slate-200"><strong className="text-amber-200">Zona destacada:</strong> localizá la pieza y deducí su función por las conexiones, el flujo o el movimiento representado.</p></figcaption>
  </figure>;
};
