---
name: Marine Zero-Scroll UI & Hyper-Realistic Graphics
description: Buenas prácticas obligatorias de diseño UI/UX sin scroll (100dvh) e imágenes/ilustraciones náuticas hiperrealistas para NavegaQuiz.
---

# Marine Zero-Scroll UI & Hyper-Realistic Graphics Skill

Cuando estés trabajando en cualquier componente de interfaz o vista en **NavegaQuiz**, debes aplicar **obligatoriamente** las siguientes directivas de UX/UI y realismo visual hiperrealista:

## 1. Gráficos e Imágenes Hiperrealistas Obligatorios
- **Prohibido el uso de íconos vectoriales planos o simples trazados 2D para representar barcos, nudos o boyas**.
- **Ilustraciones Náuticas Hiperrealistas**:
  - **Barcos & Veleros**: Renderizado 3D de nivel fotográfico con oleaje realista, reflejos en el casco de dacron/fibra, velas en tensión con iluminación dramática de altamar.
  - **Luces de Navegación RIPA**: Renderizado nocturno en alta definición con destellos luminosos (`glow`), destello estelar en tope y refracción en el agua de mar.
  - **Balizamiento IALA**: Boyas 3D con textura metálica real, óxido de mar, cadena de fondeo bajo agua cristalina y marcas de tope según normativa Región B.
  - **Cabuyería & Nudos**: Fibras de poliéster colchado con relieve de trenzado real, sombras de superposición proyectadas en 3D y marcaje cromático anatómico (🔴 **FIRME** vs 🔵 **CHICOTE**).

## 2. Arquitectura "Zero-Scroll" (Single-Screen / 100dvh)
- **Cero Scroll General**: Ninguna vista debe requerir desplazamiento vertical u horizontal para ver la pantalla completa. Toda la vista debe encajar perfectamente en el viewport (`100dvh` / `h-screen overflow-hidden`).
- **Estructura Fija Tridimensional**:
  1. **Navbar Fijo Compacto**: `h-12` (48px) con indicador de racha 🔥 y botón "Menú Principal".
  2. **Contenido Principal**: `flex-1 min-h-0 overflow-hidden`.
  3. **Status Bar / Footer Fijo**: `h-7` (28px) en la parte inferior.
- **Distribución en 2 Columnas (Side-by-Side Grid)**:
  - **Columna Izquierda (7 Cols)**: Canvas Visual Hiperrealista (Visor 3D, Barco RIPA, Boya IALA) escalado proporcionalmente (`max-h-full`).
  - **Columna Derecha (5 Cols)**: Panel explicativo y preguntas con micro-paddings (`p-2.5` / `p-3`) y tipografía responsive (`text-xs`).

## 3. Navegación y Routing Consistente
- El logo **NavegaQuiz** y el botón **Menú Principal** deben permitir regresar en todo momento al Dashboard general (`HOME`) que alberga los **7 Módulos Oficiales PNA**:
  1. RIPA & IALA
  2. Seguridad & Fondeo
  3. Nomenclatura
  4. Meteorología
  5. Prácticos de Navegación (Declinación, Mareas, Marcaciones)
  6. Nudos Náuticos (3D & Desafío)
  7. Simulador de Examen Real PNA
