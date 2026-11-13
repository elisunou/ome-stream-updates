import { appendFileSync, readFileSync, writeFileSync } from 'node:fs';

const file = new URL('../../supporters.json', import.meta.url);
const data = JSON.parse(readFileSync(file, 'utf8'));
if (!Array.isArray(data.supporters)) throw new Error('Invalid supporters list.');

const parseMoney = (value, label, maximum) => {
  const normalized = String(value || '').trim().replace(',', '.');
  if (!/^(?:0|[1-9]\d{0,6})(?:\.\d{1,2})?$/.test(normalized)) {
    throw new Error(`${label}: use a positive number with up to two decimals.`);
  }
  const [whole, decimals = ''] = normalized.split('.');
  const cents = Number(whole) * 100 + Number(decimals.padEnd(2, '0'));
  if (!Number.isSafeInteger(cents) || cents < 1 || cents > maximum) {
    throw new Error(`${label}: value outside the supported range.`);
  }
  return cents;
};

const goal = data.goal || { currency: 'EUR', targetCents: 100000,
  startTotalCents: data.totalCents || 0 };
if (process.env.OPERATION === 'set') {
  goal.targetCents = parseMoney(process.env.TARGET_EUR, 'Goal EUR', 100_000_000);
  goal.currency = 'EUR';
  delete goal.ronPerEur;
  data.goal = goal;
  data.updatedAt = new Date().toISOString();
  writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
} else if (process.env.OPERATION !== 'view') {
  throw new Error('Unknown operation.');
}

const euroCents = data.supporters.reduce((sum, entry) => sum + entry.amountCents,
  data.previousTotalCents || 0);
const progressCents = Math.max(0, euroCents - (goal.startTotalCents || 0));
const format = (cents, currency) => new Intl.NumberFormat('ro-RO', {
  style: 'currency', currency,
}).format(cents / 100);
const summary = [
  '## Obiectivul donațiilor', '',
  `Total confirmat: ${format(euroCents, 'EUR')}`,
  `Țintă: ${format(goal.targetCents, 'EUR')}`,
  `Progres de la pornirea obiectivului: ${format(progressCents, 'EUR')} / ${format(goal.targetCents, 'EUR')}`,
  '',
].join('\n');
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
console.log(summary);
