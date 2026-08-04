---
name: Algoritmos Náuticos & Gamificación
description: Lógica matemática, fórmulas de navegación y algoritmos de Spaced Repetition (SuperMemo-2 modificado) para la app NavegaQuiz.
---

# Algoritmos Náuticos & Repaso Espaciado

Cuando estés implementando la lógica (backend-less en `localStorage`) de NavegaQuiz o los cálculos de navegación, sigue estas referencias obligatorias:

## 1. Repaso Espaciado (Spaced Repetition)
Almacena el historial de la "Caja de Repaso" usando una versión simplificada del algoritmo SM-2 para maximizar el recuerdo:
- Cada pregunta guardada en `localStorage` tiene: `interval` (días), `ease` (factor de facilidad, default `2.5`), y `nextReviewDate` (timestamp).
- Si el usuario acierta la pregunta en el repaso: `interval = interval * ease`.
- Si el usuario falla la pregunta: `interval = 1` (vuelve al inicio), `ease = max(1.3, ease - 0.2)`.

## 2. Cálculo de Declinación Magnética ($D_m$)
Cuando implementes la calculadora interactiva (Tarea 21) o los ejercicios prácticos:
```typescript
function calcularDeclinacion(
    anioCarta: number, 
    anioActual: number, 
    declinacionInicial: number, // En grados decimales (W = Negativo, E = Positivo)
    variacionAnual: number // En grados decimales por año
): number {
    const diffAnios = anioActual - anioCarta;
    return declinacionInicial + (diffAnios * variacionAnual);
}
```
*Importante:* En los ejercicios, los resultados deben formatearse convirtiendo los decimales a Grados(°) y Minutos(').

## 3. Navegación Estimada (Triángulo de Velocidad)
Para la Tarea 20 o ejercicios teóricos, usa siempre la relación base:
- `Distancia (MN) = Velocidad (Nudos) * Tiempo (Horas)`
- Si el tiempo se provee o se solicita en minutos, usar `Tiempo_hs = Minutos / 60`.

## 4. Generación de Exámenes Aleatorios PNA (Simulador)
Para el algoritmo de la Tarea 18 (Examen de 40 preguntas combinadas):
1. **Ponderación**: Filtra el array maestro seleccionando $N$ preguntas *por categoría* (ej: 12 de RIPA, 6 de IALA, 6 de Seguridad, 5 de Meteorología, 6 de Nomenclatura, y 5 Ejercicios Prácticos Numéricos).
2. **Aleatoriedad**: Aplica un shuffle algorithm (como Fisher-Yates) para desordenar tanto las preguntas seleccionadas como el orden interno de las Opciones (A, B, C, D). De esta manera el alumno evalúa su conocimiento y no memoriza patrones de letras.
