import type { KnotData } from '../types/knots';

export const MASTER_KNOTS_DATA: KnotData[] = [
  {
    id: 'bowline',
    name: 'As de Guía',
    spanishAlias: 'Nudo de Marinero / Gaza Fija',
    englishName: 'Bowline',
    category: 'GAZA',
    difficulty: 'Intermedio',
    pnaExamRelevance: 'Pregunta obligatoria de examen Prefectura. Nudo de seguridad principal para hombre al agua y encapillado.',
    realWorldUse: {
      title: 'Crear una gaza fija que NO se aprieta bajo tensión extrema',
      description: 'Es EL nudo náutico por excelencia. Forma un lazo permanente en el extremo del cabo que jamás se desliza ni se azoca (aprieta) tanto que no se pueda desatar.',
      onBoardLocation: 'Encapillar a bitas de muelle, amarrar a arganeo de boya, escotas de génova y arnés de rescate HAA.',
      dangerWarning: 'NUNCA usarlo con cabos sintéticos muy rígidos sin dejar un chicote largo (mínimo 10 cm), ya que puede deslizarse si no tiene tensión inicial.'
    },
    pros: [
      'No se aprieta ni se zafa bajo carga máxima',
      'Fácil de desatar incluso tras soportar toneladas de fuerza',
      'Confiabilidad absoluta en maniobras críticas'
    ],
    cons: [
      'Se puede desarmar si el cabo flamea suelto sin tensión fija',
      'Requiere práctica para dominar el sentido de la gaza'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Formar la Gaza Inicial (El Agujero del Lago)',
        instruction: 'Tomá el firme del cabo y formá un bucle pequeño cruzando el firme por encima de sí mismo. Esto crea la gaza base por donde saldrá el chicote.',
        keyConcept: 'SENO',
        svgLayers: [
          { id: 'l1', path: 'M 30 170 Q 50 170 70 140 Q 90 110 90 80 Q 90 50 60 50 Q 30 50 30 80 Q 30 110 50 130 Q 70 150 90 170', color: '#ef4444', strokeWidth: 10, isFirme: true, shadow: true }
        ]
      },
      {
        stepNumber: 2,
        title: 'El Conejo sale del Lago',
        instruction: 'Tomá el chicote (azul) e introdúcelo desde abajo hacia arriba a través del bucle que acabás de formar.',
        keyConcept: 'CHICOTE',
        svgLayers: [
          { id: 'l1', path: 'M 30 170 Q 50 170 70 140 Q 90 110 90 80 Q 90 50 60 50 Q 30 50 30 80 Q 30 110 50 130 Q 70 150 90 170', color: '#ef4444', strokeWidth: 10, isFirme: true, shadow: true },
          { id: 'l2', path: 'M 160 160 Q 130 110 60 70 L 60 40', color: '#38bdf8', strokeWidth: 10, isChicote: true, shadow: true }
        ]
      },
      {
        stepNumber: 3,
        title: 'Rodear el Árbol (Firme)',
        instruction: 'Pasá el chicote por detrás de la parte alta del firme (cable rojo de la izquierda), rodeándolo por completo.',
        keyConcept: 'FIRME',
        svgLayers: [
          { id: 'l1', path: 'M 30 170 Q 50 170 70 140 Q 90 110 90 80 Q 90 50 60 50 Q 30 50 30 80 Q 30 110 50 130 Q 70 150 90 170', color: '#ef4444', strokeWidth: 10, isFirme: true, shadow: true },
          { id: 'l2', path: 'M 160 160 Q 130 110 60 70 L 60 40 Q 60 20 40 20 Q 20 20 20 50 Q 20 70 45 70', color: '#38bdf8', strokeWidth: 10, isChicote: true, shadow: true }
        ]
      },
      {
        stepNumber: 4,
        title: 'Volver a Entrar al Lago y Azocar',
        instruction: 'Vuelve a meter el chicote por el bucle inicial (de arriba hacia abajo) y tira firmemente de la gaza y el firme para azocar el nudo.',
        keyConcept: 'AZOCAR',
        svgLayers: [
          { id: 'l1', path: 'M 30 170 Q 50 170 70 140 Q 90 110 90 80 Q 90 50 60 50 Q 30 50 30 80 Q 30 110 50 130 Q 70 150 90 170', color: '#ef4444', strokeWidth: 10, isFirme: true, shadow: true },
          { id: 'l2', path: 'M 160 160 Q 130 110 60 70 L 60 40 Q 60 20 40 20 Q 20 20 20 50 Q 20 70 45 70 Q 60 70 60 90 L 70 120', color: '#38bdf8', strokeWidth: 10, isChicote: true, shadow: true }
        ]
      }
    ],
    sequenceChallenge: {
      correctOrder: [
        { id: 's1', text: '1. Formar un bucle (seno) en el firme del cabo.' },
        { id: 's2', text: '2. Introducir el chicote de abajo hacia arriba por el bucle.' },
        { id: 's3', text: '3. Pasar el chicote por detrás del firme (árbol).' },
        { id: 's4', text: '4. Volver a meter el chicote por el bucle de arriba hacia abajo y tironee para azocar.' }
      ]
    }
  },
  {
    id: 'reef',
    name: 'Nudo Llano',
    spanishAlias: 'Nudo de Rizo / Square Knot',
    englishName: 'Reef Knot',
    category: 'UNION',
    difficulty: 'Principiante',
    pnaExamRelevance: 'Rápida maniobra de cubierta. PNA exige saber cuándo usarlo y sus limitaciones mortales.',
    realWorldUse: {
      title: 'Unir dos cabos del MISMO diámetro y material',
      description: 'Nudo clásico para aferrar la vela mayor sobre la botavara al tomar rizos. Es simétrico y prolijo (Izquierda sobre Derecha, Derecha sobre Izquierda).',
      onBoardLocation: 'Masa de toma de rizos en vela mayor, atar fundas de embarcación y empaquetar cabos.',
      dangerWarning: '¡NUNCA usar para salvar vidas ni para unir cabos de distinto diámetro o material! Se zafa muy fácilmente bajo tensión desigual.'
    },
    pros: [
      'Muy rápido y fácil de recordar',
      'Estética limpia y simétrica',
      'Ideal para amarrado temporal de fundas'
    ],
    cons: [
      'Inseguro para cargas pesadas o continuas',
      'Se desliza si los diámetros son levemente distintos'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Primer Cruzamiento (Izquierda sobre Derecha)',
        instruction: 'Tomá ambos chicotes y cruzá el chicote A por encima del chicote B.',
        keyConcept: 'CHICOTE',
        svgLayers: [
          { id: 'l1', path: 'M 20 60 L 80 100 L 100 130', color: '#ef4444', strokeWidth: 10, isFirme: true, shadow: true },
          { id: 'l2', path: 'M 180 60 L 120 100 L 100 130', color: '#38bdf8', strokeWidth: 10, isChicote: true, shadow: true }
        ]
      },
      {
        stepNumber: 2,
        title: 'Primer Medio Nudo',
        instruction: 'Pasá el chicote A por debajo de B y salí hacia arriba. Ya tenés medio nudo base.',
        keyConcept: 'AZOCAR',
        svgLayers: [
          { id: 'l1', path: 'M 20 60 Q 70 80 100 100 Q 130 120 180 140', color: '#ef4444', strokeWidth: 10, isFirme: true, shadow: true },
          { id: 'l2', path: 'M 180 60 Q 130 80 100 100 Q 70 120 20 140', color: '#38bdf8', strokeWidth: 10, isChicote: true, shadow: true }
        ]
      },
      {
        stepNumber: 3,
        title: 'Segundo Cruzamiento (Derecha sobre Izquierda)',
        instruction: 'Ahora invertí el sentido: cruzá el chicote de la derecha por encima del de la izquierda.',
        keyConcept: 'SENO',
        svgLayers: [
          { id: 'l1', path: 'M 20 60 Q 70 80 100 100 Q 130 120 180 140', color: '#ef4444', strokeWidth: 10, isFirme: true, shadow: true },
          { id: 'l2', path: 'M 180 60 Q 130 80 100 100 Q 70 120 20 140 L 70 170', color: '#38bdf8', strokeWidth: 10, isChicote: true, shadow: true }
        ]
      },
      {
        stepNumber: 4,
        title: 'Finalizar y Azocar el Nudo Llano',
        instruction: 'Pasá el chicote por abajo y tirá de los cuatro extremos. Debe quedar un bucle prolijo entrelazado.',
        keyConcept: 'AZOCAR',
        svgLayers: [
          { id: 'l1', path: 'M 20 60 Q 60 70 90 90 Q 110 110 90 130 Q 70 150 20 160', color: '#ef4444', strokeWidth: 10, isFirme: true, shadow: true },
          { id: 'l2', path: 'M 180 60 Q 140 70 110 90 Q 90 110 110 130 Q 130 150 180 160', color: '#38bdf8', strokeWidth: 10, isChicote: true, shadow: true }
        ]
      }
    ],
    sequenceChallenge: {
      correctOrder: [
        { id: 's1', text: '1. Tomar los dos chicotes del mismo cabo/diámetro.' },
        { id: 's2', text: '2. Cruzar izquierda sobre derecha y pasar por debajo.' },
        { id: 's3', text: '3. Cruzar derecha sobre izquierda (invertir sentido).' },
        { id: 's4', text: '4. Pasar por debajo y ajustar firmemente las dos gazas.' }
      ]
    }
  },
  {
    id: 'clove',
    name: 'Ballestrinque',
    spanishAlias: 'Nudo de Defensas / Clove Hitch',
    englishName: 'Clove Hitch',
    category: 'AMARRE',
    difficulty: 'Intermedio',
    pnaExamRelevance: 'Nudo fundamental para colgar defensas y amarres rápidos a norays o bitas.',
    realWorldUse: {
      title: 'Fijar un cabo a un tubo, guardamancebo o poste circular',
      description: 'Nudo de amarre rápido que se sostiene por la presión del propio cabo sobre el tubo o madera.',
      onBoardLocation: 'Atar defensas náuticas al guardamancebo, amarre provisional a postes de muelle.',
      dangerWarning: '¡CUIDADO! Si el cabo no mantiene tensión constante (ej: la ola mueve el barco), el nudo se afloja y se zafa. Usar un cote de seguridad final.'
    },
    pros: [
      'Construcción ultra rápida',
      'Ajuste automático bajo tensión firme',
      'Excelente para colgar defensas'
    ],
    cons: [
      'Propenso a deslizarse si el cabo es sintético suave o si hay vaivén'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Primera Vuelta sobre el Palo',
        instruction: 'Pasá el chicote alrededor del tubo o guardamancebo de adelante hacia atrás.',
        keyConcept: 'FIRME',
        svgLayers: [
          { id: 'post', path: 'M 20 100 L 180 100', color: '#64748b', strokeWidth: 18, shadow: true },
          { id: 'l1', path: 'M 50 170 L 50 100 Q 50 60 90 60 L 110 60', color: '#ef4444', strokeWidth: 10, isFirme: true, shadow: true }
        ]
      },
      {
        stepNumber: 2,
        title: 'Cruzar en Diagonal sobre sí mismo',
        instruction: 'Cruzá el chicote por encima de la primera vuelta formando una X sobre el tubo.',
        keyConcept: 'CHICOTE',
        svgLayers: [
          { id: 'post', path: 'M 20 100 L 180 100', color: '#64748b', strokeWidth: 18, shadow: true },
          { id: 'l1', path: 'M 50 170 L 50 100 Q 50 60 90 60 L 110 60', color: '#ef4444', strokeWidth: 10, isFirme: true, shadow: true },
          { id: 'l2', path: 'M 110 60 L 140 140', color: '#38bdf8', strokeWidth: 10, isChicote: true, shadow: true }
        ]
      },
      {
        stepNumber: 3,
        title: 'Trabar por debajo de la X y Azocar',
        instruction: 'Da una segunda vuelta al tubo y pasa el chicote por debajo del cruzamiento para trabarlo.',
        keyConcept: 'AZOCAR',
        svgLayers: [
          { id: 'post', path: 'M 20 100 L 180 100', color: '#64748b', strokeWidth: 18, shadow: true },
          { id: 'l1', path: 'M 50 170 L 50 100 Q 50 60 90 60 L 110 60', color: '#ef4444', strokeWidth: 10, isFirme: true, shadow: true },
          { id: 'l2', path: 'M 110 60 L 140 140 Q 150 80 120 70 L 80 110', color: '#38bdf8', strokeWidth: 10, isChicote: true, shadow: true }
        ]
      }
    ],
    sequenceChallenge: {
      correctOrder: [
        { id: 's1', text: '1. Pasar el cabo alrededor del objeto formando la primera vuelta.' },
        { id: 's2', text: '2. Cruzar el chicote en diagonal sobre la primera vuelta (formando X).' },
        { id: 's3', text: '3. Dar una segunda vuelta al objeto en la misma dirección.' },
        { id: 's4', text: '4. Introducir el chicote por debajo de la vuelta cruzada para rematar.' }
      ]
    }
  },
  {
    id: 'sheet',
    name: 'Vuelta de Escota',
    spanishAlias: 'Nudo de Vela / Sheet Bend',
    englishName: 'Sheet Bend',
    category: 'UNION',
    difficulty: 'Avanzado',
    pnaExamRelevance: 'Requisito técnico clave en exámen práctico de Timonel para empalmes de líneas.',
    realWorldUse: {
      title: 'Unir dos cabos de DISTINTO grosor (mena) o material',
      description: 'El mejor nudo para unir un cabo grueso (como el fondeo) con una estacha más fina sin que se deslice ni dañe las fibras.',
      onBoardLocation: 'Prolongar líneas de amarra, empalmar cabos de remolque o drizas cortadas.',
      dangerWarning: 'El cabo más grueso DEBE formar el seno estático, mientras que el cabo más fino se teje alrededor de él.'
    },
    pros: [
      'Excelente agarre entre cabos de distinta mena',
      'No se desliza bajo tracción',
      'Fácil desmonte posterior'
    ],
    cons: [
      'Requiere recordar exactamente cuál es el cabo grueso'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Formar la Gaza con el Cabo Grueso',
        instruction: 'Tomá el cabo más grueso (rojo) y doblalo formando una gaza simple en forma de U sin cruzarlo.',
        keyConcept: 'GAZA',
        svgLayers: [
          { id: 'l1', path: 'M 20 60 L 100 60 Q 140 60 140 100 Q 140 140 100 140 L 20 140', color: '#ef4444', strokeWidth: 14, isFirme: true, shadow: true }
        ]
      },
      {
        stepNumber: 2,
        title: 'Pasar el Cabo Fino por la Gaza',
        instruction: 'Introducí el chicote del cabo fino (azul) de abajo hacia arriba a través de la gaza del cabo grueso.',
        keyConcept: 'CHICOTE',
        svgLayers: [
          { id: 'l1', path: 'M 20 60 L 100 60 Q 140 60 140 100 Q 140 140 100 140 L 20 140', color: '#ef4444', strokeWidth: 14, isFirme: true, shadow: true },
          { id: 'l2', path: 'M 180 170 L 110 100 L 110 40', color: '#38bdf8', strokeWidth: 8, isChicote: true, shadow: true }
        ]
      },
      {
        stepNumber: 3,
        title: 'Rodear el Cabo Grueso y Trabar',
        instruction: 'Rodeá por detrás los dos senos del cabo grueso con el cabo fino y pisá tu propio firme por debajo.',
        keyConcept: 'AZOCAR',
        svgLayers: [
          { id: 'l1', path: 'M 20 60 L 100 60 Q 140 60 140 100 Q 140 140 100 140 L 20 140', color: '#ef4444', strokeWidth: 14, isFirme: true, shadow: true },
          { id: 'l2', path: 'M 180 170 L 110 100 L 110 40 Q 110 20 150 40 Q 160 100 100 100', color: '#38bdf8', strokeWidth: 8, isChicote: true, shadow: true }
        ]
      }
    ],
    sequenceChallenge: {
      correctOrder: [
        { id: 's1', text: '1. Formar un seno simple con el cabo de MAYOR diámetro.' },
        { id: 's2', text: '2. Pasar el cabo de MENOR diámetro a través del seno desde abajo.' },
        { id: 's3', text: '3. Rodear por fuera las dos partes de la gaza del cabo grueso.' },
        { id: 's4', text: '4. Pasar el cabo fino por debajo de sí mismo (morderse) y azocar.' }
      ]
    }
  },
  {
    id: 'figure8',
    name: 'Nudo de Ocho',
    spanishAlias: 'Nudo Stopper / Figure Eight',
    englishName: 'Figure-Eight Knot',
    category: 'TOPE',
    difficulty: 'Principiante',
    pnaExamRelevance: 'Verificación básica de seguridad en cabos de maniobra.',
    realWorldUse: {
      title: 'Crear un tope o freno en el chicote de escotas y drizas',
      description: 'Evita que los cabos se despasen accidentalmente por las roldanas de las poleas, motones o mordazas de cubierta.',
      onBoardLocation: 'Chicotes de escotas de Génova y Mayor, drizas de spi, amantillos.',
      dangerWarning: 'Nunca dejar una escota sin un nudo de ocho en el extremo si hay viento fuerte.'
    },
    pros: [
      'No daña las fibras del cabo',
      'Fácil de deshacer incluso tras soportar tensión',
      'Volumen de tope claro y prolijo'
    ],
    cons: [
      'Requiere un par de cm libres en el chicote'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Formar el Bucle Principal',
        instruction: 'Hacé una gaza cruzando el chicote por encima del firme.',
        keyConcept: 'SENO',
        svgLayers: [
          { id: 'l1', path: 'M 40 160 Q 80 160 100 120 Q 120 80 100 40 Q 80 10 40 40', color: '#ef4444', strokeWidth: 10, isFirme: true, shadow: true }
        ]
      },
      {
        stepNumber: 2,
        title: 'Rodear el Firme (Formar el Ocho)',
        instruction: 'Pasá el chicote por detrás del firme rodeándolo por completo.',
        keyConcept: 'CHICOTE',
        svgLayers: [
          { id: 'l1', path: 'M 40 160 Q 80 160 100 120 Q 120 80 100 40 Q 80 10 40 40', color: '#ef4444', strokeWidth: 10, isFirme: true, shadow: true },
          { id: 'l2', path: 'M 40 40 Q 20 60 40 90 L 80 90', color: '#38bdf8', strokeWidth: 10, isChicote: true, shadow: true }
        ]
      },
      {
        stepNumber: 3,
        title: 'Entrar al Bucle y Rematar',
        instruction: 'Introducí el chicote de arriba hacia abajo por el bucle superior y tirá de ambos lados.',
        keyConcept: 'AZOCAR',
        svgLayers: [
          { id: 'l1', path: 'M 40 160 Q 80 160 100 120 Q 120 80 100 40 Q 80 10 40 40', color: '#ef4444', strokeWidth: 10, isFirme: true, shadow: true },
          { id: 'l2', path: 'M 40 40 Q 20 60 40 90 L 80 90 Q 110 90 90 50 L 70 30', color: '#38bdf8', strokeWidth: 10, isChicote: true, shadow: true }
        ]
      }
    ],
    sequenceChallenge: {
      correctOrder: [
        { id: 's1', text: '1. Formar un bucle cruzando el chicote sobre el firme.' },
        { id: 's2', text: '2. Rodear el firme pasando el chicote por detrás.' },
        { id: 's3', text: '3. Introducir el chicote por el centro del bucle frontal.' },
        { id: 's4', text: '4. Ajustar para obtener la clásica figura en 8 de tope.' }
      ]
    }
  }
];
