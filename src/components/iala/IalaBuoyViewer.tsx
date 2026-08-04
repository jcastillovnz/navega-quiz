import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';

type BuoyType = 'BABOR' | 'ESTRIBOR' | 'PELIGRO_AISLADO' | 'AGUAS_SEGURAS';

interface BuoyInfo {
  name: string;
  colorClass: string;
  topMark: string;
  lightColor: string;
  lightPattern: string;
  description: string;
  stripes?: 'red' | 'white';
}

const BUOY_DATA: Record<BuoyType, BuoyInfo> = {
  BABOR: {
    name: 'Boya de Babor (Región B)',
    colorClass: 'bg-red-500',
    topMark: 'Cilíndrica Roja',
    lightColor: 'glow-red',
    lightPattern: 'animate-flash-single',
    description: 'En IALA B (América), al entrar a puerto la boya de babor es roja. Marca de tope cilíndrica.'
  },
  ESTRIBOR: {
    name: 'Boya de Estribor (Región B)',
    colorClass: 'bg-green-500',
    topMark: 'Cónica Verde',
    lightColor: 'glow-green',
    lightPattern: 'animate-flash-single',
    description: 'En IALA B, al entrar a puerto la boya de estribor es verde. Marca de tope cónica.'
  },
  PELIGRO_AISLADO: {
    name: 'Peligro Aislado',
    colorClass: 'bg-slate-950',
    stripes: 'red',
    topMark: 'Dos Esferas Negras',
    lightColor: 'glow-white',
    lightPattern: 'animate-flash-double',
    description: 'Peligro rodeado de aguas navegables. Franjas rojas horizontales. Luz blanca destellos grupo de 2.'
  },
  AGUAS_SEGURAS: {
    name: 'Aguas Seguras',
    colorClass: 'bg-red-500',
    stripes: 'white',
    topMark: 'Esfera Roja',
    lightColor: 'glow-white',
    lightPattern: 'animate-flash-isophase',
    description: 'Aguas navegables en 360° (ej. eje de canal). Franjas verticales rojas y blancas. Luz isofásica.'
  }
};

export const IalaBuoyViewer: React.FC = () => {
  const [isNight, setIsNight] = useState(true);
  const [selectedBuoy, setSelectedBuoy] = useState<BuoyType>('BABOR');

  const buoy = BUOY_DATA[selectedBuoy];

  return (
    <div className="h-full flex flex-col gap-2 overflow-hidden">
      {/* Controles Superiores */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 shrink-0">
        <button 
          onClick={() => setIsNight(!isNight)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            isNight ? 'bg-indigo-950 text-indigo-200 border border-indigo-800/60' : 'bg-sky-200 text-sky-900'
          }`}
        >
          {isNight ? <Moon size={14} /> : <Sun size={14} />}
          {isNight ? 'Modo Noche' : 'Modo Día'}
        </button>

        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(BUOY_DATA) as BuoyType[]).map(type => (
            <button
              key={type}
              onClick={() => setSelectedBuoy(type)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedBuoy === type 
                  ? 'bg-cyan-500 text-slate-950 shadow-sm' 
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {BUOY_DATA[type].name.split(' (')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Grid en 2 Columnas sin scroll */}
      <div className="grid md:grid-cols-12 gap-3 flex-1 min-h-0 overflow-hidden">
        
        {/* Visual Canvas (7 Cols) */}
        <div className={`md:col-span-7 rounded-2xl overflow-hidden transition-all duration-500 flex flex-col items-center justify-end border relative h-full ${
          isNight ? 'bg-slate-950 border-slate-800' : 'bg-sky-100 border-sky-300'
        }`}>
          <div className={`absolute bottom-0 w-full h-20 transition-all ${isNight ? 'bg-slate-900 border-t border-slate-800' : 'bg-sky-300/70 border-t border-sky-400'}`}></div>

          <div className="relative z-10 flex flex-col items-center pb-6">
            <div className="flex flex-col items-center justify-end h-10 mb-1">
              {selectedBuoy === 'BABOR' && <div className="w-7 h-7 bg-red-500 rounded-sm"></div>}
              {selectedBuoy === 'ESTRIBOR' && <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[28px] border-b-green-500"></div>}
              {selectedBuoy === 'PELIGRO_AISLADO' && (
                <div className="flex flex-col gap-0.5">
                  <div className="w-5 h-5 bg-slate-950 rounded-full"></div>
                  <div className="w-5 h-5 bg-slate-950 rounded-full"></div>
                </div>
              )}
              {selectedBuoy === 'AGUAS_SEGURAS' && <div className="w-7 h-7 bg-red-500 rounded-full"></div>}
            </div>

            {isNight && (
              <div className="absolute top-8 flex items-center justify-center">
                <div className={`w-3 h-3 rounded-full ${buoy.lightColor} ${buoy.lightPattern}`}></div>
              </div>
            )}

            <div className={`relative w-14 h-24 rounded-t-full shadow-lg overflow-hidden ${buoy.colorClass}`}>
              {buoy.stripes === 'red' && (
                <>
                  <div className="absolute top-1/4 w-full h-3 bg-red-500"></div>
                  <div className="absolute top-2/4 w-full h-3 bg-red-500"></div>
                </>
              )}
              {buoy.stripes === 'white' && (
                <div className="absolute inset-0 flex justify-evenly">
                  <div className="w-1.5 h-full bg-white"></div>
                  <div className="w-1.5 h-full bg-white"></div>
                </div>
              )}
            </div>
            <div className="w-16 h-3 bg-slate-900 rounded-full opacity-40 blur-[2px] mt-1"></div>
          </div>
        </div>

        {/* Panel Explicativo (5 Cols) */}
        <div className="md:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between overflow-y-auto h-full">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">{buoy.name}</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">{buoy.description}</p>

            <div className="space-y-2 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Marca de Tope:</span>
                <span className="font-bold text-white">{buoy.topMark}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Luz Nocturna:</span>
                <span className="font-bold text-cyan-400">
                  {isNight ? (buoy.lightColor.includes('red') ? '🔴 Roja' : buoy.lightColor.includes('green') ? '🟢 Verde' : '⚪ Blanca') : 'Solo Noche'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-[11px] text-amber-300 mt-2">
            ⚠️ <strong>Regla Nemotécnica:</strong> En IALA B (Sudamérica) "Rojo a Babor al entrar" (Red Right Returning es solo IALA A).
          </div>
        </div>

      </div>
    </div>
  );
};
