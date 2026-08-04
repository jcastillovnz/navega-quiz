---
name: Marine Zero-Scroll UI & Realistic Graphics
description: Buenas prácticas obligatorias de diseño UI/UX sin scroll (100dvh) e ilustraciones vectoriales náuticas fotorrealistas para NavegaQuiz.
---

# Marine Zero-Scroll UI & Realistic Graphics Skill

Cuando estés trabajando en cualquier componente de interfaz o vista en **NavegaQuiz**, debes aplicar **obligatoriamente** las siguientes directivas de UX/UI y realismo visual:

## 1. Arquitectura "Zero-Scroll" (Single-Screen / 100dvh)
- **Cero Scroll General**: Ninguna vista debe requerir desplazamiento vertical u horizontal para ver la pantalla completa. Toda la vista debe encajar perfectamente en el viewport (`100dvh` / `h-screen overflow-hidden`).
- **Estructura Fija Tridimensional**:
  1. **Navbar Fijo Compacto**: `h-12` (48px) con indicador de racha 🔥 y botón "Menú Principal".
  2. **Contenido Principal**: `flex-1 min-h-0 overflow-hidden`.
  3. **Status Bar / Footer Fijo**: `h-7` (28px) en la parte inferior.
- **Distribución en 2 Columnas (Side-by-Side Grid)**:
  - **Columna Izquierda (7 Cols)**: Visual Canvas (Visor SVG, Barco RIPA, Boya IALA) escalado proporcionalmente.
  - **Columna Derecha (5 Cols)**: Panel explicativo y preguntas con micro-paddings (`p-2.5` / `p-3`) y tipografía responsive (`text-xs`).

## 2. Ilustraciones Náuticas Fotorrealistas
- **Cabuyería y Nudos**:
  - Los cabos deben renderizarse con **volumen 3D** (degradados `<linearGradient>`) y **sombras de cruce proyectadas** (`filter drop-shadow`).
  - **Diferenciación Anatómica Obligatoria**: Resaltar siempre con etiquetas claras:
    - 🔴 **FIRME (Tensión)**: Cable/cabo sujeto a la embarcación bajo carga.
    - 🔵 **CHICOTE (Extremo Libre)**: Punta del cabo con la que se realiza la maniobra.
  - **Diferenciación de Mena**: Cabos de distinto diámetro deben dibujarse con grosores visibles (ej: `strokeWidth="14"` para cabo de fondeo vs `strokeWidth="8"` para cabo fino).
- **Simulador RIPA (Luces Nocturnas)**:
  - Utilizar efectos de resplandor fotorrealista CSS (`glow-red`, `glow-green`, `glow-white`) para simular la luz proyectada en la noche.
- **Simulador IALA (Balizamiento)**:
  - Animación de destellos rítmicos (`@keyframes`) para marcas laterales, peligro aislado y aguas seguras.

## 3. Navegación y Routing Consistente
- El logo **NavegaQuiz** y el botón **Menú Principal** deben permitir regresar en todo momento al Dashboard general (`HOME`) que alberga los **7 Módulos Oficiales PNA**:
  1. RIPA & IALA
  2. Seguridad & Fondeo
  3. Nomenclatura
  4. Meteorología
  5. Prácticos de Navegación (Declinación, Mareas, Marcaciones)
  6. Nudos Náuticos (3D & Desafío)
  7. Simulador de Examen Real PNA
