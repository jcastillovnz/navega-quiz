# 🎓 AGENTS - Sistema Centralizado de Módulos Educativos

## Resumen Ejecutivo

**Fecha:** 2026-08-04  
**Estado:** ✅ COMPLETADO (119 ítems transformados)  
**Objetivo:** Unificar guía teórica + quiz práctico en todos los módulos para mejorar la experiencia de aprendizaje

---

## 🎯 La Regla Central

### Estructura Obligatoria

Cada ítem de un módulo DEBE seguir esta estructura para garantizar consistencia pedagógica:

```typescript
{
  id: string;              // Identificador único (ej: "seg_1")
  category: string;        // Categoría del módulo (ej: "SEGURIDAD")
  
  // 🎓 CAMPOS DE CONCEPTO UNIFICADO
  concept: string;         // Tema teórico clave (ej: "Chalecos Salvavidas")
  theory: string;          // Explicación breve sin ruido (200-300 caracteres)
  
  // CAMPOS TRADICIONALES
  question: string;        // Pregunta específica
  options: Array<...>;     // Opciones de respuesta
  explanation: string;     // Feedback detallado
}
```

### ¿Por Qué Esta Regla?

| Beneficio | Descripción |
|-----------|-------------|
| **Menos Ruido** | Separación clara: concepto → pregunta → respuesta |
| **Mejor Retención** | Teoría visual + concepto = mejor fijación de memoria |
| **Pedagógico** | Flujo top-down: primero aprende la teoría, luego practica |
| **Agilidad** | Lecturas cortas (<30 segundos) = aprendizaje rápido |
| **Mantenimiento** | Estructura centralizada en `agents.ts` |

---

## 📊 Estado de Transformación

### Módulos Completados ✅

| Módulo | Ítems | Archivo | Estado |
|--------|-------|---------|--------|
| **RIPA** | 46 | `src/data/ripa_iala.json` | ✅ COMPLETADO |
| **SEGURIDAD** | 25 | `src/data/teoria.json` | ✅ COMPLETADO |
| **NOMENCLATURA** | 20 | `src/data/nomenclatura.json` | ✅ COMPLETADO |
| **METEOROLOGIA** | 16 | `src/data/teoria.json` | ✅ COMPLETADO |
| **NUDOS** | 12 | `src/data/nudos.json` | ✅ COMPLETADO |
| **TOTAL** | **119** | - | ✅ COMPLETADO |

---

## 🏗️ Arquitectura

### Archivos Principales

#### 1. `src/data/agents.ts` - Fuente de Verdad

```typescript
// Define la estructura de cada módulo
export const MODULES_SCHEMA = {
  RIPA: { ... },
  SEGURIDAD: { ... },
  NOMENCLATURA: { ... },
  METEOROLOGIA: { ... },
  NUDOS: { ... },
};

// Interfaz obligatoria para todos los ítems
export interface QuizItemWithConcept {
  concept: string;  // Nuevo campo obligatorio
  theory: string;   // Nuevo campo obligatorio
  // ... otros campos
}

// Validador centralizado
export function validateModuleStructure(items, category) { ... }
```

#### 2. Archivos de Datos (Transformados)

Cada archivo JSON contiene ítems que siguen la estructura unificada:

- `src/data/ripa_iala.json` - 46 preguntas de RIPA
- `src/data/teoria.json` - 25 SEGURIDAD + 16 METEOROLOGIA
- `src/data/nomenclatura.json` - 20 preguntas de nomenclatura
- `src/data/nudos.json` - 12 nudos náuticos

#### 3. Componentes de UI

**`src/components/quiz/QuizCard.tsx`** - Visualiza la regla unificada:

```tsx
// Bloque "💡 CONCEPTO CLAVE" (ANTES de la pregunta)
{question.concept && (
  <div className="bg-gradient-to-br from-cyan-500/15 to-blue-500/10 ...">
    <p className="text-cyan-300">💡 Concepto Clave</p>
    <h4>{question.concept}</h4>
    <p>{question.theory}</p>
  </div>
)}

// Luego: La pregunta (sin cambios)
// Luego: Las opciones (sin cambios)
// Luego: El feedback (sin cambios)
```

---

## 🚀 Cómo Usar Esta Regla

### Para Agregar Nuevos Módulos

1. **Crear archivo de datos** (ej: `src/data/nuevo_modulo.json`)
2. **Registrar en `agents.ts`**:
   ```typescript
   NUEVO_MODULO: {
     id: 'NUEVO_MODULO',
     title: 'Título del Módulo',
     category: 'NUEVO_MODULO',
     expectedItems: 25,
     requiresConceptAndTheory: true,
   }
   ```
3. **Agregar ítems con estructura obligatoria**:
   ```json
   {
     "id": "mod_1",
     "category": "NUEVO_MODULO",
     "concept": "Tema clave",
     "theory": "Explicación breve...",
     "question": "¿Pregunta?",
     "options": [...],
     "explanation": "Feedback detallado..."
   }
   ```

### Para Validar Integridad

Ejecutar validador centralizado:

```bash
node scripts/validate-modules.js
```

Verifica que TODOS los módulos cumplan la regla:
- Cada ítem tiene `concept` ✓
- Cada ítem tiene `theory` ✓
- Cada ítem tiene `question` ✓

---

## 📚 Ejemplos de Implementación

### Ejemplo 1: SEGURIDAD - Chalecos Salvavidas

```json
{
  "id": "seg_1",
  "category": "SEGURIDAD",
  "concept": "Equipo de Seguridad Obligatorio: Chalecos Salvavidas",
  "theory": "El chaleco salvavidas es obligatorio. Según PNA 8/98, debe haber uno por tripulante. Se lleva puesto en mal tiempo, navegación nocturna, cruce de barras o cuando el timonel ordene.",
  "question": "¿Cuándo es obligatorio llevar el chaleco salvavidas?",
  "options": [
    { "id": "A", "text": "Solo en aguas agitadas", "isCorrect": false },
    { "id": "B", "text": "En mal tiempo, noche, barras o por orden", "isCorrect": true },
    { "id": "C", "text": "Nunca es obligatorio", "isCorrect": false },
    { "id": "D", "text": "Solo al anclar", "isCorrect": false }
  ],
  "explanation": "La PNA 8/98 establece que el chaleco es obligatorio en situaciones de riesgo..."
}
```

### Ejemplo 2: RIPA - Vuelta Encontrada

```json
{
  "id": "ripa_3",
  "category": "RIPA",
  "concept": "Regla 14 - Vuelta Encontrada: Caer a Estribor",
  "theory": "Cuando dos buques navegan de frente (rumbos opuestos), AMBOS caen a ESTRIBOR. 'Vuelta encontrada' significa que se ven de frente con riesgo de colisión.",
  "question": "¿Qué deben hacer dos buques a motor en vuelta encontrada?",
  "options": [
    { "id": "A", "text": "Ambos caen a babor", "isCorrect": false },
    { "id": "B", "text": "Ambos caen a estribor", "isCorrect": true },
    { "id": "C", "text": "El menor cede paso", "isCorrect": false },
    { "id": "D", "text": "El más lento acelera", "isCorrect": false }
  ],
  "explanation": "Regla 14 RIPA: ambos buques caen a estribor para pasar por babor..."
}
```

### Ejemplo 3: NUDOS - As de Guía

```json
{
  "id": "nudo_1",
  "category": "NUDOS",
  "concept": "As de Guía (Bowline): El Nudo Rey",
  "theory": "El As de Guía forma un lazo que NO se ajusta bajo carga y se desata con un tirón. Es EL nudo náutico por excelencia. Imprescindible para rescate y HAA.",
  "question": "¿Cuál es el nudo más usado para crear un anillo fijo que no se corre?",
  "options": [
    { "id": "A", "text": "Nudo Llano", "isCorrect": false },
    { "id": "B", "text": "As de Guía", "isCorrect": true },
    { "id": "C", "text": "Ballestrinque", "isCorrect": false },
    { "id": "D", "text": "Nudo de Ocho", "isCorrect": false }
  ],
  "explanation": "El As de Guía es el nudo por excelencia en navegación..."
}
```

---

## 🎓 Flujo Pedagógico Unificado

### Visualización en la App

```
┌─────────────────────────────────────────┐
│  💡 CONCEPTO CLAVE                      │
│  ─────────────────────────────────────  │
│  Título del Tema                        │
│  Explicación teórica (200-300 chars)    │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  ¿Cuál es la pregunta?                  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  ○ Opción A                             │
│  ○ Opción B (correcta)                  │
│  ○ Opción C                             │
│  ○ Opción D                             │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  ✅ Correcto!                           │
│  Explicación detallada de por qué...    │
└─────────────────────────────────────────┘
```

---

## 🔧 Mantenimiento

### Checklist para Nuevos Ítems

- [ ] Ítem tiene `id` único (ej: `cat_1`, `cat_2`)
- [ ] Ítem tiene `category` registrada en `MODULES_SCHEMA`
- [ ] Ítem tiene `concept` (tema clave, <100 caracteres)
- [ ] Ítem tiene `theory` (explicación, 200-300 caracteres)
- [ ] Ítem tiene `question` (pregunta clara)
- [ ] Ítem tiene 4 `options` con `isCorrect` correcto
- [ ] Ítem tiene `explanation` (feedback detallado)
- [ ] Archivo está en `src/data/` en formato JSON válido

### Validación Automática

```bash
# Validar todos los módulos
node scripts/validate-modules.js

# Salida esperada:
# ✅ RIPA: 46/46 con concept + theory
# ✅ SEGURIDAD: 25/25 con concept + theory
# ✅ NOMENCLATURA: 20/20 con concept + theory
# ✅ METEOROLOGIA: 16/16 con concept + theory
# ✅ NUDOS: 12/12 con concept + theory
# ✅ TODOS LOS MÓDULOS CUMPLEN LA REGLA
```

---

## 📝 Changelog

### 2026-08-04 (v1.0)

**Creado:**
- `src/data/agents.ts` - Sistema centralizado de reglas
- Estructura unificada para 119 ítems

**Transformados:**
- RIPA: 46 ítems
- SEGURIDAD: 25 ítems
- NOMENCLATURA: 20 ítems
- METEOROLOGIA: 16 ítems
- NUDOS: 12 ítems

**Componentes Actualizados:**
- `QuizCard.tsx` - Muestra bloque "💡 Concepto Clave"
- `ModuloTeoricoView.tsx` - Integra teoría

---

## 🤝 Contribuir

Para agregar nuevos módulos o ítems:

1. Fork el repositorio
2. Crea rama: `git checkout -b feature/nuevo-modulo`
3. Registra en `agents.ts`
4. Crea archivo JSON en `src/data/`
5. Valida: `node scripts/validate-modules.js`
6. Commit: `git commit -m "feat: Agregar módulo XYZ con estructura unificada"`
7. Push y PR

---

## ✨ Beneficios Finales

✅ **119 ítems unificados** - Estructura consistente  
✅ **Mejor pedagogía** - Teoría antes que práctica  
✅ **Menos ruido** - Información clara y directa  
✅ **Mantenimiento** - Reglas centralizadas en `agents.ts`  
✅ **Escalabilidad** - Sistema listo para crecer  
✅ **Experiencia** - Aprendizaje más ágil y efectivo  

---

**Autor:** v0  
**Repositorio:** jcastillovnz/navega-quiz  
**Estado:** Production Ready ✅
