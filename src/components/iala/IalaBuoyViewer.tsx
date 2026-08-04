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
    description: 'En IALA Región B (América), al entrar a puerto, la boya de babor es roja. Su marca de tope es un cilindro.'
  },
  ESTRIBOR: {
    name: 'Boya de Estribor (Región B)',
    colorClass: 'bg-green-500',
    topMark: 'Cónica Verde',
    lightColor: 'glow-green',
    lightPattern: 'animate-flash-single',
    description: 'En IALA Región B, al entrar a puerto, la boya de estribor es verde. Su marca de tope es un cono.'
  },
  PELIGRO_AISLADO: {
    name: 'Peligro Aislado',
    colorClass: 'bg-slate-900', // Negro
    stripes: 'red',
    topMark: 'Dos Esferas Negras',
    lightColor: 'glow-white',
    lightPattern: 'animate-flash-double',
    description: 'Indica un peligro de poca extensión rodeado de aguas navegables. Franjas rojas horizontales sobre fondo negro. Luz blanca con destellos en grupo de 2.'
  },
  AGUAS_SEGURAS: {
    name: 'Aguas Seguras',
    colorClass: 'bg-red-500',
    stripes: 'white',
    topMark: 'Esfera Roja',
    lightColor: 'glow-white',
    lightPattern: 'animate-flash-isophase',
    description: 'Indica que hay aguas navegables alrededor de la marca (ej. eje de un canal). Franjas verticales rojas y blancas. Luz blanca con ritmo isofásico o de ocultación.'
  }
};

export const IalaBuoyViewer: React.FC = () => {
  const [isNight, setIsNight] = useState(true);
  const [selectedBuoy, setSelectedBuoy] = useState<BuoyType>('BABOR');

  const buoy = BUOY_DATA[selectedBuoy];

  return (
    <div className="flex flex-col gap-3 w-full max-w-full mx-auto p-1">
      {/* Controles */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-slate-800 p-4 rounded-xl border border-slate-700">
        
        {/* Toggle Día/Noche */}
        <button 
          onClick={() => setIsNight(!isNight)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${isNight ? 'bg-indigo-900 text-indigo-200' : 'bg-sky-200 text-sky-800'}`}
        >
          {isNight ? <Moon size={20} /> : <Sun size={20} />}
          {isNight ? 'Modo Noche' : 'Modo Día'}
        </button>

        {/* Tipo de Boya */}
        <div className="flex flex-wrap gap-2">
          {(Object.keys(BUOY_DATA) as BuoyType[]).map(type => (
            <button
              key={type}
              onClick={() => setSelectedBuoy(type)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${selectedBuoy === type ? 'bg-cyan-600 text-white shadow-md' : 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-slate-200'}`}
            >
              {BUOY_DATA[type].name.split(' (')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Visor Visual */}
      <div className={`relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden transition-all duration-700 flex flex-col items-center justify-end border ${isNight ? 'bg-slate-950 border-slate-800' : 'bg-sky-100 border-sky-300'}`}>
        
        {/* Fondo del mar (Agua) */}
        <div className={`absolute bottom-0 w-full h-24 transition-all duration-700 ${isNight ? 'bg-slate-900 border-t border-slate-800' : 'bg-sky-300/60 border-t border-sky-400/50'}`}></div>

        {/* Renderizado de la Boya */}
        <div className="relative z-10 flex flex-col items-center pb-8 animate-[bounce_3s_ease-in-out_infinite]">
          
          {/* Marca de Tope (Top Mark) */}
          <div className="flex flex-col items-center justify-end h-12 mb-1">
            {selectedBuoy === 'BABOR' && (
              <div className="w-8 h-8 bg-red-500 rounded-sm"></div> // Cilindro
            )}
            {selectedBuoy === 'ESTRIBOR' && (
              <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[32px] border-b-green-500"></div> // Cono
            )}
            {selectedBuoy === 'PELIGRO_AISLADO' && (
              <div className="flex flex-col gap-1">
                <div className="w-6 h-6 bg-slate-900 rounded-full"></div>
                <div className="w-6 h-6 bg-slate-900 rounded-full"></div>
              </div>
            )}
            {selectedBuoy === 'AGUAS_SEGURAS' && (
              <div className="w-8 h-8 bg-red-500 rounded-full"></div> // Esfera
            )}
          </div>
          
          {/* Luz (Noche) */}
          {isNight && (
            <div className="absolute top-10 flex items-center justify-center">
              <div className={`w-3 h-3 rounded-full ${buoy.lightColor} ${buoy.lightPattern}`}></div>
            </div>
          )}

          {/* Cuerpo de la Boya */}
          <div className={`relative w-16 h-28 rounded-t-full shadow-xl overflow-hidden ${buoy.colorClass}`}>
            {/* Franjas horizontales (Peligro Aislado) */}
            {buoy.stripes === 'red' && (
              <>
                <div className="absolute top-1/4 w-full h-4 bg-red-500"></div>
                <div className="absolute top-2/4 w-full h-4 bg-red-500"></div>
              </>
            )}
            {/* Franjas verticales (Aguas Seguras) */}
            {buoy.stripes === 'white' && (
              <div className="absolute inset-0 flex justify-evenly">
                <div className="w-2 h-full bg-white"></div>
                <div className="w-2 h-full bg-white"></div>
                <div className="w-2 h-full bg-white"></div>
              </div>
            )}
          </div>
          {/* Base en el agua */}
          <div className="w-20 h-4 bg-slate-800 rounded-full opacity-50 blur-[2px] mt-2"></div>
        </div>
      </div>

      {/* Explicación Técnica */}
      <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 text-slate-300">
        <h3 className="text-xl font-bold text-white mb-2">{buoy.name}</h3>
        <p className="text-sm mb-3 text-slate-400">{buoy.description}</p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="text-sm px-2 py-1 bg-slate-700 rounded border border-slate-600 w-24 text-center">Marca Tope</span>
            <span className="text-sm text-slate-300 font-medium">{buoy.topMark}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm px-2 py-1 bg-slate-700 rounded border border-slate-600 w-24 text-center">Luz Nocturna</span>
            <span className="text-sm text-slate-300 font-medium">
              {isNight ? (
                <span className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${buoy.lightColor} ${buoy.lightPattern}`}></div>
                  {buoy.lightColor.includes('red') ? 'Roja' : buoy.lightColor.includes('green') ? 'Verde' : 'Blanca'} ({buoy.lightPattern.split('-')[2]})
                </span>
              ) : (
                "Solo visible de noche"
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
