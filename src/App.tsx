import React from 'react';
import { Anchor } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col items-center justify-center font-sans">
      <div className="flex items-center gap-3 mb-6">
        <Anchor className="text-cyan-400 w-12 h-12" />
        <h1 className="text-4xl font-bold text-slate-50 tracking-tight">NavegaQuiz</h1>
      </div>
      <p className="text-slate-300 text-lg mb-8 max-w-md text-center">
        Aplicación de Estudio para Timonel de Yate a Vela y Motor
      </p>
      
      <div className="flex gap-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center glow-red">
          Babor
        </div>
        <div className="w-16 h-16 rounded-full flex items-center justify-center glow-green">
          Estribor
        </div>
      </div>
    </div>
  );
}

export default App;
