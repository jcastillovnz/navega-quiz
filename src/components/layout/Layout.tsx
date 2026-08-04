import React from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    /* fixed inset-0 + h-dvh para viewport real (mobile friendly) */
    <div
      className="fixed inset-0 bg-slate-950 text-slate-50 font-sans flex flex-col overflow-hidden"
      style={{ height: '100dvh', maxHeight: '100dvh' }}
    >
      <Navbar />
      <main
        className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2 flex flex-col min-h-0 overflow-hidden"
      >
        {children}
      </main>
    </div>
  );
};
