import React from 'react';
import { Layout } from './components/layout/Layout';

function App() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-full gap-8 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-50 mb-4">¡Bienvenido a Bordo!</h2>
          <p className="text-slate-300 max-w-xl mx-auto">
            El Layout principal está listo. Desde aquí construiremos los módulos interactivos para tu examen de Timonel.
          </p>
        </div>
        
        {/* Test visual para el glow */}
        <div className="flex gap-8 mt-8">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full flex items-center justify-center glow-red text-white font-bold shadow-lg">
              Babor
            </div>
            <span className="text-sm text-slate-400">Rojo</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full flex items-center justify-center glow-green text-white font-bold shadow-lg">
              Estribor
            </div>
            <span className="text-sm text-slate-400">Verde</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default App;
