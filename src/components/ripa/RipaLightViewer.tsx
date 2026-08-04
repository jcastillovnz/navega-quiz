import React, { useState } from 'react';
import { Moon, Sun, Ship } from 'lucide-react';

type Perspective = 'PROA' | 'POPA' | 'BABOR' | 'ESTRIBOR';
type ShipType = 'MOTOR' | 'VELA';

export const RipaLightViewer: React.FC = () => {
  const [isNight, setIsNight] = useState(true);
  const [perspective, setPerspective] = useState<Perspective>('PROA');
  const [shipType, setShipType] = useState<ShipType>('MOTOR');

  // Funciones para determinar qué luces mostrar según la perspectiva y el tipo de buque
  const showTope = shipType === 'MOTOR' && (perspective === 'PROA' || perspective === 'BABOR' || perspective === 'ESTRIBOR');
  const showBabor = (perspective === 'PROA' || perspective === 'BABOR');
  const showEstribor = (perspective === 'PROA' || perspective === 'ESTRIBOR');
  const showAlcance = (perspective === 'POPA');

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto p-4">
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

        {/* Tipo de Buque */}
        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700">
          <button 
            onClick={() => setShipType('MOTOR')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${shipType === 'MOTOR' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            A Motor
          </button>
          <button 
            onClick={() => setShipType('VELA')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${shipType === 'VELA' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            A Vela
          </button>
        </div>

        {/* Perspectiva */}
        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700">
          {(['PROA', 'BABOR', 'ESTRIBOR', 'POPA'] as Perspective[]).map(p => (
            <button
              key={p}
              onClick={() => setPerspective(p)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${perspective === p ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {p.charAt(0) + p.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Visor Visual */}
      <div className={`relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden transition-all duration-700 flex items-center justify-center border ${isNight ? 'bg-slate-950 border-slate-800' : 'bg-sky-100 border-sky-300'}`}>
        
        {/* Fondo del mar (Horizonte) */}
        <div className={`absolute bottom-0 w-full h-1/3 transition-all duration-700 ${isNight ? 'bg-slate-900' : 'bg-sky-300'}`}></div>

        {/* El Barco (Silueta) */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Silueta abstracta del barco */}
          <div className={`relative flex items-center justify-center transition-all duration-300 ${perspective === 'PROA' || perspective === 'POPA' ? 'w-32 h-40' : 'w-64 h-32'}`}>
            <Ship 
              size={perspective === 'PROA' || perspective === 'POPA' ? 120 : 160} 
              className={isNight ? 'text-slate-800' : 'text-slate-500'} 
              style={{
                transform: perspective === 'BABOR' ? 'scaleX(-1)' : 'none'
              }}
            />

            {/* Luces (Solo visibles de noche) */}
            {isNight && (
              <>
                {/* Luz de Tope (Blanca, 225°) - Solo motor */}
                {showTope && (
                  <div className="absolute top-4 w-4 h-4 rounded-full glow-white z-20" style={{
                    left: perspective === 'PROA' ? '50%' : perspective === 'BABOR' ? '30%' : '70%',
                    transform: 'translateX(-50%)'
                  }}></div>
                )}

                {/* Luz de Babor (Roja, 112.5°) */}
                {showBabor && (
                  <div className="absolute bottom-12 w-4 h-4 rounded-full glow-red z-20" style={{
                    left: perspective === 'PROA' ? '20%' : perspective === 'BABOR' ? '20%' : '80%',
                    transform: 'translateX(-50%)'
                  }}></div>
                )}

                {/* Luz de Estribor (Verde, 112.5°) */}
                {showEstribor && (
                  <div className="absolute bottom-12 w-4 h-4 rounded-full glow-green z-20" style={{
                    left: perspective === 'PROA' ? '80%' : perspective === 'ESTRIBOR' ? '80%' : '20%',
                    transform: 'translateX(-50%)'
                  }}></div>
                )}

                {/* Luz de Alcance (Blanca, 135°) */}
                {showAlcance && (
                  <div className="absolute bottom-16 w-4 h-4 rounded-full glow-white z-20" style={{
                    left: '50%',
                    transform: 'translateX(-50%)'
                  }}></div>
                )}
              </>
            )}
            
            {/* Modo Día: Mostrar Marcas Diurnas si fuera un pesquero, fondeado, etc. (Simplificado para Motor/Vela) */}
            {!isNight && (
              <div className="absolute -top-10 bg-white/80 backdrop-blur-sm text-slate-800 text-xs px-2 py-1 rounded-md font-bold shadow-sm">
                Vista de Día: {shipType === 'VELA' ? 'Velas Izadas' : 'Buque a Motor'}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Explicación Técnica */}
      <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 text-slate-300">
        <h3 className="text-xl font-bold text-white mb-2">Análisis RIPA</h3>
        <p className="text-sm">
          Estás observando un <strong>{shipType === 'MOTOR' ? 'Buque de Propulsión Mecánica' : 'Buque de Vela'}</strong> en navegación, visto desde <strong>{perspective}</strong>.
        </p>
        <ul className="mt-3 space-y-1 text-sm">
          {showTope && <li>⚪ <strong>Luz de Tope (Blanca)</strong>: Visible desde proa hasta 22.5° a popa del través en ambas bandas (225° total). Los veleros NO la llevan.</li>}
          {showBabor && <li>🔴 <strong>Luz de Costado Babor (Roja)</strong>: Visible 112.5° desde proa.</li>}
          {showEstribor && <li>🟢 <strong>Luz de Costado Estribor (Verde)</strong>: Visible 112.5° desde proa.</li>}
          {showAlcance && <li>⚪ <strong>Luz de Alcance (Blanca)</strong>: Visible 135° exactamente desde popa.</li>}
        </ul>
      </div>

    </div>
  );
};
