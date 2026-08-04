# NavegaQuiz — Reglas de implementación

## Diseño de aprendizaje unificado

- Todos los módulos teóricos deben usar una composición vertical consistente dentro del viewport disponible.
- La parte superior contiene una única ilustración contextual; la parte inferior contiene teoría breve, pregunta, opciones y explicación de la respuesta.
- Distribución base: 46% de la altura para la ilustración y 54% para el aprendizaje. Las preguntas y explicaciones son el contenido principal.
- La ilustración debe verse completa (`object-contain`) cuando un recorte pueda ocultar información náutica relevante.
- No repetir una misma imagen mediante paneles, acercamientos laterales o mosaicos.
- Cada ilustración debe corresponder directamente con el objeto o situación preguntada: vela, motor, luces, marca diurna, boya, ancla, cabo, instrumento o fenómeno.
- Cada pregunta debe tener exactamente una ilustración principal coherente con su enunciado, sus opciones y la explicación de la respuesta. La ilustración no puede ser meramente decorativa ni pertenecer solo al tema general del módulo.
- La correspondencia debe validarse semánticamente antes de entregar: si se pregunta por una vela debe verse esa vela; si se pregunta por un buque a motor debe verse ese tipo de buque; si se evalúan luces, marcas, boyas, señales, piezas o maniobras, deben representarse su configuración, color, posición, orientación y contexto reglamentario correctos.
- No usar una ilustración genérica como fallback silencioso cuando falte una escena específica. En ese caso se debe crear o asignar un recurso adecuado y registrar explícitamente su evidencia visual.
- La imagen previa a responder debe aportar las pistas necesarias para observar y razonar la situación, pero no debe revelar la respuesta mediante rótulos que nombren directamente la opción correcta.
- Cuando varias preguntas compartan una familia visual, el visor debe adaptar realmente la escena al contexto de cada pregunta; compartir componente no autoriza a mostrar el mismo contenido indiferenciado.
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
- La validación automática de cobertura es solo el primer control: también se debe revisar la escena renderizada y comprobar que coincide con el enunciado, que el elemento evaluado se distingue completo y que no aparecen objetos, luces, marcas o rótulos contradictorios.
- Para cada pregunta nueva o modificada, verificar como mínimo: sujeto correcto, condición diurna/nocturna correcta, perspectiva útil, detalle visible, ausencia de recorte informativo y consistencia entre ilustración, respuesta correcta y explicación.
- Una pregunta con una imagen técnicamente cargada pero semánticamente incorrecta debe tratarse como una pregunta sin ilustración y no puede considerarse terminada.
- No modificar la lógica de evaluación, progreso o almacenamiento al realizar cambios puramente visuales.
