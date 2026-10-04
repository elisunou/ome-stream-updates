import { appendFileSync, readFileSync } from 'node:fs';

const file = new URL('../../supporters.json', import.meta.url);
const data = JSON.parse(readFileSync(file, 'utf8'));
if (!Array.isArray(data.supporters)) throw new Error('Invalid supporters list.');
const previous = data.previousTotalCents || 0;
if (!Number.isSafeInteger(previous) || previous < 0) {
  throw new Error('Invalid previous donation total.');
}
const euro = (cents) => `${new Intl.NumberFormat('ro-RO', {
  minimumFractionDigits: 2, maximumFractionDigits: 2,
}).format(cents / 100)} €`;
let total = previous;
const lines = ['## Donații confirmate', ''];
for (const item of data.supporters) {
  if (!Number.isSafeInteger(item.amountCents) || item.amountCents < 0) {
    throw new Error('Invalid donation amount.');
  }
  total += item.amountCents;
  const name = String(item.name || 'Anonim').replace(/[\r\n|]/g, ' ').trim();
  lines.push(`- ${name} · ${euro(item.amountCents)}`);
}
if (total !== data.totalCents) throw new Error('Stored total does not match donations.');
if (previous) lines.push(`- Donații anterioare · ${euro(previous)}`);
lines.push('', `**Total: ${euro(total)}**`, '');
const summary = lines.join('\n');
if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
}
console.log(summary);
