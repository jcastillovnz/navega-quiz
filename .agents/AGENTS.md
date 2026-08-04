# NavegaQuiz — Reglas y Directivas para Agentes de IA

Bienvenido Agente. Estás trabajando en **NavegaQuiz**, una app web 100% estática (GitHub Pages) para el examen de **Timonel de Yate a Vela y Motor** en Argentina.

> **Proyecto completado al 100%.** Ya no existe un plan de micro-tareas. Las reglas ahora definen el **estándar de calidad continuo** que debes mantener en cada modificación.

---

## 🛠️ 1. Stack Tecnológico (Inamovible)

- **Framework**: Vite + React + TypeScript
- **Estilos**: Tailwind CSS + CSS puro para animaciones/glow
- **Iconos**: Lucide React
- **Persistencia**: Solo `localStorage` (no Firebase, no Supabase, no backend)
- **Deploy**: GitHub Pages (build estático en `/dist`)

---

## 🎨 2. Estética y Diseño Visual (Zero-Scroll Premium)

- **Paleta**: Navy `bg-slate-900/950`, acentos `cyan-500` y `amber-500`
- **Modo Oscuro + Glassmorphism** para visores nocturnos (RIPA, IALA)
- **Micro-interacciones obligatorias** en todos los botones e inputs
- **Zero-Scroll absoluto**: Toda vista debe encajar en `100dvh` sin scroll global
- Consulta las skills en `.agents/skills/` para detalles adicionales de diseño

---

## 🎬 3. Regla de Ilustraciones Animadas (OBLIGATORIA)

Todo contenido que involucre conceptos dinámicos o visuales **debe usar animaciones**, según este orden de prioridad:

### 3a. Nudos Náuticos — Animaciones SVG Paso a Paso
- **Regla**: No usar imágenes estáticas para nudos. Usar **animaciones SVG con `stroke-dashoffset`/`SMIL`** o **Lottie JSON** que muestren el trazado del cabo en tiempo real.
- **Por qué**: knots3d.com usa X-Frame-Options DENY (no permite iframes). La alternativa correcta es SVG animado propio o Lottie.
- **Fuente recomendada de assets gratuitos**: https://lottiefiles.com (buscar "rope knot", "nautical knot")
- **Implementación**: Usar `useLottie` de `@lottie-react` con JSONs en `src/assets/lottie/`
- **Alternativa**: `<svg>` con `<path>` animado via `stroke-dasharray` + `stroke-dashoffset` CSS keyframes

### 3b. Luces de Navegación RIPA — Animación CSS Glow Pulsante
- **Regla**: Las luces nocturnas (tope, babor, estribor, alcance) deben ser **puntos luminosos con glow pulsante en CSS**.
- **Implementación**: `div.rounded-full` con `box-shadow` animado (`keyframes`) + `animate-pulse` de Tailwind
- **Colores**: `#ef4444` (babor rojo), `#22c55e` (estribor verde), `#ffffff` (tope y alcance blanco)
- **Patrones de destello**: Animaciones CSS custom para `flash-single`, `flash-double`, `flash-isophase` en `index.css`

### 3c. Boyas IALA — Animación de Luz Nocturna + Meceo de Oleaje
- **Regla**: En modo noche, cada boya debe tener:
  1. Una luz de color con glow pulsante (CSS `@keyframes`)
  2. Un suave movimiento de balanceo (`transform: rotate()` + CSS keyframes `sway`)
- **Patrones IALA**: Fl R (destello simple rojo), Fl G (verde), Fl(2) W (doble blanco), Iso W (isofásica)

### 3d. Meteorología — Animaciones de Estado del Mar
- **Regla**: Cada nivel de la Escala Beaufort debe tener animación CSS que simule el estado del mar correspondiente.
- **Elementos animados**: Olas con `transform: translateY()`, lluvia con `@keyframes`, relámpagos `opacity` flash

### 3e. Simulador de Cruceros RIPA — Animación de Trayectorias
- **Regla**: Las trayectorias de los buques en situaciones de cruce deben animarse con CSS `transition`/`transform`.

---

## 🖼️ 4. Imágenes Hiperrealistas en `src/assets/`

Todas las imágenes del proyecto están en `src/assets/`. Son generadas por IA:
- `sailboat_anatomy.png` — Anatomía del casco etiquetada (Nomenclatura)
- `sailboat_rigging.png` — Arboladura 3D etiquetada (Nomenclatura)
- `ripa_lights_bow.png` — Foto nocturna de buque con luces RIPA (RIPA)
- `iala_buoy_babor.png` — Foto de boya de babor real (IALA)
- `knot_bowline_steps.png` — As de Guía 4 pasos (Nudos)
- `knot_reef_steps.png` — Nudo Llano 4 pasos (Nudos)
- `knot_clove_steps.png` — Ballestrinque 4 pasos (Nudos)
- `knot_sheet_bend_steps.png` — Vuelta de Escota 4 pasos (Nudos)
- `knot_figure8_steps.png` — Nudo de Ocho 4 pasos (Nudos)

**Regla**: Para nuevas ilustraciones, usar la herramienta `generate_image` y copiar el PNG a `src/assets/`.

---

## 🗺️ 5. Módulos de la App (Referencia)

La app tiene 7 módulos accesibles desde el Dashboard:
1. **RIPA & IALA** — Luces de navegación + Balizamiento
2. **Seguridad & Fondeo** — Inventario PNA + HAA + Fondeo
3. **Nomenclatura** — Anatomía del casco + Jarcia
4. **Meteorología** — Escala Beaufort + Pampero/Sudestada
5. **Prácticos de Navegación** — Declinación, Mareas, Marcaciones
6. **Nudos Náuticos** — 5 nudos esenciales con pasos animados
7. **Simulador de Examen Real PNA** — 40 preguntas + cronómetro + boletín

---

## 📚 6. Regla de Aprendizaje Unificado (OBLIGATORIA — UX Core)

**Principio**: La Guía Teórica y el Quiz Práctico deben estar **unificados por cada ítem/concepto del módulo**. No se usan pestañas separadas "Teoría" vs "Quiz". El usuario aprende un concepto y lo practica de inmediato en la misma pantalla.

ç≈

### Flujo de Interacción

http://localhost:5175/
5. **Al completar todos los conceptos** → pantalla de resultados `ModuleResultPanel`


- **NO usar tabs `'ESTUDIO' | 'QUIZ'`** en nuevos módulos ni en modificaciones de los existentes.
- El `viewer` izquierdo y el `InlineQuizPanel` derecho deben **estar sincronizados**: el índice activo del visor determina qué pregunta se muestra.
- Si un módulo tiene sub-secciones (ej. RIPA: Luces / Cruces / IALA), cada sub-sección tiene su propio bloque de pregunta.
- Las preguntas se filtran por `category` del JSON de datos y se asignan al concepto más cercano por orden.
- Si hay más preguntas que conceptos visuales, las preguntas sobrantes se muestran como preguntas de "repaso general" al final.

### Ejemplo de Estructura en Código

```tsx
// Patrón correcto — unificado:
<div className="grid md:grid-cols-12 gap-3 flex-1 min-h-0">
  <div className="md:col-span-7">
    <VisualViewer concept={currentConcept} />
  </div>
  <div className="md:col-span-5 flex flex-col gap-2">
    <ConceptInfoPanel concept={currentConcept} />
    <InlineQuizPanel
      question={questions[currentIdx]}
      questionNumber={currentIdx + 1}
      totalQuestions={questions.length}
      onNext={handleNext}
    />
  </div>
</div>

// Patrón PROHIBIDO — tabs separados:
// ❌ <TabButton onClick={() => setTab('ESTUDIO')}>Guía Teórica</TabButton>
// ❌ <TabButton onClick={() => setTab('QUIZ')}>Quiz Práctico</TabButton>
```

---

## 🚀 7. Flujo de Trabajo para Nuevas Mejoras

1. **Entender** el pedido del usuario y qué módulo/componente afecta
2. **Consultar** las skills relevantes en `.agents/skills/`
3. **Implementar** respetando:
   - Zero-Scroll (`100dvh`, sin scroll global)
   - Reglas de animación (Sección 3)
   - **Aprendizaje Unificado** (Sección 6) — nunca tabs separados
4. **Verificar**: `npm run build` debe compilar sin errores
5. **Commitear y pushear** siempre al finalizar: `git add . && git commit -m "..." && git push origin main`

---

## ⚙️ 8. Reglas de Código TypeScript

- No dejar variables sin usar (error TS6133)
- Siempre declarar tipos con `type` keyword en imports
- Preferir `interface` para props de componentes React
- No usar `any` salvo casos extremos documentados
- Todos los componentes deben ser `React.FC` con tipado explícito

---

¡Mantené el estándar premium náutico en cada mejora!
