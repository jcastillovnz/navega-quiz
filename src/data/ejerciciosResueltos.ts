/**
 * EJERCICIOS RESUELTOS OFICIALES - Timonel de Yate (PNA)
 *
 * Fuente: PDFs oficiales en la raíz del proyecto
 *  - "6 Ejercicios tipo parcial 2025.pdf"
 *  - "7 / 8 / 9 ejercicios tipo examen Timonel.pdf"
 *
 * Toda la metodología fue VERIFICADA numéricamente contra las respuestas
 * oficiales de los PDFs (ver /scripts/verify-practicos.js).
 *
 * Reglas clave confirmadas:
 *  1. DECLINACIÓN: Dm_actual = Dm_carta ± (años × variación anual).
 *     Mismo signo (W+W o E+E) => SUMA. Distinto signo (W y E) => RESTA.
 *  2. RUMBO VERDADERO:  Rv = Rm − Dm(W)   |   Rv = Rm + Dm(E)
 *     (Regla: "Oeste resta, Este suma" al pasar de magnético a verdadero.)
 *  3. TIEMPO = Distancia / Velocidad  (horas → +0.xx × 60 = minutos).
 *  4. MAREAS (paso crítico):  sonda + marea + viento − calado ≥ margen
 *     => marea_mínima = margen + calado − viento − sonda.
 *     Se elige la hora más temprana cuya marea supere ese mínimo.
 *  5. MARCACIONES SIMULTÁNEAS: se trazan las marcaciones inversas
 *     (Mm ± 180°) desde cada punto notable; su intersección es el fix.
 */

export type ExerciseType =
  | 'DECLINACION'
  | 'RUMBO'
  | 'ESTIMA'
  | 'MAREAS'
  | 'MARCACIONES';

export interface SolutionStep {
  /** Título corto del paso (ej. "Diferencia de años") */
  label: string;
  /** Explicación en prosa de qué se hace y por qué */
  detail: string;
  /** Fórmula o cálculo concreto de este paso (opcional) */
  formula?: string;
}

export interface WorkedExercise {
  id: string;
  type: ExerciseType;
  source: string; // PDF de origen
  title: string;
  /** Enunciado tal como aparece en el examen */
  statement: string;
  /** Datos de partida ya ordenados (par clave/valor) */
  givens: { label: string; value: string }[];
  /** Resolución paso a paso */
  steps: SolutionStep[];
  /** Resultado final (una o varias líneas) */
  answer: string[];
  /** Consejo / regla mnemotécnica */
  tip?: string;
}

export interface ExerciseTypeInfo {
  type: ExerciseType;
  name: string;
  /** Explicación general del método antes de ver ejemplos */
  method: string;
  formula: string;
}

/* ------------------------------------------------------------------ */
/*  MÉTODOS GENERALES (teoría breve por tipo)                          */
/* ------------------------------------------------------------------ */

export const EXERCISE_METHODS: ExerciseTypeInfo[] = [
  {
    type: 'DECLINACION',
    name: 'Declinación Magnética',
    method:
      'La carta indica la declinación (Dm) para un año, con su variación anual. Para actualizarla al año pedido: contamos los años transcurridos, multiplicamos por la variación anual y aplicamos al valor de la carta. Si la Dm y la variación tienen el MISMO signo (W+W o E+E) se SUMAN; si tienen signo DISTINTO (una W y otra E) se RESTAN.',
    formula: 'Dm_actual = Dm_carta ± (años × variación anual)',
  },
  {
    type: 'RUMBO',
    name: 'Distancia · Rumbo · Tiempo',
    method:
      'Sobre la carta se mide la distancia entre A y B con el compás de puntas (en millas náuticas) y el rumbo con la rosa. El tiempo se obtiene dividiendo la distancia por la velocidad. Los minutos salen de multiplicar la parte decimal de la hora por 60.',
    formula: 'Tiempo = Distancia ÷ Velocidad',
  },
  {
    type: 'ESTIMA',
    name: 'Navegación de Estima',
    method:
      'Partiendo de una posición conocida con un rumbo magnético (Rm) y velocidad, calculamos la nueva posición tras cierto tiempo. Primero actualizamos la Dm al año actual, la aplicamos al Rm para obtener el rumbo verdadero (Rv), calculamos la distancia recorrida y trasladamos la posición sobre ese Rv en la carta. Finalmente verificamos si hay algún peligro (boya) cerca de la derrota.',
    formula: 'Rv = Rm − Dm(W)  |  Rv = Rm + Dm(E)   ·   Distancia = Vel × Tiempo',
  },
  {
    type: 'MAREAS',
    name: 'Mareas y Paso Crítico',
    method:
      'Para cruzar un paso poco profundo necesitamos suficiente agua. El agua total disponible es la profundidad de la carta (sonda) más la altura de marea, corregida por el viento. Debe cubrir el calado del barco más un margen de seguridad. Despejamos la altura de marea mínima necesaria y buscamos en la tabla la hora más temprana que la alcance.',
    formula: 'marea_mínima = margen + calado − viento − sonda',
  },
  {
    type: 'MARCACIONES',
    name: 'Marcaciones Simultáneas',
    method:
      'Tomamos la marcación magnética (Mm) a dos puntos notables identificables en la carta al mismo tiempo. Desde cada punto trazamos la marcación INVERSA (Mm ± 180°). El punto donde se cruzan ambas rectas es nuestra posición (fix). Luego se lee la latitud/longitud y la boya más cercana.',
    formula: 'Marcación inversa = Mm ± 180°  →  intersección = posición',
  },
];

/* ------------------------------------------------------------------ */
/*  EJERCICIOS RESUELTOS                                               */
/* ------------------------------------------------------------------ */

export const WORKED_EXERCISES: WorkedExercise[] = [
  /* ============ DECLINACIÓN ============ */
  {
    id: 'decl_ex9_4',
    type: 'DECLINACION',
    source: '9 ejercicios tipo examen',
    title: 'Declinación para Febrero 2025 (mismo signo)',
    statement:
      'Se desea obtener el valor de la Declinación Magnética para Febrero de 2025. La carta náutica publicada en 2021 indica: Dm = 07° 25′ 00″ W. Variación Secular = 08′ 24″ W.',
    givens: [
      { label: 'Dm de la carta (2021)', value: '07° 25′ 00″ W' },
      { label: 'Variación anual', value: '08′ 24″ W' },
      { label: 'Año buscado', value: '2025' },
    ],
    steps: [
      {
        label: 'Años transcurridos',
        detail: 'Restamos el año de la carta al año buscado.',
        formula: '2025 − 2021 = 4 años',
      },
      {
        label: 'Variación total',
        detail: 'Multiplicamos la variación anual por los años transcurridos.',
        formula: '4 × 08′ 24″ = 33′ 36″ W',
      },
      {
        label: '¿Suma o resta?',
        detail:
          'La Dm de la carta es W y la variación también es W: mismo signo, por lo tanto se SUMAN.',
        formula: 'W + W  →  SUMA',
      },
      {
        label: 'Cálculo final',
        detail: 'Sumamos la variación total a la Dm de la carta (segundos, minutos y grados).',
        formula: "07° 25′ 00″ + 33′ 36″ = 07° 58′ 36″ W",
      },
    ],
    answer: ['Dm (Feb 2025) = 07° 58′ 36″ W'],
    tip: 'Regla mnemotécnica: "Igual signo suma, distinto signo resta".',
  },
  {
    id: 'decl_ex8_a',
    type: 'DECLINACION',
    source: '8 ejercicios tipo examen',
    title: 'Declinación para 2025 (signos opuestos)',
    statement:
      'Obtener la Declinación Magnética para 2025. La carta de 2021 indica: Dm = 07° 03′ 09″ W. Variación Secular = 09′ 16″ E.',
    givens: [
      { label: 'Dm de la carta (2021)', value: '07° 03′ 09″ W' },
      { label: 'Variación anual', value: '09′ 16″ E' },
      { label: 'Año buscado', value: '2025' },
    ],
    steps: [
      {
        label: 'Años transcurridos',
        detail: 'Diferencia entre el año buscado y el de la carta.',
        formula: '2025 − 2021 = 4 años',
      },
      {
        label: 'Variación total',
        detail: 'Variación anual por los años.',
        formula: '4 × 09′ 16″ = 37′ 04″ E',
      },
      {
        label: '¿Suma o resta?',
        detail:
          'La Dm es W pero la variación es E: signos distintos, por lo tanto se RESTAN. El resultado conserva el signo del mayor (la Dm, que es W).',
        formula: 'W − E  →  RESTA',
      },
      {
        label: 'Cálculo final',
        detail:
          'Convertimos 07° 03′ 09″ a 06° 63′ 09″ para poder restar los 37′ 04″.',
        formula: "06° 63′ 09″ − 37′ 04″ = 06° 26′ 05″ W",
      },
    ],
    answer: ['Dm (2025) = 06° 26′ 05″ W'],
    tip: 'Al restar minutos/segundos, "pedimos prestado": 1° = 60′ y 1′ = 60″.',
  },

  /* ============ RUMBO / DISTANCIA / TIEMPO ============ */
  {
    id: 'rumbo_ex9_5',
    type: 'RUMBO',
    source: '9 ejercicios tipo examen',
    title: 'Traslado A → B: distancia, rumbo y tiempo',
    statement:
      'Trasladarse de la posición A (Lat 34° 27′ S / Long 58° 29′ W) a la posición B (Lat 34° 34′ S / Long 58° 22′ W). Velocidad 9 nudos, Dm = 8° W, Desvío del compás = 0°. Estimar distancia, rumbo magnético y tiempo.',
    givens: [
      { label: 'Posición A', value: '34° 27′ S / 58° 29′ W' },
      { label: 'Posición B', value: '34° 34′ S / 58° 22′ W' },
      { label: 'Velocidad', value: '9 nudos' },
      { label: 'Dm', value: '8° W (Dc = 0°)' },
    ],
    steps: [
      {
        label: 'Medir la distancia',
        detail:
          'Con el compás de puntas se toma la separación A-B y se lleva a la escala de latitudes (1′ de latitud = 1 milla náutica). Da 9,1 MN.',
        formula: 'Distancia = 9,1 MN',
      },
      {
        label: 'Medir el rumbo',
        detail:
          'Se traza la derrota A→B y se mide con la rosa náutica trasladándola con la regla paralela. El rumbo magnético a seguir es 150°.',
        formula: 'Rm = 150°',
      },
      {
        label: 'Calcular el tiempo',
        detail: 'Dividimos la distancia por la velocidad.',
        formula: '9,1 ÷ 9 = 1,011 h',
      },
      {
        label: 'Convertir a minutos',
        detail: 'La parte decimal por 60.',
        formula: '0,011 × 60 ≈ 1 min  →  1 h 01 min',
      },
    ],
    answer: ['Distancia = 9,1 MN', 'Rumbo magnético = 150°', 'Tiempo = 1 h 01 min'],
    tip: 'La distancia SIEMPRE se mide en la escala de latitudes (lateral), nunca en la de longitudes.',
  },
  {
    id: 'rumbo_ex8_b',
    type: 'RUMBO',
    source: '8 ejercicios tipo examen',
    title: 'Traslado A → B con velocidad 6,5 nudos',
    statement:
      'Trasladarse de A (34° 34.6′ S / 58° 17.8′ W) a B (34° 29.2′ S / 58° 26.7′ W). Velocidad 6,5 nudos, Dm = 10° W, Dc = 0°. Estimar distancia, rumbo magnético y tiempo.',
    givens: [
      { label: 'Posición A', value: '34° 34.6′ S / 58° 17.8′ W' },
      { label: 'Posición B', value: '34° 29.2′ S / 58° 26.7′ W' },
      { label: 'Velocidad', value: '6,5 nudos' },
      { label: 'Dm', value: '10° W (Dc = 0°)' },
    ],
    steps: [
      {
        label: 'Medir la distancia',
        detail: 'Separación A-B llevada a la escala de latitudes.',
        formula: 'Distancia = 9,4 MN',
      },
      {
        label: 'Medir el rumbo',
        detail:
          'B está al Noroeste de A (menor latitud = más al norte; mayor longitud W = más al oeste). El rumbo medido es 318°.',
        formula: 'Rm = 318°',
      },
      {
        label: 'Calcular el tiempo',
        detail: 'Distancia dividida por velocidad.',
        formula: '9,4 ÷ 6,5 = 1,446 h',
      },
      {
        label: 'Convertir a minutos',
        detail: 'Parte decimal por 60.',
        formula: '0,446 × 60 ≈ 27 min  →  ≈ 1 h 26 min',
      },
    ],
    answer: ['Distancia = 9,4 MN', 'Rumbo magnético = 318°', 'Tiempo ≈ 1 h 26 min'],
    tip: 'Un rumbo entre 270° y 360° indica que navegas hacia el cuadrante NOROESTE.',
  },

  /* ============ NAVEGACIÓN DE ESTIMA ============ */
  {
    id: 'estima_ex9_8',
    type: 'ESTIMA',
    source: '9 ejercicios tipo examen',
    title: 'Nueva posición (Nov 2016) + peligro en derrota',
    statement:
      'En noviembre de 2016, partiendo de C (34° 32.5′ S / 58° 22.9′ W), el compás indica Rm = 013° y la corredera 6 nudos. La carta indica Dm = 7° 36′ W con Variación Secular = 6′ W (año 2013). Calcular la posición tras 1 h 30 min, indicar si hay inconveniente y a qué distancia.',
    givens: [
      { label: 'Posición de zarpada C', value: '34° 32.5′ S / 58° 22.9′ W' },
      { label: 'Rumbo del compás (Rm)', value: '013°' },
      { label: 'Velocidad', value: '6 nudos' },
      { label: 'Dm carta (2013)', value: '7° 36′ W · var 6′ W' },
      { label: 'Tiempo navegado', value: '1 h 30 min' },
    ],
    steps: [
      {
        label: 'Actualizar la Dm a 2016',
        detail:
          'Del 2013 al 2016 pasaron 3 años. Variación total = 3 × 6′ = 18′ W. Mismo signo (W) → se suma.',
        formula: '7° 36′ W + 18′ = 7° 54′ W',
      },
      {
        label: 'Pasar de rumbo magnético a verdadero',
        detail:
          'La Dm es Oeste, y "Oeste resta" al convertir de magnético a verdadero.',
        formula: 'Rv = Rm − Dm(W) = 013° − 7° 54′ ≈ 005°',
      },
      {
        label: 'Distancia recorrida',
        detail: 'Velocidad por tiempo (1 h 30 min = 1,5 h).',
        formula: '6 × 1,5 = 9 MN',
      },
      {
        label: 'Trasladar la posición',
        detail:
          'Con rumbo ≈005° (casi al Norte) recorremos 9 MN. Eso resta ≈9′ de latitud (vamos al norte) y suma poco a la longitud. La posición estimada resulta 34° 23.6′ S / 58° 21.8′ W.',
        formula: '34° 32.5′ − 9′ ≈ 34° 23.6′ S',
      },
      {
        label: 'Verificar peligros',
        detail:
          'Sobre la carta, cerca de esa derrota aparece la Boya Canal Km 26.5. Medimos desde el punto de zarpada: 2,4 MN.',
        formula: 'Peligro: Boya Canal Km 26.5 a 2,4 MN',
      },
    ],
    answer: [
      'Posición ≈ 34° 23.6′ S / 58° 21.8′ W',
      'Inconveniente: Boya Canal Km 26.5',
      'Distancia al peligro: 2,4 MN',
    ],
    tip: 'CLAVE del examen: "Oeste RESTA, Este SUMA" al pasar de Rm a Rv. Es el error más común.',
  },
  {
    id: 'estima_ex8_d',
    type: 'ESTIMA',
    source: '8 ejercicios tipo examen',
    title: 'Nueva posición (Nov 2025) con Dm Este',
    statement:
      'En noviembre de 2025, partiendo de C (34° 35.6′ S / 58° 21.3′ W), el compás indica Rm = 073° y 7 nudos. Dm carta = 6° 05′ E, Variación Secular = 6′ W (2025). Calcular la posición tras 1 h 21 min.',
    givens: [
      { label: 'Posición de zarpada C', value: '34° 35.6′ S / 58° 21.3′ W' },
      { label: 'Rumbo del compás (Rm)', value: '073°' },
      { label: 'Velocidad', value: '7 nudos' },
      { label: 'Dm carta (2025)', value: '6° 05′ E' },
      { label: 'Tiempo navegado', value: '1 h 21 min' },
    ],
    steps: [
      {
        label: 'Actualizar la Dm',
        detail:
          'La carta ya está referida a 2025 y navegamos en 2025: 0 años de corrección. La Dm sigue siendo 6° 05′ E.',
        formula: 'Dm = 6° 05′ E',
      },
      {
        label: 'Rumbo magnético a verdadero',
        detail: 'La Dm es Este, y "Este suma" al convertir de magnético a verdadero.',
        formula: 'Rv = Rm + Dm(E) = 073° + 6° 05′ ≈ 079°',
      },
      {
        label: 'Distancia recorrida',
        detail: 'Convertimos 1 h 21 min a 1,35 h y multiplicamos por la velocidad.',
        formula: '7 × 1,35 ≈ 9,4 MN',
      },
      {
        label: 'Trasladar la posición',
        detail:
          'Con rumbo ≈079° (casi al Este, ligeramente al Norte) la latitud sube poco (≈1,9′ al norte) y la longitud avanza mucho al Este (≈11,3′). Resultado: 34° 33.7′ S / 58° 10′ W.',
        formula: '58° 21.3′ − 11,3′ ≈ 58° 10′ W',
      },
      {
        label: 'Verificar peligros',
        detail: 'Cerca de la derrota aparece la Boya Canal Km 16.2 a 4,3 MN de la zarpada.',
        formula: 'Peligro: Boya Canal Km 16.2 a 4,3 MN',
      },
    ],
    answer: [
      'Posición ≈ 34° 33.7′ S / 58° 10′ W',
      'Inconveniente: Boya Canal Km 16.2',
      'Distancia al peligro: 4,3 MN',
    ],
    tip: 'Cuando la carta ya está referida al año actual, la corrección de años es 0 y la Dm no cambia.',
  },

  /* ============ MAREAS ============ */
  {
    id: 'marea_ex9_9',
    type: 'MAREAS',
    source: '9 ejercicios tipo examen',
    title: 'Hora más temprana para cruzar un paso crítico',
    statement:
      'Navegar por un paso donde la carta indica profundidad (sonda) de 0,70 m. Estimar la hora más temprana posible. Calado = 1,10 m. Margen de seguridad = 1 pie debajo de la quilla (0,30 m). Corrección por viento = −0,20 m. Tabla de marea: 06:00 = 0,80 m · 12:00 = 0,40 m · 17:00 = 0,95 m · 23:00 = 0,70 m.',
    givens: [
      { label: 'Sonda (carta)', value: '0,70 m' },
      { label: 'Calado', value: '1,10 m' },
      { label: 'Margen de seguridad', value: '0,30 m (1 pie)' },
      { label: 'Corrección viento', value: '−0,20 m' },
      { label: 'Tabla marea', value: '06:00=0,80 · 12:00=0,40 · 17:00=0,95 · 23:00=0,70' },
    ],
    steps: [
      {
        label: 'Plantear la condición',
        detail:
          'El agua total (sonda + marea + viento) menos el calado debe dejar al menos el margen de seguridad bajo la quilla.',
        formula: 'sonda + marea + viento − calado ≥ margen',
      },
      {
        label: 'Despejar la marea mínima',
        detail: 'Pasamos todo al otro lado para hallar la altura de marea necesaria.',
        formula: 'marea ≥ margen + calado − viento − sonda',
      },
      {
        label: 'Reemplazar valores',
        detail: 'El viento resta 0,20 m, por eso entra con signo +0,20 al despejar.',
        formula: 'marea ≥ 0,30 + 1,10 + 0,20 − 0,70 = 0,90 m',
      },
      {
        label: 'Buscar en la tabla',
        detail:
          'Recorremos las horas de menor a mayor buscando la primera marea ≥ 0,90 m: 06:00 (0,80 ✗), 12:00 (0,40 ✗), 17:00 (0,95 ✓).',
        formula: '17:00 → 0,95 m ≥ 0,90 m ✓',
      },
    ],
    answer: ['La hora más temprana posible es 17:00 hs'],
    tip: 'El viento que "resta" agua pasa a SUMAR cuando lo despejamos al otro lado de la desigualdad.',
  },
  {
    id: 'marea_ex9_3',
    type: 'MAREAS',
    source: '9 ejercicios tipo examen',
    title: 'Paso crítico con viento a favor',
    statement:
      'Paso con sonda 0,50 m. Calado = 1,25 m. Margen = 0,30 m. Corrección por viento = +0,20 m (a favor). Tabla: 06:00 = 0,80 · 12:00 = 0,40 · 17:00 = 0,95 · 23:00 = 0,70 m. Hora más temprana.',
    givens: [
      { label: 'Sonda (carta)', value: '0,50 m' },
      { label: 'Calado', value: '1,25 m' },
      { label: 'Margen de seguridad', value: '0,30 m' },
      { label: 'Corrección viento', value: '+0,20 m (a favor)' },
      { label: 'Tabla marea', value: '06:00=0,80 · 12:00=0,40 · 17:00=0,95 · 23:00=0,70' },
    ],
    steps: [
      {
        label: 'Condición de cruce',
        detail: 'Misma fórmula: el agua disponible debe cubrir calado + margen.',
        formula: 'marea ≥ margen + calado − viento − sonda',
      },
      {
        label: 'Reemplazar valores',
        detail: 'Aquí el viento suma agua (+0,20), por eso resta al despejar.',
        formula: 'marea ≥ 0,30 + 1,25 − 0,20 − 0,50 = 0,85 m',
      },
      {
        label: 'Buscar en la tabla',
        detail: 'Primera marea ≥ 0,85 m recorriendo de menor a mayor hora.',
        formula: '06:00 (0,80 ✗) · 12:00 (0,40 ✗) · 17:00 (0,95 ✓)',
      },
    ],
    answer: ['La hora más temprana posible es 17:00 hs'],
    tip: 'Un viento "a favor" (que empuja agua hacia la costa) aumenta la altura, por eso ayuda a cruzar antes.',
  },

  /* ============ MARCACIONES SIMULTÁNEAS ============ */
  {
    id: 'marc_ex9_7',
    type: 'MARCACIONES',
    source: '9 ejercicios tipo examen',
    title: 'Fix por dos marcaciones simultáneas',
    statement:
      'Estimar la posición del observador con estas marcaciones magnéticas simultáneas (Dm = 9° W): al Estadio Núñez (34° 32.7′ S / 058° 27′ W) Mm = 249°; al Edificio "ALAS" (34° 36′ S / 058° 22.2′ W) Mm = 197°. Indicar posición y boya más cercana.',
    givens: [
      { label: 'Estadio Núñez', value: '34° 32.7′ S / 58° 27′ W · Mm 249°' },
      { label: 'Edificio ALAS', value: '34° 36′ S / 58° 22.2′ W · Mm 197°' },
      { label: 'Dm', value: '9° W' },
    ],
    steps: [
      {
        label: 'Marcación inversa de cada punto',
        detail:
          'Desde el objeto notable trazamos la línea hacia nosotros, que es la marcación observada ± 180°.',
        formula: '249° − 180° = 069°   ·   197° − 180° = 017°',
      },
      {
        label: 'Trazar las rectas en la carta',
        detail:
          'Desde el Estadio Núñez trazamos 069° y desde el Edificio ALAS trazamos 017°, usando la regla paralela desde la rosa.',
      },
      {
        label: 'Hallar la intersección (fix)',
        detail:
          'El punto donde se cruzan las dos rectas es nuestra posición. Se lee sobre las escalas de la carta.',
        formula: 'Posición ≈ 34° 30′ S / 58° 21.1′ W',
      },
      {
        label: 'Boya más cercana',
        detail: 'Observando la carta, la boya próxima a esa posición es la del Canal Km 26,7.',
        formula: 'Boya Canal Km 26,7',
      },
    ],
    answer: ['Posición ≈ 34° 30′ S / 58° 21.1′ W', 'Boya más cercana: Canal Km 26,7'],
    tip: 'Cuanto más cerca de 90° sea el ángulo entre las dos marcaciones, más preciso es el fix.',
  },
  {
    id: 'marc_ex8_c',
    type: 'MARCACIONES',
    source: '8 ejercicios tipo examen',
    title: 'Fix simultáneo (Dm 8° W)',
    statement:
      'Marcaciones magnéticas simultáneas (Dm = 8° W): al Estadio Núñez (34° 32.7′ S / 058° 27′ W) Mm = 284°; al Edificio "ALAS" (34° 36′ S / 058° 22.2′ W) Mm = 162°. Indicar posición y objeto más cercano.',
    givens: [
      { label: 'Estadio Núñez', value: '34° 32.7′ S / 58° 27′ W · Mm 284°' },
      { label: 'Edificio ALAS', value: '34° 36′ S / 58° 22.2′ W · Mm 162°' },
      { label: 'Dm', value: '8° W' },
    ],
    steps: [
      {
        label: 'Marcación inversa',
        detail: 'Restamos 180° a cada marcación para trazar desde el punto notable hacia el buque.',
        formula: '284° − 180° = 104°   ·   162° + 180° = 342°',
      },
      {
        label: 'Trazar y cruzar',
        detail:
          'Desde el Estadio Núñez trazamos 104° y desde el Edificio ALAS trazamos 342°. La intersección es el fix.',
        formula: 'Posición ≈ 34° 32.9′ S / 58° 23.9′ W',
      },
      {
        label: 'Objeto más cercano',
        detail: 'A esa posición el punto notable más próximo es la Torre de Toma de Agua.',
        formula: 'Torre Agua (toma de agua)',
      },
    ],
    answer: ['Posición ≈ 34° 32.9′ S / 58° 23.9′ W', 'Más cercano: Torre Agua (toma de agua)'],
    tip: 'Para restar 180° a un rumbo menor que 180°, súmalo (162° + 180° = 342°). El resultado siempre queda entre 0° y 360°.',
  },
];

/** Devuelve los ejercicios resueltos de un tipo dado */
export const getExercisesByType = (type: ExerciseType): WorkedExercise[] =>
  WORKED_EXERCISES.filter((e) => e.type === type);

/** Devuelve la info de método para un tipo */
export const getMethod = (type: ExerciseType): ExerciseTypeInfo | undefined =>
  EXERCISE_METHODS.find((m) => m.type === type);
