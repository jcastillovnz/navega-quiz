import React from 'react';
import ropeStorageNudo13 from '../../assets/knots/rope-storage-nudo-13-v1.png';
import ropeCoilingActionNudo19 from '../../assets/knots/rope-coiling-action-nudo-19-v1.png';
import securedRoundCoilNudo20 from '../../assets/knots/secured-round-coil-nudo-20-v1.png';

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
