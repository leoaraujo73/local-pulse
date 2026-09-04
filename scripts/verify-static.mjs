import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const requiredFiles = [
  'index.html',
  'styles.css',
  'app.js',
  'noticias.json',
  'manifest.webmanifest',
  'sw.js',
  'icon-192.png',
  'icon-512.png',
];

await Promise.all(requiredFiles.map(file => access(file)));

const [newsText, manifestText] = await Promise.all([
  readFile('noticias.json', 'utf8'),
  readFile('manifest.webmanifest', 'utf8'),
]);

const news = JSON.parse(newsText);
const manifest = JSON.parse(manifestText);

assert.ok(Array.isArray(news.items), 'noticias.json deve conter um array "items"');
assert.ok(news.items.length > 0, 'noticias.json deve conter ao menos uma notícia');

const ids = new Set();
for (const [index, item] of news.items.entries()) {
  const label = `items[${index}]`;
  for (const field of ['id', 'categoria', 'titulo', 'data']) {
    assert.equal(typeof item[field], 'string', `${label}.${field} deve ser texto`);
    assert.ok(item[field].trim(), `${label}.${field} não pode ser vazio`);
  }

  assert.ok(!ids.has(item.id), `${label}.id deve ser único: ${item.id}`);
  ids.add(item.id);
  assert.ok(!Number.isNaN(Date.parse(item.data)), `${label}.data deve ser uma data válida`);

  for (const field of ['link', 'imagem']) {
    if (!item[field]) continue;
    const url = new URL(item[field]);
    assert.ok(['http:', 'https:'].includes(url.protocol), `${label}.${field} deve usar http ou https`);
  }
}

assert.equal(manifest.display, 'standalone', 'manifest deve manter display "standalone"');
assert.ok(Array.isArray(manifest.icons) && manifest.icons.length > 0, 'manifest deve declarar ícones');

console.log(`Verificação concluída: ${news.items.length} notícias e ${requiredFiles.length} arquivos essenciais.`);
