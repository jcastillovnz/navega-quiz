import React from 'react';
import { ArrowDown, ArrowRight, CloudSun, Gauge, Radio, Sun, Waves, Wind } from 'lucide-react';

export type MeteoFocus = 'PRONOSTICO' | 'PRESION' | 'VIENTO' | 'BRISAS' | 'OLEAJE';

const CONTENT: Record<MeteoFocus, { title: string; icon: React.ComponentType<{ className?: string }>; points: string[] }> = {
  PRONOSTICO: { title: 'Pronóstico y actualización', icon: Radio, points: ['Consultar antes de zarpar', 'Actualizar durante la travesía', 'Atender avisos y cambios locales'] },
  PRESION: { title: 'Presión, humedad y temperatura', icon: Gauge, points: ['Isobaras unen igual presión', 'Presión descendente puede anticipar deterioro', 'Barómetro mide presión; higrómetro, humedad'] },
  VIENTO: { title: 'Origen y medición del viento', icon: Wind, points: ['El aire se mueve por diferencias de presión', 'Veleta: dirección', 'Anemómetro: velocidad', 'En el HS, bajas presiones giran en sentido horario'] },
  BRISAS: { title: 'Brisas costeras térmicas', icon: Sun, points: ['Día: mar hacia tierra', 'Noche: tierra hacia mar', 'Se originan por diferente calentamiento de tierra y agua'] },
  OLEAJE: { title: 'Oleaje y escalas', icon: Waves, points: ['El viento transfiere energía al agua', 'Beaufort relaciona viento y estado del mar', 'Douglas clasifica el estado del mar por altura de ola'] }
};

export const MeteorologyConceptViewer: React.FC<{ focus: MeteoFocus }> = ({ focus }) => {
  const content = CONTENT[focus];
  const Icon = content.icon;
  return (
    <div className="h-full min-h-0 p-2 bg-slate-950 flex flex-col gap-2 overflow-hidden">
      <div className="shrink-0 rounded-xl border border-sky-500/30 bg-sky-500/10 p-3 flex items-center gap-2">
        <Icon className="w-5 h-5 text-sky-300" />
        <div><p className="text-[9px] uppercase tracking-widest text-sky-400 font-black">Meteorología aplicada</p><h3 className="text-sm font-black text-white">{content.title}</h3></div>
      </div>
      <div className="flex-1 min-h-0 rounded-2xl border border-slate-800 bg-gradient-to-b from-sky-950/60 to-slate-900 relative overflow-hidden grid place-items-center p-4">
        {focus === 'PRESION' && (
          <div className="relative w-full h-full max-h-64">
            {[0, 1, 2, 3].map(i => <div key={i} className="absolute rounded-[50%] border-2 border-cyan-400/50" style={{ inset: `${i * 11 + 8}%` }} />)}
            <div className="absolute inset-0 grid place-items-center"><div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-400 grid place-items-center"><span className="text-2xl font-black text-rose-300">B</span></div></div>
            <div className="absolute right-3 top-3 text-[10px] text-cyan-200">Isobaras más juntas = mayor gradiente y viento</div>
          </div>
        )}
        {focus === 'VIENTO' && (
          <div className="flex items-center justify-center gap-5 w-full">
            <div className="w-24 h-24 rounded-full border-2 border-rose-400 bg-rose-500/10 grid place-items-center text-center"><span className="text-xs font-black text-rose-300">ALTA<br/>PRESIÓN</span></div>
            <div className="flex flex-col items-center"><ArrowRight className="w-16 h-16 text-cyan-300 animate-pulse"/><span className="text-[10px] text-slate-300">movimiento del aire</span></div>
            <div className="w-24 h-24 rounded-full border-2 border-blue-400 bg-blue-500/10 grid place-items-center text-center"><span className="text-xs font-black text-blue-300">BAJA<br/>PRESIÓN</span></div>
          </div>
        )}
        {focus === 'BRISAS' && (
          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 p-3 text-center"><Sun className="w-8 h-8 text-amber-300 mx-auto"/><p className="text-xs font-black text-white mt-2">Día · brisa marina</p><p className="text-[10px] text-cyan-200">Mar → Tierra</p><ArrowRight className="w-12 h-12 text-cyan-300 mx-auto"/></div>
            <div className="rounded-xl border border-indigo-400/30 bg-indigo-500/10 p-3 text-center"><CloudSun className="w-8 h-8 text-indigo-300 mx-auto"/><p className="text-xs font-black text-white mt-2">Noche · brisa terrestre</p><p className="text-[10px] text-cyan-200">Tierra → Mar</p><ArrowRight className="w-12 h-12 text-cyan-300 mx-auto rotate-180"/></div>
          </div>
        )}
        {focus === 'OLEAJE' && (
          <div className="w-full text-center"><Wind className="w-12 h-12 text-cyan-300 mx-auto animate-pulse"/><ArrowDown className="w-8 h-8 text-slate-400 mx-auto"/><div className="flex justify-center gap-1 items-end h-24">{[30,50,70,48,64,38].map((h,i)=><div key={i} className="w-10 rounded-t-full bg-cyan-500/50 border-t border-cyan-300" style={{height:h}}/>)}</div><p className="text-[10px] text-slate-300 mt-2">Intensidad · duración · fetch determinan el oleaje generado</p></div>
        )}
        {focus === 'PRONOSTICO' && (
          <div className="grid grid-cols-3 gap-3 w-full">{['Antes de zarpar','Durante la navegación','Ante un aviso'].map((text,i)=><div key={text} className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3 text-center"><Radio className={`w-8 h-8 mx-auto ${i===2?'text-rose-300':'text-cyan-300'}`}/><p className="text-[10px] font-black text-white mt-2">{text}</p></div>)}</div>
        )}
      </div>
      <div className="shrink-0 grid grid-cols-2 gap-1.5">{content.points.map(point => <div key={point} className="rounded-lg border border-slate-800 bg-slate-900 px-2 py-1.5 text-[10px] text-slate-300">• {point}</div>)}</div>
    </div>
  );
};
