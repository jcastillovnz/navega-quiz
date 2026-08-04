import React from 'react';
import { Layout } from './components/layout/Layout';
import { RipaLightViewer } from './components/ripa/RipaLightViewer';
import { IalaBuoyViewer } from './components/iala/IalaBuoyViewer';

function App() {
  return (
    <Layout>
      <div className="flex flex-col items-center gap-16 py-8">
        
        {/* Sección RIPA */}
        <section className="w-full max-w-5xl mx-auto flex flex-col gap-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-50 mb-2">Simulador RIPA</h2>
            <p className="text-slate-300 max-w-xl mx-auto text-sm">
              Reconoce las luces de navegación de los buques según su perspectiva.
            </p>
          </div>
          <RipaLightViewer />
        </section>

        {/* Separador */}
        <div className="w-32 h-px bg-slate-800"></div>

        {/* Sección IALA */}
        <section className="w-full max-w-5xl mx-auto flex flex-col gap-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-50 mb-2">Simulador IALA (Región B)</h2>
            <p className="text-slate-300 max-w-xl mx-auto text-sm">
              Estudia las formas, colores, marcas de tope y ritmos luminosos del balizamiento.
            </p>
          </div>
          <IalaBuoyViewer />
        </section>

      </div>
    </Layout>
  );
}

export default App;
