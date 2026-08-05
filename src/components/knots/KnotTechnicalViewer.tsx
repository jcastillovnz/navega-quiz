import React, { useEffect, useState } from 'react';
import type { VisualFamily } from '../../data/visualManifest';
import anchorBendPlate from '../../assets/knots/anchor-bend-steps-v1.webp';
import bowlineStep1 from '../../assets/knots/bowline-guide-step-1-v3.webp';
import bowlineStep2 from '../../assets/knots/bowline-guide-step-2-v3.webp';
import bowlineStep3 from '../../assets/knots/bowline-guide-step-3-v3.webp';
import bowlineStep4 from '../../assets/knots/bowline-guide-step-4-v3.webp';
import bowlineStep5 from '../../assets/knots/bowline-guide-step-5-v3.webp';
import cloveHitchPlate from '../../assets/knots/clove-hitch-steps-v1.webp';
import figureEightPlate from '../../assets/knots/figure-eight-steps-v1.webp';
import reefKnotNudo2 from '../../assets/knots/reef-knot-nudo-2-v2.webp';
import reefKnotPlate from '../../assets/knots/reef-knot-steps-v1.webp';
import sheetBendPlate from '../../assets/knots/sheet-bend-steps-v1.webp';

export type KnotFamily = Extract<VisualFamily,
  'KNOT_BOWLINE' | 'KNOT_REEF' | 'KNOT_CLOVE' | 'KNOT_SHEET_BEND' | 'KNOT_FIGURE_EIGHT' | 'KNOT_ANCHOR_BEND'
>;

type KnotGuide = {
  name: string;
  use: string;
  image: string;
  stepImages?: string[];
  alt: string;
  steps: string[];
  directions?: string[];
  layout?: 'strip' | 'grid';
};

const GUIDES: Record<KnotFamily, KnotGuide> = {
  KNOT_BOWLINE: {
    name: 'As de guía',
    use: 'Gaza fija que no se corre',
    image: bowlineStep1,
    stepImages: [bowlineStep1, bowlineStep2, bowlineStep3, bowlineStep4, bowlineStep5],
    alt: 'Cinco fotografías verificadas para formar un as de guía con un único cabo',
    steps: ['Giralo para formar la coca', 'Dejá la coca abierta', 'Sacá el chicote por la coca', 'Rodeá el firme por detrás', 'Volvé por la coca y ajustá'],
    directions: ['↻', '○', '↑', '↶', '↓'],
  },
  KNOT_REEF: {
    name: 'Nudo llano',
    use: 'Unir cabos de igual mena',
    image: reefKnotPlate,
    alt: 'Cuatro fotografías consecutivas para formar un nudo llano con dos cabos de distinto color',
    steps: ['Cruzá ambos cabos', 'Hacé el primer medio nudo', 'Invertí el segundo cruce', 'Vestí el nudo plano'],
    layout: 'grid',
  },
  KNOT_CLOVE: {
    name: 'Ballestrinque',
    use: 'Amarre temporal a un soporte',
    image: cloveHitchPlate,
    alt: 'Cuatro fotografías consecutivas para formar un ballestrinque alrededor de un poste de acero',
    steps: ['Rodeá el soporte', 'Cruzá sobre la vuelta', 'Pasá bajo el cruce', 'Ajustá ambas vueltas'],
  },
  KNOT_SHEET_BEND: {
    name: 'Vuelta de escota',
    use: 'Unir cabos de distinta mena',
    image: sheetBendPlate,
    alt: 'Cuatro fotografías consecutivas para formar una vuelta de escota con un cabo grueso azul y uno fino naranja',
    steps: ['Formá un seno grueso', 'Entrá con el cabo fino', 'Rodeá ambos brazos', 'Mordé bajo el propio cabo'],
  },
  KNOT_FIGURE_EIGHT: {
    name: 'Nudo de ocho',
    use: 'Tope para impedir que escape el chicote',
    image: figureEightPlate,
    alt: 'Cuatro fotografías consecutivas para formar un nudo de ocho siguiendo el chicote naranja',
    steps: ['Formá una vuelta', 'Rodeá el firme', 'Entrá por la coca', 'Vestí la figura de ocho'],
  },
  KNOT_ANCHOR_BEND: {
    name: 'Vuelta de ancla',
    use: 'Afirmar un cabo al arganeo',
    image: anchorBendPlate,
    alt: 'Cuatro fotografías consecutivas para formar una vuelta de ancla sobre un arganeo de acero',
    steps: ['Dá dos vueltas al arganeo', 'Cruzá sobre el firme', 'Pasá entre vueltas y arganeo', 'Rematá con medio cote'],
  },
};

const stripPosition = ['0%', '33.333%', '66.666%', '100%'];
const gridPosition = ['0% 0%', '100% 0%', '0% 100%', '100% 100%'];

export const KnotTechnicalViewer: React.FC<{ family: KnotFamily; questionId?: string }> = ({ family, questionId }) => {
  const guide = GUIDES[family];
  const focusStep = questionId ? Number(questionId.replace(/\D/g, '')) % 4 : 3;
  const [selectedStep, setSelectedStep] = useState(0);

  useEffect(() => setSelectedStep(0), [family, questionId]);

  if (questionId === 'nudo_2') {
    return (
      <figure className="h-full min-h-0 overflow-hidden bg-[#17110d] flex flex-col" aria-label="Unión simétrica de dos cabos de igual diámetro">
        <div className="min-h-0 flex-1">
          <img
            src={reefKnotNudo2}
            alt="Dos cabos trenzados de igual diámetro unidos en un nudo plano y simétrico, con los extremos de cada cabo paralelos"
            className="h-full w-full object-contain"
            draggable={false}
          />
        </div>
        <figcaption className="shrink-0 border-t border-pink-400/30 bg-slate-900 px-3 py-1.5 text-center text-[10px] font-bold text-slate-200">
          Observá el recorrido, la simetría y la salida paralela de los chicotes.
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className="h-full min-h-0 overflow-hidden bg-slate-950 flex flex-col" aria-label={`${guide.name}: guía visual paso a paso`}>
      <div className="relative min-h-0 flex-1 bg-[#17110d]">
        {guide.stepImages ? (
          <div className="relative flex h-full items-center justify-center bg-[radial-gradient(circle_at_center,#3b2a1f_0%,#17110d_62%)] px-16 sm:px-28">
            <img
              src={guide.stepImages[selectedStep]}
              alt={`Paso ${selectedStep + 1} de ${guide.steps.length}: ${guide.steps[selectedStep]}`}
              className="h-full max-h-full w-auto max-w-full object-contain"
              draggable={false}
            />
            <div className="absolute left-1/2 top-2 flex -translate-x-1/2 gap-1 rounded-full border border-slate-600 bg-slate-950/90 p-1" aria-label="Elegir paso del As de Guía">
              {guide.steps.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedStep(index)}
                  className={`grid h-7 w-7 place-items-center rounded-full text-[11px] font-black ${selectedStep === index ? 'bg-amber-300 text-slate-950' : 'text-slate-300 hover:bg-slate-800'}`}
                  aria-label={`Ver paso ${index + 1}`}
                  aria-current={selectedStep === index ? 'step' : undefined}
                >{index + 1}</button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setSelectedStep(step => Math.max(0, step - 1))}
              disabled={selectedStep === 0}
              className="absolute left-3 grid h-10 w-10 place-items-center rounded-full border border-slate-500 bg-slate-950/90 text-xl font-black text-white disabled:opacity-25"
              aria-label="Paso anterior"
            >‹</button>
            <button
              type="button"
              onClick={() => setSelectedStep(step => Math.min(guide.steps.length - 1, step + 1))}
              disabled={selectedStep === guide.steps.length - 1}
              className="absolute right-3 grid h-10 w-10 place-items-center rounded-full border border-slate-500 bg-slate-950/90 text-xl font-black text-white disabled:opacity-25"
              aria-label="Paso siguiente"
            >›</button>
            <div className="absolute inset-x-0 bottom-2 flex justify-center">
              <span className="rounded-full border border-amber-300/60 bg-slate-950/90 px-3 py-1 text-[11px] font-bold text-white">
                <span className="mr-1 text-amber-300">{selectedStep + 1}/{guide.steps.length}</span>{guide.steps[selectedStep]}
              </span>
            </div>
          </div>
        ) : (
        <div className="flex h-full snap-x snap-mandatory overflow-x-auto sm:grid sm:grid-cols-4 sm:overflow-hidden" aria-label="Deslizá para observar los cuatro pasos">
          {guide.steps.map((step, index) => (
            <div
              key={step}
              className="relative h-full min-w-[88vw] snap-center border-r border-white/20 bg-cover bg-no-repeat sm:min-w-0"
              style={{
                backgroundImage: `url(${guide.image})`,
                backgroundSize: guide.layout === 'grid' ? '200% 200%' : '400% 100%',
                backgroundPosition: guide.layout === 'grid' ? gridPosition[index] : `${stripPosition[index]} center`,
              }}
              role="img"
              aria-label={`Paso ${index + 1}: ${step}`}
            >
              <span className={`absolute left-3 top-3 grid h-8 w-8 place-items-center rounded-full border text-sm font-black shadow-lg ${index === focusStep ? 'border-amber-300 bg-amber-300 text-slate-950' : 'border-white/50 bg-slate-950/90 text-white'}`}>
                {index + 1}
              </span>
              {guide.directions?.[index] && (
                <span className="absolute right-3 top-2 text-4xl font-black text-amber-300 [text-shadow:0_2px_8px_#000]" aria-hidden="true">
                  {guide.directions[index]}
                </span>
              )}
              <span className="absolute inset-x-2 bottom-2 rounded-md border border-white/20 bg-slate-950/90 px-2 py-1 text-center text-[10px] font-bold text-white sm:hidden">
                {step}
              </span>
            </div>
          ))}
        </div>
        )}
      </div>

      <figcaption className="shrink-0 border-t border-pink-400/30 bg-slate-900 px-2 py-1.5">
        <div className="mb-1 flex items-baseline justify-between gap-2">
          <p className="text-xs font-black text-pink-200">{guide.name}</p>
          <p className="text-[10px] font-bold text-amber-300">{guide.use}</p>
        </div>
        <ol className={`grid grid-cols-2 gap-1 ${guide.steps.length === 5 ? 'sm:grid-cols-5' : 'sm:grid-cols-4'}`}>
          {guide.steps.map((step, index) => (
            <li key={step} className={`rounded-md border px-2 py-1 text-[10px] font-semibold ${index === (guide.stepImages ? selectedStep : focusStep) ? 'border-amber-400/70 bg-amber-400/10 text-amber-100' : 'border-slate-700 bg-slate-950/70 text-slate-200'}`}>
              <span className="mr-1 text-cyan-300">{index + 1}.</span>{step}
            </li>
          ))}
        </ol>
      </figcaption>
    </figure>
  );
};
