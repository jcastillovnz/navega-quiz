import React from 'react';
import type { VisualFamily } from '../../data/visualManifest';
import anchorBendPlate from '../../assets/knots/anchor-bend-steps-v1.webp';
import bowlinePlate from '../../assets/knots/bowline-steps-v1.webp';
import cloveHitchPlate from '../../assets/knots/clove-hitch-steps-v1.webp';
import figureEightPlate from '../../assets/knots/figure-eight-steps-v1.webp';
import reefKnotPlate from '../../assets/knots/reef-knot-steps-v1.webp';
import sheetBendPlate from '../../assets/knots/sheet-bend-steps-v1.webp';

export type KnotFamily = Extract<VisualFamily,
  'KNOT_BOWLINE' | 'KNOT_REEF' | 'KNOT_CLOVE' | 'KNOT_SHEET_BEND' | 'KNOT_FIGURE_EIGHT' | 'KNOT_ANCHOR_BEND'
>;

type KnotGuide = {
  name: string;
  use: string;
  image: string;
  alt: string;
  steps: [string, string, string, string];
};

const GUIDES: Record<KnotFamily, KnotGuide> = {
  KNOT_BOWLINE: {
    name: 'As de guía',
    use: 'Gaza fija que no se corre',
    image: bowlinePlate,
    alt: 'Cuatro fotografías consecutivas para formar un as de guía con el firme azul y el chicote naranja',
    steps: ['Formá una coca', 'Subí por la coca', 'Rodeá el firme', 'Volvé y ajustá'],
  },
  KNOT_REEF: {
    name: 'Nudo llano',
    use: 'Unir cabos de igual mena',
    image: reefKnotPlate,
    alt: 'Cuatro fotografías consecutivas para formar un nudo llano con dos cabos de distinto color',
    steps: ['Cruzá ambos cabos', 'Hacé el primer medio nudo', 'Invertí el segundo cruce', 'Vestí el nudo plano'],
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

const panelPosition = ['0%', '33.333%', '66.666%', '100%'];

export const KnotTechnicalViewer: React.FC<{ family: KnotFamily; questionId?: string }> = ({ family, questionId }) => {
  const guide = GUIDES[family];
  const focusStep = questionId ? Number(questionId.replace(/\D/g, '')) % 4 : 3;

  return (
    <figure className="h-full min-h-0 overflow-hidden bg-slate-950 flex flex-col" aria-label={`${guide.name}: guía visual paso a paso`}>
      <div className="relative min-h-0 flex-1 bg-[#17110d]">
        <img
          src={guide.image}
          alt={guide.alt}
          className="hidden h-full w-full object-contain sm:block"
          draggable={false}
        />

        <div className="flex h-full snap-x snap-mandatory overflow-x-auto sm:hidden" aria-label="Deslizá para observar los cuatro pasos">
          {guide.steps.map((step, index) => (
            <div
              key={step}
              className="relative h-full min-w-[88vw] snap-center border-r border-white/15 bg-cover bg-no-repeat"
              style={{ backgroundImage: `url(${guide.image})`, backgroundSize: '400% 100%', backgroundPosition: `${panelPosition[index]} center` }}
              role="img"
              aria-label={`Paso ${index + 1}: ${step}`}
            >
              <span className="absolute left-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-white/50 bg-slate-950/90 text-sm font-black text-white">
                {index + 1}
              </span>
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-2 hidden grid-cols-4 px-2 sm:grid">
          {guide.steps.map((step, index) => (
            <div key={step} className="px-1">
              <span className={`grid h-7 w-7 place-items-center rounded-full border text-xs font-black shadow-lg ${index === focusStep ? 'border-amber-300 bg-amber-300 text-slate-950' : 'border-white/50 bg-slate-950/85 text-white'}`}>
                {index + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      <figcaption className="shrink-0 border-t border-pink-400/30 bg-slate-900 px-2 py-1.5">
        <div className="mb-1 flex items-baseline justify-between gap-2">
          <p className="text-xs font-black text-pink-200">{guide.name}</p>
          <p className="text-[10px] font-bold text-amber-300">{guide.use}</p>
        </div>
        <ol className="grid grid-cols-2 gap-1 sm:grid-cols-4">
          {guide.steps.map((step, index) => (
            <li key={step} className={`rounded-md border px-2 py-1 text-[10px] font-semibold ${index === focusStep ? 'border-amber-400/70 bg-amber-400/10 text-amber-100' : 'border-slate-700 bg-slate-950/70 text-slate-200'}`}>
              <span className="mr-1 text-cyan-300">{index + 1}.</span>{step}
            </li>
          ))}
        </ol>
      </figcaption>
    </figure>
  );
};
