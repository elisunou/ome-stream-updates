import { appendFileSync, readFileSync, writeFileSync } from 'node:fs';

const file = new URL('../../supporters.json', import.meta.url);
const data = JSON.parse(readFileSync(file, 'utf8'));
const inputAmount = (process.env.DONATION_EUR || '').trim().replace(',', '.');
if (!/^(?:0|[1-9]\d{0,5})(?:\.\d{1,2})?$/.test(inputAmount)) {
  throw new Error('Enter a positive EUR amount with at most two decimals.');
}
const [euros, fraction = ''] = inputAmount.split('.');
const amountCents = Number(euros) * 100 + Number(fraction.padEnd(2, '0'));
if (amountCents < 1 || amountCents > 10_000_000) {
  throw new Error('The donation amount is outside the supported range.');
}
const approvalId = (process.env.APPROVAL_ID || '').trim();
if (!/^\d+$/.test(approvalId)) throw new Error('Missing GitHub approval ID.');
if (!Array.isArray(data.supporters)) throw new Error('Invalid supporters list.');
if (data.supporters.some((entry) => entry.approvalId === approvalId
  || (Array.isArray(entry.approvalIds) && entry.approvalIds.includes(approvalId)))) {
  console.log('This approval was already recorded; no duplicate added.');
  process.exit(0);
}

const rawName = (process.env.DONOR_NAME || '').replace(/[\r\n\t]/g, ' ').trim();
const consent = process.env.NAME_CONSENT === 'true';
if (consent && (!rawName || rawName.length > 30)) {
  throw new Error('A consented public name must be 1–30 characters.');
}
const name = consent ? rawName : 'Anonim';
const donorKey = (value) => value.normalize('NFKC').trim()
  .replace(/\s+/g, ' ').toLocaleLowerCase('ro-RO');
const now = new Date().toISOString();
const existing = consent ? data.supporters.find((entry) =>
  donorKey(String(entry.name || '')) === donorKey(name)) : null;
if (existing) {
  if (!Number.isSafeInteger(existing.amountCents) || existing.amountCents < 0) {
    throw new Error('Existing donor has an invalid total.');
  }
  existing.amountCents += amountCents;
  existing.lastDonationCents = amountCents;
  existing.donationCount = Math.max(1, existing.donationCount || 1) + 1;
  existing.approvalIds = Array.isArray(existing.approvalIds)
    ? existing.approvalIds : [];
  existing.approvalIds.push(approvalId);
  existing.approvedAt = now;
} else {
  data.supporters.push({
    name,
    amountCents,
    lastDonationCents: amountCents,
    donationCount: 1,
    currency: 'EUR',
    approvalId,
    approvedAt: now,
  });
}
data.schema = 2;
data.updatedAt = now;
const previousTotalCents = data.previousTotalCents || 0;
if (!Number.isSafeInteger(previousTotalCents) || previousTotalCents < 0) {
  throw new Error('Invalid previous donation total.');
}
data.totalCents = data.supporters.reduce((sum, entry) => {
  if (!Number.isSafeInteger(entry.amountCents) || entry.amountCents < 0) {
    throw new Error('Existing donation has an invalid amount.');
  }
  return sum + entry.amountCents;
}, previousTotalCents);
writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
const euro = (cents) => `${new Intl.NumberFormat('ro-RO', {
  minimumFractionDigits: 2, maximumFractionDigits: 2,
}).format(cents / 100)} €`;
const donorTotalCents = consent ? data.supporters.reduce((sum, entry) =>
  donorKey(String(entry.name || '')) === donorKey(name)
    ? sum + entry.amountCents : sum, 0) : null;
const summary = [
  '## Donație aprobată', '',
  `${name} · donația nouă: ${euro(amountCents)}`,
  ...(donorTotalCents === null ? []
    : [`${name} · total donat: **${euro(donorTotalCents)}**`]),
  `Total general confirmat: **${euro(data.totalCents)}**`, '',
].join('\n');
if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
}
console.log(summary);
