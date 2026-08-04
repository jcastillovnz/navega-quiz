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
    <div className="flex flex-col gap-5 w-full max-w-5xl mx-auto">
      {/* Header del Nudo */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl backdrop-blur-md shadow-lg">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xs font-bold px-2.5 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full">
              {knot.category}
            </span>
            <span className="text-xs font-medium text-slate-400">
              Dificultad: <strong className="text-slate-200">{knot.difficulty}</strong>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {knot.name} <span className="text-slate-400 text-lg font-normal">({knot.englishName})</span>
          </h2>
          <p className="text-sm text-cyan-300/90 mt-1 flex items-center gap-1.5 font-medium">
            <Anchor className="w-4 h-4 shrink-0" />
            {knot.realWorldUse.title}
          </p>
        </div>

        {/* Toggle de Anatomía */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAnatomy(!showAnatomy)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              showAnatomy 
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-md' 
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            {showAnatomy ? 'Anatomía Visible' : 'Ocultar Etiquetas'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Visor Visual SVG Fotorrealista (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center">
            
            {/* Grilla técnica náutica de fondo */}
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />

            {/* SVG Render con Sombras y Capas 3D */}
            <svg 
              viewBox="0 0 200 200" 
              className="w-full h-full p-4 relative z-10 filter drop-shadow-xl"
            >
              <defs>
                {/* Degradados de Volumen de Cabo */}
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

              {/* Renderizado Capa por Capa */}
              {step.svgLayers.map((layer) => (
                <g key={layer.id}>
                  {/* Sombra proyectada */}
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
                  {/* Cabo Principal */}
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
                    className="transition-all duration-500 ease-in-out"
                  />
                </g>
              ))}

              {/* Etiquetas Anatómicas Náuticas */}
              {showAnatomy && (
                <g className="animate-fade-in text-[10px] font-extrabold tracking-wider">
                  <text x="12" y="185" fill="#f87171" className="drop-shadow-md">🔴 FIRME (Tensión)</text>
                  <text x="110" y="185" fill="#38bdf8" className="drop-shadow-md">🔵 CHICOTE (Extremo libre)</text>
                </g>
              )}
            </svg>

            {/* Contador de Pasos */}
            <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs font-semibold text-slate-300">
              Paso <span className="text-cyan-400 font-bold">{currentStep + 1}</span> de {totalSteps}
            </div>
          </div>

          {/* Barra de Progreso e Interacción Paso a Paso */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-bold rounded-xl transition-all border border-slate-700 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" /> Anterior
              </button>

              <div className="flex items-center gap-1.5">
                {knot.steps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentStep(idx)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      idx === currentStep 
                        ? 'w-8 bg-cyan-400 shadow-lg shadow-cyan-500/50' 
                        : idx < currentStep 
                          ? 'w-2.5 bg-cyan-600' 
                          : 'w-2.5 bg-slate-700'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextStep}
                disabled={currentStep === totalSteps - 1}
                className="flex items-center gap-1.5 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 text-xs font-extrabold rounded-xl transition-all shadow-md shadow-cyan-900/30 cursor-pointer disabled:cursor-not-allowed"
              >
                Siguiente <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Explicación Pedagógica y Advertencias de Seguridad (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Instrucción del Paso Actual */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden shadow-md">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              {step.title}
            </div>
            
            <p className="text-slate-200 text-sm leading-relaxed font-medium">
              {step.instruction}
            </p>
          </div>

          {/* Aplicación Real a Bordo */}
          <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-md">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Anchor className="w-4 h-4 text-cyan-400" />
              Uso Práctico a Bordo
            </h4>
            
            <p className="text-xs text-slate-300 leading-relaxed">
              {knot.realWorldUse.description}
            </p>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-400">
              📍 <strong className="text-slate-200">Ubicación clave:</strong> {knot.realWorldUse.onBoardLocation}
            </div>
          </div>

          {/* Advertencia de Seguridad (PNA) */}
          <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-2xl flex items-start gap-3 shadow-md">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-rose-300 uppercase tracking-wide">
                ¡Peligro de Mal Uso Náutico!
              </h5>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {knot.realWorldUse.dangerWarning}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
