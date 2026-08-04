import React from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-50 font-sans flex flex-col overflow-hidden select-none">
      {/* Navbar Fijo Compacto */}
      <Navbar />

      {/* Área Principal de Trabajo (Flex-1 Sin Scroll General) */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-2 sm:px-4 py-2 overflow-hidden flex flex-col min-h-0">
        {children}
      </main>

      {/* Footer / Status Bar Fijo Compacto */}
      <footer className="h-7 bg-slate-900 border-t border-white/10 px-4 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
        <span>NavegaQuiz • Examen de Timonel PNA</span>
        <span className="text-cyan-400 font-medium hidden sm:inline-block">Experiencia Zero-Scroll ⚓</span>
      </footer>
    </div>
  );
};
