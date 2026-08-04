import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ShieldAlert, 
  Anchor, 
  Sparkles,
  Layers
} from 'lucide-react';
import type { KnotData } from '../../types/knots';

interface Props {
  knot: KnotData;
}

export const InteractiveKnotViewer: React.FC<Props> = ({ knot }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showAnatomy, setShowAnatomy] = useState(true);

  const step = knot.steps[currentStep];
  const totalSteps = knot.steps.length;

  const nextStep = () => {
    if (currentStep < totalSteps - 1) setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  return (
    <div className="h-full flex flex-col gap-2 overflow-hidden">
      {/* Mini Bar de Título del Nudo (Compact Header) */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold px-2 py-0.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-md">
            {knot.category}
          </span>
          <h3 className="text-sm font-bold text-white tracking-tight">
            {knot.name} <span className="text-slate-400 font-normal text-xs">({knot.englishName})</span>
          </h3>
        </div>

        <button
          onClick={() => setShowAnatomy(!showAnatomy)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
            showAnatomy 
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' 
              : 'bg-slate-950 border-slate-800 text-slate-400'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          {showAnatomy ? 'Anatomía Visible' : 'Ocultar Etiquetas'}
        </button>
      </div>

      {/* Grid 2 Columnas Principal (Flex-1 sin overflow) */}
      <div className="grid md:grid-cols-12 gap-2.5 flex-1 min-h-0 overflow-hidden">
        
        {/* Columna Izquierda: Visor SVG (7 Cols) */}
        <div className="md:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl relative flex flex-col overflow-hidden h-full">
          
          {/* Canvas SVG Resizable que ocupa el espacio libre */}
          <div className="relative flex-1 w-full h-full min-h-0 flex items-center justify-center p-2">
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:14px_14px] opacity-25" />

            <svg 
              viewBox="0 0 200 200" 
              className="w-full h-full max-h-full max-w-full relative z-10 filter drop-shadow-md"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="chicote-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#0369a1" />
                </linearGradient>

                <linearGradient id="firme-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f87171" />
                  <stop offset="50%" stopColor="#dc2626" />
                  <stop offset="100%" stopColor="#991b1b" />
                </linearGradient>
              </defs>

              {/* Renderizado Capas SVG */}
              {step.svgLayers.map((layer) => (
                <g key={layer.id}>
                  {layer.shadow && (
                    <path
                      d={layer.path}
                      fill="none"
                      stroke="#000000"
                      strokeWidth={layer.strokeWidth + 2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-50"
                      transform="translate(2, 3)"
                    />
                  )}
                  <path
                    d={layer.path}
                    fill="none"
                    stroke={
                      layer.isChicote 
                        ? 'url(#chicote-grad)' 
                        : layer.isFirme 
                          ? 'url(#firme-grad)' 
                          : layer.color
                    }
                    strokeWidth={layer.strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={layer.dashArray || 'none'}
                    className="transition-all duration-300 ease-in-out"
                  />
                </g>
              ))}

              {/* Etiquetas Anatómicas Náuticas */}
              {showAnatomy && (
                <g className="text-[9px] font-extrabold tracking-wider">
                  <text x="8" y="192" fill="#f87171">🔴 FIRME (Tensión)</text>
                  <text x="110" y="192" fill="#38bdf8">🔵 CHICOTE (Extremo libre)</text>
                </g>
              )}
            </svg>
          </div>

          {/* Barra Flotante Inferior de Navegación de Pasos integrada en el canvas */}
          <div className="bg-slate-900/90 border-t border-slate-800 p-2 flex items-center justify-between gap-2 shrink-0">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 text-xs font-bold rounded-lg transition-all border border-slate-700 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-3.5 h-3.5 inline mr-1" /> Anterior
            </button>

            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-400 font-semibold mr-1">
                Paso {currentStep + 1}/{totalSteps}
              </span>
              {knot.steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStep(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentStep 
                      ? 'w-5 bg-cyan-400' 
                      : idx < currentStep 
                        ? 'w-2 bg-cyan-600' 
                        : 'w-2 bg-slate-700'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextStep}
              disabled={currentStep === totalSteps - 1}
              className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 text-slate-950 text-xs font-extrabold rounded-lg transition-all disabled:cursor-not-allowed"
            >
              Siguiente <ChevronRight className="w-3.5 h-3.5 inline ml-1" />
            </button>
          </div>
        </div>

        {/* Columna Derecha: Explicación Pedagógica Compacta (5 Cols) */}
        <div className="md:col-span-5 flex flex-col justify-between gap-2 h-full overflow-hidden">
          
          {/* 1. Instrucción del Paso Actual */}
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex-1 flex flex-col justify-center min-h-0 overflow-hidden">
            <div className="flex items-center gap-1.5 text-cyan-400 text-[10px] font-extrabold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              {step.title}
            </div>
            <p className="text-slate-200 text-xs leading-relaxed font-medium overflow-y-auto">
              {step.instruction}
            </p>
          </div>

          {/* 2. Aplicación Real a Bordo */}
          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex-1 flex flex-col justify-between min-h-0 overflow-hidden">
            <div>
              <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                <Anchor className="w-3.5 h-3.5 text-cyan-400" />
                Uso Práctico a Bordo
              </h4>
              <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
                {knot.realWorldUse.description}
              </p>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80 text-[10px] text-slate-400 mt-1">
              📍 <strong className="text-slate-200">Ubicación:</strong> {knot.realWorldUse.onBoardLocation}
            </div>
          </div>

          {/* 3. Advertencia de Seguridad Náutica */}
          <div className="bg-rose-500/10 border border-rose-500/30 p-2.5 rounded-xl flex items-start gap-2 text-rose-300 shrink-0">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <div>
              <h5 className="text-[10px] font-bold uppercase tracking-wider">Peligro Náutico</h5>
              <p className="text-[11px] text-slate-300 leading-tight">
                {knot.realWorldUse.dangerWarning}
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
