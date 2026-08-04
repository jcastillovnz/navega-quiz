import React, { useState } from 'react';
import { Moon, Sun, Ship } from 'lucide-react';

type Perspective = 'PROA' | 'POPA' | 'BABOR' | 'ESTRIBOR';
type ShipType = 'MOTOR' | 'VELA';

export const RipaLightViewer: React.FC = () => {
  const [isNight, setIsNight] = useState(true);
  const [perspective, setPerspective] = useState<Perspective>('PROA');
  const [shipType, setShipType] = useState<ShipType>('MOTOR');

  const showTope = shipType === 'MOTOR' && (perspective === 'PROA' || perspective === 'BABOR' || perspective === 'ESTRIBOR');
  const showBabor = (perspective === 'PROA' || perspective === 'BABOR');
  const showEstribor = (perspective === 'PROA' || perspective === 'ESTRIBOR');
  const showAlcance = (perspective === 'POPA');

  return (
    <div className="h-full flex flex-col gap-2 overflow-hidden">
      {/* Controles Compactos (Top Bar) */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 shrink-0">
        
        {/* Toggle Día/Noche */}
        <button 
          onClick={() => setIsNight(!isNight)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            isNight ? 'bg-indigo-950 text-indigo-200 border border-indigo-800/60' : 'bg-sky-200 text-sky-900'
          }`}
        >
          {isNight ? <Moon size={14} /> : <Sun size={14} />}
          {isNight ? 'Modo Noche' : 'Modo Día'}
        </button>

        {/* Tipo de Buque */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button 
            onClick={() => setShipType('MOTOR')}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${shipType === 'MOTOR' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            A Motor
          </button>
          <button 
            onClick={() => setShipType('VELA')}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${shipType === 'VELA' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            A Vela
          </button>
        </div>

        {/* Perspectiva */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
          {(['PROA', 'BABOR', 'ESTRIBOR', 'POPA'] as Perspective[]).map(p => (
            <button
              key={p}
              onClick={() => setPerspective(p)}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${perspective === p ? 'bg-slate-800 text-cyan-400 border border-slate-700' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {p.charAt(0) + p.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Grid 2 Columnas (Flex-1 sin scroll global) */}
      <div className="grid md:grid-cols-12 gap-3 flex-1 min-h-0 overflow-hidden">
        
        {/* Columna Visual Canvas (7 Cols) */}
        <div className={`md:col-span-7 rounded-2xl overflow-hidden transition-all duration-500 flex items-center justify-center border relative h-full ${
          isNight ? 'bg-slate-950 border-slate-800' : 'bg-sky-100 border-sky-300'
        }`}>
          {/* Fondo del mar */}
          <div className={`absolute bottom-0 w-full h-1/3 transition-all ${isNight ? 'bg-slate-900/90' : 'bg-sky-300/80'}`}></div>

          {/* El Barco (Silueta) */}
          <div className="relative z-10 flex flex-col items-center">
            <div className={`relative flex items-center justify-center transition-all ${perspective === 'PROA' || perspective === 'POPA' ? 'w-28 h-36' : 'w-56 h-28'}`}>
              <Ship 
                size={perspective === 'PROA' || perspective === 'POPA' ? 100 : 130} 
                className={isNight ? 'text-slate-800' : 'text-slate-500'} 
                style={{
                  transform: perspective === 'BABOR' ? 'scaleX(-1)' : 'none'
                }}
              />

              {/* Luces (Modo Noche) */}
              {isNight && (
                <>
                  {showTope && (
                    <div className="absolute top-2 w-3.5 h-3.5 rounded-full glow-white z-20" style={{
                      left: perspective === 'PROA' ? '50%' : perspective === 'BABOR' ? '30%' : '70%',
                      transform: 'translateX(-50%)'
                    }}></div>
                  )}

                  {showBabor && (
                    <div className="absolute bottom-10 w-3.5 h-3.5 rounded-full glow-red z-20" style={{
                      left: perspective === 'PROA' ? '20%' : perspective === 'BABOR' ? '20%' : '80%',
                      transform: 'translateX(-50%)'
                    }}></div>
                  )}

                  {showEstribor && (
                    <div className="absolute bottom-10 w-3.5 h-3.5 rounded-full glow-green z-20" style={{
                      left: perspective === 'PROA' ? '80%' : perspective === 'ESTRIBOR' ? '80%' : '20%',
                      transform: 'translateX(-50%)'
                    }}></div>
                  )}

                  {showAlcance && (
                    <div className="absolute bottom-12 w-3.5 h-3.5 rounded-full glow-white z-20" style={{
                      left: '50%',
                      transform: 'translateX(-50%)'
                    }}></div>
                  )}
                </>
              )}

              {!isNight && (
                <div className="absolute -top-8 bg-white/90 text-slate-900 text-[10px] px-2 py-0.5 rounded font-extrabold shadow-sm">
                  Vista de Día: {shipType === 'VELA' ? 'Velero' : 'Motor'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Columna Derecha de Análisis (5 Cols) */}
        <div className="md:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between overflow-y-auto h-full">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Análisis de Reglas RIPA</h3>
            <p className="text-xs text-slate-300">
              Observando un <strong>{shipType === 'MOTOR' ? 'Buque a Motor' : 'Buque de Vela'}</strong> desde <strong>{perspective}</strong>.
            </p>

            <div className="mt-4 space-y-2 text-xs">
              {showTope && (
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  ⚪ <strong className="text-white">Luz de Tope (Blanca):</strong> Visible desde proa 225°. Exclusiva para buques a motor.
                </div>
              )}
              {showBabor && (
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  🔴 <strong className="text-rose-400">Luz de Babor (Roja):</strong> Visible 112.5° en la banda izquierda.
                </div>
              )}
              {showEstribor && (
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  🟢 <strong className="text-emerald-400">Luz de Estribor (Verde):</strong> Visible 112.5° en la banda derecha.
                </div>
              )}
              {showAlcance && (
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  ⚪ <strong className="text-white">Luz de Alcance (Blanca):</strong> Visible 135° desde la popa.
                </div>
              )}
            </div>
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/20 p-3 rounded-xl text-[11px] text-cyan-300 mt-2">
            💡 <strong>Tip PNA:</strong> En cruces de noche, si ves la luz roja de otro buque a motor por tu estribor, él tiene paso.
          </div>
        </div>

      </div>
    </div>
  );
};
