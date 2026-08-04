# NavegaQuiz - Reglas y Directivas para Agentes de IA

Bienvenido Agente. Estás trabajando en **NavegaQuiz**, una aplicación web estática (100% Client-Side, sin backend) para el estudio interactivo y la preparación del examen de **Timonel de Yate a Vela y Motor** en Argentina.

Este archivo `.agents/AGENTS.md` es la fuente de verdad y las reglas operativas que debes seguir **estrictamente** durante toda tu ejecución en este workspace.

---

## 📖 1. Tu Misión y Metodología de Trabajo

Tu objetivo principal es construir la aplicación siguiendo **al pie de la letra** el plan maestro detallado en el archivo `PLAN_APP_TIMONEL.md` ubicado en la raíz del repositorio. 

El proyecto está organizado en un **Mapa de 25 Micro-Tareas Atómicas** (diseñadas para ejecutarse en < 2 minutos). 

**Flujo de Trabajo Obligatorio:**
1. Al recibir una petición del usuario (Ej: *"Ejecuta la Tarea 01"* o *"Siguiente tarea"*), **siempre** debes leer el archivo `PLAN_APP_TIMONEL.md` primero.
2. Identifica la tarea que se te pide en la sección "Mapa de Micro-Tareas Atomic".
3. Revisa su estado (debería ser `[PENDIENTE]` ⏳ o `[EN PROGRESO]` 🔄).
4. Ejecuta el código y los comandos necesarios para **completar únicamente esa tarea**. No te adelantes a tareas futuras.
5. Al finalizar tu trabajo exitosamente, **debes actualizar el archivo `PLAN_APP_TIMONEL.md`** cambiando el estado de esa tarea a `[COMPLETADO]` ✅ y actualizando la sección `Estado Actual de Ejecución` (Progreso global y Próxima Tarea).

---

## 🛠️ 2. Restricciones Tecnológicas

- **Arquitectura**: La app debe funcionar como una **Página Estática en GitHub Pages**. **NO** utilices bases de datos (ni Firebase, ni Supabase), **NO** uses APIs externas (a menos que sean recursos públicos estáticos), y **NO** uses backends (Node.js/Express, Next.js API Routes).
- **Stack**: **Vite + React + TypeScript**.
- **Estilos**: **Tailwind CSS** + CSS puro (si se requieren animaciones complejas/glow effects).
- **Iconos**: Utiliza la librería **Lucide React** (`lucide-react`).
- **Persistencia de Datos**: Todo el progreso del usuario (notas de exámenes, "Caja de Repaso" de errores, rachas diarias) se debe guardar en **`localStorage`**.
- **Contenido Teórico**: Todo el texto teórico, preguntas y ejercicios prácticos debe estar hardcodeado o servido desde archivos `.json` ubicados en `src/data/` que tú mismo crearás basándote en la teoría náutica general requerida.

---

## 🎨 3. Estética y Diseño Visual (UX/UI)

El usuario espera una aplicación web de alta calidad. 
- **La estética es crucial.** Debes crear un diseño "Premium" y "Náutico".
- **Colores Principales**: Tonos profundos de azul marino (Dark Navy/Slate `bg-slate-900`), blanco puro, y acentos de color cian (`cyan-500`) o dorado (`amber-500`) para elementos destacados. 
- **Modo Oscuro (Glassmorphism)**: Prioriza fondos oscuros y marinos con tarjetas semi-transparentes (blur/glassmorphism) cuando el simulador (como el Visor RIPA nocturno) lo requiera.
- **Micro-interacciones**: Asegúrate de que los botones tengan efectos `hover` atractivos, transiciones suaves y feedback visual al responder una pregunta (verde para éxito, rojo para error, con sutiles sacudidas o pings de Tailwind).
- **Skill de UI & Gráficos**: Consulta y aplica **estrictamente** las directivas en [.agents/skills/marine-ui-design/SKILL.md](file:///Users/jose-castillo/navega-quiz/.agents/skills/marine-ui-design/SKILL.md) para garantizar una arquitectura **Zero-Scroll (`100dvh`)** sin desplazamiento horizontal/vertical e **ilustraciones vectoriales fotorrealistas** (Sombras 3D, Glow de luces, Anatomía de cabos Chicote/Firme).

---

## 🗺️ 4. Reglas Críticas del Simulador de Examen (Fase 6)

Cuando construyas la parte del **Simulador de Examen Real**:
- El simulador de examen debe ser **riguroso**. No puede dar feedback en tiempo real.
- Debe combinar **ambos tipos de preguntas**: Opción múltiple (teoría) y Ejercicios Prácticos Numéricos ($D_m$, Mareas, Marcaciones).
- Debe tener un reloj de cuenta regresiva (45 a 60 min).
- Al finalizar, debe generar un "Boletín" (si es posible, usando un Radar Chart o gráficos simples CSS/SVG) para mostrar los puntos fuertes y débiles.

---

## 🏁 Instrucciones de Inicialización
Si estás creando el proyecto por primera vez, recuerda correr el comando de Vite sin modo interactivo para crear el template de React + TS en el directorio actual, o en su defecto construir la estructura de carpetas a mano asegurándote de usar los presets correctos de Tailwind.

¡Respeta el plan `PLAN_APP_TIMONEL.md`, escribe buen código TypeScript y buena suerte!
