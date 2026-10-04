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
const donors = new Map();
const anonymous = [];
const donorKey = (value) => value.normalize('NFKC').trim()
  .replace(/\s+/g, ' ').toLocaleLowerCase('ro-RO');
for (const item of data.supporters) {
  if (!Number.isSafeInteger(item.amountCents) || item.amountCents < 0) {
    throw new Error('Invalid donation amount.');
  }
  total += item.amountCents;
  const name = String(item.name || 'Anonim').replace(/[\r\n|]/g, ' ').trim();
  if (donorKey(name) === 'anonim') {
    anonymous.push(`- Anonim · ${euro(item.amountCents)}`);
    continue;
  }
  const key = donorKey(name);
  const donor = donors.get(key) || { name, lastCents: 0, totalCents: 0 };
  donor.lastCents = Number.isSafeInteger(item.lastDonationCents)
    ? item.lastDonationCents : item.amountCents;
  donor.totalCents += item.amountCents;
  donors.set(key, donor);
}
if (total !== data.totalCents) throw new Error('Stored total does not match donations.');
for (const donor of donors.values()) {
  lines.push(`- ${donor.name} · ultima donație ${euro(donor.lastCents)} · total donat **${euro(donor.totalCents)}**`);
}
lines.push(...anonymous);
if (previous) lines.push(`- Donații anterioare · ${euro(previous)}`);
lines.push('', `**Total: ${euro(total)}**`, '');
const summary = lines.join('\n');
if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
}
console.log(summary);
