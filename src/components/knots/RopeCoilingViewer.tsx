import React from 'react';
import ropeStorageNudo13 from '../../assets/knots/rope-storage-nudo-13-v1.png';
import ropeCoilingActionNudo19 from '../../assets/knots/rope-coiling-action-nudo-19-v1.png';
import securedRoundCoilNudo20 from '../../assets/knots/secured-round-coil-nudo-20-v1.png';
import figureEightCoilNudo21 from '../../assets/knots/figure-eight-coil-nudo-21-v1.png';
import dutchSpiralCoilNudo22 from '../../assets/knots/dutch-spiral-coil-nudo-22-v1.png';
import readyToRunLineNudo23 from '../../assets/knots/ready-to-run-line-nudo-23-v1.png';
import forcedCoilKinkNudo24 from '../../assets/knots/forced-coil-kink-nudo-24-v1.png';
import lineSafetyCheckNudo25 from '../../assets/knots/line-safety-check-nudo-25-v1.png';

type Coil = 'round' | 'eight' | 'dutch' | 'ready' | 'safety';
const choose = (text: string): Coil => /holandesa|espiral/.test(text) ? 'dutch' : /ocho|cocas|torsi[oó]n/.test(text) ? 'eight' : /r[aá]pid|senos largos|salir/.test(text) ? 'ready' : /seguridad|pies|manos|largar/.test(text) ? 'safety' : 'round';
const COPY: Record<Coil, [string,string]> = {
  round: ['Aduja redonda · a la marinera','Vueltas iguales, torsión descargada y conjunto asegurado para guardar o colgar.'],
  eight: ['Aduja en ocho','Los cruces alternan la curvatura y reducen las cocas al desplegar.'],
  dutch: ['Aduja a la holandesa','Espiral plana para presentación e inspección; no para largado inmediato.'],
  ready: ['Aduja lista para correr','Senos largos sin cruces atrapados y chicote de trabajo accesible.'],
  safety: ['Zona de peligro de una línea','Nunca colocar manos o pies dentro de un seno que pueda tomar carga.']
};

const QUESTION_IMAGES: Record<string, {src:string; alt:string; title:string; detail:string}> = {
  nudo_13: {src:ropeStorageNudo13, alt:'Cabo blanco guardado en vueltas iguales, asegurado y colgado dentro de un pañol náutico', title:'Cabo listo para guardar', detail:'Observá las vueltas regulares, el conjunto sujeto y los dos extremos libres de cocas.'},
  nudo_19: {src:ropeCoilingActionNudo19, alt:'Marinero recogiendo progresivamente un cabo azul en vueltas largas e iguales', title:'Ordenar el cabo mientras se recoge', detail:'Seguí el tramo que llega desde cubierta y cómo cada seno se incorpora al conjunto sin enredos.'},
  nudo_20: {src:securedRoundCoilNudo20, alt:'Aduja circular completa con vueltas iguales, asegurada por varias vueltas y un seno final junto a un gancho', title:'Conjunto asegurado para transportar o colgar', detail:'Observá las vueltas del mismo tamaño, el amarre alrededor del conjunto y el seno final accesible.'},
  nudo_21: {src:figureEightCoilNudo21, alt:'Cabo azul continuo dispuesto sobre cubierta en vueltas con cruces centrales alternados que forman dos ochos amplios', title:'Curvaturas alternadas sobre cubierta', detail:'Seguí el cabo de un chicote al otro y observá cómo cada cruce invierte el sentido de la vuelta.'},
  nudo_22: {src:dutchSpiralCoilNudo22, alt:'Cabo natural completo presentado como una espiral plana y compacta sobre cubierta de teca', title:'Presentación plana para inspeccionar', detail:'Observá el recorrido continuo desde el extremo exterior hasta el centro y la ausencia de vueltas superpuestas.'},
  nudo_23: {src:readyToRunLineNudo23, alt:'Cabo naranja dispuesto en senos largos alternados y sin cruces atrapados, con extremo accesible junto a un pasacabo', title:'Línea preparada para salir clara', detail:'Seguí los senos largos, el extremo accesible y el recorrido despejado hacia el herraje de cubierta.'},
  nudo_24: {src:forcedCoilKinkNudo24, alt:'Marinero forzando una aduja circular mientras el tramo entrante se retuerce y forma una coca antes de llegar a la mano', title:'Torsión acumulada durante el enrollado', detail:'Observá la deformación del tramo entrante cuando se obliga cada vuelta sin dejar girar el cabo.'},
  nudo_25: {src:lineSafetyCheckNudo25, alt:'Línea roja ordenada en senos largos con ambos pies del marinero juntos y completamente fuera de las vueltas', title:'Cubierta despejada antes de largar', detail:'Comprobá que todos los senos estén libres, el chicote sea visible y ambos pies permanezcan fuera del recorrido.'},
};

export const RopeCoilingViewer: React.FC<{context:string; questionId?:string}> = ({context,questionId}) => {
  const questionImage=questionId ? QUESTION_IMAGES[questionId] : undefined;
  if(questionImage) return <figure className="h-full flex flex-col overflow-hidden bg-slate-950"><div className="min-h-0 flex-1 bg-[radial-gradient(circle_at_center,#164e63_0%,#020617_75%)]"><img src={questionImage.src} alt={questionImage.alt} className="h-full w-full object-contain" draggable={false}/></div><figcaption className="shrink-0 border-t border-pink-400/30 bg-slate-900 px-4 py-2"><p className="text-sm font-black text-pink-200">{questionImage.title}</p><p className="text-xs text-slate-300">{questionImage.detail}</p></figcaption></figure>;
  const type=choose(context);
  return <figure className="h-full flex flex-col overflow-hidden bg-slate-950">
    <svg viewBox="0 0 1200 430" className="flex-1 min-h-0 w-full" role="img" aria-label={COPY[type][0]}>
      <defs><linearGradient id="deck" x1="0" x2="1"><stop stopColor="#6b4a31"/><stop offset=".5" stopColor="#3f2b20"/><stop offset="1" stopColor="#765138"/></linearGradient><filter id="ropeShadow"><feDropShadow dx="5" dy="7" stdDeviation="5" floodOpacity=".55"/></filter></defs>
      <rect width="1200" height="430" fill="url(#deck)"/>{[100,220,340,460,580,700,820,940,1060].map(x=><path key={x} d={`M${x} 0 V430`} stroke="#1c1917" strokeWidth="5" opacity=".38"/>)}
      {type==='round' && <g fill="none" stroke="#d6a45d" strokeWidth="22" filter="url(#ropeShadow)">{[165,130,95,60].map(r=><ellipse key={r} cx="600" cy="220" rx={r*1.45} ry={r}/>) }<path d="M815 115 Q875 220 815 326 M815 172 H900 Q940 172 915 210 L840 292"/></g>}
      {type==='eight' && <path d="M600 220 C380 25 260 115 360 220 C455 320 545 285 600 220 C655 155 745 120 840 220 C940 325 820 415 600 220 C380 25 260 115 360 220" fill="none" stroke="#d6a45d" strokeWidth="24" strokeLinecap="round" filter="url(#ropeShadow)"/>}
      {type==='dutch' && <path d="M600 220 C600 175 660 170 680 215 C708 280 625 326 552 298 C445 257 475 130 590 105 C750 70 855 222 785 344" fill="none" stroke="#d6a45d" strokeWidth="23" strokeLinecap="round" filter="url(#ropeShadow)"/>}
      {type==='ready' && <path d="M170 90 C300 90 300 340 430 340 C560 340 560 90 690 90 C820 90 820 340 950 340 L1060 340" fill="none" stroke="#d6a45d" strokeWidth="24" strokeLinecap="round" filter="url(#ropeShadow)"/>}
      {type==='safety' && <><path d="M185 300 C300 70 510 70 600 300 C690 70 900 70 1015 300" fill="none" stroke="#d6a45d" strokeWidth="24" filter="url(#ropeShadow)"/><ellipse cx="405" cy="245" rx="57" ry="95" fill="#0f172a" stroke="#fb7185" strokeWidth="8"/><ellipse cx="735" cy="245" rx="57" ry="95" fill="#0f172a" stroke="#fb7185" strokeWidth="8"/><path d="M320 60 L820 385 M820 60 L320 385" stroke="#ef4444" strokeWidth="15" opacity=".85"/></>}
      <text x="55" y="55" fill="#fdf2f8" fontSize="26" fontWeight="900">CABUYERÍA · CABO ADUJADO</text>
    </svg>
    <figcaption className="shrink-0 border-t border-pink-400/30 bg-slate-900 px-4 py-2"><p className="text-sm font-black text-pink-200">{COPY[type][0]}</p><p className="text-xs text-slate-300">{COPY[type][1]}</p></figcaption>
  </figure>;
};
