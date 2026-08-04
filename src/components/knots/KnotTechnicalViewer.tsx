import React from 'react';
import type { VisualFamily } from '../../data/visualManifest';

export type KnotFamily=Extract<VisualFamily,'KNOT_BOWLINE'|'KNOT_REEF'|'KNOT_CLOVE'|'KNOT_SHEET_BEND'|'KNOT_FIGURE_EIGHT'|'KNOT_ANCHOR_BEND'>;
const INFO:Record<KnotFamily,[string,string,string]>={
  KNOT_BOWLINE:['As de guía','Gaza fija','Seguí firme → coca → rodeo del firme → regreso por la coca.'],
  KNOT_REEF:['Nudo llano','Ligada o rizo','Dos medios nudos opuestos; los dos chicotes salen paralelos a sus firmes.'],
  KNOT_CLOVE:['Ballestrinque','Amarre temporal','Dos vueltas cruzadas al soporte; asegurar si la carga cambia.'],
  KNOT_SHEET_BEND:['Vuelta de escota','Cabos de distinta mena','El fino rodea el seno del grueso y muerde debajo de sí mismo.'],
  KNOT_FIGURE_EIGHT:['Nudo de ocho','Tope de chicote','El chicote rodea el firme y vuelve cruzando para dibujar un ocho.'],
  KNOT_ANCHOR_BEND:['Vuelta de ancla','Afirmar a un arganeo','Dos vueltas por la anilla, vuelta alrededor del firme y remate seguro.']
};
export const KnotTechnicalViewer:React.FC<{family:KnotFamily}>=({family})=>{
 const [name,use,detail]=INFO[family]; const rope='#e9a84c', rope2='#38bdf8';
 return <figure className="h-full flex flex-col overflow-hidden bg-slate-950"><svg viewBox="0 0 1200 430" className="flex-1 min-h-0 w-full" role="img" aria-label={`${name}: recorrido completo del cabo`}>
  <defs><linearGradient id="knotDeck"><stop stopColor="#513724"/><stop offset="1" stopColor="#241810"/></linearGradient><filter id="knotShadow"><feDropShadow dx="4" dy="6" stdDeviation="4" floodOpacity=".65"/></filter></defs><rect width="1200" height="430" fill="url(#knotDeck)"/>{[100,260,420,580,740,900,1060].map(x=><path key={x} d={`M${x} 0V430`} stroke="#0c0a09" strokeWidth="5" opacity=".35"/>)}
  {family==='KNOT_BOWLINE'&&<><path d="M80 335 H405 C555 335 565 85 760 85 C955 85 965 335 795 335 C675 335 615 245 675 190 C745 125 850 205 810 275 C770 340 665 315 645 255 C625 195 695 165 760 170 L1115 170" fill="none" stroke={rope} strokeWidth="28" strokeLinecap="round" filter="url(#knotShadow)"/><circle cx="690" cy="235" r="94" fill="none" stroke="#67e8f9" strokeWidth="4" strokeDasharray="10 10"/></>}
  {family==='KNOT_REEF'&&<><path d="M70 120 C330 120 410 330 600 215 C750 125 870 120 1130 120" fill="none" stroke={rope} strokeWidth="28"/><path d="M70 330 C330 330 415 120 600 225 C760 315 875 330 1130 330" fill="none" stroke={rope2} strokeWidth="28"/><path d="M500 170 Q600 225 700 170 M500 280 Q600 225 700 280" fill="none" stroke="#f8fafc" strokeOpacity=".35" strokeWidth="4"/></>}
  {family==='KNOT_CLOVE'&&<><rect x="545" y="35" width="110" height="360" rx="48" fill="#64748b" stroke="#cbd5e1" strokeWidth="7"/><path d="M80 330 C330 330 400 120 600 120 C800 120 870 330 1120 330 M80 120 C330 120 400 330 600 330 C800 330 870 120 1120 120" fill="none" stroke={rope} strokeWidth="27" filter="url(#knotShadow)"/></>}
  {family==='KNOT_SHEET_BEND'&&<><path d="M80 95 C435 95 500 100 580 215 C500 330 435 335 80 335" fill="none" stroke={rope} strokeWidth="34" strokeLinecap="round"/><path d="M1110 330 C820 330 725 285 670 215 C725 145 820 100 1110 100 M670 215 C620 175 590 135 610 100" fill="none" stroke={rope2} strokeWidth="24" strokeLinecap="round"/></>}
  {family==='KNOT_FIGURE_EIGHT'&&<path d="M75 330 C350 330 430 80 650 105 C850 125 890 325 690 335 C505 345 470 195 610 190 C750 185 770 65 1120 65" fill="none" stroke={rope} strokeWidth="29" strokeLinecap="round" filter="url(#knotShadow)"/>}
  {family==='KNOT_ANCHOR_BEND'&&<><circle cx="370" cy="220" r="128" fill="none" stroke="#94a3b8" strokeWidth="42"/><path d="M1110 100 H650 C500 100 470 175 520 235 C575 300 700 285 705 210 C710 140 620 115 555 145 C445 198 500 330 650 330 H1110 M730 330 C690 280 710 245 770 220" fill="none" stroke={rope} strokeWidth="27" strokeLinecap="round" filter="url(#knotShadow)"/></>}
  <g transform="translate(65 45)"><rect width="235" height="55" rx="12" fill="#020617" fillOpacity=".85" stroke="#f9a8d4"/><text x="18" y="23" fill="#f9a8d4" fontSize="15" fontWeight="900">RECORRIDO DEL CABO</text><text x="18" y="43" fill="#e2e8f0" fontSize="14">firme · seno · chicote</text></g>
 </svg><figcaption className="shrink-0 border-t border-pink-400/30 bg-slate-900 px-4 py-2"><div className="flex items-baseline gap-2"><p className="text-sm font-black text-pink-200">{name}</p><span className="text-[10px] font-bold text-amber-300">{use}</span></div><p className="text-xs text-slate-300">{detail}</p></figcaption></figure>
};
