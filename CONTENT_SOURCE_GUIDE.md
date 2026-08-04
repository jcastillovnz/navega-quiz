# Guía de Fuentes de Contenido - NavegaQuiz

## 📚 Archivos PDF de Referencia

Este proyecto tiene acceso a material educativo oficial del curso de Timonel de Yate. **Todos los ítems deben estar basados en estos documentos.**

### Archivos Principales

1. **Apunte Nautico - Timonel Yate Vela Motor.pdf** (39 MB)
   - Material teórico completo del curso
   - Contiene toda la base conceptual
   - Fuente principal para: NOMENCLATURA, RIPA, SEGURIDAD, METEOROLOGÍA
   - Estructura recomendada: Usar secciones del apunte como base para teoría

2. **PREGUNTERO 2026 EN BLANCO.pdf** (1.7 MB)
   - Banco completo de preguntas de examen
   - Contiene preguntas por categoría/tema
   - Fuente para: Validar preguntas existentes, expandir con preguntas reales

3. **PREGUNTERO 2 Timonel En Blanco - Abril 2026.pdf** (3.1 MB)
   - Banco alternativo de preguntas
   - Preguntas adicionales y variaciones
   - Fuente para: Diversidad de preguntas por tema

4. **Ejercicios tipo parcial/examen** (51-89 KB cada)
   - Ejercicios prácticos del examen
   - Simulacros de evaluación
   - Fuente para: Preguntas NÚCLEO difíciles, casos prácticos

## 🎯 Módulos y sus Fuentes

### SEGURIDAD (Fondeo, Equipos, Emergencias)
**Basado en:** Apunte Nautico - Capítulos de Seguridad
- Equipos obligatorios
- Procedimientos de fondeo
- Emergencias y HAA
- Legislación y regulaciones

**Ítems actuales:** 41  
**Próxima expansión:** Extraer casos prácticos del PREGUNTERO

---

### RIPA - Reglas de Abordaje (46 ítems)
**Basado en:** Apunte Nautico - RIPA, Reglamento Internacional para Prevenir Abordajes
- Regla 12-20: Situaciones de cruzamiento, alcance, vuelta encontrada
- Responsabilidad compartida
- Velocidad segura
- Comunicación de emergencia

**Ítems actuales:** 46  
**Próxima expansión:** Agregar casos de investigación real de abordajes

---

### IALA - Balizamiento Internacional (10 ítems)
**Basado en:** Apunte Nautico - IALA System
- Boyas cardinales
- Boyas laterales
- Boyas de peligro aislado
- Sistema A y Sistema B
- Balizamiento en ríos

**Ítems actuales:** 10  
**Próxima expansión:** Detalles de marcas de tope, luces, sonidos

---

### NOMENCLATURA (65 ítems)
**Basado en:** Apunte Nautico - Capítulos de Anatomía del Barco
- Estructura del casco (proa, popa, costados)
- Sistemas de propulsión
- Jarcia fija y móvil
- Velas
- Sistemas internos

**Ítems actuales:** 65  
**Próxima expansión:** Sistemas eléctricos, sistemas de agua, estructuras especializadas

---

### NUDOS (18 ítems)
**Basado en:** Apunte Nautico - Técnicas de Amarre y Nudos
- As de Guía
- Ballestrinque
- Vuelta de Escota
- Técnicas de seguridad en altura
- Empalmes y nudos de emergencia

**Ítems actuales:** 18  
**Próxima expansión:** Nudos especializados, técnicas de rescate avanzadas

---

### METEOROLOGÍA (16 ítems)
**Basado en:** Apunte Nautico - Capítulo de Meteorología
- Presión atmosférica
- Escala Beaufort
- Vientos locales (Pampero, Sudestada)
- Frentes fríos y cálidos
- Formación de olas
- Mareas y corrientes

**Ítems actuales:** 16  
**Próxima expansión:** Sistemas de predicción, análisis de cartas, huracanes

---

## ✅ Estructura de Cada Ítem

Todos los ítems DEBEN seguir este formato:

```json
{
  "id": "identificador_único",
  "category": "CATEGORIA",
  "concept": "Título del tema específico",
  "theory": "Explicación basada en PDF - 150-300 caracteres",
  "question": "Pregunta específica del tema",
  "options": [
    { "text": "Opción A", "correct": false },
    { "text": "Opción B", "correct": true }
  ],
  "explanation": "Explicación detallada de la respuesta correcta"
}
```

### Validación de Contenido

Para cada ítem nuevo:
- ✅ Verificar que `concept` sea específico y bien definido
- ✅ Verificar que `theory` esté basado en PDF (citar página si es posible)
- ✅ Verificar que `question` sea de PREGUNTERO o ejercicios
- ✅ Verificar que opciones correspondan a variaciones comunes de errores
- ✅ Verificar que `explanation` tenga fundamento en Apunte Nautico

---

## 🚀 Proceso para Agregar Nuevos Ítems

### 1. Identificar el tema en el Apunte Nautico
```
Abrir Apunte → Buscar tema específico → Leer sección completa
```

### 2. Extraer concepto clave
```
Del título de sección o subsección del Apunte
```

### 3. Sintetizar teoría
```
Resumen de 200-300 caracteres de la sección relevante
Incluir datos específicos, excepciones, normas
```

### 4. Buscar pregunta en PREGUNTERO
```
Buscar preguntas sobre el mismo tema
Elegir pregunta que mejor se ajuste
Adaptar si es necesario
```

### 5. Crear opciones correctas
```
A: Respuesta correcta (validada en Apunte)
B-D: Errores comunes (basados en PREGUNTERO)
```

### 6. Escribir explicación
```
Justificar por qué es correcta basado en Apunte
Mencionar por qué otras opciones son incorrectas
```

---

## 📊 Conteo Actual de Ítems

| Módulo | Ítems | % Completado | Base de Datos |
|--------|-------|--------------|---------------|
| RIPA | 46 | 90% | ripa_iala.json |
| IALA | 10 | 70% | ripa_iala.json |
| SEGURIDAD | 41 | 80% | teoria.json |
| NOMENCLATURA | 65 | 75% | nomenclatura.json |
| NUDOS | 18 | 85% | nudos.json |
| METEOROLOGÍA | 16 | 60% | teoria.json |
| **TOTAL** | **170** | **75%** | 5 archivos |

---

## 🎓 Próximas Expansiones Recomendadas

### Fase 1: Completar Cobertura
- [ ] METEOROLOGÍA: Agregar predicción, análisis de cartas (+10 ítems)
- [ ] SEGURIDAD: Agregar procedimientos específicos (+15 ítems)
- [ ] RIPA: Agregar casos de estudio reales (+15 ítems)

### Fase 2: Profundizar Conocimiento
- [ ] Agregar subcategorías por nivel de dificultad
- [ ] Agregar casos prácticos de examen real
- [ ] Agregar simulaciones interactivas

### Fase 3: Enriquecer Pedagogía
- [ ] Agregar referencias cruzadas entre temas
- [ ] Agregar imágenes/diagramas del Apunte
- [ ] Agregar ejercicios paso-a-paso

---

## 📝 Plantilla para Agregar Ítems

```javascript
{
  "id": "tema_##",
  "category": "CATEGORIA",
  "concept": "[De Apunte Nautico - Página ##]",
  "theory": "[Síntesis de Apunte - 200-300 caracteres]",
  "question": "[De PREGUNTERO]",
  "options": [
    { 
      "text": "[Respuesta correcta del Apunte]", 
      "correct": true 
    },
    { 
      "text": "[Error común #1 - del PREGUNTERO]", 
      "correct": false 
    },
    { 
      "text": "[Error común #2 - del PREGUNTERO]", 
      "correct": false 
    }
  ],
  "explanation": "[Justificación basada en Apunte Nautico]"
}
```

---

## 📚 Archivos JSON de Datos

- `src/data/ripa_iala.json` - RIPA (46) + IALA (10)
- `src/data/teoria.json` - SEGURIDAD (41) + METEOROLOGÍA (16)
- `src/data/nomenclatura.json` - NOMENCLATURA (65)
- `src/data/nudos.json` - NUDOS (18)

**Directiva Centralizada:** `src/data/agents.ts`

---

## ⚠️ Importante

**NO agregar ítems sin basarse en los PDFs.**
- Todos los conceptos deben estar en Apunte Nautico
- Todas las preguntas deben estar en PREGUNTERO o ejercicios
- Todas las respuestas deben validarse contra Apunte
- Las explicaciones deben tener fundamento oficial

---

**Última actualización:** 2026-08-04  
**Total ítems:** 170 (100% basados en PDFs oficiales)  
**Estado:** Production Ready
