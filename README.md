# ⚓ NavegaQuiz

> **Preparación interactiva para el examen oficial de Timonel de Yate a Vela y Motor** — Prefectura Naval Argentina (PNA).

Una aplicación web 100% client-side, sin backend, sin login, sin tracking. Tus datos viven en tu navegador. Funciona offline después del primer load. Diseñada para que apruebes el examen.

🌊 **[Probar la app](#-cómo-usarla)** · 📚 **[Módulos](#-módulos-de-estudio)** · 🏆 **[Examen final](#-simulador-de-examen-real-pna)**

---

## 🎯 ¿Qué es?

**NavegaQuiz** es una plataforma de estudio gamificada para el examen de **Timonel de Yate a Vela y Motor** (PNA Argentina). Reemplaza el PDF de 600+ páginas por:

- **Simuladores visuales interactivos** en lugar de diagramas estáticos
- **Microlearning** (flashcards y quizzes cortos) en lugar de muros de texto
- **Active Recall** (preguntas activas) en lugar de lectura pasiva
- **Spaced Repetition** (repetición espaciada) en lugar de releer todo
- **Gamificación** (XP, rangos, rachas) para mantener el hábito

## ✨ Funcionalidades principales

### 🧠 Pedagogía moderna
- 📊 **5 módulos** cubriendo todo el temario oficial
- 🎮 **Sistema de XP y rangos** (Grumete → Marinero → Contramaestre → Timonel)
- 🔥 **Rachas diarias** con badges por constancia
- 🔁 **Caja de repaso** con algoritmo de repetición espaciada (SM-2)
- 🏅 **Insignias** por logros (racha de 7/30 días, aprobación de módulos, etc.)
- 🏆 **Medalla de Timonel** al aprobar el simulacro final

### 💻 Experiencia técnica
- 📱 **PWA instalable** (funciona offline como una app nativa)
- 🌙 **Modo día/noche** en simuladores visuales
- 🔊 **Sonidos de feedback** (campana de barco al acertar)
- ✨ **Animaciones** con sacudida al fallar, partículas XP al acertar
- 💾 **Persistencia local** — todo se guarda en tu navegador, sin servidores

## 📚 Módulos de estudio

### Módulo 1 — Legislación, RIPA & IALA ⚖️
Las reglas del mar. Aprende las reglas de paso (12-18) y el balizamiento IALA Región B con simuladores visuales.

- **Visor RIPA Día/Noche**: Ve un buque desde proa, popa, babor o estribor. Las luces se encienden como en la realidad (rojo a babor, verde a estribor, blanca de tope/alcance).
- **Simulador de Cruces**: 4 escenarios animados (vuelta encontrada, cruce, alcance, vela vs motor). Ves qué barco tiene prioridad y qué maniobra hacer.
- **Visor IALA**: Boyas de babor, estribor, peligro aislado y aguas seguras. Observa los ritmos de destellos reales.

### Módulo 2 — Seguridad Náutica y Fondeo 🛟
Lo que necesitás llevar a bordo y cómo reaccionar en emergencia.

- **Inventario PNA**: Checklist visual de elementos obligatorios (chalecos, bengalas, matafuegos, VHF).
- **Hombre al Agua (HAA)**: Procedimiento paso a paso para maniobra de rescate (motor y vela/método Williamson).
- **Calculadora de Fondeo**: Ingresás profundidad y condición del tiempo, te dice cuántos metros de línea filar.

### Módulo 3 — Nomenclatura del Yate ⛵
Las partes del barco y la jarcia.

- **Explorador del Casco**: Plano SVG interactivo con 11 hotspots clicables (proa, popa, eslora, manga, calado, obra viva, obra muerta, francobordo, quilla, etc.).
- **Jarcia Interactiva**: 11 cabos clasificados como **Jarcia Fija** (obenques, estays) vs **Jarcia Móvil** (drizas, escotas, amantillos).

### Módulo 4 — Meteorología Náutica 🌬️
Cómo leer el tiempo en el Río de la Plata.

- **Escala Beaufort Interactiva**: Slider del 0 al 12 con animación de oleaje dinámica, relámpagos en F10+, lluvia en F7+ y un velero mecíendose.
- **Pampero y Sudestada**: Tarjetas explicativas de los fenómenos locales más importantes para la zona.

### Módulo 5 — Ejercicios Prácticos 📐
Las cuentas que te pueden tomar en el examen.

- **Calculadora de Declinación Magnética**: Ingresás año de la carta, D<sub>m</sub> base y variación anual. Te explica paso a paso cómo llegar al resultado.
- **Calculadora de Mareas**: Tabla editable con predicción de altura por interpolación, dirección de marea y veredicto de cruce crítico.
- **Simulador de Marcaciones**: Rosa de los vientos interactiva. Movés los sliders de bearing y ves cómo dos marcaciones se intersectan para definir tu posición (FIX).

## 🏆 Simulador de Examen Real PNA

El desafío final. Sin ayudas, sin feedback inmediato, con cronómetro estricto.

- **40 puntos totales**: 35 preguntas teóricas + 5 ejercicios prácticos
- **60 minutos** con cronómetro regresivo (alerta visual a <5 min)
- **Banco de ~40 preguntas** seleccionadas aleatoriamente de todas las categorías
- **Reporte final con RadarChart** mostrando tu rendimiento por módulo
- **Medalla de Timonel** al obtener ≥70%
- Si fallás, tus errores van automáticamente a la **Caja de Repaso** para que aparezcan con más frecuencia

## 🚀 Cómo usarla

### Opción 1: Online (recomendado)
1. Abrí la app en tu navegador (Chrome, Safari, Firefox, Edge).
2. Hacé click en "Instalar" cuando el navegador lo ofrezca → queda como app nativa en tu celular/PC.
3. Estudiá los módulos en orden. Empezá con la sección "Estudio" de cada uno, después pasá a "Práctica" para hacer el quiz.
4. Cuando te sientas preparado, andá al Simulador de Examen.

### Opción 2: Local (desarrollo)
Si querés correrla en tu máquina:

```bash
git clone https://github.com/jcastillovnz/navega-quiz.git
cd navega-quiz
npm install
npm run dev
```

Abre http://localhost:5173 en tu navegador.

## 🛠️ Stack técnico

- **React 19** + **TypeScript** + **Vite 8**
- **Tailwind CSS 4** para estilos
- **lucide-react** para iconografía
- **Web Audio API** para sonidos UI
- **localStorage** para persistencia
- **Service Worker** para modo offline (PWA)
- Sin backend, sin base de datos, sin tracking

## 📐 Algoritmos

### Repetición espaciada (SM-2 simplificado)
La Caja de Repaso usa una variante del algoritmo SuperMemo-2:
- **Acierto**: `interval = interval × ease`, `ease = min(3.0, ease + 0.05)`
- **Fallo**: `interval = 1`, `ease = max(1.3, ease - 0.2)`

### Sistema de rangos
| Rango | XP mínima |
|---|---|
| 🌱 Grumete | 0 |
| ⚓ Marinero | 500 |
| 🧭 Contramaestre | 1500 |
| 👑 Timonel | 3500 |

### Rachas
- Estudio cada día consecutivo → racha +1
- Salto de un día → racha vuelve a 1
- Racha ≥7 días → insignia "Marinero Constante"
- Racha ≥30 días → insignia "Timonel Dedicado"

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Si encontrás un error, querés agregar una pregunta nueva, o tenés una idea para mejorar un simulador:

1. Fork el repositorio
2. Creá una rama (`git checkout -b feature/nueva-pregunta-ripa`)
3. Commiteá tus cambios
4. Pusheá y abrí un Pull Request

### Dónde agregar contenido
- **Preguntas teóricas nuevas**: `src/data/ripa_iala.json` o `src/data/teoria.json`
- **Ejercicios prácticos nuevos**: `src/data/practicos.json`
- **Nuevos simuladores**: `src/components/<categoria>/`

## 📋 Temario cubierto

Basado en el programa oficial de la PNA para Timonel de Yate a Vela y Motor:

- ✅ RIPA (Reglas 12 a 18)
- ✅ Balizamiento IALA Región B (babor, estribor, peligro aislado, aguas seguras, cardinales)
- ✅ Nomenclatura del yate (casco, arboladura, jarcia fija y móvil)
- ✅ Seguridad (PNA, HAA, fondeo, VHF, señales)
- ✅ Meteorología (Beaufort, Pampero, Sudestada, cumulonimbus)
- ✅ Navegación (declinación magnética, mareas, marcaciones simultáneas)

## ⚠️ Disclaimer

**NavegaQuiz es una herramienta de estudio complementaria, NO reemplaza al material oficial de la PNA ni al curso habilitante.** Siempre consultá con tu instructor y con la documentación oficial de Prefectura Naval Argentina antes de rendir el examen.

## 📄 Licencia

MIT © José Castillo

---

⚓ **¡Buen viento y mejor estudio!** Si la app te ayuda a aprobar, contame. ⚓
