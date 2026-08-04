import React from 'react';
import lifejackets from '../../assets/safety_lifejackets_illustrated.png';
import anchorSystem from '../../assets/safety_anchor_system_illustrated-v2.png';
import fireResponse from '../../assets/safety_fire_response_illustrated-v2.png';
import floodingResponse from '../../assets/safety_flooding_response_illustrated-v2.png';
import manOverboard from '../../assets/safety_man_overboard_illustrated-v2.png';
import heavyWeather from '../../assets/safety_heavy_weather_illustrated-v2.png';
import distressSignals from '../../assets/safety_distress_signals_illustrated-v2.png';
import fireClassA from '../../assets/safety_fire_class_a_illustrated-v2.png';
import fireLiquid from '../../assets/safety_fire_liquid_illustrated-v2.png';
import fireGas from '../../assets/safety_fire_gas_illustrated-v2.png';
import fireCookingOil from '../../assets/safety_fire_cooking_oil_illustrated-v2.png';
import fireMetal from '../../assets/safety_fire_metal_illustrated-v2.png';
import type { QuizQuestion } from '../../types/quiz';
import type { VisualFamily } from '../../data/visualManifest';

type Props={question:QuizQuestion;family?:VisualFamily};
const kindFrom=(q:QuizQuestion,f?:VisualFamily)=>{const t=`${q.question} ${q.explanation}`.toLowerCase(); if(q.id==='seg_1')return'lifejackets'; if(/vhf|mayday|canal 16|radio/.test(t))return'radio'; if(/bengala|humo naranja|señal/.test(t))return'flare'; if(f==='SAFETY_FIRE'||/fuego|incendio|matafuego|extintor|combusti/.test(t))return'fire'; if(f==='SAFETY_ANCHOR'||/ancla|fonde|cadena|orinque|garrear/.test(t))return'anchor'; if(f==='SAFETY_HAA'||/hombre al agua|náufrago/.test(t))return'rescue'; if(f==='SAFETY_STORM'||/temporal|costa a sotavento|capear|ancla de capa/.test(t))return'storm'; if(f==='SAFETY_DAMAGE'||/vía de agua|abordaje|varad|timón|remolque|abandono/.test(t))return'damage'; if(/motor|bujía|prensaestopa|ánodo|rayo/.test(t))return'mechanical'; return'document';};

type RasterPlate = { src: string; alt: string; focus: string; detail?: 'AGENTS' };

const rasterPlate = (question: QuizQuestion): RasterPlate | null => {
  if (['seg_7', 'seg_fire_1'].includes(question.id)) {
    return {
      src: fireClassA,
      alt: 'Fuego controlado de madera, papel y tela dentro de una bandeja de entrenamiento en la cubierta de un velero',
      focus: question.id === 'seg_7'
        ? 'Relacioná el combustible sólido con los distintos modos de descarga disponibles.'
        : 'Identificá qué tienen en común la madera, el papel y la tela antes de clasificar el incendio.',
      detail: question.id === 'seg_7' ? 'AGENTS' : undefined
    };
  }
  if (question.id === 'seg_fire_2') {
    return {
      src: fireLiquid,
      alt: 'Líquido combustible ardiendo en una bandeja y demostración separada de cómo un chorro de agua dispersa líquido',
      focus: 'Compará la superficie líquida en llamas con el efecto de dispersión producido por el chorro.'
    };
  }
  if (question.id === 'seg_fire_3') {
    return {
      src: fireGas,
      alt: 'Fuga encendida en la instalación de GLP de un velero mientras se cierra la válvula del cilindro',
      focus: 'Seguí la instalación desde el cilindro hasta la fuga y observá qué acción elimina el suministro.'
    };
  }
  if (question.id === 'seg_fire_5') {
    return {
      src: fireMetal,
      alt: 'Virutas de metal combustible ardiendo y siendo cubiertas con polvo especial dentro de una bandeja',
      focus: 'Observá el combustible metálico, el polvo aplicado suavemente y los agentes mantenidos aislados.'
    };
  }
  if (question.id === 'seg_fire_7') {
    return {
      src: fireCookingOil,
      alt: 'Aceite de cocina ardiendo en una sartén de la cocina de un velero con agente húmedo preparado',
      focus: 'Identificá el aceite caliente, la tapa disponible y el tipo de aplicación preparada a distancia segura.'
    };
  }
  if (['seg_3', 'seg_4', 'seg_18', 'seg_24', 'seg_catenary_1'].includes(question.id)) {
    const focus = question.id === 'seg_24'
      ? 'Seguí la línea auxiliar desde la boya hasta la parte posterior del ancla.'
      : question.id === 'seg_catenary_1' || question.id === 'seg_4'
        ? 'Observá cómo la línea se curva y llega casi horizontal al fondo.'
        : 'Examiná la forma de las uñas, la caña y cómo trabajan sobre este fondo.';
    return { src: anchorSystem, alt: 'Sistema de fondeo ilustrado completo con velero, cadena, cabo, ancla de uñas y línea auxiliar con boya', focus };
  }
  if (['seg_fire_4', 'seg_fire_methods_1', 'seg_fire_technique_1'].includes(question.id)) {
    return {
      src: fireResponse,
      alt: 'Tripulación controlando un incendio pequeño dentro de un velero con matafuego y corte de energía',
      focus: question.id === 'seg_fire_technique_1'
        ? 'Observá el punto donde impacta el agente y la posición segura del operador.'
        : 'Relacioná combustible, energía y agente extintor antes de elegir.'
    };
  }
  if (['seg_averia_1', 'seg_watertight_1'].includes(question.id)) {
    return {
      src: floodingResponse,
      alt: 'Corte ilustrado de un velero donde la tripulación tapona una vía de agua y opera una bomba de achique',
      focus: 'Identificá la entrada, el taponamiento, el achique y la descarga al exterior.'
    };
  }
  if (question.id === 'seg_16') {
    return {
      src: manOverboard,
      alt: 'Recuperación ilustrada de una persona desde el agua mediante eslinga, driza y escalera por el costado bajo del velero',
      focus: 'Observá la banda elegida, el soporte horizontal, la escalera y la posición segura respecto del motor.'
    };
  }
  if (['seg_temporal_1', 'seg_temporal_2', 'seg_temporal_3', 'seg_temporal_4'].includes(question.id)) {
    const focus = question.id === 'seg_temporal_1'
      ? 'Compará el tamaño del paño izado con la intensidad del frente que se aproxima.'
      : question.id === 'seg_temporal_3'
        ? 'Ubicá la costa respecto del viento y reconocé hacia dónde deriva el barco.'
        : question.id === 'seg_temporal_4'
          ? 'Seguí la línea de proa hasta el dispositivo sumergido y observá cómo estabiliza la orientación.'
          : 'Observá el ángulo de la proa frente al oleaje, la velocidad reducida y el paño disponible.';
    return {
      src: heavyWeather,
      alt: 'Velero ilustrado preparado para temporal con velas reducidas, tripulación asegurada, costa a sotavento y ancla de capa',
      focus
    };
  }
  if (['seg_2', 'seg_8', 'seg_15'].includes(question.id)) {
    const focus = question.id === 'seg_8'
      ? 'Diferenciá la señal manual, el cohete con paracaídas y el humo por su forma y uso previsto.'
      : 'Observá el equipo fijo, el portátil, la posición disponible y la embarcación que recibe la llamada.';
    return {
      src: distressSignals,
      alt: 'Puesto de comunicaciones ilustrado con radio VHF fija y portátil, carta y señales visuales de socorro separadas',
      focus
    };
  }
  return null;
};

const DetailedRasterPlate: React.FC<{ plate: NonNullable<ReturnType<typeof rasterPlate>> }> = ({ plate }) => (
  <figure className="relative h-full overflow-hidden bg-slate-950">
    <img src={plate.src} alt={plate.alt} className="h-full w-full object-contain" />
    {plate.detail === 'AGENTS' && (
      <div className="absolute right-2 top-2 grid w-28 grid-cols-3 gap-1 rounded-xl border border-white/25 bg-slate-950/90 p-2 shadow-2xl sm:w-44" aria-label="Comparación visual de agentes extintores aptos para sólidos">
        <div className="grid place-items-center rounded-lg bg-cyan-950/80 p-1"><span className="h-8 w-2 rounded-full bg-gradient-to-b from-cyan-100 to-cyan-500 sm:h-12"/><span className="mt-1 text-[7px] text-cyan-100">niebla</span></div>
        <div className="grid place-items-center rounded-lg bg-slate-800 p-1"><span className="h-8 w-5 rounded-b-full bg-gradient-to-b from-white to-slate-300 sm:h-12"/><span className="mt-1 text-[7px] text-slate-100">espuma</span></div>
        <div className="grid place-items-center rounded-lg bg-amber-950/70 p-1"><span className="h-8 w-7 rounded-full bg-[radial-gradient(circle,#fde68a_1px,transparent_1px)] bg-[length:4px_4px] sm:h-12"/><span className="mt-1 text-[7px] text-amber-100">polvo</span></div>
      </div>
    )}
    <figcaption className="absolute inset-x-2 bottom-2 rounded-lg border border-cyan-300/25 bg-slate-950/88 px-2.5 py-1.5 shadow-xl backdrop-blur-sm">
      <p className="text-[9px] sm:text-[11px] leading-snug text-slate-100"><strong className="text-cyan-200">Pista de observación:</strong> {plate.focus}</p>
    </figcaption>
  </figure>
);

const FondeoManeuverPlate: React.FC<{ id: string }> = ({ id }) => {
  const isTwoAnchors = id === 'seg_6';
  const isDragging = id === 'seg_25';
  return (
    <figure className="relative h-full overflow-hidden bg-slate-950">
      <svg viewBox="0 0 1000 430" className="h-full w-full" role="img" aria-label={isTwoAnchors ? 'Vista superior de un velero afirmado con dos anclas abiertas desde la proa' : isDragging ? 'Secuencia de un velero cuya ancla pierde agarre y se desplaza sobre el fondo' : 'Vista superior del círculo de borneo de un velero fondeado con una sola ancla'}>
        <defs>
          <radialGradient id={`anchoringWater-${id}`}><stop stopColor="#0891b2"/><stop offset="1" stopColor="#082f49"/></radialGradient>
          <marker id={`anchorArrow-${id}`} markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8Z" fill="#fbbf24"/></marker>
          <filter id={`anchorShadow-${id}`}><feDropShadow dx="4" dy="6" stdDeviation="5" floodOpacity=".5"/></filter>
        </defs>
        <rect width="1000" height="430" fill={`url(#anchoringWater-${id})`}/>
        {[70,145,220,295,370].map(y=><path key={y} d={`M0 ${y} Q125 ${y-15} 250 ${y} T500 ${y} T750 ${y} T1000 ${y}`} fill="none" stroke="#67e8f9" strokeWidth="3" opacity=".18"/>)}
        {!isTwoAnchors && !isDragging && <circle cx="500" cy="225" r="165" fill="none" stroke="#a5f3fc" strokeWidth="5" strokeDasharray="13 12"/>}
        {isDragging && <>
          <path d="M250 220 Q450 220 675 275" fill="none" stroke="#fbbf24" strokeWidth="8" strokeDasharray="15 10" markerEnd={`url(#anchorArrow-${id})`}/>
          <g opacity=".35" transform="translate(300 185)"><path d="M0 -75 C45 -55 55 45 0 92 C-55 45 -45 -55 0 -75Z" fill="#e2e8f0" stroke="#334155" strokeWidth="7"/><path d="M0 -75 V92" stroke="#64748b" strokeWidth="6"/></g>
          <path d="M700 285 L748 322 M724 304 L760 276 M748 322 L780 298" stroke="#cbd5e1" strokeWidth="12" strokeLinecap="round"/>
          <path d="M700 286 q-70 25 -125 0" fill="none" stroke="#d6a45d" strokeWidth="8" strokeDasharray="8 7"/>
        </>}
        <g transform={`translate(${isDragging ? 700 : 500} ${isDragging ? 180 : 190})`} filter={`url(#anchorShadow-${id})`}>
          <path d="M0 -80 C48 -55 58 48 0 100 C-58 48 -48 -55 0 -80Z" fill="#f8fafc" stroke="#334155" strokeWidth="8"/>
          <path d="M0 -80 V100" stroke="#64748b" strokeWidth="7"/>
          <rect x="-26" y="-32" width="52" height="48" rx="8" fill="#dbeafe" stroke="#475569" strokeWidth="5"/>
        </g>
        {isTwoAnchors ? <>
          <path d="M500 285 Q350 315 210 350 M500 285 Q650 315 790 350" fill="none" stroke="#d6a45d" strokeWidth="10"/>
          <g stroke="#cbd5e1" strokeWidth="12" strokeLinecap="round"><path d="M185 350 L225 385 M205 368 L245 340 M225 385 L260 360"/><path d="M815 350 L775 385 M795 368 L755 340 M775 385 L740 360"/></g>
          <path d="M350 332 A170 170 0 0 1 650 332" fill="none" stroke="#fbbf24" strokeWidth="6" strokeDasharray="10 8"/>
        </> : !isDragging && <>
          <path d="M500 285 Q500 335 500 380" fill="none" stroke="#d6a45d" strokeWidth="10"/>
          <path d="M475 380 L515 415 M495 398 L535 370 M515 415 L550 390" stroke="#cbd5e1" strokeWidth="12" strokeLinecap="round"/>
          <path d="M365 95 A165 165 0 0 1 625 88" fill="none" stroke="#fbbf24" strokeWidth="7" markerEnd={`url(#anchorArrow-${id})`}/>
        </>}
      </svg>
      <figcaption className="absolute inset-x-2 bottom-2 rounded-lg border border-amber-300/30 bg-slate-950/88 px-2.5 py-1.5">
        <p className="text-[9px] sm:text-[11px] text-slate-100"><strong className="text-amber-200">Leé la geometría:</strong> {isTwoAnchors ? 'compará la apertura de ambas líneas y cómo limitan el giro.' : isDragging ? 'compará la posición inicial con el desplazamiento y la huella del ancla.' : 'seguí el radio entre el ancla fija y las posibles posiciones del barco.'}</p>
      </figcaption>
    </figure>
  );
};

export const SafetyQuestionIllustration:React.FC<Props>=({question,family})=>{const plate=rasterPlate(question); if(plate)return <DetailedRasterPlate plate={plate}/>; if(['seg_5','seg_6','seg_25'].includes(question.id))return <FondeoManeuverPlate id={question.id}/>; const kind=kindFrom(question,family); const hue=[...question.id].reduce((a,c)=>a+c.charCodeAt(0),0)%3; if(kind==='lifejackets')return <figure className="h-full flex flex-col overflow-hidden bg-slate-950"><img src={lifejackets} alt="Tripulación completa navegando con chalecos salvavidas correctamente colocados" className="flex-1 min-h-0 w-full object-contain"/><figcaption className="shrink-0 bg-slate-900 px-4 py-2 text-xs text-slate-200"><strong className="text-rose-200">Observación:</strong> comprobá colocación, ajuste y cantidad de chalecos respecto de la tripulación.</figcaption></figure>;
return <figure className="h-full flex flex-col overflow-hidden bg-slate-950"><svg viewBox="0 0 1200 430" className="flex-1 min-h-0 w-full" role="img" aria-label={`Escena de seguridad para ${question.question}`}><defs><linearGradient id={`safeSea${hue}`} x1="0" y1="0" x2="0" y2="1"><stop stopColor={['#bae6fd','#dbeafe','#cffafe'][hue]}/><stop offset=".52" stopColor="#38bdf8"/><stop offset=".53" stopColor="#075985"/><stop offset="1" stopColor="#082f49"/></linearGradient><filter id={`safeShadow${hue}`}><feDropShadow dx="5" dy="7" stdDeviation="5" floodOpacity=".5"/></filter></defs><rect width="1200" height="430" fill={`url(#safeSea${hue})`}/>
{kind==='radio'&&<><rect x="390" y="70" width="420" height="300" rx="35" fill="#1e293b" stroke="#94a3b8" strokeWidth="8"/><rect x="455" y="120" width="290" height="92" rx="12" fill="#164e63" stroke="#67e8f9" strokeWidth="5"/><path d="M490 165 H710" stroke="#22d3ee" strokeWidth="6" strokeDasharray="8 7"/><circle cx="505" cy="285" r="43" fill="#334155" stroke="#cbd5e1" strokeWidth="6"/><rect x="590" y="255" width="155" height="65" rx="12" fill="#ef4444"/><path d="M780 65 L850 15" stroke="#0f172a" strokeWidth="10"/></>}
{kind==='flare'&&<><path d="M600 340 L600 160" stroke="#334155" strokeWidth="45"/><path d="M600 160 C505 100 565 32 600 65 C635 32 695 100 600 160Z" fill="#fb923c" stroke="#ef4444" strokeWidth="8"/><path d="M390 345 Q600 280 810 345" fill="none" stroke="#e0f2fe" strokeWidth="10"/><circle cx="600" cy="95" r="115" fill="#fb923c" opacity=".2"/></>}
{kind==='fire'&&<><path d="M235 350 H965" stroke="#475569" strokeWidth="14"/><path d="M520 350 C390 245 470 155 535 205 C495 85 650 65 650 190 C735 115 835 250 690 350Z" fill="#f97316" stroke="#ef4444" strokeWidth="8"/><rect x="190" y="100" width="135" height="235" rx="45" fill="#dc2626" stroke="#fee2e2" strokeWidth="7"/><path d="M255 100 V55 H360 V110" fill="none" stroke="#334155" strokeWidth="18"/><path d="M325 160 Q430 170 475 225" fill="none" stroke="#e2e8f0" strokeWidth="16"/><path d="M470 220 L550 245" stroke="#f8fafc" strokeWidth="9" strokeDasharray="10 7"/></>}
{kind==='anchor'&&<><path d="M0 315 Q300 285 600 315 T1200 315 V430 H0Z" fill="#6b4f36"/><path d="M600 55 V265 M490 120 H710 M600 265 Q505 260 455 205 M600 265 Q695 260 745 205" stroke="#334155" strokeWidth="25" fill="none"/><circle cx="600" cy="65" r="28" fill="none" stroke="#334155" strokeWidth="16"/><path d="M600 55 Q800 45 940 130 Q1020 180 1100 165" fill="none" stroke="#d6a45d" strokeWidth="18"/><path d="M600 265 Q510 335 400 318 M600 265 Q690 335 800 318" stroke="#334155" strokeWidth="26"/><path d="M600 55 V15" stroke="#d6a45d" strokeWidth="16"/></>}
{kind==='rescue'&&<><path d="M80 210 H700 L620 340 H160Z" fill="#e2e8f0" stroke="#475569" strokeWidth="8"/><circle cx="850" cy="240" r="38" fill="#f2c6a0"/><path d="M850 278 V360 M850 305 L785 340 M850 305 L915 340" stroke="#f97316" strokeWidth="28"/><circle cx="850" cy="295" r="82" fill="none" stroke="#fb923c" strokeWidth="22"/><path d="M650 230 Q730 155 820 235" fill="none" stroke="#d6a45d" strokeWidth="16"/></>}
{kind==='storm'&&<><path d="M0 80 Q180 15 350 75 T700 70 T1200 65 V0 H0Z" fill="#1e293b"/><path d="M0 310 Q130 210 260 310 T520 310 T780 310 T1040 310 T1300 310" fill="none" stroke="#e0f2fe" strokeWidth="24"/><path d="M350 300 H850 L760 365 H430Z" fill="#e2e8f0" stroke="#334155" strokeWidth="7" transform="rotate(-8 600 330)"/><path d="M600 295 V105 L770 292Z" fill="#f8fafc" stroke="#64748b" strokeWidth="7" transform="rotate(-8 600 330)"/><path d="M980 30 L900 140 H970 L880 255" stroke="#fde047" strokeWidth="16" fill="none"/></>}
{kind==='damage'&&<><path d="M150 125 H930 L820 330 H260Z" fill="#e2e8f0" stroke="#475569" strokeWidth="9"/><path d="M610 120 L580 190 L635 235 L590 330" stroke="#ef4444" strokeWidth="13" fill="none"/><path d="M600 245 Q720 205 835 270" fill="none" stroke="#38bdf8" strokeWidth="25"/><path d="M600 245 Q520 220 450 270" fill="none" stroke="#38bdf8" strokeWidth="25"/><rect x="930" y="170" width="90" height="140" rx="12" fill="#f59e0b"/><path d="M975 170 V115" stroke="#334155" strokeWidth="15"/></>}
{kind==='mechanical'&&<><path d="M210 330 H980" stroke="#475569" strokeWidth="16"/><circle cx="480" cy="220" r="145" fill="#334155" stroke="#94a3b8" strokeWidth="10"/><circle cx="480" cy="220" r="48" fill="#0f172a"/>{[0,60,120,180,240,300].map(a=><rect key={a} x="455" y="48" width="50" height="95" rx="14" fill="#64748b" transform={`rotate(${a} 480 220)`}/>) }<rect x="720" y="100" width="150" height="230" rx="30" fill="#1e293b" stroke="#cbd5e1" strokeWidth="8"/><path d="M755 155 H835 M755 210 H835 M755 265 H835" stroke="#22d3ee" strokeWidth="14"/></>}
{kind==='document'&&<><path d="M365 45 H835 V380 H365Z" fill="#f8fafc" stroke="#64748b" strokeWidth="8"/><path d="M440 125 H760 M440 180 H760 M440 235 H650" stroke="#94a3b8" strokeWidth="13"/><circle cx="705" cy="305" r="55" fill="none" stroke="#f43f5e" strokeWidth="12"/><path d="M680 305 L700 325 L742 278" fill="none" stroke="#f43f5e" strokeWidth="12"/></>}
<path d={`M${80+hue*35} 395 H${260+hue*35}`} stroke="#fb7185" strokeWidth="8"/><circle cx={80+hue*35} cy="395" r="10" fill="#fb7185"/></svg><figcaption className="shrink-0 border-t border-rose-400/30 bg-slate-900 px-4 py-2"><p className="text-xs text-slate-200"><strong className="text-rose-200">Escena específica:</strong> identificá el objeto, su ubicación y la acción segura antes de responder.</p></figcaption></figure>};
