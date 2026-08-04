# ⛵ Plan Detallado: App Web de Estudio NavegaQuiz (Timonel de Yate Vela y Motor)

Aplicación Web estática e interactiva para el aprendizaje náutico y preparación del examen oficial de **Timonel de Yate a Vela y Motor**, desplegable directamente en **GitHub Pages** (100% Client-Side, accesible públicamente sin backend).

---

## 📌 1. Visión y Definición General

- **Formato**: Aplicación Web Single Page Application (SPA) responsiva (Desktop / Mobile).
- **Despliegue**: **GitHub Pages** (`https://<usuario>.github.io/navega-quiz/`).
- **Arquitectura**: 100% Frontend con componentes visuales interactivos, datos incrustados (JSONs) y almacenamiento local en `localStorage`.

---

## 🧠 2. Pedagogía Moderna y Gamificación (Estrategia de Enseñanza)

Para maximizar la retención de conocimiento, la aplicación no será un simple banco de preguntas, sino una plataforma que integra las mejores prácticas modernas de aprendizaje y diseño de comportamientos (inspirado en apps como Duolingo):

### 🎮 Gamificación (Engagement y Progresión)
- **Sistema de Rangos y Niveles**: El usuario acumula Puntos de Experiencia (XP) al completar módulos y tests. Sube de rango marítimo: *Grumete ➔ Marinero ➔ Contramaestre ➔ Timonel*.
- **Rachas de Estudio Diarias (Streaks)**: Un indicador visual (🔥) que cuenta cuántos días consecutivos el usuario ha estudiado, fomentando el hábito y la constancia.
- **Feedback Sensorial Positivo**: Sonidos de campanas de barco o bips náuticos sutiles al acertar respuestas, colores vibrantes de éxito (verde neón) y pequeñas animaciones (micro-interacciones de "sacudida" al fallar o lluvia de confeti al aprobar un módulo).
- **Insignias (Badges) de Logro**: Trofeos visuales otorgados por hitos (Ej: "Amo de los Nudos", "Sobreviviente de Pampero", "As del IALA").

### 📖 Prácticas de Enseñanza Moderna
- **Microlearning (Microaprendizaje)**: En lugar de muros de texto (como el PDF original), el contenido teórico se presenta en **Flashcards Interactivas (Tarjetas)** muy visuales y al punto.
- **Active Recall (Recuerdo Activo)**: Los simuladores interactivos (ej. armar la jarcia arrastrando partes, o tocar la luz que corresponde al destello) obligan al cerebro a trabajar activamente, superando a la lectura pasiva.
- **Spaced Repetition (Repetición Espaciada)**: La **Caja de Repaso** (donde van las preguntas falladas) utilizará lógica para volver a presentar esas preguntas con mayor frecuencia hasta que el usuario demuestre haberlas memorizado.

---

## 🏗️ 3. Arquitectura Detallada de Módulos de Aprendizaje

Cada módulo cuenta con una sección de **Estudio/Teoría Visual (Flashcards)** y una sección de **Práctica/Quiz Gamificado**.

### ⚖️ Módulo 1: Legislación, RIPA (RIPIPA) y Balizamiento IALA
- **Sección Teórica e Interactiva**:
  - **Visor Fotorrealista RIPA (Día/Noche)**: Canvas interactivo. En **Modo Noche**, muestra efectos de iluminación (CSS Glow) simulando cómo se ven las luces a distancia. Permite rotar la vista (proa, babor, estribor, popa).
  - **Simulador de Reglas de Paso**: Animaciones 2D de cruces (Regla 15), alcance (Regla 13), etc.
  - **Simulador IALA (Región B)**: Boyas con animación en tiempo real de los ritmos de destellos de luz.
- **Sección Práctica**: Quiz de opción múltiple con feedback de Gamificación.

### 🛡️ Módulo 2: Seguridad Náutica, Fondeo y Averías
- **Sección Teórica e Interactiva**:
  - **Inventario PNA**: Fichas visuales de chalecos, bengalas, matafuegos.
  - **Simulador Hombre al Agua (HAA)**: Animación paso a paso de maniobras de retorno.
  - **Tenederos y Fondeo**: Interfaz gráfica para calcular el filado de cabo/cadena.
- **Sección Práctica**: Cuestionario y ejercicios de emparejamiento visual.

### ⛵ Módulo 3: Nomenclatura del Yate (Vela y Motor)
- **Sección Teórica e Interactiva**:
  - **Explorador SVG del Casco**: Plano con hotspots para Eslora, Manga, Calado, Obra Viva, etc.
  - **Arboladura y Jarcia Interactiva**: Aislar visualmente *Jarcia Fija* vs *Jarcia Móvil*.
- **Sección Práctica**: Ejercicios visuales Drag & Drop ("Unir con flechas").

### 🌬️ Módulo 4: Meteorología Náutica
- **Sección Teórica e Interactiva**:
  - **Escala Beaufort Interactiva**: Slider del 0 al 12 modificando animación de oleaje y nudos.
  - **Fenómenos Locales**: Animaciones de Pampero y Sudestada.
- **Sección Práctica**: Quiz interactivo y visual.

### 📐 Módulo 5: Ejercicios Prácticos de Navegación (Resolutivos)
- **Sección Teórica e Interactiva**:
  - Calculadora interactiva paso a paso para **Declinación Magnética ($D_m$)**.
  - Gráfico interactivo para **Tablas de Marea** y hora de paso crítico.
  - Rosa de los Vientos interactiva para trazado de **Marcaciones Simultáneas**.

---

## 🎯 4. Sección Separada: Simulador de Examen Real PNA (Integral)
*El desafío final, sin ayudas ni feedback inmediato.*

- **Mecánica del Examen**:
  - **Reloj estricto**: Cuenta regresiva de 45 a 60 minutos.
  - **40 Puntos Totales**: **35 Preguntas Teóricas** + **5 Ejercicios Prácticos Numéricos** (extraídos de los PDFs `6, 7, 8 y 9`).
- **Reporte Final (Boletín)**:
  - Gráfico Radar (Spider Chart) indicando puntos fuertes/débiles.
  - Recompensa de Gamificación: Si aprueba (>70%), recibe Medalla de Timonel. Si falla, las preguntas erróneas se envían automáticamente al algoritmo de **Caja de Repaso Espaciado**.

---

## 📊 Estado de Control de Ejecución
- **Progreso Global**: `13 / 25 Tareas completadas (52%)`
- **Estado Actual**: 🟢 **FASE 3 Completa**
- **Próxima Tarea a Ejecutar**: 🎯 **Tarea 14**

---

## 🗺️ 5. Mapa de Micro-Tareas Atomic (Ejecución Ágil de < 2 Minutos)

Leyenda de Estados:
- `[PENDIENTE]` ⏳: Tarea aún no iniciada.
- `[EN PROGRESO]` 🔄: Tarea actualmente en ejecución.
- `[COMPLETADO]` ✅: Tarea finalizada y verificada.

### 🚀 FASE 1: Setup & Despliegue en GitHub Pages (Tareas 01 - 04)
- `[COMPLETADO]` ✅ **Tarea 01**: Inicializar la estructura base Vite + React + TypeScript + Tailwind CSS con paquetes de iconos (`lucide-react`).
- `[COMPLETADO]` ✅ **Tarea 02**: Configurar `vite.config.ts` (`base: '/navega-quiz/'`).
- `[COMPLETADO]` ✅ **Tarea 03**: Crear `.github/workflows/deploy.yml` para GitHub Pages.
- `[COMPLETADO]` ✅ **Tarea 04**: Crear el Layout principal (`Navbar` Náutica con indicador de Racha Diaria 🔥).

### 📄 FASE 2: Schemas de Datos y JSONs Náuticos (Tareas 05 - 08)
- `[COMPLETADO]` ✅ **Tarea 05**: Tipos TypeScript (`src/types/quiz.ts` incluyendo tipos para XP, Rachas y Repetición Espaciada).
- `[COMPLETADO]` ✅ **Tarea 06**: `src/data/ripa_iala.json` (JSON con Legislación, RIPA Reglas 12-18, Luces y Balizamiento IALA Región B. ~80 preguntas).
- `[COMPLETADO]` ✅ **Tarea 07**: `src/data/teoria.json` (JSON de Nomenclatura, Jarcia, Seguridad Náutica, Fondeo y Meteorología. ~120 preguntas).
- `[COMPLETADO]` ✅ **Tarea 08**: `src/data/practicos.json` (JSON con variables y casos para Declinación, Tablas de Marea y Marcaciones Simultáneas).

### 🚨 FASE 3: Módulo 1 (Legislación, RIPA & IALA) (Tareas 09 - 13)
- `[COMPLETADO]` ✅ **Tarea 09**: Visor RIPA (`RipaLightViewer.tsx`).
- `[COMPLETADO]` ✅ **Tarea 10**: Visor IALA (`IalaBuoyViewer.tsx`).
- `[COMPLETADO]` ✅ **Tarea 11**: Simulador cruces (`RipaCrossingSimulator.tsx`) — 4 escenarios animados (Reglas 13, 14, 15 y 18) con rosa de los vientos, grilla náutica y acción del buque prioritario.
- `[COMPLETADO]` ✅ **Tarea 12**: `QuizCard.tsx` — Componente de quiz con animación shake en error, glow verde en acierto, floater de XP animado, sonidos Web Audio API (campana/bitonal).
- `[COMPLETADO]` ✅ **Tarea 13**: `ModuloRipaIalaView.tsx` — Orquestador con tabs Estudio/Práctica, sub-tabs visuales, quiz gamificado, pantalla de resultados con XP, precisión y medalla.

### 🛡️ FASE 4: Módulos 2, 3 y 4 (Seguridad, Nomenclatura, Clima) (Tareas 14 - 17)
- `[PENDIENTE]` ⏳ **Tarea 14**: `NomenclaturaViewer.tsx`.
- `[PENDIENTE]` ⏳ **Tarea 15**: `SeguridadViewer.tsx`.
- `[PENDIENTE]` ⏳ **Tarea 16**: `MeteorologiaViewer.tsx`.
- `[PENDIENTE]` ⏳ **Tarea 17**: Ensamblar Vistas Teóricas.

### 📐 FASE 5: Módulo 5 (Ejercicios Prácticos de Navegación) (Tareas 18 - 20)
- `[PENDIENTE]` ⏳ **Tarea 18**: `DeclinationCalculator.tsx`.
- `[PENDIENTE]` ⏳ **Tarea 19**: `TideCalculator.tsx`.
- `[PENDIENTE]` ⏳ **Tarea 20**: `BearingsSimulator.tsx`.

### ⏱️ FASE 6: Simulador de Examen Real PNA (Integral) (Tareas 21 - 23)
- `[PENDIENTE]` ⏳ **Tarea 21**: `examGenerator.ts` (Generador de examen de 40 preguntas combinadas seleccionadas de un banco general de ~200 preguntas).
- `[PENDIENTE]` ⏳ **Tarea 22**: `RealExamView.tsx`.
- `[PENDIENTE]` ⏳ **Tarea 23**: `ExamReport.tsx` (Radar chart, otorgamiento de Insignias y ruteo de fallos al algoritmo de Repaso Espaciado).

### 📱 FASE 7: Persistencia Gamificada y PWA (Tareas 24 - 25)
- `[PENDIENTE]` ⏳ **Tarea 24**: `storage.ts` (Persistencia de XP, Rachas Diarias y algoritmos de Repaso en `localStorage`).
- `[PENDIENTE]` ⏳ **Tarea 25**: Setup final de PWA y Build para GitHub Pages.
