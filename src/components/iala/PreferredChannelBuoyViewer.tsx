import React from 'react';

export const PreferredChannelBuoyViewer: React.FC<{preferred:'PORT'|'STARBOARD'}> = ({preferred}) => {
  const toPort=preferred==='PORT';
  const main=toPort?'#dc2626':'#16a34a';
  const band=toPort?'#16a34a':'#dc2626';
  const label=toPort?'CANAL PREFERIDO A BABOR':'CANAL PREFERIDO A ESTRIBOR';
  return <figure className="h-full min-h-0 grid grid-cols-2 gap-1.5 bg-slate-950 overflow-hidden" aria-label={`${label}, vista diurna y nocturna`}>
    {(['DAY','NIGHT'] as const).map(mode=>{const night=mode==='NIGHT'; return <div key={mode} className={`relative overflow-hidden rounded-xl border ${night?'border-indigo-500/40 bg-gradient-to-b from-slate-950 via-indigo-950 to-blue-950':'border-sky-300/50 bg-gradient-to-b from-sky-200 via-sky-400 to-sky-700'}`}>
      <svg viewBox="0 0 500 430" className={`absolute inset-0 h-full w-full ${night?'brightness-[.35]':''}`} role="img">
        <path d="M0 320 Q130 285 250 320 T500 320 V430 H0Z" fill={night?'#082f49':'#0369a1'}/>
        <path d="M205 330 L225 145 H275 L295 330Z" fill={main} stroke="#0f172a" strokeWidth="6"/>
        <path d="M215 245 H285 L290 285 H210Z" fill={band}/>
        {toPort?<path d="M250 68 L205 145 H295Z" fill={main} stroke="#0f172a" strokeWidth="6"/>:<><rect x="207" y="88" width="86" height="57" fill={main} stroke="#0f172a" strokeWidth="6"/><rect x="226" y="54" width="48" height="34" fill={main}/></>}
        <path d="M250 330 V372" stroke="#475569" strokeWidth="8"/><ellipse cx="250" cy="388" rx="85" ry="13" fill="#020617" opacity=".35"/>
      </svg>
      {!night&&<div className="absolute inset-0 animate-buoy-sway pointer-events-none"/>}
      {night&&<><div className={`question-light-animation absolute left-1/2 top-[13%] -translate-x-1/2 h-5 w-5 rounded-full ${toPort?'bg-red-500 animate-glow-red':'bg-emerald-500 animate-glow-green'} animate-iala-two-plus-one`}/><div className="absolute inset-0 opacity-70">{[...Array(14)].map((_,i)=><i key={i} className="star absolute rounded-full bg-white" style={{width:2,height:2,top:`${8+(i*23)%55}%`,left:`${8+(i*31)%86}%`}}/>)}</div></>}
    </div>})}
  </figure>;
};
