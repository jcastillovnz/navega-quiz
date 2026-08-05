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

const EmergencyRadioPlate: React.FC<{ question: QuizQuestion }> = ({ question }) => {
  const id = question.id;
  const isPriority = id === 'seg_radio_priority_1';
  const isPan = id === 'seg_radio_panpan_1';
  const isSafety = id === 'seg_radio_securite_1';
  const isMayday = id === 'seg_radio_mayday_1';
  const isStructure = id === 'seg_radio_panpan_structure_1';
  const isExample = id === 'seg_radio_securite_example_1';
  const isChannel = id === 'seg_radio_channel16_1';
  const isReceive = id === 'seg_radio_receive_1';
  const isEscalation = id === 'seg_radio_escalation_1';
  const isMedical = id === 'seg_radio_medical_1';
  const isWorking = id === 'seg_radio_working_channel_1';
  const isWeather = id === 'seg_radio_weather_safety_1';
  const isCancel = id === 'seg_radio_cancel_1';
  const isPosition = id === 'seg_radio_position_1';
  const title = isPriority ? 'Tres niveles de prioridad' : isPan ? 'Embarcación a la deriva' : isSafety ? 'Aviso para otros navegantes' : isMayday ? 'Peligro grave e inminente' : isStructure ? 'Datos que permiten asistir' : isExample ? 'Peligro a la deriva' : isChannel ? 'Puesto VHF de escucha' : isReceive ? 'Recepción de un socorro' : isEscalation ? 'La urgencia cambia de nivel' : isMedical ? 'Urgencia médica a bordo' : isWorking ? 'Liberar el canal prioritario' : isWeather ? 'Aviso meteorológico de seguridad' : isCancel ? 'Cierre coordinado del caso' : 'Posición inequívoca';
  const cue = isPriority ? 'Compará gravedad, urgencia y alcance del aviso.' : isPan ? 'Evaluá la deriva, el estado del barco y la ausencia de peligro inmediato.' : isSafety ? 'El transmisor advierte un peligro que afecta a otras embarcaciones.' : isMayday ? 'Observá el peligro para las personas y los datos necesarios para el rescate.' : isStructure ? 'Seguí la secuencia desde la identificación hasta la ayuda solicitada.' : isExample ? 'El objeto no pide ayuda: representa un riesgo para el tránsito.' : isChannel ? 'Diferenciá el canal de voz del canal reservado a llamada digital.' : isReceive ? 'El tráfico de socorro queda libre mientras se anotan datos y se mantiene escucha.' : isEscalation ? 'Compará la avería estable con la nueva proximidad de un peligro inmediato.' : isMedical ? 'Evaluá a la persona y comunicá síntomas, posición y asistencia requerida.' : isWorking ? 'La llamada empieza en 16 y continúa en el canal asignado por la estación.' : isWeather ? 'La información afecta a todos los navegantes de la zona, no sólo al transmisor.' : isCancel ? 'La resolución también se comunica para cerrar correctamente la coordinación.' : 'Leé coordenadas o una referencia conocida antes de transmitir.';
  return <figure className="h-full min-h-0 flex flex-col overflow-hidden bg-slate-950">
    <svg viewBox="0 0 1200 430" className="flex-1 min-h-0 w-full" role="img" aria-label={`${title}. ${cue}`}>
      <defs>
        <linearGradient id={`radioBg-${id}`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#0c4a6e"/><stop offset=".58" stopColor="#082f49"/><stop offset=".59" stopColor="#075985"/><stop offset="1" stopColor="#0f172a"/></linearGradient>
        <filter id={`radioGlow-${id}`}><feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#22d3ee" floodOpacity=".7"/></filter>
        <marker id={`radioArrow-${id}`} markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0 0 L0 6 L9 3Z" fill="#fbbf24"/></marker>
      </defs>
      <rect width="1200" height="430" fill={`url(#radioBg-${id})`}/>
      {isPriority && <>
        {[{x:90,w:310,c:'#dc2626',s:'SOCORRO',n:'1'},{x:445,w:270,c:'#f59e0b',s:'URGENCIA',n:'2'},{x:760,w:350,c:'#0ea5e9',s:'SEGURIDAD',n:'3'}].map((b,i)=><g key={b.s} transform={`translate(${b.x} ${110+i*28})`}><rect width={b.w} height="150" rx="24" fill="#020617" stroke={b.c} strokeWidth="7"/><circle cx="55" cy="75" r="32" fill={b.c}/><text x="55" y="87" textAnchor="middle" fill="#fff" fontSize="34" fontWeight="900">{b.n}</text><text x="105" y="65" fill="#fff" fontSize="26" fontWeight="900">{b.s}</text><path d={`M105 92 H${b.w-35}`} stroke={b.c} strokeWidth="8" strokeDasharray={i===0?'4 3':i===1?'14 8':'25 12'}/></g>)}
      </>}
      {isPan && <>
        <path d="M0 330 Q120 295 240 330 T480 330 T720 330 T960 330 T1200 330 V430 H0Z" fill="#0369a1" stroke="#7dd3fc" strokeWidth="5"/>
        <g transform="translate(610 278) rotate(5)"><path d="M-170 15 H120 L185 0 L120 52 H-135Z" fill="#f8fafc" stroke="#334155" strokeWidth="7"/><path d="M-20 5 V-155 L100 5Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="5"/><circle cx="82" cy="-25" r="18" fill="#f59e0b"/></g>
        <path d="M720 350 Q880 385 1040 345" fill="none" stroke="#fbbf24" strokeWidth="8" strokeDasharray="14 10" markerEnd={`url(#radioArrow-${id})`}/><text x="855" y="405" fill="#fef3c7" fontSize="20">deriva controlada · sin fuego ni ingreso de agua</text>
        <g transform="translate(90 68)"><rect width="310" height="125" rx="20" fill="#020617" stroke="#f59e0b" strokeWidth="5"/><path d="M35 90 H270" stroke="#fbbf24" strokeWidth="8" strokeDasharray="18 8"/><circle cx="55" cy="42" r="15" fill="#f59e0b"/><text x="87" y="50" fill="#fff" fontSize="22" fontWeight="800">LLAMADA URGENTE</text></g>
      </>}
      {(isSafety || isExample) && <>
        <path d="M0 335 Q130 300 260 335 T520 335 T780 335 T1040 335 T1300 335 V430 H0Z" fill="#0369a1"/>
        {isSafety ? <g transform="translate(760 195)"><path d="M0 115 V-70" stroke="#f8fafc" strokeWidth="14"/><path d="M-45 80 H45 L65 130 H-65Z" fill="#f59e0b" stroke="#fef3c7" strokeWidth="6"/><circle cy="-82" r="30" fill="#475569"/><path d="M-42 -82 H42" stroke="#ef4444" strokeWidth="10"/><circle cx="82" cy="-82" r="13" fill="#334155"/></g> : <g transform="translate(740 305) rotate(-8)"><path d="M-160 0 Q-90 -62 -25 0 Q55 -48 165 5 Q60 48 -20 20 Q-100 55 -160 0Z" fill="#78350f" stroke="#d97706" strokeWidth="8"/><path d="M-45 -5 l45 -75 30 80" stroke="#92400e" strokeWidth="18" fill="none"/></g>}
        <g transform="translate(150 135)"><path d="M-70 100 H100 L145 82 L95 130 H-50Z" fill="#f8fafc"/><line x1="5" y1="95" x2="5" y2="-65" stroke="#cbd5e1" strokeWidth="8"/><path d="M18 -55 q80 35 0 70Z" fill="#38bdf8"/></g>
        <path d="M315 145 Q500 40 660 135" fill="none" stroke="#67e8f9" strokeWidth="6" strokeDasharray="15 9"/><path d="M330 175 Q505 80 650 165" fill="none" stroke="#67e8f9" strokeWidth="4" strokeDasharray="15 9"/><rect x="70" y="32" width="365" height="56" rx="16" fill="#020617" opacity=".9"/><text x="92" y="68" fill="#bae6fd" fontSize="22" fontWeight="800">AVISO DIRIGIDO AL TRÁNSITO</text>
      </>}
      {isMayday && <>
        <path d="M0 338 Q140 300 280 338 T560 338 T840 338 T1120 338 V430 H0Z" fill="#075985"/>
        <g transform="translate(690 290)"><path d="M-210 5 H145 L220 -18 L145 52 H-175Z" fill="#e2e8f0" stroke="#334155" strokeWidth="8"/><path d="M-40 0 V-175 L80 0Z" fill="#cbd5e1" stroke="#64748b" strokeWidth="5"/></g>
        <path d="M720 240 C625 150 690 75 742 140 C730 40 865 55 835 160 C935 95 980 225 865 270Z" fill="#f97316" stroke="#ef4444" strokeWidth="9"/><g transform="translate(90 70)"><rect width="350" height="205" rx="24" fill="#020617" stroke="#ef4444" strokeWidth="6"/><circle cx="78" cy="70" r="36" fill="#dc2626" filter={`url(#radioGlow-${id})`}/><path d="M142 70 H300" stroke="#fb7185" strokeWidth="10" strokeDasharray="8 7"/><path d="M45 140 H300 M45 175 H245" stroke="#94a3b8" strokeWidth="9"/><text x="125" y="40" fill="#fecaca" fontSize="20" fontWeight="900">SOCORRO</text></g>
      </>}
      {isStructure && <>
        {[{x:45,n:'1',t:'IDENTIDAD',c:'#38bdf8'},{x:280,n:'2',t:'POSICIÓN',c:'#22d3ee'},{x:515,n:'3',t:'SITUACIÓN',c:'#f59e0b'},{x:750,n:'4',t:'ASISTENCIA',c:'#fb7185'},{x:985,n:'5',t:'DATOS',c:'#a78bfa'}].map((s,i)=><g key={s.t} transform={`translate(${s.x} ${100+i%2*38})`}><rect width="190" height="180" rx="23" fill="#0f172a" stroke={s.c} strokeWidth="5"/><circle cx="95" cy="58" r="31" fill={s.c}/><text x="95" y="70" textAnchor="middle" fill="#020617" fontSize="29" fontWeight="900">{s.n}</text><text x="95" y="126" textAnchor="middle" fill="#fff" fontSize="19" fontWeight="800">{s.t}</text><path d="M42 150 H148" stroke={s.c} strokeWidth="6" strokeDasharray="8 6"/></g>)}
      </>}
      {isChannel && <>
        <g transform="translate(330 205)"><rect x="-190" y="-150" width="380" height="310" rx="34" fill="#1e293b" stroke="#94a3b8" strokeWidth="9"/><rect x="-135" y="-98" width="270" height="98" rx="13" fill="#164e63" stroke="#22d3ee" strokeWidth="6"/><text x="0" y="-34" textAnchor="middle" fill="#cffafe" fontSize="50" fontWeight="900">16</text><circle cx="-95" cy="83" r="43" fill="#334155" stroke="#cbd5e1" strokeWidth="6"/><rect x="0" y="47" width="135" height="72" rx="12" fill="#0f172a" stroke="#64748b" strokeWidth="5"/></g>
        <path d="M555 130 Q730 30 910 130 M555 190 Q730 90 910 190 M555 250 Q730 150 910 250" fill="none" stroke="#67e8f9" strokeWidth="7" strokeDasharray="16 10"/><g transform="translate(1000 220)"><line y1="130" y2="-135" stroke="#e2e8f0" strokeWidth="11"/><path d="M0 -115 q85 35 0 70Z" fill="#38bdf8"/><circle cy="-140" r="16" fill="#22d3ee" filter={`url(#radioGlow-${id})`}/></g><rect x="650" y="320" width="335" height="52" rx="15" fill="#020617" opacity=".9"/><text x="817" y="353" textAnchor="middle" fill="#e0f2fe" fontSize="20">voz · escucha · llamada inicial</text>
      </>}
      {isPosition && <>
        <rect x="65" y="42" width="700" height="340" rx="25" fill="#e2e8f0" stroke="#64748b" strokeWidth="8"/><g stroke="#94a3b8" strokeWidth="2">{[145,225,305,385,465,545,625,705].map(x=><line key={x} x1={x} y1="42" x2={x} y2="382"/>)}{[105,165,225,285,345].map(y=><line key={y} x1="65" y1={y} x2="765" y2={y}/>)}</g><path d="M115 325 Q210 170 320 230 Q400 95 525 150 Q610 115 720 82" fill="none" stroke="#65a30d" strokeWidth="22"/><circle cx="470" cy="230" r="18" fill="#ef4444"/><path d="M470 230 L610 105" stroke="#ef4444" strokeWidth="5" strokeDasharray="10 8"/><text x="505" y="215" fill="#7f1d1d" fontSize="21" fontWeight="900">POSICIÓN</text><g transform="translate(930 215)"><rect x="-135" y="-145" width="270" height="300" rx="28" fill="#1e293b" stroke="#94a3b8" strokeWidth="8"/><rect x="-92" y="-95" width="184" height="84" rx="12" fill="#164e63"/><path d="M-58 -55 H60" stroke="#67e8f9" strokeWidth="7" strokeDasharray="9 6"/><circle cy="70" r="43" fill="#334155" stroke="#cbd5e1" strokeWidth="6"/></g>
      </>}
      {isReceive && <>
        <g transform="translate(290 215)"><rect x="-180" y="-145" width="360" height="300" rx="32" fill="#1e293b" stroke="#94a3b8" strokeWidth="8"/><rect x="-125" y="-95" width="250" height="88" rx="12" fill="#164e63"/><text x="0" y="-40" textAnchor="middle" fill="#fecaca" fontSize="31" fontWeight="900">CANAL 16</text><circle cx="-90" cy="75" r="42" fill="#334155" stroke="#cbd5e1" strokeWidth="6"/><path d="M5 50 H125 M5 80 H100" stroke="#64748b" strokeWidth="10"/></g>
        <path d="M490 105 Q665 25 835 105 M490 170 Q665 90 835 170 M490 235 Q665 155 835 235" fill="none" stroke="#fb7185" strokeWidth="7" strokeDasharray="16 10"/>
        <g transform="translate(930 205)"><rect x="-105" y="-125" width="250" height="285" rx="18" fill="#f8fafc" stroke="#64748b" strokeWidth="7"/><path d="M-65 -65 H100 M-65 -10 H100 M-65 45 H65 M-65 100 H85" stroke="#94a3b8" strokeWidth="9"/><path d="M-75 -92 L-55 -72 L-18 -112" fill="none" stroke="#16a34a" strokeWidth="8"/></g><rect x="480" y="330" width="335" height="48" rx="14" fill="#020617"/><text x="648" y="361" textAnchor="middle" fill="#e2e8f0" fontSize="19">escuchar · anotar · no interferir</text>
      </>}
      {isEscalation && <>
        <path d="M0 330 Q120 295 240 330 T480 330 T720 330 T960 330 T1200 330 V430 H0Z" fill="#0369a1"/>
        <g transform="translate(420 275) rotate(7)"><path d="M-150 10 H110 L165 -8 L110 48 H-125Z" fill="#f8fafc" stroke="#334155" strokeWidth="7"/><path d="M-20 0 V-135 L85 0Z" fill="#e2e8f0"/></g>
        <path d="M850 315 l70 -145 65 100 65-165 125 210Z" fill="#475569" stroke="#94a3b8" strokeWidth="7"/><path d="M555 320 Q700 320 835 275" fill="none" stroke="#ef4444" strokeWidth="10" markerEnd={`url(#radioArrow-${id})`}/>
        <g transform="translate(80 55)"><rect width="310" height="85" rx="19" fill="#422006" stroke="#f59e0b" strokeWidth="5"/><text x="155" y="52" textAnchor="middle" fill="#fef3c7" fontSize="24" fontWeight="900">URGENCIA</text></g><path d="M420 98 H665" stroke="#fbbf24" strokeWidth="8" markerEnd={`url(#radioArrow-${id})`}/><g transform="translate(700 55)"><rect width="330" height="85" rx="19" fill="#450a0a" stroke="#ef4444" strokeWidth="5"/><text x="165" y="52" textAnchor="middle" fill="#fecaca" fontSize="24" fontWeight="900">PELIGRO INMEDIATO</text></g>
      </>}
      {isMedical && <>
        <path d="M0 350 H1200 V430 H0Z" fill="#334155"/><g transform="translate(660 270)"><rect x="-230" y="30" width="490" height="75" rx="25" fill="#cbd5e1"/><circle cx="-145" cy="-20" r="42" fill="#efc39e"/><path d="M-100 -10 Q40 -60 190 10 L220 60 H-130Z" fill="#0e7490"/><path d="M-25 -20 Q20 -70 70 -20" fill="none" stroke="#f8fafc" strokeWidth="7"/></g><g transform="translate(245 200)"><rect x="-120" y="-135" width="240" height="285" rx="28" fill="#1e293b" stroke="#94a3b8" strokeWidth="8"/><rect x="-82" y="-92" width="164" height="72" rx="10" fill="#164e63"/><path d="M-55 -54 H55" stroke="#fbbf24" strokeWidth="7" strokeDasharray="10 6"/><circle cy="70" r="40" fill="#334155" stroke="#cbd5e1" strokeWidth="6"/></g><g transform="translate(980 170)"><circle r="58" fill="#f8fafc" stroke="#ef4444" strokeWidth="8"/><path d="M-32 0 H32 M0 -32 V32" stroke="#ef4444" strokeWidth="16"/></g><path d="M380 115 Q620 20 870 105" fill="none" stroke="#67e8f9" strokeWidth="7" strokeDasharray="15 9"/>
      </>}
      {isWorking && <>
        {[{x:290,ch:'16',c:'#ef4444',t:'LLAMADA INICIAL'},{x:910,ch:'72',c:'#22d3ee',t:'CANAL ASIGNADO'}].map(r=><g key={r.ch} transform={`translate(${r.x} 215)`}><rect x="-175" y="-145" width="350" height="290" rx="32" fill="#1e293b" stroke="#94a3b8" strokeWidth="8"/><rect x="-115" y="-95" width="230" height="105" rx="13" fill="#164e63" stroke={r.c} strokeWidth="5"/><text x="0" y="-25" textAnchor="middle" fill="#fff" fontSize="54" fontWeight="900">{r.ch}</text><circle cx="-85" cy="82" r="39" fill="#334155" stroke="#cbd5e1" strokeWidth="6"/><text x="0" y="185" textAnchor="middle" fill={r.c} fontSize="19" fontWeight="900">{r.t}</text></g>)}<path d="M490 215 H700" stroke="#fbbf24" strokeWidth="11" markerEnd={`url(#radioArrow-${id})`}/><text x="590" y="180" textAnchor="middle" fill="#fef3c7" fontSize="19">por indicación</text>
      </>}
      {isWeather && <>
        <path d="M0 330 Q150 300 300 330 T600 330 T900 330 T1200 330 V430 H0Z" fill="#075985"/><g fill="#cbd5e1" opacity=".65">{[0,1,2,3].map(i=><path key={i} d={`M-80 ${135+i*55} Q130 ${95+i*55} 340 ${135+i*55} T760 ${135+i*55} T1180 ${135+i*55} V${175+i*55} H-80Z`}/>)}</g><g transform="translate(180 300)"><path d="M-100 0 H70 L115 -15 L70 35 H-75Z" fill="#f8fafc"/><line y1="0" y2="-135" stroke="#cbd5e1" strokeWidth="8"/></g><g transform="translate(1000 285)"><path d="M-100 0 H70 L115 -15 L70 35 H-75Z" fill="#e2e8f0"/><line y1="0" y2="-135" stroke="#cbd5e1" strokeWidth="8"/></g><path d="M350 85 Q600 5 850 85 M350 145 Q600 65 850 145" fill="none" stroke="#67e8f9" strokeWidth="7" strokeDasharray="16 10"/><rect x="440" y="18" width="320" height="50" rx="15" fill="#020617" opacity=".9"/><text x="600" y="50" textAnchor="middle" fill="#cffafe" fontSize="21" fontWeight="900">AVISO PARA TODA LA ZONA</text>
      </>}
      {isCancel && <>
        <path d="M0 335 Q150 305 300 335 T600 335 T900 335 T1200 335 V430 H0Z" fill="#0369a1"/><g transform="translate(445 275)"><path d="M-165 10 H115 L175 -8 L115 48 H-135Z" fill="#f8fafc" stroke="#334155" strokeWidth="7"/><path d="M-15 0 V-140 L95 0Z" fill="#e2e8f0"/></g><circle cx="770" cy="170" r="95" fill="#064e3b" stroke="#34d399" strokeWidth="9"/><path d="M720 170 L755 205 L825 125" fill="none" stroke="#a7f3d0" strokeWidth="18" strokeLinecap="round"/><g transform="translate(1010 225)"><rect x="-110" y="-135" width="220" height="275" rx="27" fill="#1e293b" stroke="#94a3b8" strokeWidth="8"/><rect x="-72" y="-90" width="144" height="70" rx="10" fill="#164e63"/><path d="M-45 -55 H45" stroke="#34d399" strokeWidth="7"/><circle cy="70" r="38" fill="#334155" stroke="#cbd5e1" strokeWidth="6"/></g><path d="M590 205 Q680 135 680 135" fill="none" stroke="#34d399" strokeWidth="8" markerEnd={`url(#radioArrow-${id})`}/><text x="115" y="75" fill="#d1fae5" fontSize="25" fontWeight="900">SITUACIÓN RESUELTA</text><text x="115" y="108" fill="#cbd5e1" fontSize="19">informar el cierre a quien coordina</text>
      </>}
    </svg>
    <figcaption className="shrink-0 border-t border-cyan-300/25 bg-slate-900 px-4 py-2"><p className="text-sm font-black text-cyan-200">{title}</p><p className="text-xs text-slate-300">{cue}</p></figcaption>
  </figure>;
};

const HypothermiaRecoveryPlate: React.FC = () => (
  <figure className="h-full min-h-0 flex flex-col overflow-hidden bg-slate-950">
    <svg viewBox="0 0 1200 430" className="flex-1 min-h-0 w-full" role="img" aria-label="Persona recién recuperada, tendida horizontalmente en una cabina protegida, asistida con suavidad, ropa mojada apartada y aislamiento seco">
      <defs>
        <linearGradient id="hypCabin" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#dbeafe"/><stop offset=".62" stopColor="#94a3b8"/><stop offset=".63" stopColor="#334155"/><stop offset="1" stopColor="#0f172a"/></linearGradient>
        <linearGradient id="hypBlanket" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f59e0b"/><stop offset="1" stopColor="#b45309"/></linearGradient>
        <filter id="hypShadow"><feDropShadow dx="5" dy="8" stdDeviation="7" floodOpacity=".45"/></filter>
      </defs>
      <rect width="1200" height="430" fill="url(#hypCabin)"/>
      <path d="M0 80 H1200" stroke="#64748b" strokeWidth="10"/><path d="M190 80 V250 M1010 80 V250" stroke="#64748b" strokeWidth="8"/>
      <rect x="55" y="28" width="325" height="58" rx="16" fill="#020617" opacity=".88"/><text x="78" y="64" fill="#e0f2fe" fontSize="22" fontWeight="800">CABINA PROTEGIDA DEL VIENTO</text>
      <g transform="translate(530 275)" filter="url(#hypShadow)">
        <rect x="-330" y="54" width="675" height="54" rx="24" fill="#cbd5e1" stroke="#475569" strokeWidth="7"/>
        <circle cx="-220" cy="-20" r="45" fill="#efc39e" stroke="#7c2d12" strokeWidth="3"/>
        <path d="M-180 -4 Q20 -65 250 -5 L300 67 H-205Z" fill="url(#hypBlanket)" stroke="#fde68a" strokeWidth="7"/>
        <path d="M-160 15 Q30 -30 245 15" fill="none" stroke="#fcd34d" strokeWidth="4" opacity=".65"/>
        <path d="M-268 18 Q-238 40 -205 30" fill="none" stroke="#bae6fd" strokeWidth="6"/>
      </g>
      <g transform="translate(185 175)">
        <circle cx="0" cy="0" r="38" fill="#d6a47c"/><path d="M-8 42 L65 145 M-2 72 L110 98" stroke="#0e7490" strokeWidth="34" strokeLinecap="round"/><path d="M105 98 Q155 110 190 102" fill="none" stroke="#d6a47c" strokeWidth="18" strokeLinecap="round"/>
        <rect x="-88" y="-70" width="170" height="38" rx="14" fill="#020617" opacity=".86"/><text x="-69" y="-45" fill="#cffafe" fontSize="18" fontWeight="800">CONTROL SUAVE</text>
      </g>
      <g transform="translate(985 185)">
        <circle cx="0" cy="0" r="38" fill="#d6a47c"/><path d="M8 42 L-58 145 M2 72 L-105 105" stroke="#0369a1" strokeWidth="34" strokeLinecap="round"/><path d="M-102 105 Q-145 120 -180 105" fill="none" stroke="#d6a47c" strokeWidth="18" strokeLinecap="round"/>
      </g>
      <g transform="translate(975 312)"><path d="M0 0 q-28 48 0 70 q28-22 0-70Z" fill="#38bdf8"/><path d="M35 5 q-28 48 0 70 q28-22 0-70Z" fill="#38bdf8"/><path d="M-55 72 H92" stroke="#fb7185" strokeWidth="7"/><text x="18" y="100" textAnchor="middle" fill="#fecdd3" fontSize="17">ropa mojada apartada</text></g>
      <g transform="translate(760 72)"><rect width="330" height="76" rx="18" fill="#020617" opacity=".88"/><path d="M35 55 V22" stroke="#cbd5e1" strokeWidth="12" strokeLinecap="round"/><circle cx="35" cy="57" r="14" fill="#fb7185"/><path d="M35 44 H77 M77 44 L105 31 M105 31 L135 25" fill="none" stroke="#fbbf24" strokeWidth="6"/><text x="155" y="34" fill="#fef3c7" fontSize="17" fontWeight="800">CALOR GRADUAL</text><text x="155" y="58" fill="#cbd5e1" fontSize="15">vigilar respiración y conciencia</text></g>
      <path d="M610 375 H760" stroke="#fbbf24" strokeWidth="6" strokeDasharray="12 9" markerEnd="url(#hypArrow)"/>
      <defs><marker id="hypArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0 0 L0 6 L9 3Z" fill="#fbbf24"/></marker></defs>
    </svg>
    <figcaption className="shrink-0 border-t border-cyan-300/25 bg-slate-900 px-4 py-2">
      <p className="text-xs text-slate-200"><strong className="text-cyan-200">Después del rescate:</strong> observá la posición horizontal, el trato cuidadoso, el aislamiento seco y el control progresivo de la persona.</p>
    </figcaption>
  </figure>
);

export const SafetyQuestionIllustration:React.FC<Props>=({question,family})=>{const plate=rasterPlate(question); if(plate)return <DetailedRasterPlate plate={plate}/>; if(family==='SAFETY_RADIO')return <EmergencyRadioPlate question={question}/>; if(question.id==='seg_hypothermia_1')return <HypothermiaRecoveryPlate/>; if(['seg_5','seg_6','seg_25'].includes(question.id))return <FondeoManeuverPlate id={question.id}/>; const kind=kindFrom(question,family); const hue=[...question.id].reduce((a,c)=>a+c.charCodeAt(0),0)%3; if(kind==='lifejackets')return <figure className="h-full flex flex-col overflow-hidden bg-slate-950"><img src={lifejackets} alt="Tripulación completa navegando con chalecos salvavidas correctamente colocados" className="flex-1 min-h-0 w-full object-contain"/><figcaption className="shrink-0 bg-slate-900 px-4 py-2 text-xs text-slate-200"><strong className="text-rose-200">Observación:</strong> comprobá colocación, ajuste y cantidad de chalecos respecto de la tripulación.</figcaption></figure>;
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
