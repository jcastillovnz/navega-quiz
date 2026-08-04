import React from 'react';
import { Layout } from './components/layout/Layout';
import { RipaLightViewer } from './components/ripa/RipaLightViewer';

function App() {
  return (
    <Layout>
      <div className="flex flex-col items-center gap-12 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-50 mb-4">Simulador RIPA</h2>
          <p className="text-slate-300 max-w-xl mx-auto">
            Aprende a reconocer las luces de navegación de los buques según la perspectiva y el tipo de embarcación.
          </p>
        </div>
        
        {/* Renderizado del Simulador Visual RIPA */}
        <RipaLightViewer />
      </div>
    </Layout>
  );
}

export default App;
