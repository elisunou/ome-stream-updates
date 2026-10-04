# Ome Stream Updates

Repository public pentru actualizările oficiale **Ome Stream Media Player**:

- Android Mobile: `com.omestrem.media`
- Android TV: `com.omestrem.tv`

Aplicațiile verifică fișierul `update.json`. Actualizările sunt opționale și
instalarea unei versiuni noi păstrează setările și datele locale existente.

APK-urile oficiale sunt publicate în secțiunea **Releases**.

## Aprobarea donațiilor

După confirmarea unei plăți în Revolut, un administrator al repository-ului poate
deschide **Actions → Approve donation → Run workflow**. Alege `view` pentru a
vedea donațiile existente și totalul sau `approve` pentru o donație nouă. La
aprobare introduce suma în euro
și numele public doar dacă donatorul a acceptat afișarea lui; altfel debifează
consimțământul, iar lista va afișa „Anonim”. Workflow-ul adaugă donația o
singură dată și recalculează automat `totalCents` din donațiile aprobate plus
`previousTotalCents` (donațiile anterioare). Plățile nu sunt verificate automat
de GitHub; confirmarea în Revolut trebuie făcută înainte de aprobare.
Raportul `view` afișează ultima donație și totalul cumulat pentru fiecare nume
public; numele identice (fără diferențe de majuscule sau spații) sunt tratate ca
același susținător. Donațiile anonime rămân separate.
