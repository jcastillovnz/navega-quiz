import React from 'react';
import { Bell, Volume2 } from 'lucide-react';
import crossingScene from '../../assets/ripa_rule15_crossing_illustrated.png';

type Blast = 'SHORT' | 'LONG';

const signalFrom = (text: string): { title: string; blasts: Blast[]; interval?: string; bell?: boolean } => {
  const value = text.toLowerCase();
  if (/fondead|campana/.test(value)) return { title: 'Buque fondeado en visibilidad reducida', blasts: [], interval: 'Repique rápido durante 5 s · cada ≤ 1 min', bell: true };
  if (/duda|incomprensi|cinco|5 pitadas/.test(value)) return { title: 'Duda o peligro', blasts: ['SHORT', 'SHORT', 'SHORT', 'SHORT', 'SHORT'] };
  if (/recodo|curva|obstru/.test(value)) return { title: 'Aproximación a recodo', blasts: ['LONG'] };
  if (/acepta|acuerdo/.test(value)) return { title: 'Conformidad con el adelantamiento', blasts: ['LONG', 'SHORT', 'LONG', 'SHORT'] };
  if (/alcanz|adelant/.test(value) && /babor/.test(value)) return { title: 'Alcanzar por babor del alcanzado', blasts: ['LONG', 'LONG', 'SHORT', 'SHORT'] };
  if (/alcanz|adelant/.test(value) && /estribor/.test(value)) return { title: 'Alcanzar por estribor del alcanzado', blasts: ['LONG', 'LONG', 'SHORT'] };
  if (/detenido|sin arrancada/.test(value)) return { title: 'Motor detenido y sin arrancada en niebla', blasts: ['LONG', 'LONG'], interval: '2 s entre pitadas · repetir cada ≤ 2 min' };
  if (/velero|remolc/.test(value)) return { title: 'Velero, pesca, remolque o maniobra restringida', blasts: ['LONG', 'SHORT', 'SHORT'], interval: 'Repetir cada ≤ 2 min' };
  if (/babor|dos pitadas/.test(value)) return { title: 'Caigo a babor', blasts: ['SHORT', 'SHORT'] };
  if (/marcha atrás|propulsión atrás|tres pitadas/.test(value)) return { title: 'Opero propulsión atrás', blasts: ['SHORT', 'SHORT', 'SHORT'] };
  if (/estribor|una pitada corta/.test(value)) return { title: 'Caigo a estribor', blasts: ['SHORT'] };
  return { title: 'Motor con arrancada en niebla', blasts: ['LONG'], interval: 'Repetir cada ≤ 2 min' };
};

export const RipaSoundSignalViewer: React.FC<{ context: string }> = ({ context }) => {
  const signal = signalFrom(context);
  return (
    <div className="h-full min-h-0 relative overflow-hidden bg-slate-950">
      <img src={crossingScene} alt="Buques emitiendo señales auditivas RIPA" className="absolute inset-0 w-full h-full object-cover opacity-45 grayscale-[.15]" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-900/20" />
      <div className="relative h-full flex flex-col items-center justify-center px-6 text-center">
        <div className="rounded-full border border-cyan-400/40 bg-slate-950/80 p-3 shadow-[0_0_30px_rgba(34,211,238,.2)]">
          {signal.bell ? <Bell className="w-8 h-8 text-amber-300" /> : <Volume2 className="w-8 h-8 text-cyan-300" />}
        </div>
        <p className="mt-3 text-base font-black text-white">{signal.title}</p>
        {signal.bell ? (
          <div className="mt-4 rounded-xl border border-amber-400/40 bg-slate-950/85 px-5 py-3 text-sm font-black text-amber-200">🔔 🔔 🔔 🔔 🔔 · repique continuo</div>
        ) : (
          <div className="mt-5 flex items-end justify-center gap-2 rounded-xl border border-white/15 bg-slate-950/85 px-5 py-4">
            {signal.blasts.map((blast, index) => (
              <div key={`${blast}-${index}`} className="flex flex-col items-center gap-1">
                <div className={`h-3 rounded-full ${blast === 'LONG' ? 'w-16 bg-cyan-300' : 'w-5 bg-amber-300'}`} />
                <span className="text-[8px] font-black text-slate-400">{blast === 'LONG' ? 'PROLONGADA' : 'CORTA'}</span>
              </div>
            ))}
          </div>
        )}
        {signal.interval && <p className="mt-3 rounded-lg bg-slate-950/80 px-3 py-1.5 text-[11px] font-bold text-slate-200">{signal.interval}</p>}
        <p className="mt-3 text-[10px] text-slate-300">Corta ≈ 1 s · Prolongada = 4 a 6 s</p>
      </div>
    </div>
  );
};
