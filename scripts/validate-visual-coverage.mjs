import fs from 'node:fs';

const dataDir = new URL('../src/data/', import.meta.url);
const manifestSource = fs.readFileSync(new URL('../src/data/visualManifest.ts', import.meta.url), 'utf8');
const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.json'));
const ids = files.flatMap(file => JSON.parse(fs.readFileSync(new URL(file, dataDir), 'utf8')).map(item => item.id));
const missing = ids.filter(id => !manifestSource.includes(`'${id}'`) && !/^nom_\d+$/.test(id) && !/^prac_\d+$/.test(id));

if (missing.length) {
  console.error(`Preguntas sin cobertura visual: ${missing.join(', ')}`);
  process.exit(1);
}

console.log(`Cobertura visual validada: ${ids.length} ítems registrados.`);
