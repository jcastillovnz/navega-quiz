import React from 'react';
import preferredPortRealistic from '../../assets/preferred-channel-port-realistic-v1.png';
import preferredStarboardRealistic from '../../assets/preferred-channel-starboard-realistic-v1.png';

export const PreferredChannelBuoyViewer: React.FC<{preferred:'PORT'|'STARBOARD'}> = ({preferred}) => {
  const toPort=preferred==='PORT';
  const realisticAsset=toPort?preferredPortRealistic:preferredStarboardRealistic;
  const label=toPort?'CANAL PREFERIDO A BABOR':'CANAL PREFERIDO A ESTRIBOR';
  return <figure className="relative h-full min-h-0 overflow-hidden rounded-xl bg-slate-950" aria-label={`${label}, vista diurna y nocturna`}>
    <img src={realisticAsset} alt={`${label}: boya completa en vista diurna y nocturna con su marca de tope y luz`} className="h-full w-full object-contain" draggable={false}/>
    <figcaption className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-cyan-300/40 bg-slate-950/90 px-3 py-1 text-[10px] font-bold text-white shadow-xl">Día · noche · Fl(2+1)</figcaption>
  </figure>;
};
