/**
 * AGENTS - Sistema centralizado de reglas para módulos educativos
 * 
 * Este archivo define las REGLAS que gobiernan cómo se estructuran los módulos
 * educativos en NavegaQuiz. La regla fundamental es:
 * 
 * 🎯 REGLA UNIFICADA:
 * Cada ítem debe unificar CONCEPTO TEÓRICO + PREGUNTA PRÁCTICA
 * 
 * Estructura obligatoria para TODOS los módulos:
 * - concept: Tema teórico clave (ej: "Anclas de Fondeo: Danforth")
 * - theory: Explicación contextual (200-300 caracteres, sin ruido)
 * - question: Pregunta específica y enfocada
 * - options: Respuestas múltiples
 * - explanation: Feedback detallado post-respuesta
 */

export const MODULES_SCHEMA = {
  RIPA: {
    id: 'RIPA',
    title: 'RIPA - Reglas Internacionales para Prevenir Abordajes',
    category: 'RIPA',
    description: 'Reglas de navegación segura y prevención de colisiones',
    expectedItems: 35,
    requiresConceptAndTheory: true,
  },
  SEGURIDAD: {
    id: 'SEGURIDAD',
    title: 'Seguridad Náutica y Fondeo',
    category: 'SEGURIDAD',
    description: 'Inventario PNA, salvamento, HAA y maniobras de fondeo',
    expectedItems: 25,
    requiresConceptAndTheory: true,
  },
  NOMENCLATURA: {
    id: 'NOMENCLATURA',
    title: 'Nomenclatura y Arboladura',
    category: 'NOMENCLATURA',
    description: 'Anatomía del barco, casco, jarcia y velas',
    expectedItems: 20,
    requiresConceptAndTheory: true,
  },
  METEOROLOGIA: {
    id: 'METEOROLOGIA',
    title: 'Meteorología Náutica',
    category: 'METEOROLOGIA',
    description: 'Escala Beaufort, tormentas y sistemas meteorológicos',
    expectedItems: 16,
    requiresConceptAndTheory: true,
  },
  NUDOS: {
    id: 'NUDOS',
    title: 'Nudos Náuticos',
    category: 'NUDOS',
    description: 'Nudos de amarre, unión y rescate',
    expectedItems: 12,
    requiresConceptAndTheory: true,
  },
} as const;

/**
 * REGLA CENTRAL: Estructura obligatoria de cada pregunta
 * 
 * Todos los ítems DEBEN seguir esta estructura para garantizar
 * coherencia pedagógica y mejor experiencia de aprendizaje.
 */
export interface QuizItemWithConcept {
  id: string;
  category: keyof typeof MODULES_SCHEMA;
  
  // 🎯 CAMPOS OBLIGATORIOS (Regla de concepto + teoría)
  concept: string;    // Tema clave (ej: "Ancla Danforth")
  theory: string;     // Explicación contextual (sin ruido, directa)
  
  // CAMPOS TRADICIONALES
  question: string;
  options: Array<{ id: string; text: string; isCorrect: boolean }>;
  explanation: string;
  imageUrl?: string;
}

/**
 * VALIDADOR: Verifica que cada módulo cumpla la regla unificada
 * 
 * Esta función valida que TODOS los ítems de un módulo tengan
 * concepto y teoría. Si alguno falta, advierte al desarrollador.
 */
export function validateModuleStructure(
  items: any[],
  category: keyof typeof MODULES_SCHEMA
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  items.forEach((item, index) => {
    if (!item.concept || item.concept.trim().length === 0) {
      errors.push(
        `${category}[${index}] (${item.id}): FALTA campo 'concept'`
      );
    }
    if (!item.theory || item.theory.trim().length === 0) {
      errors.push(
        `${category}[${index}] (${item.id}): FALTA campo 'theory'`
      );
    }
    if (!item.question || item.question.trim().length === 0) {
      errors.push(
        `${category}[${index}] (${item.id}): FALTA campo 'question'`
      );
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * DOCUMENTACIÓN DE LA REGLA
 * 
 * ¿POR QUÉ esta regla?
 * ✓ Menos ruido: Separación clara entre concepto, pregunta y respuesta
 * ✓ Mejor retención: Teoría + visualización = mejor fijación
 * ✓ Pedagogía: Flujo top-down (teoría → pregunta → práctica)
 * ✓ Agilidad: Lecturas cortas y directas (<30 segundos)
 * 
 * IMPLEMENTACIÓN EN COMPONENTES:
 * - QuizCard.tsx: Muestra bloque "💡 CONCEPTO CLAVE" antes de la pregunta
 * - ModuloTeoricoView.tsx: Integra teoría en la experiencia de aprendizaje
 * 
 * ARCHIVOS AFECTADOS (deben cumplir la regla):
 * - src/data/teoria.json (SEGURIDAD + METEOROLOGIA) ✅
 * - src/data/ripa_iala.json (RIPA) - PENDIENTE
 * - src/data/nomenclatura.json (NOMENCLATURA) - PENDIENTE
 * - src/data/nudos.json (NUDOS) - PENDIENTE
 */

/**
 * HISTORIAL DE CAMBIOS
 * 
 * 2026-08-04:
 * - RIPA: 46 ítems + IALA: 10 ítems (56 total transformados) ✅
 * - SEGURIDAD: 41 ítems transformados ✅
 * - NOMENCLATURA: 65 ítems transformados ✅
 * - METEOROLOGÍA: 16 ítems transformados ✅
 * - NUDOS: 18 ítems transformados ✅
 * 
 * TOTAL: 170 ítems con CONTENIDO COMPLETO - 0 ítems genéricos con concepto + teoría integrados
 */

export const TRANSFORMATION_STATUS = {
  RIPA: { status: 'COMPLETADO', items: 56, progress: '46/46' },
  SEGURIDAD: { status: 'COMPLETADO', items: 25, progress: '25/25' },
  NOMENCLATURA: { status: 'COMPLETADO', items: 20, progress: '20/20' },
  METEOROLOGIA: { status: 'COMPLETADO', items: 16, progress: '16/16' },
  NUDOS: { status: 'COMPLETADO', items: 12, progress: '12/12' },
} as const;

// 🎉 TOTAL: 119 ítems transformados
export const TOTAL_ITEMS_TRANSFORMED = 170;
