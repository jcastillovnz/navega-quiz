# NavegaQuiz — Reglas de implementación

## Diseño de aprendizaje unificado

- Todos los módulos teóricos deben usar una composición vertical consistente dentro del viewport disponible.
- La parte superior contiene una única ilustración contextual; la parte inferior contiene teoría breve, pregunta, opciones y explicación de la respuesta.
- Distribución base: 46% de la altura para la ilustración y 54% para el aprendizaje. Las preguntas y explicaciones son el contenido principal.
- La ilustración debe verse completa (`object-contain`) cuando un recorte pueda ocultar información náutica relevante.
- No repetir una misma imagen mediante paneles, acercamientos laterales o mosaicos.
- Cada ilustración debe corresponder directamente con el objeto o situación preguntada: vela, motor, luces, marca diurna, boya, ancla, cabo, instrumento o fenómeno.
- Preferir ilustraciones técnicas de alta definición, con volumen, textura y objetos completos. Evitar fotografías ambiguas y también diagramas excesivamente simples.
- Mantener un único lenguaje visual dentro de cada módulo. RIPA usa ilustración náutica técnica detallada.
- Las luces nocturnas RIPA e IALA pueden conservar animación luminosa para enseñar color, sector y ritmo.
- Las explicaciones posteriores a la respuesta deben permanecer visibles y disponer de desplazamiento interno si el texto excede el espacio.
- La aplicación debe conservar la arquitectura zero-scroll: sin desplazamiento global y con scroll solo dentro del panel de contenido cuando sea imprescindible.

## Verificación obligatoria

- Antes de entregar cambios de interfaz ejecutar `npm run build`, `npm run lint` y `git diff --check`.
- Validar que toda pregunta teórica resuelva a un recurso visual o visor contextual visible.
- Registrar cada pregunta nueva en `src/data/visualManifest.ts` con su familia y la evidencia visual que el usuario debe observar.
- Ejecutar `npm run validate:visuals`; una pregunta sin cobertura visual no debe considerarse terminada.
- No modificar la lógica de evaluación, progreso o almacenamiento al realizar cambios puramente visuales.
