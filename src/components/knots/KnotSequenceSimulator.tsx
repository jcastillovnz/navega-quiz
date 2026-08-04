import React, { useState } from 'react';
import { CheckCircle, XCircle, RotateCcw, Award, ArrowUp, ArrowDown } from 'lucide-react';
import type { SequenceStepOption } from '../../types/knots';

interface Props {
  knotName: string;
  correctSteps: SequenceStepOption[];
  onSuccess: (xp: number) => void;
}

export const KnotSequenceSimulator: React.FC<Props> = ({ knotName, correctSteps, onSuccess }) => {
  const [selectedOrder, setSelectedOrder] = useState<SequenceStepOption[]>([]);
  const [shuffledOptions] = useState<SequenceStepOption[]>(() => 
    [...correctSteps].sort(() => Math.random() - 0.5)
  );
  const [isValidated, setIsValidated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSelectOption = (step: SequenceStepOption) => {
    if (selectedOrder.find(s => s.id === step.id)) return;
    setSelectedOrder([...selectedOrder, step]);
  };

  const handleRemoveOption = (index: number) => {
    if (isValidated) return;
    setSelectedOrder(selectedOrder.filter((_, i) => i !== index));
  };

  const handleMoveUp = (index: number) => {
    if (isValidated || index === 0) return;
    const newOrder = [...selectedOrder];
    const temp = newOrder[index - 1];
    newOrder[index - 1] = newOrder[index];
    newOrder[index] = temp;
    setSelectedOrder(newOrder);
  };

  const handleMoveDown = (index: number) => {
    if (isValidated || index === selectedOrder.length - 1) return;
    const newOrder = [...selectedOrder];
    const temp = newOrder[index + 1];
    newOrder[index + 1] = newOrder[index];
    newOrder[index] = temp;
    setSelectedOrder(newOrder);
  };

  const handleValidate = () => {
    const isValid = selectedOrder.every((step, i) => step.id === correctSteps[i].id) && 
                    selectedOrder.length === correctSteps.length;
    
    setIsValidated(true);
    setIsCorrect(isValid);

    if (isValid) {
      onSuccess(25); // Otorgar 25 XP
    }
  };

  const handleReset = () => {
    setSelectedOrder([]);
    setIsValidated(false);
    setIsCorrect(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-2xl mx-auto flex flex-col gap-5 shadow-xl">
      <div className="text-center">
        <span className="text-xs font-bold px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30">
          Desafío de Armado
        </span>
        <h3 className="text-xl font-extrabold text-white mt-2">
          Ordená la Secuencia: {knotName}
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Hacé clic en los pasos de abajo para armar la secuencia lógica de armado.
        </p>
      </div>

      {/* Área de Secuencia Seleccionada */}
      <div className="min-h-[160px] bg-slate-950/90 border-2 border-dashed border-slate-700/80 rounded-xl p-3 flex flex-col gap-2">
        <span className="text-[10px] uppercase font-extrabold text-slate-500">Tu secuencia de armado:</span>
        {selectedOrder.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-xs text-slate-600 italic py-8">
            Seleccioná las acciones de abajo en el orden correcto...
          </div>
        ) : (
          selectedOrder.map((step, idx) => (
            <div 
              key={step.id}
              className="flex items-center justify-between bg-slate-800 border border-slate-700 px-3.5 py-2.5 rounded-xl text-xs text-slate-200 shadow-sm transition-all"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[11px] shrink-0">
                  {idx + 1}
                </span>
                <span className="font-medium">{step.text}</span>
              </div>
              
              {!isValidated && (
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => handleMoveUp(idx)}
                    disabled={idx === 0}
                    className="p-1 text-slate-400 hover:text-slate-200 disabled:opacity-30"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleMoveDown(idx)}
                    disabled={idx === selectedOrder.length - 1}
                    className="p-1 text-slate-400 hover:text-slate-200 disabled:opacity-30"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleRemoveOption(idx)}
                    className="p-1 text-slate-400 hover:text-rose-400 ml-1"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Opciones Disponibles */}
      {!isValidated && (
        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase font-extrabold text-slate-500">Pasos disponibles:</span>
          <div className="flex flex-col gap-2">
            {shuffledOptions.map((step) => {
              const isSelected = selectedOrder.some(s => s.id === step.id);
              return (
                <button
                  key={step.id}
                  disabled={isSelected}
                  onClick={() => handleSelectOption(step)}
                  className={`text-left px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-slate-950 border-slate-800 text-slate-600 opacity-40 cursor-not-allowed' 
                      : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300 hover:border-cyan-500/50'
                  }`}
                >
                  {step.text}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Resultado de Validación */}
      {isValidated && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 ${
          isCorrect 
            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' 
            : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
        }`}>
          {isCorrect ? (
            <>
              <CheckCircle className="w-6 h-6 shrink-0 text-emerald-400" />
              <div>
                <h4 className="text-sm font-bold">¡Secuencia Perfecta! (+25 XP)</h4>
                <p className="text-xs text-slate-300 mt-0.5">Demostraste dominio total de la técnica de armado.</p>
              </div>
            </>
          ) : (
            <>
              <XCircle className="w-6 h-6 shrink-0 text-rose-400" />
              <div>
                <h4 className="text-sm font-bold">Secuencia Incorrecta</h4>
                <p className="text-xs text-slate-300 mt-0.5">Revisá la guía paso a paso y volvé a intentarlo.</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Botones de Acción */}
      <div className="flex justify-end gap-3 mt-2">
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all border border-slate-700 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reiniciar
        </button>

        {!isValidated && (
          <button
            onClick={handleValidate}
            disabled={selectedOrder.length !== correctSteps.length}
            className="flex items-center gap-1.5 px-5 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 text-xs font-extrabold rounded-xl transition-all shadow-md shadow-amber-900/30 cursor-pointer disabled:cursor-not-allowed"
          >
            <Award className="w-4 h-4" /> Validar Secuencia
          </button>
        )}
      </div>
    </div>
  );
};
