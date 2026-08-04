---
name: Marine UI/UX & Gamification
description: Mejores prácticas y patrones visuales para crear interfaces náuticas interactivas, gamificadas y fotorrealistas (Tailwind, Lucide, CSS Glow, SVG).
---

# Marine UI/UX & Gamification Skill

Cuando estés trabajando en componentes visuales y frontend para NavegaQuiz, aplica obligatoriamente los siguientes patrones de diseño y experiencia de usuario:

## 1. Paleta de Colores Náutica (Tailwind CSS)
Usa esta paleta base para mantener una estética marítima premium:
- **Fondo General**: `bg-slate-900` (Noche/Profundidad) o `bg-slate-50` (Día).
- **Acentos Primarios**: `text-cyan-400` / `bg-cyan-500` (Agua y elementos interactivos).
- **Logros y XP**: `text-amber-500` / `bg-amber-500` (Oro, medallas, rachas).
- **Feedback (Éxito/Error)**: `bg-emerald-500` (Acierto) y `bg-rose-500` (Error).
- **Efecto Glassmorphism (Tarjetas)**: Usa `bg-white/10 backdrop-blur-md border border-white/20` para paneles flotantes sobre fondos oscuros o marítimos.

## 2. Efectos Fotorrealistas (Visor RIPA e IALA)
Para simular faros, boyas y luces de navegación en el "Modo Noche", es obligatorio usar el efecto **Glow (resplandor)** mediante CSS puro o clases arbitrarias de Tailwind:
```css
/* Ejemplo CSS para luces RIPA */
.glow-red { box-shadow: 0 0 15px 5px rgba(239, 68, 68, 0.7); background: #ef4444; }
.glow-green { box-shadow: 0 0 15px 5px rgba(34, 197, 94, 0.7); background: #22c55e; }
.glow-white { box-shadow: 0 0 15px 5px rgba(255, 255, 255, 0.7); background: #ffffff; }
```
- **Destellos IALA**: Usa animaciones de fotogramas clave (`@keyframes blink`) combinando la propiedad `opacity` para simular los ritmos exactos (destello corto, largo, isofase, ocultación).

## 3. Micro-Interacciones de Gamificación (UI)
- **Error (Active Recall)**: Al fallar una pregunta, aplica una animación de sacudida horizontal (Keyframes de Shake) al contenedor de la respuesta incorrecta y pinta de rojo.
- **Transiciones**: Siempre usa `transition-all duration-300` para botones y hover states.
- **Iconografía Gamificada**: Representa las Rachas Diarias con iconos de fuego (🔥) de `lucide-react`, y los niveles del usuario con anclas o veleros (⚓, ⛵).

## 4. Tarjetas de Estudio (Flashcards)
Para el *Microlearning*, las tarjetas teóricas deben poder "girar" (Flip Card en 3D) mediante CSS `transform: rotateY(180deg)` y `backface-visibility: hidden`, de modo que el frente muestre la pregunta o el diagrama, y el reverso la explicación.
