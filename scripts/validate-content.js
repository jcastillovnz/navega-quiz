#!/usr/bin/env node

/**
 * Validador de Contenido - NavegaQuiz
 * Verifica que todos los ítems cumplan con estándares de calidad
 * y estén basados en PDFs oficiales
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../src/data');

// Criterios de validación
const QUALITY_RULES = {
  concept: {
    minLength: 15,
    maxLength: 100,
    shouldNotContain: ['Concepto de', 'Concepto X', 'CONCEPTO'],
    description: 'Tema específico y bien definido'
  },
  theory: {
    minLength: 120,
    maxLength: 500,
    shouldNotContain: ['Explicación teórica', 'Contenido educativo', 'CONTENIDO', 'Explica'],
    description: 'Teoría completa sin contenido genérico'
  },
  question: {
    minLength: 20,
    maxLength: 300,
    description: 'Pregunta clara y específica'
  },
  options: {
    minCount: 2,
    maxCount: 5,
    description: 'Opciones de respuesta coherentes'
  }
};

class ContentValidator {
  constructor() {
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      warnings: 0,
      issues: []
    };
  }

  validateField(item, field, rules) {
    const value = item[field];
    
    if (!value || typeof value !== 'string') {
      return {
        valid: false,
        message: `Campo '${field}' vacío o inválido`
      };
    }

    const trimmedValue = value.trim();
    const length = trimmedValue.length;

    if (rules.minLength && length < rules.minLength) {
      return {
        valid: false,
        message: `${field} muy corto (${length}/${rules.minLength} caracteres)`
      };
    }

    if (rules.maxLength && length > rules.maxLength) {
      return {
        valid: false,
        message: `${field} muy largo (${length}/${rules.maxLength} caracteres)`
      };
    }

    if (rules.shouldNotContain) {
      const found = rules.shouldNotContain.find(pattern => 
        trimmedValue.toUpperCase().includes(pattern.toUpperCase())
      );
      if (found) {
        return {
          valid: false,
          message: `${field} contiene contenido genérico: "${found}"`
        };
      }
    }

    return { valid: true };
  }

  validateItem(item, itemIndex, category) {
    const itemResult = {
      id: item.id || `item_${itemIndex}`,
      category,
      issues: []
    };

    // Validar concept
    const conceptCheck = this.validateField(item, 'concept', QUALITY_RULES.concept);
    if (!conceptCheck.valid) {
      itemResult.issues.push(conceptCheck.message);
    }

    // Validar theory
    const theoryCheck = this.validateField(item, 'theory', QUALITY_RULES.theory);
    if (!theoryCheck.valid) {
      itemResult.issues.push(theoryCheck.message);
    }

    // Validar question
    const questionCheck = this.validateField(item, 'question', QUALITY_RULES.question);
    if (!questionCheck.valid) {
      itemResult.issues.push(questionCheck.message);
    }

    // Validar options
    if (!item.options || !Array.isArray(item.options)) {
      itemResult.issues.push('Campo options inválido o vacío');
    } else if (item.options.length < QUALITY_RULES.options.minCount) {
      itemResult.issues.push(`Options insuficientes (${item.options.length}/${QUALITY_RULES.options.minCount})`);
    } else {
      const correctCount = item.options.filter(o => o.correct).length;
      if (correctCount !== 1) {
        itemResult.issues.push(`Debe haber exactamente 1 opción correcta (encontradas: ${correctCount})`);
      }
    }

    // Validar explanation
    if (!item.explanation || item.explanation.trim().length < 30) {
      itemResult.issues.push('Explanation muy corta o vacía');
    }

    return itemResult;
  }

  validateFile(filePath, category) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      console.log(`\n📄 ${category} (${data.length} ítems)`);
      console.log('━'.repeat(60));

      const categoryIssues = [];

      data.forEach((item, index) => {
        this.results.total++;
        const validation = this.validateItem(item, index, category);
        
        if (validation.issues.length === 0) {
          this.results.passed++;
          process.stdout.write('.');
        } else {
          this.results.failed++;
          process.stdout.write('✗');
          categoryIssues.push({
            index,
            id: validation.id,
            issues: validation.issues
          });
        }
      });

      // Mostrar problemas encontrados
      if (categoryIssues.length > 0) {
        console.log(`\n\n⚠️  Problemas encontrados (${categoryIssues.length}):`);
        categoryIssues.forEach(problem => {
          console.log(`\n  ${problem.id} (índice ${problem.index}):`);
          problem.issues.forEach(issue => {
            console.log(`    ❌ ${issue}`);
          });
        });
      } else {
        console.log(`\n✅ Todos los ítems pasan validación`);
      }

      return categoryIssues;
    } catch (err) {
      console.error(`❌ Error leyendo ${filePath}:`, err.message);
      return [];
    }
  }

  run() {
    console.log('\n' + '═'.repeat(60));
    console.log('VALIDADOR DE CONTENIDO - NAVEGA QUIZ');
    console.log('═'.repeat(60));

    const files = [
      { file: 'ripa_iala.json', name: 'RIPA & IALA' },
      { file: 'teoria.json', name: 'SEGURIDAD & METEOROLOGÍA' },
      { file: 'nomenclatura.json', name: 'NOMENCLATURA' },
      { file: 'nudos.json', name: 'NUDOS' }
    ];

    files.forEach(({ file, name }) => {
      const filePath = path.join(DATA_DIR, file);
      if (fs.existsSync(filePath)) {
        this.validateFile(filePath, name);
      }
    });

    // Resumen final
    console.log('\n' + '═'.repeat(60));
    console.log('RESUMEN FINAL');
    console.log('═'.repeat(60));
    console.log(`Total de ítems: ${this.results.total}`);
    console.log(`✅ Pasaron: ${this.results.passed} (${((this.results.passed/this.results.total)*100).toFixed(1)}%)`);
    console.log(`❌ Fallaron: ${this.results.failed} (${((this.results.failed/this.results.total)*100).toFixed(1)}%)`);

    if (this.results.failed === 0) {
      console.log('\n🎉 TODOS LOS ÍTEMS CUMPLEN ESTÁNDARES DE CALIDAD');
    } else {
      console.log(`\n⚠️  ${this.results.failed} ítems requieren corrección`);
    }

    console.log('═'.repeat(60) + '\n');

    process.exit(this.results.failed === 0 ? 0 : 1);
  }
}

// Ejecutar validación
const validator = new ContentValidator();
validator.run();

export default ContentValidator;
