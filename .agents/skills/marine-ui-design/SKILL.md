---
name: Marine Zero-Scroll UI & Hyper-Realistic Graphics
description: Buenas prácticas obligatorias de diseño UI/UX sin scroll (100dvh), animaciones GIF hiperrealistas e imágenes 3D para NavegaQuiz.
---

# Marine Zero-Scroll UI & Hyper-Realistic Graphics Skill

Cuando estés trabajando en cualquier componente de interfaz o vista en **NavegaQuiz**, debes aplicar **obligatoriamente** las siguientes directivas de UX/UI, animaciones GIF hiperrealistas y realismo visual:

## 1. Animaciones GIF e Ilustraciones Hiperrealistas Obligatorias
- **Prohibido el uso de íconos vectoriales planos o simples trazados 2D para representar barcos, nudos o boyas**.
- **Animaciones GIF & Loop Graphics Hiperrealistas**:
  - **Balizamiento IALA**: Para los ritmos luminosos (destello simple, grupo de 2 destellos, isofásica), utilizar **animaciones GIF / Loops hiperrealistas** que muestren el parpadeo fotográfico real de los faroles sobre el agua y la refracción en la noche marina.
  - **Luces de Navegación RIPA**: GIFs animados o bucles con balanceo suave sobre las olas del océano y resplandor fotográfico (`glow`) de luces de tope (blanca), babor (roja) y estribor (verde).
  - **Cabuyería & Nudos 3D**: Animaciones paso a paso en bucle que muestren la fibra sintética de poliéster pasando por los senos y ajustando el nudo con relieve hiperrealista.
  - **Meteorología (Escala Beaufort & Fenómenos)**: Bucles animados del estado del mar (olas rompiendo, spray, relámpagos de Cumulonimbus, Pampero y Sudestada).
- **Formatos y Carga**:
  - Servir imágenes y GIFs optimizados desde `src/assets/` o recursos públicos en alta definición.

## 2. Arquitectura "Zero-Scroll" (Single-Screen / 100dvh)
- **Cero Scroll General**: Ninguna vista debe requerir desplazamiento vertical u horizontal para ver la pantalla completa. Toda la vista debe encajar perfectamente en el viewport (`100dvh` / `h-screen overflow-hidden`).
- **Estructura Fija Tridimensional**:
  1. **Navbar Fijo Compacto**: `h-12` (48px) con indicador de racha 🔥 y botón "Menú Principal".
  2. **Contenido Principal**: `flex-1 min-h-0 overflow-hidden`.
  3. **Status Bar / Footer Fijo**: `h-7` (28px) en la parte inferior.
- **Distribución en 2 Columnas (Side-by-Side Grid)**:
  - **Columna Izquierda (7 Cols)**: Canvas Visual Hiperrealista (Visor 3D / GIF Animado / Barco RIPA) escalado proporcionalmente (`max-h-full`).
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
