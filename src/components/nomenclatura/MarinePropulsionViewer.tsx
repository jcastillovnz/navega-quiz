import React from 'react';

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

const engineFocus: Record<EnginePart, { x: number; y: number; rx: number; ry: number }> = {
  COWLING:{x:430,y:145,rx:160,ry:82}, STARTER:{x:365,y:118,rx:48,ry:34}, THROTTLE:{x:285,y:190,rx:72,ry:36},
  CLAMPS:{x:300,y:250,rx:48,ry:72}, TILT:{x:350,y:285,rx:35,ry:35}, CYLINDER:{x:450,y:165,rx:62,ry:55},
  FILTER:{x:535,y:180,rx:32,ry:48}, FUEL:{x:390,y:180,rx:145,ry:70}, SPARK:{x:485,y:105,rx:28,ry:34},
  TELLTALE:{x:585,y:205,rx:38,ry:30}, LEG:{x:555,y:285,rx:58,ry:105}, TRANSMISSION:{x:570,y:315,rx:65,ry:72},
  PUMP:{x:610,y:325,rx:40,ry:38}, IMPELLER:{x:610,y:325,rx:24,ry:24}, INTAKE:{x:610,y:345,rx:34,ry:28}, PLATE:{x:665,y:330,rx:100,ry:22}, EXHAUST:{x:735,y:354,rx:42,ry:35}
};

const EngineView: React.FC<{ context: string }> = ({ context }) => {
  const part=enginePartFrom(context); const focus=engineFocus[part];
  return <>
    <path d="M245 70 H610 Q645 70 650 110 V208 H610 V365 H515 V210 H245Z" fill="#e2e8f0" stroke="#0f172a" strokeWidth="8"/>
    <path d="M270 92 Q305 55 560 62 Q625 65 625 115 V205 H270Z" fill="#1e293b" stroke="#94a3b8" strokeWidth="6"/>
    <path d="M305 110 Q365 82 555 100" fill="none" stroke="#475569" strokeWidth="7"/>
    <circle cx="365" cy="118" r="22" fill="none" stroke="#cbd5e1" strokeWidth="7"/><path d="M365 96 Q320 70 295 115" fill="none" stroke="#f8fafc" strokeWidth="6"/>
    <path d="M280 176 H185 Q155 176 155 205 V250" fill="none" stroke="#475569" strokeWidth="20"/><rect x="130" y="235" width="95" height="32" rx="15" fill="#334155"/>
    <path d="M300 215 H230 V315 H305" fill="none" stroke="#64748b" strokeWidth="18"/><circle cx="300" cy="250" r="15" fill="#f59e0b"/><circle cx="350" cy="285" r="13" fill="#f59e0b"/>
    <rect x="395" y="118" width="72" height="78" rx="12" fill="#64748b" stroke="#cbd5e1" strokeWidth="5"/><path d="M414 118 V196 M438 118 V196" stroke="#334155" strokeWidth="6"/>
    <rect x="510" y="135" width="48" height="76" rx="12" fill="#f8fafc" stroke="#475569" strokeWidth="5"/><path d="M520 150 H548 M520 165 H548 M520 180 H548" stroke="#f59e0b" strokeWidth="5"/>
    <path d="M485 103 h18 v34 h-18 l-8 -15Z" fill="#e2e8f0" stroke="#334155" strokeWidth="4"/><path d="M585 197 Q620 205 642 222" fill="none" stroke="#38bdf8" strokeWidth="7" strokeDasharray="8 5"/>
    <path d="M530 205 H585 V352 H530Z" fill="#475569" stroke="#0f172a" strokeWidth="7"/><path d="M550 220 V340" stroke="#cbd5e1" strokeWidth="10"/><circle cx="570" cy="315" r="38" fill="#334155" stroke="#94a3b8" strokeWidth="6"/>
    <circle cx="610" cy="325" r="24" fill="#f8fafc" stroke="#334155" strokeWidth="5"/>{[0,60,120,180,240,300].map(a=><path key={a} d="M610 325 q30 -18 28 12 q-20 13 -28 -12" fill="#38bdf8" transform={`rotate(${a} 610 325)`}/>) }
    <path d="M530 322 H700" stroke="#94a3b8" strokeWidth="22"/><path d="M530 330 H720" stroke="#e2e8f0" strokeWidth="13"/>
    <path d="M604 340 h18 M604 350 h18" stroke="#67e8f9" strokeWidth="5"/><path d="M700 350 H760" stroke="#64748b" strokeWidth="24"/>
    <circle cx="760" cy="350" r="45" fill="#64748b" stroke="#0f172a" strokeWidth="6"/><path d="M760 350 Q700 275 735 250 Q785 300 770 345Z M760 350 Q850 325 860 370 Q800 400 770 365Z M760 350 Q735 435 690 415 Q700 360 750 350Z" fill="#94a3b8" stroke="#1e293b" strokeWidth="5"/>
    <path d="M735 342 Q760 350 790 360" stroke="#f97316" strokeWidth="8" opacity=".65"/>
    <ellipse cx={focus.x} cy={focus.y} rx={focus.rx} ry={focus.ry} fill="#fb7185" fillOpacity=".12" stroke="#fb7185" strokeWidth="8" strokeDasharray="14 9"/>
    <circle cx={focus.x} cy={focus.y} r="9" fill="#fecdd3"/>
  </>;
};

export const MarinePropulsionViewer: React.FC<{focus:'ENGINE'|'PROPELLER'; context:string}> = ({focus,context}) => {
  const lower=context.toLowerCase();
  const propellerFocus=lower.includes('capacete')?'CAP':lower.includes('barra transmite')||lower.includes('eje de hélice')?'SHAFT':lower.includes('conducto')||lower.includes('bocina')?'STERN_TUBE':lower.includes('diámetro')&&lower.includes('palas opuestas')?'DIAMETER':lower.includes('ángulo de pala')||lower.includes('inclinación')?'BLADE_ANGLE':lower.includes('cada superficie')||lower.includes('pala o aspa')?'BLADE':lower.includes('núcleo')||lower.includes('cubo')?'HUB':lower.includes('raíz')?'ROOT_TIP':lower.includes('paso')?'PITCH':lower.includes('dextr')?'ROTATION':lower.includes('cavit')?'CAVITATION':'EDGE';
  return <figure className="h-full flex flex-col overflow-hidden bg-slate-950">
    <svg viewBox="0 0 1000 400" className="flex-1 min-h-0 w-full" role="img" aria-label="Vista técnica ampliada del sistema de propulsión con la zona evaluada destacada">
      <defs><linearGradient id="motorSea" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#bae6fd"/><stop offset=".48" stopColor="#38bdf8"/><stop offset=".49" stopColor="#075985"/><stop offset="1" stopColor="#082f49"/></linearGradient><radialGradient id="motorMetal"><stop stopColor="#f8fafc"/><stop offset=".5" stopColor="#94a3b8"/><stop offset="1" stopColor="#334155"/></radialGradient></defs>
      <rect width="1000" height="400" fill="url(#motorSea)"/>
      {focus==='ENGINE'?<EngineView context={context}/>:['CAP','SHAFT','STERN_TUBE'].includes(propellerFocus)?<>
        <path d="M80 110 Q260 85 410 135 L460 265 Q250 310 80 275Z" fill="#e2e8f0" stroke="#334155" strokeWidth="8"/>
        <path d="M315 185 H805" stroke="#64748b" strokeWidth="24"/><path d="M315 185 H805" stroke="#cbd5e1" strokeWidth="12"/>
        <rect x="300" y="145" width="150" height="80" rx="34" fill="#334155" stroke="#94a3b8" strokeWidth="8"/>
        <ellipse cx="375" cy="185" rx="45" ry="58" fill="none" stroke="#22d3ee" strokeWidth="7"/>
        <circle cx="805" cy="185" r="55" fill="url(#motorMetal)" stroke="#0f172a" strokeWidth="7"/>
        <path d="M805 185 Q750 90 690 120 Q715 205 790 195Z M805 185 Q900 140 925 205 Q850 250 815 205Z M805 185 Q790 295 720 275 Q720 205 795 190Z" fill="#94a3b8" stroke="#1e293b" strokeWidth="6"/>
        <path d="M860 152 Q930 185 860 218Z" fill="#64748b" stroke="#0f172a" strokeWidth="7"/>
        {propellerFocus==='SHAFT'&&<rect x="455" y="165" width="350" height="40" rx="20" fill="#fb7185" fillOpacity=".25" stroke="#fb7185" strokeWidth="8"/>}
        {propellerFocus==='STERN_TUBE'&&<rect x="292" y="137" width="166" height="96" rx="40" fill="#fbbf24" fillOpacity=".2" stroke="#fbbf24" strokeWidth="8"/>}
        {propellerFocus==='CAP'&&<path d="M852 145 Q945 185 852 225Z" fill="#fb7185" fillOpacity=".3" stroke="#fb7185" strokeWidth="8"/>}
      </>:<>
        <circle cx="500" cy="205" r="72" fill="url(#motorMetal)" stroke="#0f172a" strokeWidth="8"/><circle cx="500" cy="205" r="25" fill="#1e293b"/>
        <path d="M470 165 Q310 25 230 90 Q305 223 452 215Z M540 183 Q735 100 760 200 Q640 290 535 235Z M490 255 Q455 420 355 370 Q350 255 475 220Z" fill="#94a3b8" stroke="#1e293b" strokeWidth="7"/>
        {(propellerFocus==='ROTATION'||propellerFocus==='PITCH')&&<><path d="M500 53 A152 152 0 1 1 350 205" fill="none" stroke="#22d3ee" strokeWidth="10" strokeDasharray="18 12"/><path d="M345 205 L375 170 L385 215Z" fill="#22d3ee"/></>}
        {propellerFocus==='HUB'&&<circle cx="500" cy="205" r="85" fill="none" stroke="#fb7185" strokeWidth="9"/>}
        {propellerFocus==='ROOT_TIP'&&<><circle cx="455" cy="192" r="30" fill="none" stroke="#fb7185" strokeWidth="9"/><circle cx="248" cy="94" r="30" fill="none" stroke="#fbbf24" strokeWidth="9"/></>}
        {propellerFocus==='EDGE'&&<path d="M470 165 Q310 25 230 90" fill="none" stroke="#fb7185" strokeWidth="12"/>}
        {propellerFocus==='BLADE'&&<path d="M470 165 Q310 25 230 90 Q305 223 452 215Z" fill="#fbbf24" fillOpacity=".35" stroke="#fbbf24" strokeWidth="10"/>}
        {propellerFocus==='DIAMETER'&&<><path d="M242 85 L700 325" stroke="#fbbf24" strokeWidth="8"/><path d="M230 90 l34 -6 -17 31 M712 330 l-34 6 17 -31" fill="none" stroke="#fbbf24" strokeWidth="7"/></>}
        {propellerFocus==='BLADE_ANGLE'&&<><path d="M500 205 H735" stroke="#e2e8f0" strokeWidth="6" strokeDasharray="12 9"/><path d="M500 205 L690 125" stroke="#fbbf24" strokeWidth="9"/><path d="M620 205 A120 120 0 0 0 610 159" fill="none" stroke="#fb7185" strokeWidth="8"/></>}
        {propellerFocus==='CAVITATION'&&[0,1,2,3,4,5].map(i=><circle key={i} cx={710+i*27} cy={245+(i%2)*23} r={7+i*1.5} fill="#e0f2fe" stroke="#38bdf8" strokeWidth="3"/>)}
      </>}
    </svg>
    <figcaption className="shrink-0 border-t border-amber-400/30 bg-slate-900 px-3 py-1.5"><p className="text-[10px] sm:text-xs text-slate-200"><strong className="text-amber-200">Zona destacada:</strong> localizá la pieza y deducí su función por las conexiones, el flujo o el movimiento representado.</p></figcaption>
  </figure>;
};
